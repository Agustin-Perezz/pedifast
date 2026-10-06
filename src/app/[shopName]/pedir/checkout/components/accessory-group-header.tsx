import type { PlainAccessoryGroup } from "../../lib/serialize-catalog";

export type AccessoryGroupHeaderProps = {
  readonly group: PlainAccessoryGroup;
  readonly showMissingHint: boolean;
};

export function AccessoryGroupHeader({
  group,
  showMissingHint,
}: AccessoryGroupHeaderProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-bold text-foreground">{group.name}</span>
        {group.isRequired && (
          <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
            Requerido
          </span>
        )}
      </div>
      {showMissingHint && group.isRequired && (
        <p
          role="alert"
          className="text-[11px] font-medium text-destructive"
          data-testid={`accessory-group-missing-${group.id}`}
        >
          Elegí una opción para continuar
        </p>
      )}
    </div>
  );
}
