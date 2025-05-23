import React, { createContext, useContext, useState, useEffect } from 'react';
import { ShoppingList, Item, Category, Store, Unit, ShoppingListContextType } from '@/types';
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

// Default units - updated to include 'bottle'
export const DEFAULT_UNITS: Unit[] = [
  'pcs', 'kg', 'g', 'l', 'ml', 'pack', 'box', 'bottle'
];

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 11);

// Default shopping lists with more items
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
    },
    {
      id: generateId(),
      name: 'Eggs',
      categoryId: 'dairy',
      quantity: 12,
      unit: 'pcs',
      price: 4.99,
      isChecked: false,
      storeLocation: 'Refrigerated section'
    },
    {
      id: generateId(),
      name: 'Bananas',
      categoryId: 'produce',
      quantity: 1,
      unit: 'kg',
      price: 1.99,
      isChecked: true,
      storeLocation: 'Produce section'
    },
    {
      id: generateId(),
      name: 'Chicken Breast',
      categoryId: 'meat',
      quantity: 0.5,
      unit: 'kg',
      price: 8.99,
      isChecked: false,
      storeLocation: 'Meat department'
    },
    {
      id: generateId(),
      name: 'Spinach',
      categoryId: 'produce',
      quantity: 1,
      unit: 'pack',
      price: 3.49,
      isChecked: false,
      storeLocation: 'Produce section'
    },
    {
      id: generateId(),
      name: 'Greek Yogurt',
      categoryId: 'dairy',
      quantity: 1,
      unit: 'pack',
      price: 4.99,
      isChecked: true,
      storeLocation: 'Aisle 3'
    },
    {
      id: generateId(),
      name: 'Pasta',
      categoryId: 'canned',
      quantity: 2,
      unit: 'pack',
      price: 1.79,
      isChecked: false,
      storeLocation: 'Aisle 7'
    },
    {
      id: generateId(),
      name: 'Tomato Sauce',
      categoryId: 'canned',
      quantity: 1,
      unit: 'bottle',
      price: 2.49,
      isChecked: true,
      storeLocation: 'Aisle 5'
    },
    {
      id: generateId(),
      name: 'Coffee',
      categoryId: 'beverages',
      quantity: 1,
      unit: 'pack',
      price: 7.99,
      isChecked: false,
      storeLocation: 'Aisle 8'
    }
  ]
};

// Weekly meal prep list
const MEAL_PREP_LIST: ShoppingList = {
  id: generateId(),
  name: 'Weekly Meal Prep',
  createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  budget: 85,
  items: [
    {
      id: generateId(),
      name: 'Brown Rice',
      categoryId: 'canned',
      quantity: 1,
      unit: 'kg',
      price: 3.49,
      isChecked: true,
      storeLocation: 'Aisle 5'
    },
    {
      id: generateId(),
      name: 'Chicken Thighs',
      categoryId: 'meat',
      quantity: 1,
      unit: 'kg',
      price: 7.99,
      isChecked: false,
      storeLocation: 'Meat department'
    },
    {
      id: generateId(),
      name: 'Broccoli',
      categoryId: 'produce',
      quantity: 2,
      unit: 'pcs',
      price: 2.49,
      isChecked: true,
      storeLocation: 'Produce section'
    },
    {
      id: generateId(),
      name: 'Sweet Potatoes',
      categoryId: 'produce',
      quantity: 0.7,
      unit: 'kg',
      price: 3.29,
      isChecked: false,
      storeLocation: 'Produce section'
    },
    {
      id: generateId(),
      name: 'Quinoa',
      categoryId: 'canned',
      quantity: 1,
      unit: 'pack',
      price: 4.99,
      isChecked: false,
      storeLocation: 'Aisle 7'
    },
    {
      id: generateId(),
      name: 'Avocados',
      categoryId: 'produce',
      quantity: 3,
      unit: 'pcs',
      price: 1.29,
      isChecked: false,
      storeLocation: 'Produce section'
    },
    {
      id: generateId(),
      name: 'Ground Turkey',
      categoryId: 'meat',
      quantity: 0.5,
      unit: 'kg',
      price: 6.99,
      isChecked: true,
      storeLocation: 'Meat department'
    },
    {
      id: generateId(),
      name: 'Bell Peppers',
      categoryId: 'produce',
      quantity: 3,
      unit: 'pcs',
      price: 1.49,
      isChecked: true,
      storeLocation: 'Produce section'
    },
    {
      id: generateId(),
      name: 'Black Beans',
      categoryId: 'canned',
      quantity: 2,
      unit: 'can',
      price: 0.99,
      isChecked: false,
      storeLocation: 'Aisle 4'
    },
    {
      id: generateId(),
      name: 'Eggs',
      categoryId: 'dairy',
      quantity: 18,
      unit: 'pcs',
      price: 5.99,
      isChecked: true,
      storeLocation: 'Refrigerated section'
    },
    {
      id: generateId(),
      name: 'Chicken Broth',
      categoryId: 'canned',
      quantity: 1,
      unit: 'bottle',
      price: 3.49,
      isChecked: false,
      storeLocation: 'Aisle 5'
    }
  ]
};

// Household items list
const HOUSEHOLD_LIST: ShoppingList = {
  id: generateId(),
  name: 'Household Items',
  createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
  budget: 50,
  items: [
    {
      id: generateId(),
      name: 'Laundry Detergent',
      categoryId: 'household',
      quantity: 1,
      unit: 'bottle',
      price: 12.99,
      isChecked: false,
      storeLocation: 'Cleaning supplies'
    },
    {
      id: generateId(),
      name: 'Paper Towels',
      categoryId: 'household',
      quantity: 2,
      unit: 'pack',
      price: 6.99,
      isChecked: true,
      storeLocation: 'Paper goods'
    },
    {
      id: generateId(),
      name: 'Dish Soap',
      categoryId: 'household',
      quantity: 1,
      unit: 'bottle',
      price: 3.49,
      isChecked: false,
      storeLocation: 'Cleaning supplies'
    },
    {
      id: generateId(),
      name: 'Toothpaste',
      categoryId: 'personal',
      quantity: 1,
      unit: 'pcs',
      price: 2.99,
      isChecked: false,
      storeLocation: 'Personal care'
    },
    {
      id: generateId(),
      name: 'Tissues',
      categoryId: 'household',
      quantity: 3,
      unit: 'box',
      price: 1.99,
      isChecked: true,
      storeLocation: 'Paper goods'
    },
    {
      id: generateId(),
      name: 'Hand Soap',
      categoryId: 'personal',
      quantity: 2,
      unit: 'bottle',
      price: 3.99,
      isChecked: false,
      storeLocation: 'Personal care'
    },
    {
      id: generateId(),
      name: 'Bathroom Cleaner',
      categoryId: 'household',
      quantity: 1,
      unit: 'bottle',
      price: 4.49,
      isChecked: true,
      storeLocation: 'Cleaning supplies'
    },
    {
      id: generateId(),
      name: 'Toilet Paper',
      categoryId: 'household',
      quantity: 1,
      unit: 'pack',
      price: 8.99,
      isChecked: false,
      storeLocation: 'Paper goods'
    },
    {
      id: generateId(),
      name: 'Light Bulbs',
      categoryId: 'household',
      quantity: 4,
      unit: 'pcs',
      price: 3.29,
      isChecked: false,
      storeLocation: 'Home goods'
    },
    {
      id: generateId(),
      name: 'Shampoo',
      categoryId: 'personal',
      quantity: 1,
      unit: 'bottle',
      price: 5.99,
      isChecked: true,
      storeLocation: 'Personal care'
    }
  ]
};

// Create a Party Supplies list
const PARTY_LIST: ShoppingList = {
  id: generateId(),
  name: 'Party Supplies',
  createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  budget: 120,
  items: [
    {
      id: generateId(),
      name: 'Paper Plates',
      categoryId: 'household',
      quantity: 3,
      unit: 'pack',
      price: 4.99,
      isChecked: true,
      storeLocation: 'Party supplies'
    },
    {
      id: generateId(),
      name: 'Plastic Cups',
      categoryId: 'household',
      quantity: 2,
      unit: 'pack',
      price: 3.99,
      isChecked: true,
      storeLocation: 'Party supplies'
    },
    {
      id: generateId(),
      name: 'Napkins',
      categoryId: 'household',
      quantity: 2,
      unit: 'pack',
      price: 2.49,
      isChecked: false,
      storeLocation: 'Paper goods'
    },
    {
      id: generateId(),
      name: 'Balloons',
      categoryId: 'other',
      quantity: 1,
      unit: 'pack',
      price: 5.99,
      isChecked: false,
      storeLocation: 'Party supplies'
    },
    {
      id: generateId(),
      name: 'Soft Drinks',
      categoryId: 'beverages',
      quantity: 4,
      unit: 'bottle',
      price: 1.99,
      isChecked: false,
      storeLocation: 'Beverage aisle'
    },
    {
      id: generateId(),
      name: 'Chips',
      categoryId: 'snacks',
      quantity: 5,
      unit: 'pack',
      price: 3.49,
      isChecked: true,
      storeLocation: 'Snack aisle'
    },
    {
      id: generateId(),
      name: 'Dip',
      categoryId: 'snacks',
      quantity: 2,
      unit: 'pcs',
      price: 2.99,
      isChecked: false,
      storeLocation: 'Refrigerated section'
    },
    {
      id: generateId(),
      name: 'Pizza',
      categoryId: 'frozen',
      quantity: 3,
      unit: 'pcs',
      price: 6.99,
      isChecked: false,
      storeLocation: 'Frozen foods'
    }
  ]
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
  const [lists, setLists] = useState<ShoppingList[]>([DEFAULT_SHOPPING_LIST, MEAL_PREP_LIST, HOUSEHOLD_LIST, PARTY_LIST]);
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
    DEFAULT_UNITS,
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
