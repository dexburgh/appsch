import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBillingEntrySchema, type InsertBillingEntry } from "@shared/schema";
import { useCreateBillingEntry, useUploadPhoto } from "@/hooks/use-billing";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, UploadCloud, X, Camera } from "lucide-react";

// Predefined procedure options
const COMMON_PROCEDURES = [
  { name: "General Anaesthetic - Standard", code: "001" },
  { name: "Regional Block - Spinal", code: "005" },
  { name: "Sedation Level 3", code: "010" },
  { name: "Epidural Insertion", code: "015" },
];

export default function NewEntry() {
  const [, setLocation] = useLocation();
  const [photos, setPhotos] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const createMutation = useCreateBillingEntry();
  const uploadMutation = useUploadPhoto();

  const form = useForm<InsertBillingEntry>({
    resolver: zodResolver(insertBillingEntrySchema),
    defaultValues: {
      patientHeight: "",
      patientWeight: "",
      icd10Code: "",
      procedureName: "",
      procedureCode: "",
      theatreStartTime: new Date(),
      theatreEndTime: new Date(new Date().setHours(new Date().getHours() + 1)),
    },
  });

  const onSubmit = (data: InsertBillingEntry) => {
    createMutation.mutate(
      { ...data, photoUrls: photos }, 
      {
        onSuccess: () => setLocation("/dashboard"),
      }
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    try {
      const file = e.target.files[0];
      const url = await uploadMutation.mutateAsync(file);
      setPhotos(prev => [...prev, url]);
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcedureSelect = (value: string) => {
    const proc = COMMON_PROCEDURES.find(p => p.name === value);
    if (proc) {
      form.setValue("procedureName", proc.name);
      form.setValue("procedureCode", proc.code);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 animate-enter">
      <div>
        <h1 className="text-3xl font-display font-bold">New Billing Entry</h1>
        <p className="text-muted-foreground">Fill in the patient and procedure details below.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Patient Details */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Patient Details</CardTitle>
              <CardDescription>Basic patient vitals and diagnosis</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="patientHeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (cm)</FormLabel>
                    <FormControl>
                      <Input placeholder="175" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="patientWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input placeholder="70" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="icd10Code"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>ICD10 Diagnosis Code</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. J03.90" {...field} className="font-mono" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Procedure Details */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Procedure Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="procedureName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Procedure Name</FormLabel>
                    <Select onValueChange={(val) => {
                      field.onChange(val);
                      handleProcedureSelect(val);
                    }}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select common procedure or type below" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COMMON_PROCEDURES.map((proc) => (
                          <SelectItem key={proc.code} value={proc.name}>
                            {proc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="mt-2">
                      <Input placeholder="Or type custom procedure name..." {...field} />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="procedureCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Procedure Code</FormLabel>
                      <FormControl>
                        <Input placeholder="001" {...field} className="font-mono" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="theatreStartTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Theatre Start</FormLabel>
                      <FormControl>
                        <Input 
                          type="datetime-local" 
                          {...field}
                          value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="theatreEndTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Theatre End</FormLabel>
                      <FormControl>
                        <Input 
                          type="datetime-local" 
                          {...field}
                          value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Photo Evidence */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
              <CardDescription>Upload anaesthetic charts or relevant stickers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {photos.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
                    <img src={url} alt="Evidence" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {photos.length < 3 && (
                  <div className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center bg-muted/20 relative">
                    {isUploading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    ) : (
                      <>
                        <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
                        <span className="text-xs text-muted-foreground font-medium">Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              size="lg" 
              className="w-full md:w-auto shadow-lg shadow-primary/20"
              disabled={createMutation.isPending || isUploading}
            >
              {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Billing Entry
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
