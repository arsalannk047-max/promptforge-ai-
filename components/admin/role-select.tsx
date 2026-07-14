"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateUserRoleAction } from "@/app/admin/actions";
import { Select } from "@/components/ui/select-native";
import type { UserRole } from "@/types/database";

export function RoleSelect({ userId, currentRole }: { userId: string; currentRole: UserRole }) {
  const [pending, startTransition] = useTransition();

  return (
    <Select
      defaultValue={currentRole}
      disabled={pending}
      className="h-8 w-32 text-xs"
      onChange={(e) => {
        const role = e.target.value as UserRole;
        startTransition(async () => {
          try {
            await updateUserRoleAction(userId, role);
            toast.success("Role updated");
          } catch {
            toast.error("Couldn't update role");
          }
        });
      }}
    >
      <option value="user">User</option>
      <option value="moderator">Moderator</option>
      <option value="admin">Admin</option>
    </Select>
  );
}
