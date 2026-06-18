import { useParams, useLocation } from "wouter";
import { useBillingEntry, useProcessBillingEntry } from "@/hooks/use-billing";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, Calendar, Hash, FileCheck, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

export default function EntryDetails() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { data: entry, isLoading } = useBillingEntry(Number(id));
  const processMutation = useProcessBillingEntry();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"process" | "defer" | null>(null);
  const [note, setNote] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const isOffice = user?.role === "office_staff";

  if (isLoading) return <DetailsSkeleton />;
  if (!entry) return <div>Entry not found</div>;

  const handleProcess = () => {
    if (actionType === "process") {
      processMutation.mutate({
        id: Number(id),
        status: "done",
        accountNumber,
      }, {
        onSuccess: () => setDialogOpen(false)
      });
    } else if (actionType === "defer") {
      processMutation.mutate({
        id: Number(id),
        status: "deferred",
        officeNotes: note,
      }, {
        onSuccess: () => setDialogOpen(false)
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-enter pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/dashboard")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold font-display">Entry #{entry.id}</h1>
          <p className="text-muted-foreground text-sm">Created on {format(new Date(entry.createdAt), 'PPP')}</p>
        </div>
        <div className="ml-auto">
          <StatusBadge status={entry.status as any} className="text-sm px-3 py-1" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Patient & Procedure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/20 rounded-lg">
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Weight</Label>
                  <p className="font-mono text-lg font-medium">{entry.patientWeight} kg</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Height</Label>
                  <p className="font-mono text-lg font-medium">{entry.patientHeight} cm</p>
                </div>
              </div>
              
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Diagnosis (ICD10)</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Hash className="w-4 h-4 text-primary" />
                  <span className="font-mono text-lg font-semibold">{entry.icd10Code}</span>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Procedure</Label>
                <h3 className="text-lg font-medium mt-1">{entry.procedureName}</h3>
                <p className="text-sm text-muted-foreground font-mono">Code: {entry.procedureCode}</p>
              </div>

              <div className="flex items-center gap-6 pt-4 border-t border-border/50">
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Start Time</Label>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="w-4 h-4 text-primary/70" />
                    {format(new Date(entry.theatreStartTime), 'PP p')}
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">End Time</Label>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="w-4 h-4 text-primary/70" />
                    {format(new Date(entry.theatreEndTime), 'PP p')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {entry.officeNotes && (
            <Card className="border-orange-200 bg-orange-50/30 dark:border-orange-900/50 dark:bg-orange-950/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                  <AlertTriangle className="w-5 h-5" />
                  Office Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{entry.officeNotes}</p>
              </CardContent>
            </Card>
          )}

          {entry.accountNumber && (
             <Card className="border-green-200 bg-green-50/30 dark:border-green-900/50 dark:bg-green-950/10">
             <CardHeader>
               <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                 <FileCheck className="w-5 h-5" />
                 Processed
               </CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-sm font-medium">Account Number: {entry.accountNumber}</p>
             </CardContent>
           </Card>
          )}
        </div>

        {/* Sidebar Actions & Photos */}
        <div className="space-y-6">
          {isOffice && entry.status !== 'done' && (
            <Card className="border-border/60 shadow-md">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700" 
                      onClick={() => setActionType("process")}
                    >
                      Process & Finalize
                    </Button>
                  </DialogTrigger>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800"
                      onClick={() => setActionType("defer")}
                    >
                      Defer Entry
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{actionType === 'process' ? 'Process Entry' : 'Defer Entry'}</DialogTitle>
                    </DialogHeader>
                    
                    <div className="py-4 space-y-4">
                      {actionType === 'process' ? (
                        <div className="space-y-2">
                          <Label>Assign Account Number</Label>
                          <Input 
                            placeholder="ACC-2024-..." 
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label>Reason for Deferral</Label>
                          <Textarea 
                            placeholder="Missing information regarding..." 
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                          />
                        </div>
                      )}
                    </div>

                    <DialogFooter>
                      <Button onClick={handleProcess} disabled={processMutation.isPending}>
                        {processMutation.isPending ? 'Saving...' : 'Confirm'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          )}

          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Evidence</CardTitle>
              <CardDescription>{entry.photos?.length || 0} attachments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {entry.photos?.map((photo: any, i: number) => (
                  <a key={i} href={photo.url} target="_blank" rel="noopener noreferrer" className="block aspect-square rounded-lg overflow-hidden border border-border hover:border-primary transition-all">
                    <img src={photo.url} alt="Evidence" className="w-full h-full object-cover" />
                  </a>
                ))}
                {(!entry.photos || entry.photos.length === 0) && (
                  <div className="col-span-2 py-8 text-center text-sm text-muted-foreground bg-muted/20 rounded-lg">
                    No photos attached
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DetailsSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-4">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    </div>
  );
}
