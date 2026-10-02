"use client";

import { signOutAction } from "../actions";
import { SubmitButton } from "./sign-out-submit-button";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <SubmitButton />
    </form>
  );
}
