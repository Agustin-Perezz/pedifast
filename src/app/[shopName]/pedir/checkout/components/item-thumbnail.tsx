"use client";

export type ItemThumbnailProps = {
  readonly image: string | null;
  readonly name: string;
};

export function ItemThumbnail({ image, name }: ItemThumbnailProps) {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="h-16 w-16 shrink-0 rounded-lg bg-surface-container object-cover"
        loading="lazy"
        decoding="async"
      />
    );
  }

  return <div className="h-16 w-16 shrink-0 rounded-lg bg-surface-container" />;
}
