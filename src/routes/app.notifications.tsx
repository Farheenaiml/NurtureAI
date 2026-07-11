import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { notifications as seed } from "@/services/mockData";
import { toast } from "sonner";

export const Route = createFileRoute("/app/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Nurture" }] }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const [items, setItems] = useState(seed);
  return (
    <div className="space-y-6">
      <PageHeader icon={Bell} title="Notifications" subtitle="Stay on top of your care" action={
        <Button variant="outline" className="rounded-xl" onClick={() => { setItems(items.map((i) => ({ ...i, unread: false }))); toast.success("All marked as read"); }}><CheckCheck className="mr-1 h-4 w-4" /> Mark all read</Button>
      } />
      {items.length ? (
        <div className="space-y-2">
          {items.map((n) => (
            <Card key={n.id} className={`flex items-center gap-3 rounded-2xl border-border/60 p-4 ${n.unread ? "bg-accent/40" : ""}`}>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-card text-xl">{n.emoji}</span>
              <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="truncate font-semibold">{n.title}</p>{n.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}</div><p className="truncate text-sm text-muted-foreground">{n.body}</p></div>
              <span className="shrink-0 text-xs text-muted-foreground">{n.time}</span>
              <button onClick={() => setItems(items.filter((i) => i.id !== n.id))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </Card>
          ))}
        </div>
      ) : <EmptyState icon={Bell} title="You're all caught up" description="No new notifications right now." />}
    </div>
  );
}
