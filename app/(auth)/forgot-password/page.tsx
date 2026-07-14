"use client";

import Link from "next/link";
import { useActionState } from "react";
import { forgotPasswordAction } from "../actions";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/primitives";

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(forgotPasswordAction, null);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-forge-50">Reset your password</h1>
      <p className="mt-1 text-sm text-forge-400">We&apos;ll email you a secure reset link.</p>

      <form action={formAction} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="you@company.com" />
        </div>

        {state?.error && <p className="text-sm text-danger">{state.error}</p>}
        {state?.success && <p className="text-sm text-success">{state.success}</p>}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Sending..." : "Send reset link"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-forge-400">
        <Link href="/login" className="text-ember-500 hover:underline">
          Back to log in
        </Link>
      </p>
    </div>
  );
}
