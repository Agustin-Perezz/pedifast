"use client";

import { signOutAction } from "../actions";
import { SubmitButton } from "./SignOutSubmitButton";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <SubmitButton />
    </form>
  );
}
