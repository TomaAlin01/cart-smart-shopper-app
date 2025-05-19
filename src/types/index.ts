
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

export type ShoppingListContextType = {
  lists: ShoppingList[];
  categories: Category[];
  stores: Store[];
  DEFAULT_UNITS: Unit[];
  currentListId: string | null;
  setCurrentListId: (id: string | null) => void;
  addList: (name: string, budget?: number) => void;
  updateList: (id: string, updates: Partial<Omit<ShoppingList, 'id' | 'items'>>) => void;
  deleteList: (id: string) => void;
  addItemToList: (listId: string, item: Omit<Item, 'id' | 'isChecked'>) => void;
  updateItemInList: (listId: string, itemId: string, updates: Partial<Omit<Item, 'id'>>) => void;
  deleteItemFromList: (listId: string, itemId: string) => void;
  toggleItemCheck: (listId: string, itemId: string) => void;
  getListTotal: (listId: string) => number;
  getCheckedTotal: (listId: string) => number;
  searchItems: (listId: string, query: string) => Item[];
};
