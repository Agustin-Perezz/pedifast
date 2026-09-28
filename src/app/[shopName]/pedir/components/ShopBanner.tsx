type ShopBannerProps = {
  readonly name: string;
  readonly portraitUrl: string | null;
  readonly logoUrl: string | null;
};

export function ShopBanner({ name, portraitUrl, logoUrl }: ShopBannerProps) {
  const initial = name[0] ?? "?";

  return (
    <>
      <div className="relative h-44 w-full overflow-hidden bg-zinc-300 sm:h-52">
        {portraitUrl && (
          <img
            src={portraitUrl}
            alt={`${name} portrait`}
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-lg px-5 md:max-w-3xl lg:max-w-5xl">
        <div className="absolute -top-10 left-5 size-20 overflow-hidden rounded-full border-4 border-white bg-white shadow-md">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${name} logo`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-black text-zinc-400">
              {initial}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
