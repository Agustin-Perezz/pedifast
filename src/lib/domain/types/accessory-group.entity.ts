export interface RawAccessoryOption {
  id: number;
  name: string;
  price_delta: number;
  sort_order: number;
}

export interface RawAccessoryGroup {
  id: number;
  name: string;
  selection_mode: string;
  is_required: boolean;
  sort_order: number;
  accessory_options: RawAccessoryOption[];
}

export interface RawAccessoryGroupRow extends RawAccessoryGroup {
  shop_item_id: number;
}
