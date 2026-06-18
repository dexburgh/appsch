import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import type { 
  CreateBillingEntryRequest, 
  ProcessBillingEntryRequest, 
  BillingEntryWithPhotos 
} from "@shared/schema";

export function useBillingEntries() {
  return useQuery({
    queryKey: [api.billingEntries.list.path],
    queryFn: async () => {
      const res = await fetch(api.billingEntries.list.path);
      if (!res.ok) throw new Error("Failed to fetch billing entries");
      return await res.json() as BillingEntryWithPhotos[];
    },
  });
}

export function useBillingEntry(id: number) {
  return useQuery({
    queryKey: [api.billingEntries.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.billingEntries.get.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch billing entry");
      return await res.json() as BillingEntryWithPhotos;
    },
    enabled: !!id,
  });
}

export function useCreateBillingEntry() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateBillingEntryRequest) => {
      const res = await fetch(api.billingEntries.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create entry");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.billingEntries.list.path] });
      toast({
        title: "Success",
        description: "Billing entry submitted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useProcessBillingEntry() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: ProcessBillingEntryRequest & { id: number }) => {
      const url = buildUrl(api.billingEntries.process.path, { id });
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to process entry");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.billingEntries.list.path] });
      toast({
        title: "Processed",
        description: "Billing entry status updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUploadPhoto() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(api.uploads.create.path, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload photo");
      }
      
      const data = await res.json();
      return data.url as string;
    },
    onError: () => {
      toast({
        title: "Upload Failed",
        description: "Could not upload photo. Please try again.",
        variant: "destructive",
      });
    },
  });
}
