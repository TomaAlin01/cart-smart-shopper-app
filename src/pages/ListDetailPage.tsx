
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShoppingList } from '@/context/ShoppingListContext';
import AppHeader from '@/components/AppHeader';
import BudgetProgress from '@/components/BudgetProgress';
import SearchBar from '@/components/SearchBar';
import EmptyState from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { 
  ShoppingCart, Plus, PackageOpen, Search, 
  MapPin, DollarSign, Tag, Check, Trash2 
} from 'lucide-react';
import { Item, Unit } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const MotionDiv = motion.div;

const ListDetailPage = () => {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const { 
    lists, 
    categories, 
    addItemToList, 
    deleteItemFromList, 
    toggleItemCheck, 
    DEFAULT_UNITS, 
    searchItems 
  } = useShoppingList();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  
  // Form state for new item
  const [newItem, setNewItem] = useState<{
    name: string;
    categoryId: string;
    quantity: string;
    unit: Unit;
    price: string;
    comments?: string;
    storeLocation?: string;
  }>({
    name: '',
    categoryId: categories[0].id,
    quantity: '1',
    unit: 'pcs',
    price: '',
    comments: '',
    storeLocation: '',
  });

  useEffect(() => {
    // Reset selected category when search query changes
    if (searchQuery) {
      setSelectedCategoryId(null);
    }
  }, [searchQuery]);

  if (!listId) {
    navigate('/lists');
    return null;
  }

  const currentList = lists.find(list => list.id === listId);
  
  if (!currentList) {
    navigate('/lists');
    return null;
  }

  let displayedItems = searchQuery 
    ? searchItems(listId, searchQuery)
    : currentList.items;
    
  // Filter by selected category if one is selected
  if (selectedCategoryId) {
    displayedItems = displayedItems.filter(item => item.categoryId === selectedCategoryId);
  }
  
  // Group items by category
  const itemsByCategory: Record<string, Item[]> = {};
  
  if (!selectedCategoryId) {
    // Only group by category if no specific category is selected
    displayedItems.forEach(item => {
      if (!itemsByCategory[item.categoryId]) {
        itemsByCategory[item.categoryId] = [];
      }
      itemsByCategory[item.categoryId].push(item);
    });
  } else {
    // If a category is selected, just use a single group
    itemsByCategory[selectedCategoryId] = displayedItems;
  }

  const handleAddItem = () => {
    if (newItem.name.trim()) {
      addItemToList(listId, {
        name: newItem.name,
        categoryId: newItem.categoryId,
        quantity: parseFloat(newItem.quantity) || 1,
        unit: newItem.unit,
        price: newItem.price ? parseFloat(newItem.price) : null,
        comments: newItem.comments?.trim() || undefined,
        storeLocation: newItem.storeLocation?.trim() || undefined,
      });
      
      resetForm();
      setIsAddDialogOpen(false);
    }
  };

  const resetForm = () => {
    setNewItem({
      name: '',
      categoryId: categories[0].id,
      quantity: '1',
      unit: 'pcs',
      price: '',
      comments: '',
      storeLocation: '',
    });
  };

  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
    if (isSearchActive) {
      setSearchQuery('');
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/80">
      <AppHeader 
        title={currentList.name} 
        showBackButton={true} 
        showSearchButton={true}
        onSearchClick={toggleSearch}
      />
      
      {isSearchActive && (
        <div className="p-4 bg-white/70 backdrop-blur-md shadow-sm">
          <SearchBar 
            onSearch={setSearchQuery} 
            placeholder="Search items..." 
            autofocus={true}
          />
        </div>
      )}
      
      {currentList.budget && (
        <BudgetProgress listId={listId} />
      )}
      
      <div className="px-4 py-3 bg-white/50 overflow-x-auto">
        <div className="flex space-x-2">
          <Button 
            variant={selectedCategoryId === null ? "default" : "outline"} 
            size="sm" 
            onClick={() => setSelectedCategoryId(null)}
            className="rounded-full whitespace-nowrap"
          >
            All
          </Button>
          
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategoryId === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategoryId(category.id)}
              className="rounded-full whitespace-nowrap"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>
      
      <main className="flex-1 p-6 max-w-3xl mx-auto w-full">
        {displayedItems.length === 0 ? (
          searchQuery ? (
            <EmptyState
              title="No matching items"
              description="Try a different search term"
              icon={<Search className="h-12 w-12" />}
            />
          ) : (
            <EmptyState
              title="No items yet"
              description="Start adding items to your shopping list"
              actionLabel="Add Item"
              onAction={() => setIsAddDialogOpen(true)}
              icon={<PackageOpen className="h-12 w-12" />}
            />
          )
        ) : (
          <div className="space-y-8">
            {Object.entries(itemsByCategory).map(([categoryId, items]) => {
              const category = categories.find(c => c.id === categoryId);
              if (!category) return null;
              
              return (
                <div key={categoryId} className="fadeIn">
                  {!selectedCategoryId && (
                    <div className="flex items-center mb-3">
                      <h3 className="text-lg font-medium text-shoppingapp-text">{category.name}</h3>
                      <div className="h-px bg-gray-200 flex-1 ml-4"></div>
                    </div>
                  )}
                  
                  <AnimatePresence>
                    <div className="space-y-3">
                      {items.map(item => (
                        <MotionDiv 
                          key={item.id} 
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className={cn(
                            "p-4 rounded-xl transition-all duration-300",
                            item.isChecked 
                              ? "list-item-checked" 
                              : "list-item-unchecked"
                          )}
                        >
                          <div className="flex">
                            <div className="mr-3 pt-1">
                              <div 
                                className={cn(
                                  "flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors",
                                  item.isChecked 
                                    ? "bg-green-500 border-green-500" 
                                    : "border-gray-300"
                                )}
                                onClick={() => toggleItemCheck(listId, item.id)}
                              >
                                {item.isChecked && <Check className="h-4 w-4 text-white" />}
                              </div>
                            </div>
                            
                            <div className="flex-1" onClick={() => toggleItemCheck(listId, item.id)}>
                              <div className="flex justify-between items-start">
                                <h4 
                                  className={cn(
                                    "font-medium text-base transition-all",
                                    item.isChecked 
                                      ? "text-gray-500 line-through" 
                                      : "text-shoppingapp-text"
                                  )}
                                >
                                  {item.name}
                                </h4>
                                
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteItemFromList(listId, item.id);
                                  }}
                                  className="h-8 w-8 rounded-full text-shoppingapp-muted hover:text-shoppingapp-danger hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              <div className="flex flex-wrap gap-3 mt-2">
                                <div className="flex items-center text-sm text-shoppingapp-muted">
                                  <Tag className="h-3.5 w-3.5 mr-1.5" />
                                  <span>{item.quantity} {item.unit}</span>
                                </div>
                                
                                {item.price !== null && (
                                  <div className="flex items-center text-sm text-shoppingapp-muted">
                                    <DollarSign className="h-3.5 w-3.5 mr-1" />
                                    <span>${item.price.toFixed(2)}</span>
                                  </div>
                                )}
                                
                                {item.storeLocation && (
                                  <div className="flex items-center text-sm text-shoppingapp-muted">
                                    <MapPin className="h-3.5 w-3.5 mr-1.5" />
                                    <span>{item.storeLocation}</span>
                                  </div>
                                )}
                              </div>
                              
                              {item.comments && (
                                <div className="mt-2 p-2 bg-gray-50 rounded-lg text-sm text-shoppingapp-muted">
                                  {item.comments}
                                </div>
                              )}
                            </div>
                          </div>
                        </MotionDiv>
                      ))}
                    </div>
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <div className="sticky bottom-8 flex justify-center">
        <Button 
          className="shadow-lg bg-gradient-to-r from-shoppingapp-primary to-blue-600 hover:opacity-90 rounded-full px-6 py-6"
          size="lg"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Item
        </Button>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
        setIsAddDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="glass-card rounded-xl border-0 shadow-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Add New Item</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-5 py-4">
            <div className="space-y-3">
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                placeholder="e.g., Milk, Bread, etc."
                className="rounded-lg border-blue-100 focus:border-blue-300"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={newItem.categoryId} 
                onValueChange={(value) => setNewItem({...newItem, categoryId: value})}
              >
                <SelectTrigger className="rounded-lg border-blue-100 focus:border-blue-300">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                  className="rounded-lg border-blue-100 focus:border-blue-300"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="unit">Unit</Label>
                <Select 
                  value={newItem.unit} 
                  onValueChange={(value) => setNewItem({...newItem, unit: value as Unit})}
                >
                  <SelectTrigger className="rounded-lg border-blue-100 focus:border-blue-300">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEFAULT_UNITS.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="price">
                Price (optional)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newItem.price}
                  onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                  className="pl-7 rounded-lg border-blue-100 focus:border-blue-300"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="location">Store Location (optional)</Label>
              <Input
                id="location"
                value={newItem.storeLocation || ''}
                onChange={(e) => setNewItem({...newItem, storeLocation: e.target.value})}
                placeholder="e.g., Aisle 5, Dairy section"
                className="rounded-lg border-blue-100 focus:border-blue-300"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="comments">Comments (optional)</Label>
              <Textarea
                id="comments"
                value={newItem.comments || ''}
                onChange={(e) => setNewItem({...newItem, comments: e.target.value})}
                placeholder="Add any additional notes here..."
                className="resize-none rounded-lg border-blue-100 focus:border-blue-300"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsAddDialogOpen(false);
                resetForm();
              }}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddItem}
              disabled={!newItem.name.trim()}
              className="bg-gradient-to-r from-shoppingapp-primary to-blue-600 rounded-lg"
            >
              Add to List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListDetailPage;
