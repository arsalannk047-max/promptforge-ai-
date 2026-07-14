import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/primitives";
import { SiteSettingRow } from "@/components/admin/site-setting-row";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("site_settings").select("*").order("key");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-forge-50">Site settings</h1>
      <Card>
        <CardContent className="divide-y divide-forge-800 p-0">
          {settings?.map((s) => (
            <SiteSettingRow key={s.key} settingKey={s.key} value={s.value} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
