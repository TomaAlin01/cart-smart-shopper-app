
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShoppingList } from '@/context/ShoppingListContext';
import AppHeader from '@/components/AppHeader';
import EmptyState from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, Plus, Trash } from 'lucide-react';
import { format } from 'date-fns';

const ListsPage = () => {
  const { lists, addList, deleteList, setCurrentListId, getListTotal } = useShoppingList();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListBudget, setNewListBudget] = useState('');

  const handleCreateList = () => {
    if (newListName.trim()) {
      const budget = newListBudget ? parseFloat(newListBudget) : undefined;
      addList(newListName, budget);
      setIsDialogOpen(false);
      setNewListName('');
      setNewListBudget('');
    }
  };

  const handleOpenList = (id: string) => {
    setCurrentListId(id);
    navigate(`/list/${id}`);
  };

  const handleDeleteList = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent opening the list
    deleteList(id);
  };

  const resetForm = () => {
    setNewListName('');
    setNewListBudget('');
  };

  const formatDate = (date: Date) => {
    return format(date, 'MMM d, yyyy');
  };

  return (
    <div className="flex flex-col min-h-screen bg-shoppingapp-background">
      <AppHeader title="Shopping Lists" />
      
      <main className="flex-1 p-4">
        {lists.length === 0 ? (
          <EmptyState
            title="No shopping lists yet"
            description="Create your first shopping list to get started"
            actionLabel="Create List"
            onAction={() => setIsDialogOpen(true)}
            icon={<ShoppingBag className="h-12 w-12" />}
          />
        ) : (
          <div className="space-y-4">
            {lists.map((list) => {
              const total = getListTotal(list.id);
              const itemCount = list.items.length;
              const checkedCount = list.items.filter(item => item.isChecked).length;
              
              return (
                <Card 
                  key={list.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleOpenList(list.id)}
                >
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-lg mb-1">{list.name}</h3>
                      <div className="text-sm text-shoppingapp-muted space-y-1">
                        <p>
                          {itemCount} {itemCount === 1 ? 'item' : 'items'} 
                          {checkedCount > 0 && ` (${checkedCount} checked)`}
                        </p>
                        {list.budget && (
                          <p>
                            Budget: ${list.budget.toFixed(2)} 
                            <span className={`ml-2 ${total > list.budget ? 'text-shoppingapp-danger' : ''}`}>
                              Spent: ${total.toFixed(2)}
                            </span>
                          </p>
                        )}
                        <p>Created {formatDate(list.createdAt)}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => handleDeleteList(e, list.id)}
                      className="text-shoppingapp-muted hover:text-shoppingapp-danger"
                    >
                      <Trash className="h-5 w-5" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <div className="sticky bottom-4 flex justify-center">
        <Button 
          className="shadow-lg bg-shoppingapp-primary hover:bg-blue-600"
          size="lg"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="mr-2 h-5 w-5" />
          Create New List
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Shopping List</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">List Name</Label>
              <Input
                id="name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="e.g., Groceries, Home Depot, Target..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="budget">
                Budget (optional)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="budget"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newListBudget}
                  onChange={(e) => setNewListBudget(e.target.value)}
                  className="pl-7"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateList}
              disabled={!newListName.trim()}
              className="bg-shoppingapp-primary hover:bg-blue-600"
            >
              Create List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListsPage;
