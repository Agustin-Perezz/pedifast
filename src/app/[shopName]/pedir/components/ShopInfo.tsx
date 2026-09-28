import { Clock, MapPin } from "lucide-react";

type ShopInfoProps = {
  readonly name: string;
  readonly address: string;
  readonly openHours: string | null;
};

export function ShopInfo({ name, address, openHours }: ShopInfoProps) {
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <div className="mx-auto max-w-lg px-5 pt-14 pb-4 md:max-w-3xl lg:max-w-5xl">
      <h1 className="text-xl font-bold text-zinc-900">{name}</h1>

      <div className="mt-3 flex flex-col gap-2.5">
        <a
          href={mapsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5"
        >
          <MapPin className="size-5 shrink-0 text-red-500" />
          <span className="text-sm text-zinc-600 group-hover:text-blue-600 group-hover:underline">
            {address}
          </span>
        </a>

        {openHours && (
          <div className="flex items-center gap-2.5">
            <Clock className="size-5 shrink-0 text-zinc-400" />
            <span className="text-sm text-zinc-600">{openHours}</span>
          </div>
        )}
      </div>
    </div>
  );
}
