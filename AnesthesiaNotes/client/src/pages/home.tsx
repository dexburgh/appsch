import Header from "@/components/header";
import Footer from "@/components/footer";
import BrandingBanner from "@/components/branding-banner";
import PatientInfo from "@/components/patient-info";
import ImageCapture from "@/components/image-capture";
import MedicalCodes from "@/components/medical-codes";
import TimeTracking from "@/components/time-tracking";
import ClinicalNotes from "@/components/clinical-notes";
import BillingSubmission from "@/components/billing-submission";
import OfflineIndicator from "@/components/offline-indicator";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export default function Home() {
  const [currentProcedureId, setCurrentProcedureId] = useState<string | null>(null);

  // Initialize with a default procedure for demo
  useEffect(() => {
    const initializeProcedure = async () => {
      if (!currentProcedureId) {
        try {
          const response = await fetch("/api/procedures", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              patientId: "P-2024-001",
              procedureName: "Arthroscopic Knee Surgery",
              status: "in-progress",
              startTime: "14:30",
            }),
          });
          const procedure = await response.json();
          setCurrentProcedureId(procedure.id);
        } catch (error) {
          console.error("Failed to initialize procedure:", error);
        }
      }
    };

    initializeProcedure();
  }, [currentProcedureId]);

  const { data: procedureData, refetch } = useQuery({
    queryKey: ["/api/procedures", currentProcedureId, "complete"],
    enabled: !!currentProcedureId,
  });

  if (!currentProcedureId || !procedureData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mb-4"></div>
          <div className="text-lg text-slate-700">Loading procedure...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-roboto text-slate-700">
      <Header />
      <OfflineIndicator />
      <BrandingBanner />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <PatientInfo procedure={procedureData.procedure} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ImageCapture 
            procedureId={currentProcedureId}
            images={procedureData.images}
            onRefresh={refetch}
          />
          <MedicalCodes 
            procedureId={currentProcedureId}
            codes={procedureData.codes}
            onRefresh={refetch}
          />
        </div>
        
        <TimeTracking 
          procedureId={currentProcedureId}
          times={procedureData.times}
          onRefresh={refetch}
        />
        
        <ClinicalNotes 
          procedureId={currentProcedureId}
          notes={procedureData.notes}
          onRefresh={refetch}
        />
        
        <BillingSubmission 
          procedureId={currentProcedureId}
          procedureData={procedureData}
          onRefresh={refetch}
        />
      </main>
      <Footer />
    </div>
  );
}
