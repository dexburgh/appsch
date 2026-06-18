import { useState, useEffect } from "react";
import { Clock, CheckCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { ProcedureTimes } from "@shared/schema";

interface TimeTrackingProps {
  procedureId: string;
  times: ProcedureTimes | null;
  onRefresh: () => void;
}

export default function TimeTracking({ procedureId, times, onRefresh }: TimeTrackingProps) {
  const [anesthesiaStart, setAnesthesiaStart] = useState("");
  const [procedureStart, setProcedureStart] = useState("");
  const [procedureEnd, setProcedureEnd] = useState("");
  const [anesthesiaEnd, setAnesthesiaEnd] = useState("");
  const { toast } = useToast();

  // Load existing times
  useEffect(() => {
    if (times) {
      setAnesthesiaStart(times.anesthesiaStart || "");
      setProcedureStart(times.procedureStart || "");
      setProcedureEnd(times.procedureEnd || "");
      setAnesthesiaEnd(times.anesthesiaEnd || "");
    }
  }, [times]);

  const saveTimes = async () => {
    try {
      await apiRequest("PUT", `/api/procedures/${procedureId}/times`, {
        anesthesiaStart,
        procedureStart,
        procedureEnd,
        anesthesiaEnd,
      });
      
      toast({
        title: "Success",
        description: "Times saved successfully",
      });
      
      onRefresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save times",
        variant: "destructive",
      });
    }
  };

  const markCurrentTime = () => {
    const currentTime = new Date().toTimeString().slice(0, 5); // HH:MM format
    
    // Determine which field to set based on current status
    if (!anesthesiaStart) {
      setAnesthesiaStart(currentTime);
    } else if (!procedureStart) {
      setProcedureStart(currentTime);
    } else if (!procedureEnd) {
      setProcedureEnd(currentTime);
    } else if (!anesthesiaEnd) {
      setAnesthesiaEnd(currentTime);
    }
    
    toast({
      title: "Time Marked",
      description: `Current time (${currentTime}) has been recorded`,
    });
  };

  const clearTimes = () => {
    setAnesthesiaStart("");
    setProcedureStart("");
    setProcedureEnd("");
    setAnesthesiaEnd("");
    
    toast({
      title: "Times Cleared",
      description: "All time entries have been cleared",
    });
  };

  // Auto-save times when they change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (anesthesiaStart || procedureStart || procedureEnd || anesthesiaEnd) {
        saveTimes();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [anesthesiaStart, procedureStart, procedureEnd, anesthesiaEnd]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mt-6">
      <h3 className="text-lg font-medium text-slate-700 mb-4 flex items-center">
        <Clock className="w-6 h-6 mr-2 text-amber-500" />
        Time Tracking
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Anesthesia Start
          </label>
          <Input
            type="time"
            value={anesthesiaStart}
            onChange={(e) => setAnesthesiaStart(e.target.value)}
            className="min-h-[48px]"
            data-testid="input-anesthesia-start"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Procedure Start
          </label>
          <Input
            type="time"
            value={procedureStart}
            onChange={(e) => setProcedureStart(e.target.value)}
            className="min-h-[48px]"
            data-testid="input-procedure-start"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Procedure End
          </label>
          <Input
            type="time"
            value={procedureEnd}
            onChange={(e) => setProcedureEnd(e.target.value)}
            className="min-h-[48px]"
            data-testid="input-procedure-end"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Anesthesia End
          </label>
          <Input
            type="time"
            value={anesthesiaEnd}
            onChange={(e) => setAnesthesiaEnd(e.target.value)}
            className="min-h-[48px]"
            data-testid="input-anesthesia-end"
          />
        </div>
      </div>

      {/* Quick Time Buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          onClick={markCurrentTime}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white min-h-[40px]"
          data-testid="button-mark-current-time"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Mark Current Time
        </Button>
        
        <Button
          onClick={clearTimes}
          variant="secondary"
          className="min-h-[40px]"
          data-testid="button-clear-times"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Clear Times
        </Button>
      </div>
    </div>
  );
}
