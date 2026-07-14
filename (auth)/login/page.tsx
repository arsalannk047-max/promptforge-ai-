"use client";

import Link from "next/link";
import { useActionState } from "react";
import { motion } from "framer-motion";
import { loginAction } from "../actions";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/primitives";
import { OAuthButtons } from "@/components/shared/oauth-buttons";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
    >
      <motion.h1
        variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
        className="font-display text-2xl font-semibold text-forge-50"
      >
        Welcome back
      </motion.h1>
      <motion.p
        variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
        className="mt-1 text-sm text-forge-400"
      >
        Log in to keep forging.
      </motion.p>

      <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }} className="mt-6">
        <OAuthButtons />
      </motion.div>

      <motion.div
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
        className="my-6 flex items-center gap-3 text-xs text-forge-600"
      >
        <div className="h-px flex-1 bg-forge-700" />
        or with email
        <div className="h-px flex-1 bg-forge-700" />
      </motion.div>

      <motion.form
        variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
        action={formAction}
        className="space-y-4"
      >
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="you@company.com" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs text-ember-500 hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input id="password" name="password" type="password" required placeholder="••••••••" />
        </div>

        {state?.error && <p className="text-sm text-danger">{state.error}</p>}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Logging in..." : "Log in"}
        </Button>
      </motion.form>

      <motion.p
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
        className="mt-6 text-center text-sm text-forge-400"
      >
        New here?{" "}
        <Link href="/signup" className="text-ember-500 hover:underline">
          Create an account
        </Link>
      </motion.p>
    </motion.div>
  );
}
