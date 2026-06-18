import { useState, useRef } from "react";
import { Camera, Upload, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { ProcedureImage } from "@shared/schema";

interface ImageCaptureProps {
  procedureId: string;
  images: ProcedureImage[];
  onRefresh: () => void;
}

export default function ImageCapture({ procedureId, images, onRefresh }: ImageCaptureProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      
      setStream(mediaStream);
      setIsCapturing(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Failed to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  };

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");
    
    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      
      const formData = new FormData();
      formData.append("image", blob, `capture_${Date.now()}.jpg`);
      
      try {
        await apiRequest("POST", `/api/procedures/${procedureId}/images`, formData);
        toast({
          title: "Success",
          description: "Image captured successfully",
        });
        onRefresh();
        stopCamera();
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: "Failed to save captured image",
          variant: "destructive",
        });
      }
    }, "image/jpeg", 0.8);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      await apiRequest("POST", `/api/procedures/${procedureId}/images`, formData);
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
      onRefresh();
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload image",
        variant: "destructive",
      });
    }
  };

  const deleteImage = async (imageId: string) => {
    try {
      await apiRequest("DELETE", `/api/images/${imageId}`);
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
      onRefresh();
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete image",
        variant: "destructive",
      });
    }
  };

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
      <h3 className="text-lg font-medium text-slate-700 mb-4 flex items-center">
        <Camera className="w-6 h-6 mr-2 text-amber-500" />
        Clinical Images
      </h3>

      <div className="space-y-4">
        {/* Camera Interface */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
          {isCapturing ? (
            <div className="space-y-4">
              <video 
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full max-w-md mx-auto rounded-lg"
                data-testid="video-camera-preview"
              />
              <div className="flex space-x-3">
                <Button 
                  onClick={captureImage}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                  data-testid="button-capture-image"
                >
                  Capture Image
                </Button>
                <Button 
                  onClick={stopCamera}
                  variant="outline"
                  data-testid="button-stop-camera"
                >
                  Stop Camera
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Camera className="w-12 h-12 mx-auto text-gray-400" />
              <p className="text-gray-600">Click to start camera or upload image</p>
            </div>
          )}
        </div>

        {!isCapturing && (
          <div className="flex space-x-3">
            <Button 
              onClick={startCamera}
              className="flex-1 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white min-h-[48px]"
              data-testid="button-start-camera"
            >
              <Camera className="w-5 h-5 mr-2" />
              Start Camera
            </Button>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              variant="secondary"
              className="flex-1 min-h-[48px]"
              data-testid="button-upload-image"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload
            </Button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          data-testid="input-file-upload"
        />

        <canvas ref={canvasRef} className="hidden" />

        {/* Captured Images */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Captured Images</h4>
          {images.length === 0 ? (
            <p className="text-sm text-gray-500">No images captured yet</p>
          ) : (
            images.map((image) => (
              <div 
                key={image.id} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                data-testid={`card-image-${image.id}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm" data-testid={`text-image-name-${image.id}`}>
                      {image.originalName}
                    </p>
                    <p className="text-xs text-gray-500" data-testid={`text-image-timestamp-${image.id}`}>
                      {formatTimestamp(image.capturedAt!)}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => deleteImage(image.id)}
                  variant="ghost"
                  size="sm"
                  className="text-medical-red hover:bg-red-50"
                  data-testid={`button-delete-image-${image.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
