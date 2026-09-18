import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { MagicLinkForm } from "./components/MagicLinkForm";
import { OAuthButtons } from "./components/OAuthButtons";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 p-4 dark:from-zinc-950 dark:to-zinc-900">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <h1 className="font-heading text-2xl font-bold tracking-tight">
              Sign in or sign up
            </h1>
            <CardDescription>
              Use a magic link or an OAuth provider to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <MagicLinkForm />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 tracking-wider text-zinc-400">
                  Or continue with
                </span>
              </div>
            </div>
            <OAuthButtons />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
