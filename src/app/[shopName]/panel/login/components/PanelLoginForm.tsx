import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { loginWithPinAction } from "../../actions";

type PanelLoginFormProps = {
  readonly shopName: string;
  readonly error: string | null;
};

export function PanelLoginForm({ shopName, error }: PanelLoginFormProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="mb-1 text-lg font-semibold text-zinc-950">
            Panel del local
          </h1>
          <p className="mb-6 text-sm text-zinc-500">
            Ingresá el PIN para acceder al panel de pedidos.
          </p>

          <form action={loginWithPinAction} className="flex flex-col gap-4">
            <input type="hidden" name="shopName" value={shopName} />
            <div className="flex flex-col gap-2">
              <Label htmlFor="pin">PIN</Label>
              <Input
                id="pin"
                name="pin"
                type="password"
                inputMode="numeric"
                autoComplete="off"
                maxLength={6}
                placeholder="Ingresá el PIN"
                className="text-center text-lg tracking-widest"
                required
              />
              {error ? (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              ) : null}
            </div>
            <Button type="submit" className="w-full">
              Ingresar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
