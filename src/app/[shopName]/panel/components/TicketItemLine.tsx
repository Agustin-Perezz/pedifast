import type { PlainPanelItem } from "../lib/serialize-panel-order";

export function TicketItemLine({ item }: TicketItemLineProps) {
  return (
    <div className="my-0.5">
      <div className="flex gap-1.5 text-[13px]">
        <span className="min-w-6 font-bold">{item.quantity}x</span>
        <span>{item.name}</span>
      </div>
      {item.accessories.map((accessory, index) => (
        <p key={index} className="m-0 ml-7 text-[11px] text-gray-700">
          + {accessory.name}
        </p>
      ))}
    </div>
  );
}

type TicketItemLineProps = {
  readonly item: PlainPanelItem;
};
