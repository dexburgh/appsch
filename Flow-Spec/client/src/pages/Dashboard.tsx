import { useAuth } from "@/hooks/use-auth";
import { useBillingEntries } from "@/hooks/use-billing";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Plus, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: entries, isLoading } = useBillingEntries();

  const isAnaesthetist = user?.role === "anaesthetist";

  if (isLoading) return <DashboardSkeleton />;

  // Analytics Logic
  const stats = {
    total: entries?.length || 0,
    submitted: entries?.filter(e => e.status === 'submitted').length || 0,
    deferred: entries?.filter(e => e.status === 'deferred').length || 0,
    processed: entries?.filter(e => e.status === 'done').length || 0,
  };

  const chartData = [
    { name: 'Submitted', value: stats.submitted, color: '#3b82f6' },
    { name: 'Deferred', value: stats.deferred, color: '#f97316' },
    { name: 'Processed', value: stats.processed, color: '#22c55e' },
  ];

  return (
    <div className="space-y-8 animate-enter">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            {isAnaesthetist ? "My Practice Dashboard" : "Billing Overview"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.firstName || user?.username}. Here's what's happening today.
          </p>
        </div>
        
        {isAnaesthetist && (
          <Link href="/entry/new">
            <Button size="lg" className="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
              <Plus className="mr-2 h-5 w-5" />
              New Entry
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Entries" 
          value={stats.total} 
          icon={FileText} 
          className="bg-gradient-to-br from-background to-muted"
        />
        <StatCard 
          title="Pending Review" 
          value={stats.submitted} 
          icon={Clock} 
          className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900"
          iconClass="text-blue-600"
        />
        <StatCard 
          title="Action Required" 
          value={stats.deferred} 
          icon={AlertCircle} 
          className="bg-orange-50/50 dark:bg-orange-950/20 border-orange-100 dark:border-orange-900"
          iconClass="text-orange-600"
        />
        <StatCard 
          title="Completed" 
          value={stats.processed} 
          icon={CheckCircle2} 
          className="bg-green-50/50 dark:bg-green-950/20 border-green-100 dark:border-green-900"
          iconClass="text-green-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity List */}
        <Card className="lg:col-span-2 border-border/60 shadow-md">
          <CardHeader>
            <CardTitle>Recent Entries</CardTitle>
            <CardDescription>Latest billing submissions requiring attention.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {entries?.slice(0, 5).map((entry) => (
                <div 
                  key={entry.id}
                  className="group flex items-center justify-between p-4 rounded-xl border border-border/40 hover:border-primary/50 hover:bg-muted/30 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {entry.patientWeight}kg
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{entry.procedureName}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <span>{new Date(entry.theatreStartTime).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{entry.procedureCode}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={entry.status as any} />
                    <Link href={`/entry/${entry.id}`}>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
              
              {(!entries || entries.length === 0) && (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No billing entries found.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Analytics Chart */}
        <Card className="border-border/60 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, className, iconClass }: any) {
  return (
    <Card className={cn("border-border/60 shadow-sm transition-all hover:shadow-md", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <Icon className={cn("h-4 w-4 text-muted-foreground", iconClass)} />
        </div>
        <div className="text-2xl font-bold font-display">{value}</div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-8">
        <Skeleton className="col-span-2 h-96 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    </div>
  );
}
