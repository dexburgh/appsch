import { useState } from "react";
import { CloudUpload, Bookmark, CheckCircle, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { CompleteProcedureData } from "@shared/schema";

interface BillingSubmissionProps {
  procedureId: string;
  procedureData: CompleteProcedureData;
  onRefresh: () => void;
}

interface ValidationCheck {
  name: string;
  status: "complete" | "incomplete" | "warning";
  required: boolean;
}

export default function BillingSubmission({ procedureId, procedureData, onRefresh }: BillingSubmissionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Validation logic
  const getValidationChecks = (): ValidationCheck[] => {
    return [
      {
        name: "Patient Information Complete",
        status: procedureData.procedure.patientId ? "complete" : "incomplete",
        required: true,
      },
      {
        name: "CPT Code Selected",
        status: procedureData.codes.some(c => c.codeType === "cpt") ? "complete" : "incomplete",
        required: true,
      },
      {
        name: "ICD Code Selected",
        status: procedureData.codes.some(c => c.codeType === "icd") ? "complete" : "warning",
        required: false,
      },
      {
        name: "Procedure Times Recorded",
        status: procedureData.times && 
               (procedureData.times.anesthesiaStart && procedureData.times.anesthesiaEnd) 
               ? "complete" : "incomplete",
        required: true,
      },
      {
        name: "Clinical Documentation",
        status: procedureData.notes && 
               (procedureData.notes.preOperative || procedureData.notes.intraOperative || procedureData.notes.postOperative) 
               ? "complete" : "warning",
        required: false,
      },
      {
        name: "Clinical Images",
        status: procedureData.images.length > 0 ? "complete" : "warning",
        required: false,
      },
    ];
  };

  const validationChecks = getValidationChecks();
  const hasRequiredData = validationChecks.filter(c => c.required).every(c => c.status === "complete");
  const isComplete = procedureData.procedure.status === "completed";

  const submitToBilling = async () => {
    if (!hasRequiredData) {
      toast({
        title: "Validation Error",
        description: "Please complete all required fields before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiRequest("POST", `/api/procedures/${procedureId}/submit`);
      const result = await response.json();
      
      toast({
        title: "Success",
        description: "Documentation submitted to billing system successfully",
      });
      
      onRefresh();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit to billing system. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveDraft = async () => {
    try {
      await apiRequest("PATCH", `/api/procedures/${procedureId}`, {
        status: "draft",
      });
      
      toast({
        title: "Draft Saved",
        description: "Current progress has been saved as draft",
      });
      
      onRefresh();
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save draft",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="w-5 h-5 text-medical-green" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-medical-amber" />;
      default:
        return <AlertCircle className="w-5 h-5 text-medical-red" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-red-50 border-red-200";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "complete":
        return "text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full";
      case "warning":
        return "text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full";
      default:
        return "text-xs text-red-700 bg-red-100 px-2 py-1 rounded-full";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mt-6">
      <h3 className="text-lg font-medium text-slate-700 mb-4 flex items-center">
        <CloudUpload className="w-6 h-6 mr-2 text-amber-500" />
        Submit for Billing
      </h3>

      {/* Data Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-medium text-gray-700 mb-3">Documentation Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2" data-testid="summary-images">
            <CheckCircle className="w-5 h-5 text-medical-green" />
            <span>{procedureData.images.length} Clinical Images</span>
          </div>
          <div className="flex items-center space-x-2" data-testid="summary-codes">
            <CheckCircle className="w-5 h-5 text-medical-green" />
            <span>{procedureData.codes.length} Medical Codes</span>
          </div>
          <div className="flex items-center space-x-2" data-testid="summary-times">
            <CheckCircle className="w-5 h-5 text-medical-green" />
            <span>
              {procedureData.times && 
               (procedureData.times.anesthesiaStart || procedureData.times.procedureStart) 
               ? "Times Recorded" : "Times Pending"}
            </span>
          </div>
        </div>
      </div>

      {/* Validation Status */}
      <div className="space-y-3 mb-6">
        <h4 className="font-medium text-gray-700">Validation Status</h4>
        {validationChecks.map((check, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor(check.status)}`}
            data-testid={`validation-check-${index}`}
          >
            <div className="flex items-center space-x-3">
              {getStatusIcon(check.status)}
              <span className="text-sm font-medium">
                {check.name} {check.required && <span className="text-red-500">*</span>}
              </span>
            </div>
            <span className={getStatusBadge(check.status)}>
              {check.status === "complete" ? "Complete" : 
               check.status === "warning" ? "Optional" : "Required"}
            </span>
          </div>
        ))}
      </div>

      {/* Submission Actions */}
      <div className="flex space-x-4">
        <Button
          onClick={submitToBilling}
          disabled={!hasRequiredData || isSubmitting || isComplete}
          className="flex-1 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white min-h-[48px] flex items-center justify-center disabled:from-gray-400 disabled:to-gray-500"
          data-testid="button-submit-billing"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Submitting...
            </>
          ) : (
            <>
              <CloudUpload className="w-5 h-5 mr-2" />
              {isComplete ? "Already Submitted" : "Submit to Billing"}
            </>
          )}
        </Button>
        
        <Button
          onClick={saveDraft}
          variant="secondary"
          className="min-h-[48px] flex items-center justify-center"
          data-testid="button-save-draft"
        >
          <Bookmark className="w-5 h-5 mr-2" />
          Save Draft
        </Button>
      </div>

      {/* PMA Integration Status */}
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Info className="w-5 h-5 text-amber-600" />
          <h4 className="font-medium text-amber-600">PMA System Integration</h4>
        </div>
        <p className="text-sm text-gray-600" data-testid="text-pma-status">
          {isComplete 
            ? "Documentation has been successfully submitted and integrated with the Practice Management System."
            : "Ready to integrate with Practice Management System. Data will be formatted according to HL7 FHIR standards for seamless transfer."
          }
        </p>
      </div>
    </div>
  );
}
