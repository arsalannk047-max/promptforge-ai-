import { formatDistanceToNow } from "date-fns";
import { Heart, MessageSquare, UserPlus, Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/primitives";
import { cn } from "@/lib/utils/cn";

const icons: Record<string, typeof Heart> = {
  like: Heart,
  comment: MessageSquare,
  follow: UserPlus,
  system: Bell,
  mention: Bell,
};

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-forge-50">Notifications</h1>
        <p className="mt-1 text-sm text-forge-400">Likes, comments, and follows from the community.</p>
      </div>

      {!notifications?.length ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-forge-500">You&apos;re all caught up.</CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const Icon = icons[n.type] || Bell;
            return (
              <Card key={n.id} className={cn(!n.is_read && "border-ember-500/40")}>
                <CardContent className="flex items-center gap-4 py-4">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ember-500/10 text-ember-500">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-forge-200">{n.message}</p>
                    <p className="mt-0.5 text-xs text-forge-500">
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  {!n.is_read && <span className="h-2 w-2 shrink-0 rounded-full bg-ember-500" />}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
