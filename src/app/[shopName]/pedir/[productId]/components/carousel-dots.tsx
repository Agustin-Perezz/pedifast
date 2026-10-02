import { Button } from "@/components/ui/button";

type CarouselDotsProps = {
  readonly count: number;
  readonly selectedIndex: number;
  readonly onSelect: (index: number) => void;
};

export function CarouselDots({
  count,
  selectedIndex,
  onSelect,
}: CarouselDotsProps) {
  if (count <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2.5 pb-4">
      {Array.from({ length: count }, (_, index) => (
        <Button
          // The dot's identity IS its position: it navigates to image N
          // and E2E selectors depend on carousel-dot-N.
          // biome-ignore lint/suspicious/noArrayIndexKey: positional UI identity
          key={index}
          type="button"
          aria-label={`Image ${index + 1}`}
          data-testid={`carousel-dot-${index}`}
          onClick={() => onSelect(index)}
          className={`rounded-full transition-all duration-200 ${
            index === selectedIndex
              ? "h-3 w-3 border border-outline"
              : "h-2 w-2 bg-surface-container-highest"
          }`}
        />
      ))}
    </div>
  );
}
