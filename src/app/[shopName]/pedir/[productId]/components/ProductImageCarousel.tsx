"use client";

import { useCallback, useRef, useState } from "react";

import { CarouselDots } from "./carousel-dots";

type ProductImageCarouselProps = {
  readonly images: readonly string[];
  readonly productName: string;
};

export function ProductImageCarousel({
  images,
  productName,
}: ProductImageCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollToImage = useCallback((index: number) => {
    const track = trackRef.current;
    if (track) {
      track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
    }
  }, []);

  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (track) {
      setSelectedIndex(Math.round(track.scrollLeft / track.clientWidth));
    }
  }, []);

  if (images.length === 0) {
    return (
      <div className="relative flex flex-col overflow-hidden bg-card md:w-1/2 md:rounded-2xl">
        <div className="flex items-center justify-center py-6 md:px-10">
          <div className="bg-muted flex aspect-square w-full max-w-[280px] items-center justify-center rounded-xl md:max-h-[400px]">
            <span className="text-muted-foreground text-sm">No images</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col overflow-hidden bg-card md:w-1/2 md:rounded-2xl">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
      >
        {images.map((image, index) => (
          <div key={image} className="w-full shrink-0 snap-center">
            <div className="flex items-center justify-center md:px-10 md:py-6">
              <img
                src={image}
                alt={`${productName} ${index + 1}`}
                className="aspect-square w-full object-cover md:max-h-[400px] md:object-contain"
                loading={index === 0 ? "eager" : "lazy"}
                decoding={index === 0 ? "sync" : "async"}
              />
            </div>
          </div>
        ))}
      </div>

      <CarouselDots
        count={images.length}
        selectedIndex={selectedIndex}
        onSelect={scrollToImage}
      />
    </div>
  );
}
