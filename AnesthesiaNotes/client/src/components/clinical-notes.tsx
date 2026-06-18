import { useState, useEffect } from "react";
import { Edit, Save, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { ClinicalNotes } from "@shared/schema";

interface ClinicalNotesProps {
  procedureId: string;
  notes: ClinicalNotes | null;
  onRefresh: () => void;
}

export default function ClinicalNotes({ procedureId, notes, onRefresh }: ClinicalNotesProps) {
  const [preOperative, setPreOperative] = useState("");
  const [intraOperative, setIntraOperative] = useState("");
  const [postOperative, setPostOperative] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();

  // Load existing notes
  useEffect(() => {
    if (notes) {
      setPreOperative(notes.preOperative || "");
      setIntraOperative(notes.intraOperative || "");
      setPostOperative(notes.postOperative || "");
      setLastSaved(notes.updatedAt ? new Date(notes.updatedAt) : null);
    }
  }, [notes]);

  const saveNotes = async () => {
    try {
      await apiRequest("PUT", `/api/procedures/${procedureId}/notes`, {
        preOperative,
        intraOperative,
        postOperative,
      });
      
      setLastSaved(new Date());
      toast({
        title: "Success",
        description: "Clinical notes saved successfully",
      });
      
      onRefresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save clinical notes",
        variant: "destructive",
      });
    }
  };

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (preOperative || intraOperative || postOperative) {
        saveNotes();
      }
    }, 2000); // Auto-save after 2 seconds of no typing

    return () => clearTimeout(timer);
  }, [preOperative, intraOperative, postOperative]);

  const insertTemplate = (template: string, field: 'preOperative' | 'intraOperative' | 'postOperative') => {
    const templates = {
      'standard-monitoring': 'Standard ASA monitors applied. Baseline vital signs stable.',
      'general-anesthesia': 'General anesthesia administered with endotracheal intubation. Patient tolerated procedure well.',
      'spinal-anesthesia': 'Spinal anesthesia administered at L3-L4 level. Adequate sensory block achieved.',
    };

    const templateText = templates[template as keyof typeof templates] || '';
    
    switch (field) {
      case 'preOperative':
        setPreOperative(prev => prev ? `${prev}\n${templateText}` : templateText);
        break;
      case 'intraOperative':
        setIntraOperative(prev => prev ? `${prev}\n${templateText}` : templateText);
        break;
      case 'postOperative':
        setPostOperative(prev => prev ? `${prev}\n${templateText}` : templateText);
        break;
    }

    toast({
      title: "Template Inserted",
      description: "Standard text has been added to the notes",
    });
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mt-6">
      <h3 className="text-lg font-medium text-slate-700 mb-4 flex items-center">
        <Edit className="w-6 h-6 mr-2 text-amber-500" />
        Clinical Notes
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pre-operative Assessment
            </label>
            <Textarea
              rows={4}
              placeholder="Document pre-operative findings..."
              value={preOperative}
              onChange={(e) => setPreOperative(e.target.value)}
              className="resize-none"
              data-testid="textarea-pre-operative"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Intraoperative Notes
            </label>
            <Textarea
              rows={4}
              placeholder="Document intraoperative events..."
              value={intraOperative}
              onChange={(e) => setIntraOperative(e.target.value)}
              className="resize-none"
              data-testid="textarea-intra-operative"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Post-operative Notes
          </label>
          <Textarea
            rows={4}
            placeholder="Document post-operative recovery and discharge planning..."
            value={postOperative}
            onChange={(e) => setPostOperative(e.target.value)}
            className="resize-none"
            data-testid="textarea-post-operative"
          />
        </div>

        {/* Quick Note Templates */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Templates
          </label>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => insertTemplate('standard-monitoring', 'preOperative')}
              variant="outline"
              size="sm"
              className="min-h-[40px]"
              data-testid="button-template-standard-monitoring"
            >
              Standard Monitoring
            </Button>
            <Button
              onClick={() => insertTemplate('general-anesthesia', 'intraOperative')}
              variant="outline"
              size="sm"
              className="min-h-[40px]"
              data-testid="button-template-general-anesthesia"
            >
              General Anesthesia
            </Button>
            <Button
              onClick={() => insertTemplate('spinal-anesthesia', 'intraOperative')}
              variant="outline"
              size="sm"
              className="min-h-[40px]"
              data-testid="button-template-spinal-anesthesia"
            >
              Spinal Anesthesia
            </Button>
          </div>
        </div>

        {/* Auto-save Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600" data-testid="status-auto-save">
            <CheckCircle className="w-4 h-4 text-medical-green" />
            <span>
              {lastSaved ? `Auto-saved at ${formatTimestamp(lastSaved)}` : "Not saved yet"}
            </span>
          </div>
          <Button
            onClick={saveNotes}
            className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white min-h-[40px]"
            data-testid="button-save-notes"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Notes
          </Button>
        </div>
      </div>
    </div>
  );
}
