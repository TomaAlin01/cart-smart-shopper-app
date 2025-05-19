
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
import { Progress } from '@/components/ui/progress';
import { ShoppingBag, Plus, Trash, CalendarDays, DollarSign } from 'lucide-react';
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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/80">
      <AppHeader title="My Shopping Lists" />
      
      <main className="flex-1 p-6 space-y-6 max-w-3xl mx-auto w-full">
        {lists.length === 0 ? (
          <EmptyState
            title="No shopping lists yet"
            description="Create your first shopping list to get started"
            actionLabel="Create List"
            onAction={() => setIsDialogOpen(true)}
            icon={<ShoppingBag className="h-12 w-12" />}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {lists.map((list) => {
              const total = getListTotal(list.id);
              const itemCount = list.items.length;
              const checkedCount = list.items.filter(item => item.isChecked).length;
              const percentage = list.budget ? Math.min((total / list.budget) * 100, 100) : 0;
              const isOverBudget = list.budget && total > list.budget;
              
              return (
                <Card 
                  key={list.id} 
                  className="overflow-hidden card-hover glass-card scaleIn rounded-xl"
                  onClick={() => handleOpenList(list.id)}
                >
                  <div className="h-2.5 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                  <CardContent className="p-5">
                    <div className="mb-4 flex justify-between items-start">
                      <h3 className="font-semibold text-xl mb-1 text-shoppingapp-text">{list.name}</h3>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => handleDeleteList(e, list.id)}
                        className="rounded-full text-shoppingapp-muted hover:text-shoppingapp-danger hover:bg-red-50"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-shoppingapp-muted">
                        <ShoppingBag className="h-4 w-4" />
                        <span>
                          {itemCount} {itemCount === 1 ? 'item' : 'items'} 
                          {itemCount > 0 && ` (${checkedCount}/${itemCount} checked)`}
                        </span>
                      </div>
                      
                      {list.budget && (
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span className="flex items-center gap-1.5">
                              <DollarSign className="h-3.5 w-3.5" />
                              Budget: ${list.budget.toFixed(2)}
                            </span>
                            <span className={`${isOverBudget ? 'text-shoppingapp-danger' : 'text-shoppingapp-primary font-medium'}`}>
                              ${total.toFixed(2)}
                            </span>
                          </div>
                          <Progress 
                            value={percentage} 
                            className={`h-1.5 rounded-full ${isOverBudget ? 'bg-red-100' : 'bg-blue-100'}`}
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-xs text-shoppingapp-muted">
                        <CalendarDays className="h-3.5 w-3.5" />
                        <span>Created {formatDate(list.createdAt)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <div className="sticky bottom-8 flex justify-center">
        <Button 
          className="shadow-lg bg-gradient-to-r from-shoppingapp-primary to-blue-600 hover:opacity-90 rounded-full px-6 py-6"
          size="lg"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="mr-2 h-5 w-5" />
          New Shopping List
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="glass-card rounded-xl border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Create New Shopping List</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-5 py-4">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-sm font-medium">List Name</Label>
              <Input
                id="name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="e.g., Weekly Groceries, Home Depot..."
                className="rounded-lg border-blue-100 focus:border-blue-300"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="budget" className="text-sm font-medium">
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
                  className="pl-7 rounded-lg border-blue-100 focus:border-blue-300"
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
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateList}
              disabled={!newListName.trim()}
              className="bg-gradient-to-r from-shoppingapp-primary to-blue-600 rounded-lg"
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
