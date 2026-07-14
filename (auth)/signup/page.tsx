"use client";

import Link from "next/link";
import { useActionState } from "react";
import { motion } from "framer-motion";
import { signUpAction } from "../actions";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/primitives";
import { OAuthButtons } from "@/components/shared/oauth-buttons";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signUpAction, null);

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
        Create your account
      </motion.h1>
      <motion.p
        variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
        className="mt-1 text-sm text-forge-400"
      >
        Free to start. No card required.
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
          <Label htmlFor="username">Username</Label>
          <Input id="username" name="username" required placeholder="ada_builds" pattern="[a-z0-9_]+" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="you@company.com" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required minLength={8} placeholder="At least 8 characters" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input id="confirmPassword" name="confirmPassword" type="password" required placeholder="Repeat your password" />
        </div>

        {state?.error && <p className="text-sm text-danger">{state.error}</p>}
        {state?.success && <p className="text-sm text-success">{state.success}</p>}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Creating account..." : "Create account"}
        </Button>
      </motion.form>

      <motion.p
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
        className="mt-6 text-center text-sm text-forge-400"
      >
        Already forging?{" "}
        <Link href="/login" className="text-ember-500 hover:underline">
          Log in
        </Link>
      </motion.p>
    </motion.div>
  );
}
