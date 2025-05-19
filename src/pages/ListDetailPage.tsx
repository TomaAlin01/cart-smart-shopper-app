
import React, { useState } from 'react';
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
import { ShoppingCart, Plus, PackageOpen } from 'lucide-react';
import { Item, Unit } from '@/types';

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

  if (!listId) {
    navigate('/lists');
    return null;
  }

  const currentList = lists.find(list => list.id === listId);
  
  if (!currentList) {
    navigate('/lists');
    return null;
  }

  const displayedItems = searchQuery 
    ? searchItems(listId, searchQuery)
    : currentList.items;
  
  // Group items by category
  const itemsByCategory: Record<string, Item[]> = {};
  
  displayedItems.forEach(item => {
    if (!itemsByCategory[item.categoryId]) {
      itemsByCategory[item.categoryId] = [];
    }
    itemsByCategory[item.categoryId].push(item);
  });

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
    <div className="flex flex-col min-h-screen bg-shoppingapp-background">
      <AppHeader 
        title={currentList.name} 
        showBackButton={true} 
        showSearchButton={true}
        onSearchClick={toggleSearch}
      />
      
      {isSearchActive && (
        <div className="p-4 bg-white shadow-sm">
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
      
      <main className="flex-1 p-4">
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
          <div className="divide-y divide-gray-200">
            {Object.entries(itemsByCategory).map(([categoryId, items]) => {
              const category = categories.find(c => c.id === categoryId);
              if (!category) return null;
              
              return (
                <div key={categoryId} className="py-3">
                  <h3 className="text-sm font-medium text-shoppingapp-muted mb-2">{category.name}</h3>
                  <ul className="space-y-2">
                    {items.map(item => (
                      <li 
                        key={item.id} 
                        className={`flex items-center p-3 rounded-lg ${
                          item.isChecked 
                            ? 'bg-gray-50' 
                            : 'bg-white shadow-sm'
                        }`}
                      >
                        <Checkbox 
                          id={`item-${item.id}`}
                          checked={item.isChecked}
                          onCheckedChange={() => toggleItemCheck(listId, item.id)}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <label 
                              htmlFor={`item-${item.id}`}
                              className={`font-medium ${
                                item.isChecked 
                                  ? 'text-gray-500 line-through' 
                                  : 'text-shoppingapp-text'
                              }`}
                            >
                              {item.name}
                            </label>
                            <button 
                              className="text-shoppingapp-muted hover:text-shoppingapp-danger text-sm"
                              onClick={() => deleteItemFromList(listId, item.id)}
                            >
                              Remove
                            </button>
                          </div>
                          
                          <div className="text-sm text-shoppingapp-muted mt-1 flex flex-wrap gap-2">
                            <span>{item.quantity} {item.unit}</span>
                            {item.price !== null && <span>${item.price.toFixed(2)}</span>}
                            {item.storeLocation && <span>• {item.storeLocation}</span>}
                          </div>
                          
                          {item.comments && (
                            <div className="mt-1 text-sm text-shoppingapp-muted">
                              {item.comments}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <div className="sticky bottom-4 flex justify-center">
        <Button 
          className="shadow-lg bg-shoppingapp-primary hover:bg-blue-600"
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                placeholder="e.g., Milk, Bread, etc."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={newItem.categoryId} 
                onValueChange={(value) => setNewItem({...newItem, categoryId: value})}
              >
                <SelectTrigger>
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
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select 
                  value={newItem.unit} 
                  onValueChange={(value) => setNewItem({...newItem, unit: value as Unit})}
                >
                  <SelectTrigger>
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
            
            <div className="space-y-2">
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
                  className="pl-7"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Store Location (optional)</Label>
              <Input
                id="location"
                value={newItem.storeLocation || ''}
                onChange={(e) => setNewItem({...newItem, storeLocation: e.target.value})}
                placeholder="e.g., Aisle 5, Dairy section"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="comments">Comments (optional)</Label>
              <Textarea
                id="comments"
                value={newItem.comments || ''}
                onChange={(e) => setNewItem({...newItem, comments: e.target.value})}
                placeholder="Add any additional notes here..."
                className="resize-none"
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
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddItem}
              disabled={!newItem.name.trim()}
              className="bg-shoppingapp-primary hover:bg-blue-600"
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
