import type { Procedure } from "@shared/schema";

interface PatientInfoProps {
  procedure: Procedure;
}

export default function PatientInfo({ procedure }: PatientInfoProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-progress":
        return "bg-gradient-to-r from-blue-500 to-blue-600";
      case "completed":
        return "bg-gradient-to-r from-emerald-500 to-emerald-600";
      case "draft":
        return "bg-gradient-to-r from-amber-500 to-amber-600";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "in-progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "draft":
        return "Draft";
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-slate-700" data-testid="text-section-title">
          Current Patient
        </h2>
        <span 
          className={`${getStatusColor(procedure.status)} text-white px-3 py-1 rounded-full text-sm font-medium`}
          data-testid="badge-procedure-status"
        >
          {getStatusText(procedure.status)}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Patient ID
          </label>
          <p className="text-lg font-medium" data-testid="text-patient-id">
            {procedure.patientId}
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Procedure
          </label>
          <p className="text-lg font-medium" data-testid="text-procedure-name">
            {procedure.procedureName}
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Time
          </label>
          <p className="text-lg font-medium" data-testid="text-start-time">
            {procedure.startTime || "Not set"}
          </p>
        </div>
      </div>
    </div>
  );
}
