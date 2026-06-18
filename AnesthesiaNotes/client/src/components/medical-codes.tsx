import { useState } from "react";
import { FileText, Search, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import type { MedicalCode } from "@shared/schema";

interface MedicalCodesProps {
  procedureId: string;
  codes: MedicalCode[];
  onRefresh: () => void;
}

interface CodeSearchResult {
  code: string;
  description: string;
  type?: "cpt" | "icd" | "procedure";
  isPMB?: boolean;
}

export default function MedicalCodes({ procedureId, codes, onRefresh }: MedicalCodesProps) {
  const [selectedCPTCode, setSelectedCPTCode] = useState("");
  const [icdSearch, setIcdSearch] = useState("");
  const [procedureSearch, setProcedureSearch] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { toast } = useToast();

  // Search CPT codes
  const { data: cptCodes = [] } = useQuery({
    queryKey: ["/api/codes/search", "cpt"],
    queryFn: async () => {
      const response = await fetch("/api/codes/search?type=cpt");
      return response.json() as Promise<CodeSearchResult[]>;
    },
  });

  // Search ICD codes
  const { data: icdSearchResults = [] } = useQuery({
    queryKey: ["/api/codes/search", "icd", icdSearch],
    queryFn: async () => {
      if (!icdSearch.trim()) return [];
      const response = await fetch(`/api/codes/search?type=icd&q=${encodeURIComponent(icdSearch)}`);
      return response.json() as Promise<CodeSearchResult[]>;
    },
    enabled: icdSearch.length > 2,
  });

  // Search Procedure codes
  const { data: procedureSearchResults = [] } = useQuery({
    queryKey: ["/api/codes/search", "procedure", procedureSearch],
    queryFn: async () => {
      if (!procedureSearch.trim()) return [];
      const response = await fetch(`/api/codes/search?type=procedure&q=${encodeURIComponent(procedureSearch)}`);
      return response.json() as Promise<CodeSearchResult[]>;
    },
    enabled: procedureSearch.length > 2,
  });

  const addCode = async (code: string, description: string, type: "cpt" | "icd" | "procedure", isPMB?: boolean) => {
    try {
      await apiRequest("POST", `/api/procedures/${procedureId}/codes`, {
        codeType: type,
        code,
        description,
        isPMB: isPMB ? "true" : "false",
      });
      
      toast({
        title: "Success",
        description: `${type.toUpperCase()} code added successfully`,
      });
      
      onRefresh();
      
      if (type === "cpt") {
        setSelectedCPTCode("");
      } else if (type === "icd") {
        setIcdSearch("");
        setShowSearchResults(false);
      } else {
        setProcedureSearch("");
        setShowSearchResults(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add medical code",
        variant: "destructive",
      });
    }
  };

  const removeCode = async (codeId: string) => {
    try {
      await apiRequest("DELETE", `/api/codes/${codeId}`);
      toast({
        title: "Success",
        description: "Code removed successfully",
      });
      onRefresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove code",
        variant: "destructive",
      });
    }
  };

  const handleCPTSelection = (value: string) => {
    setSelectedCPTCode(value);
    const selectedCode = cptCodes.find(c => c.code === value);
    if (selectedCode) {
      addCode(selectedCode.code, selectedCode.description, "cpt");
    }
  };

  const handleIcdSelection = (result: CodeSearchResult) => {
    addCode(result.code, result.description, "icd", result.isPMB);
  };

  const handleProcedureSelection = (result: CodeSearchResult) => {
    addCode(result.code, result.description, "procedure");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
      <h3 className="text-lg font-medium text-slate-700 mb-4 flex items-center">
        <FileText className="w-6 h-6 mr-2 text-amber-500" />
        Medical Codes
      </h3>

      <div className="space-y-4">
        {/* CPT Code Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CPT Code
          </label>
          <Select value={selectedCPTCode} onValueChange={handleCPTSelection}>
            <SelectTrigger className="min-h-[48px]" data-testid="select-cpt-code">
              <SelectValue placeholder="Select CPT Code" />
            </SelectTrigger>
            <SelectContent>
              {cptCodes.map((code) => (
                <SelectItem key={code.code} value={code.code}>
                  {code.code} - {code.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ICD Code Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ICD-10 Code
          </label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search ICD codes..."
              value={icdSearch}
              onChange={(e) => {
                setIcdSearch(e.target.value);
                setShowSearchResults(true);
              }}
              className="min-h-[48px] pr-10"
              data-testid="input-icd-search"
            />
            <Search className="w-5 h-5 absolute right-3 top-3 text-gray-400" />
          </div>

          {/* Search Results */}
          {showSearchResults && icdSearchResults.length > 0 && (
            <div className="mt-2 space-y-2 max-h-60 overflow-y-auto border rounded-lg">
              {icdSearchResults.map((result, index) => (
                <div
                  key={`${result.code}-${index}`}
                  className="p-3 hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => handleIcdSelection(result)}
                  data-testid={`item-icd-result-${index}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{result.code}</p>
                      <p className="text-xs text-gray-600">{result.description}</p>
                    </div>
                    {result.isPMB && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                        PMB
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Procedure Code Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Procedure Code
          </label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search procedure codes..."
              value={procedureSearch}
              onChange={(e) => {
                setProcedureSearch(e.target.value);
                setShowSearchResults(true);
              }}
              className="min-h-[48px] pr-10"
              data-testid="input-procedure-search"
            />
            <Search className="w-5 h-5 absolute right-3 top-3 text-gray-400" />
          </div>

          {/* Search Results */}
          {showSearchResults && procedureSearchResults.length > 0 && (
            <div className="mt-2 space-y-2 max-h-60 overflow-y-auto border rounded-lg">
              {procedureSearchResults.map((result, index) => (
                <div
                  key={`${result.code}-${index}`}
                  className="p-3 hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => handleProcedureSelection(result)}
                  data-testid={`item-procedure-result-${index}`}
                >
                  <p className="font-medium text-sm">{result.code}</p>
                  <p className="text-xs text-gray-600">{result.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Codes */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Selected Codes</h4>
          {codes.length === 0 ? (
            <p className="text-sm text-gray-500">No codes selected yet</p>
          ) : (
            <div className="space-y-2">
              {codes.map((code) => (
                <div
                  key={code.id}
                  className="flex items-center justify-between p-3 bg-medical-blue bg-opacity-10 rounded-lg border border-medical-blue border-opacity-20"
                  data-testid={`card-selected-code-${code.id}`}
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-sm" data-testid={`text-code-number-${code.id}`}>
                        {code.code} ({code.codeType.toUpperCase()})
                      </p>
                      {code.codeType === "icd" && code.isPMB === "true" && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                          PMB
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600" data-testid={`text-code-description-${code.id}`}>
                      {code.description}
                    </p>
                  </div>
                  <Button
                    onClick={() => removeCode(code.id)}
                    variant="ghost"
                    size="sm"
                    className="text-medical-red hover:bg-red-50"
                    data-testid={`button-remove-code-${code.id}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
