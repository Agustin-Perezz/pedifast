"use client";

import { FacebookIcon, GoogleIcon } from "@/components/icons/brand-icons";
import { Button } from "@/components/ui/button";
import { OAuthProvider } from "@/domain/entities/oauth-provider.enum";
import { signInWithOAuthAction } from "../actions";

type OAuthButtonConfig = {
  provider: OAuthProvider;
  label: string;
  icon: () => React.ReactElement;
};

const OAUTH_BUTTONS: readonly OAuthButtonConfig[] = [
  {
    provider: OAuthProvider.Google,
    label: "Google",
    icon: () => <GoogleIcon className="size-5" />,
  },
  {
    provider: OAuthProvider.Facebook,
    label: "Facebook",
    icon: () => <FacebookIcon className="size-5" />,
  },
] as const;

export function OAuthButtons() {
  return (
    <div className="space-y-2">
      {OAUTH_BUTTONS.map(({ provider, label, icon: Icon }) => (
        <Button
          key={provider}
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => signInWithOAuthAction(provider)}
        >
          <Icon />
          Continue with {label}
        </Button>
      ))}
    </div>
  );
}
