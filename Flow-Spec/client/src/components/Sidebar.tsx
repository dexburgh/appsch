import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, PlusCircle, LogOut, FileText, UserCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const isAnaesthetist = user?.role === "anaesthetist";
  const isOffice = user?.role === "office_staff";

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      show: true
    },
    {
      name: "New Entry",
      href: "/entry/new",
      icon: PlusCircle,
      show: isAnaesthetist
    },
    {
      name: "All Entries",
      href: "/entries",
      icon: FileText,
      show: isOffice
    }
  ];

  return (
    <div className="hidden md:flex h-screen w-64 flex-col fixed inset-y-0 z-50 bg-background border-r border-border/50 shadow-xl shadow-black/5">
      <div className="p-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/30">
            MB
          </div>
          <div>
            <h1 className="font-display font-bold text-lg leading-tight">MediBill</h1>
            <p className="text-xs text-muted-foreground font-medium">Anaesthetic Billing</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-4 space-y-1">
        {navigation.filter(item => item.show).map((item) => (
          <Link key={item.name} href={item.href}>
            <div
              className={cn(
                "group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer",
                location === item.href
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  location === item.href ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {item.name}
            </div>
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-border/50 bg-muted/20">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <UserCircle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.username}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
