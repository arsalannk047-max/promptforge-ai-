import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/primitives";
import { Input } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { createCategoryAction } from "@/app/admin/actions";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*, prompts(count)")
    .order("sort_order");

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 font-display text-2xl font-semibold text-forge-50">Categories</h1>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <form action={createCategoryAction} className="flex gap-3">
            <Input name="name" placeholder="New category name" required className="flex-1" />
            <Button type="submit">Add</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-forge-800 text-left text-forge-500">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Slug</th>
                <th className="px-5 py-3 font-medium">Prompts</th>
              </tr>
            </thead>
            <tbody>
              {categories?.map((c) => (
                <tr key={c.id} className="border-b border-forge-800/60">
                  <td className="px-5 py-3 text-forge-200">{c.name}</td>
                  <td className="px-5 py-3 font-mono text-xs text-forge-500">{c.slug}</td>
                  <td className="px-5 py-3 text-forge-400">{c.prompts?.[0]?.count ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
