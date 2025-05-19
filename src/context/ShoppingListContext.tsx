
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ShoppingList, Item, Category, Store, Unit } from '@/types';
import { toast } from "sonner";

// Default categories
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'produce', name: 'Produce' },
  { id: 'dairy', name: 'Dairy' },
  { id: 'meat', name: 'Meat' },
  { id: 'bakery', name: 'Bakery' },
  { id: 'canned', name: 'Canned Goods' },
  { id: 'frozen', name: 'Frozen Foods' },
  { id: 'beverages', name: 'Beverages' },
  { id: 'snacks', name: 'Snacks' },
  { id: 'household', name: 'Household' },
  { id: 'personal', name: 'Personal Care' },
  { id: 'other', name: 'Other' },
];

// Default stores
export const DEFAULT_STORES: Store[] = [
  { id: 'grocery', name: 'Grocery Store' },
  { id: 'supermarket', name: 'Supermarket' },
  { id: 'farmers', name: 'Farmers Market' },
  { id: 'convenience', name: 'Convenience Store' },
  { id: 'department', name: 'Department Store' },
  { id: 'online', name: 'Online' },
];

// Default units
export const DEFAULT_UNITS: Unit[] = [
  'pcs', 'kg', 'g', 'l', 'ml', 'pack', 'box'
];

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 11);

// Default shopping list
const DEFAULT_SHOPPING_LIST: ShoppingList = {
  id: generateId(),
  name: 'Groceries',
  createdAt: new Date(),
  updatedAt: new Date(),
  budget: 100,
  items: [
    {
      id: generateId(),
      name: 'Milk',
      categoryId: 'dairy',
      quantity: 1,
      unit: 'l',
      price: 2.99,
      isChecked: false,
      storeLocation: 'Aisle 2'
    },
    {
      id: generateId(),
      name: 'Bread',
      categoryId: 'bakery',
      quantity: 1,
      unit: 'pcs',
      price: 3.49,
      isChecked: false,
      storeLocation: 'Bakery section'
    }
  ]
};

type ShoppingListContextType = {
  lists: ShoppingList[];
  categories: Category[];
  stores: Store[];
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

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

export const useShoppingList = () => {
  const context = useContext(ShoppingListContext);
  if (!context) {
    throw new Error('useShoppingList must be used within a ShoppingListProvider');
  }
  return context;
};

export const ShoppingListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lists, setLists] = useState<ShoppingList[]>([DEFAULT_SHOPPING_LIST]);
  const [categories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [stores] = useState<Store[]>(DEFAULT_STORES);
  const [currentListId, setCurrentListId] = useState<string | null>(DEFAULT_SHOPPING_LIST.id);

  // Load data from localStorage on initial load
  useEffect(() => {
    try {
      const savedLists = localStorage.getItem('shoppingLists');
      if (savedLists) {
        const parsedLists = JSON.parse(savedLists);
        // Convert string dates back to Date objects
        const formattedLists = parsedLists.map((list: any) => ({
          ...list,
          createdAt: new Date(list.createdAt),
          updatedAt: new Date(list.updatedAt)
        }));
        setLists(formattedLists);
        
        // Set current list to the first one if it exists
        if (formattedLists.length > 0 && !currentListId) {
          setCurrentListId(formattedLists[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load shopping lists from localStorage:', error);
      toast.error('Failed to load your shopping lists');
    }
  }, []);

  // Save data to localStorage whenever lists change
  useEffect(() => {
    try {
      localStorage.setItem('shoppingLists', JSON.stringify(lists));
    } catch (error) {
      console.error('Failed to save shopping lists to localStorage:', error);
    }
  }, [lists]);

  const addList = (name: string, budget?: number) => {
    const newList: ShoppingList = {
      id: generateId(),
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
      budget: budget || null,
      items: []
    };
    
    setLists(prevLists => [...prevLists, newList]);
    setCurrentListId(newList.id);
    toast.success(`Created "${name}" shopping list`);
  };

  const updateList = (id: string, updates: Partial<Omit<ShoppingList, 'id' | 'items'>>) => {
    setLists(prevLists => prevLists.map(list => 
      list.id === id 
        ? { ...list, ...updates, updatedAt: new Date() } 
        : list
    ));
    toast.success(`Updated list details`);
  };

  const deleteList = (id: string) => {
    const listToDelete = lists.find(list => list.id === id);
    
    setLists(prevLists => prevLists.filter(list => list.id !== id));
    
    // If we're deleting the current list, set the current list to another one
    if (currentListId === id) {
      const remainingLists = lists.filter(list => list.id !== id);
      if (remainingLists.length > 0) {
        setCurrentListId(remainingLists[0].id);
      } else {
        setCurrentListId(null);
      }
    }

    if (listToDelete) {
      toast.success(`Deleted "${listToDelete.name}" list`);
    }
  };

  const addItemToList = (listId: string, item: Omit<Item, 'id' | 'isChecked'>) => {
    const newItem: Item = {
      ...item,
      id: generateId(),
      isChecked: false
    };
    
    setLists(prevLists => prevLists.map(list => 
      list.id === listId 
        ? { 
            ...list, 
            items: [...list.items, newItem],
            updatedAt: new Date()
          } 
        : list
    ));
    toast.success(`Added "${item.name}" to list`);
  };

  const updateItemInList = (listId: string, itemId: string, updates: Partial<Omit<Item, 'id'>>) => {
    setLists(prevLists => prevLists.map(list => 
      list.id === listId 
        ? { 
            ...list, 
            items: list.items.map(item => 
              item.id === itemId 
                ? { ...item, ...updates } 
                : item
            ),
            updatedAt: new Date()
          } 
        : list
    ));
  };

  const deleteItemFromList = (listId: string, itemId: string) => {
    setLists(prevLists => prevLists.map(list => 
      list.id === listId 
        ? { 
            ...list, 
            items: list.items.filter(item => item.id !== itemId),
            updatedAt: new Date() 
          } 
        : list
    ));
    toast.success(`Removed item from list`);
  };

  const toggleItemCheck = (listId: string, itemId: string) => {
    setLists(prevLists => prevLists.map(list => 
      list.id === listId 
        ? { 
            ...list, 
            items: list.items.map(item => 
              item.id === itemId 
                ? { ...item, isChecked: !item.isChecked } 
                : item
            ),
            updatedAt: new Date()
          } 
        : list
    ));
  };

  const getListTotal = (listId: string) => {
    const list = lists.find(list => list.id === listId);
    if (!list) return 0;
    
    return list.items.reduce((total, item) => {
      if (item.price === null) return total;
      return total + (item.price * item.quantity);
    }, 0);
  };

  const getCheckedTotal = (listId: string) => {
    const list = lists.find(list => list.id === listId);
    if (!list) return 0;
    
    return list.items.reduce((total, item) => {
      if (item.price === null || !item.isChecked) return total;
      return total + (item.price * item.quantity);
    }, 0);
  };

  const searchItems = (listId: string, query: string) => {
    const list = lists.find(list => list.id === listId);
    if (!list) return [];
    
    const lowercasedQuery = query.toLowerCase();
    return list.items.filter(item => 
      item.name.toLowerCase().includes(lowercasedQuery) ||
      item.comments?.toLowerCase().includes(lowercasedQuery) ||
      item.storeLocation?.toLowerCase().includes(lowercasedQuery)
    );
  };

  const value = {
    lists,
    categories,
    stores,
    currentListId,
    setCurrentListId,
    addList,
    updateList,
    deleteList,
    addItemToList,
    updateItemInList,
    deleteItemFromList,
    toggleItemCheck,
    getListTotal,
    getCheckedTotal,
    searchItems
  };

  return (
    <ShoppingListContext.Provider value={value}>
      {children}
    </ShoppingListContext.Provider>
  );
};
