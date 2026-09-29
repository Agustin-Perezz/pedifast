"use client";

import { useState } from "react";

type ProductImageCarouselProps = {
  readonly images: readonly string[];
  readonly productName: string;
};

export function ProductImageCarousel({
  images,
  productName,
}: ProductImageCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="relative flex flex-col overflow-hidden bg-white md:w-1/2 md:rounded-2xl">
        <div className="flex items-center justify-center px-10 py-6">
          <div className="bg-muted flex aspect-square w-full max-w-[280px] items-center justify-center rounded-xl md:max-h-[400px]">
            <span className="text-muted-foreground text-sm">No images</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col overflow-hidden bg-white md:w-1/2 md:rounded-2xl">
      <div className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto scroll-smooth">
        {images.map((image, index) => (
          <div key={image} className="w-full shrink-0 snap-center">
            <div className="flex items-center justify-center px-10 py-6">
              <img
                src={image}
                alt={`${productName} ${index + 1}`}
                className="max-h-[280px] w-full object-contain md:max-h-[400px]"
                loading={index === 0 ? "eager" : "lazy"}
                decoding={index === 0 ? "sync" : "async"}
              />
            </div>
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <div className="absolute right-0 bottom-10 left-0 flex items-center justify-center gap-2.5">
          {images.map((_, index) => (
            <button
              // The dot's identity IS its position: it navigates to image N
              // and E2E selectors depend on carousel-dot-N.
              // biome-ignore lint/suspicious/noArrayIndexKey: positional UI identity
              key={index}
              type="button"
              aria-label={`Image ${index + 1}`}
              data-testid={`carousel-dot-${index}`}
              onClick={() => setSelectedIndex(index)}
              className={`rounded-full transition-all duration-200 ${
                index === selectedIndex
                  ? "h-3 w-3 border border-zinc-400"
                  : "h-2 w-2 bg-zinc-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
