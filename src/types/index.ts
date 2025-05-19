
export type Category = {
  id: string;
  name: string;
  icon?: string;
};

export type Store = {
  id: string;
  name: string;
};

export type Unit = 'pcs' | 'kg' | 'g' | 'l' | 'ml' | 'pack' | 'box';

export type Item = {
  id: string;
  name: string;
  categoryId: string;
  quantity: number;
  unit: Unit;
  price: number | null;
  isChecked: boolean;
  comments?: string;
  storeLocation?: string;
};

export type ShoppingList = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  budget: number | null;
  items: Item[];
};
