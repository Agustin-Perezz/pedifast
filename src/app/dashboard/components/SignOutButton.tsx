"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { signOutAction } from "../actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="outline" disabled={pending}>
      {pending ? "Signing out..." : "Sign out"}
    </Button>
  );
}

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <SubmitButton />
    </form>
  );
}
