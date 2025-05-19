
import React, { useState } from 'react';
import { useShoppingList } from '@/context/ShoppingListContext';
import AppHeader from '@/components/AppHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tag, Plus, Trash2, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionCard = motion(Card);

const CategoriesPage = () => {
  const { categories } = useShoppingList();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');
  
  const handleAddCategory = () => {
    // This would need implementation in the context
    console.log('Adding category:', categoryName);
    setIsDialogOpen(false);
    setCategoryName('');
    setEditingCategory(null);
  };
  
  const handleEditCategory = (id: string, name: string) => {
    setEditingCategory(id);
    setCategoryName(name);
    setIsDialogOpen(true);
  };
  
  const handleDeleteCategory = (id: string) => {
    // This would need implementation in the context
    console.log('Deleting category:', id);
  };
  
  const resetForm = () => {
    setCategoryName('');
    setEditingCategory(null);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/80">
      <AppHeader 
        title="Manage Categories" 
        showBackButton={true}
        showListsButton={true}
      />
      
      <main className="flex-1 p-6 max-w-2xl mx-auto w-full">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Shopping Categories</h2>
          <Button 
            onClick={() => {
              resetForm();
              setIsDialogOpen(true);
            }}
            className="rounded-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>
        
        <AnimatePresence>
          <div className="space-y-3">
            {categories.map((category) => (
              <MotionCard 
                key={category.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="glass-card"
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                      <Tag className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEditCategory(category.id, category.name)}
                      className="h-8 w-8 rounded-full hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteCategory(category.id)}
                      className="h-8 w-8 rounded-full text-shoppingapp-muted hover:text-shoppingapp-danger hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </MotionCard>
            ))}
          </div>
        </AnimatePresence>
        
        <div className="mt-8 p-6 border border-dashed border-gray-300 rounded-lg text-center">
          <p className="text-shoppingapp-muted">
            Note: Currently, the category management functionality is only visual as the context implementation would be required.
          </p>
        </div>
      </main>
      
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="glass-card rounded-xl border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-5 py-4">
            <div className="space-y-3">
              <Label htmlFor="category-name">Category Name</Label>
              <Input
                id="category-name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g., Fruits, Dairy, Electronics..."
                className="rounded-lg border-blue-100 focus:border-blue-300"
              />
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
              onClick={handleAddCategory}
              disabled={!categoryName.trim()}
              className="bg-gradient-to-r from-shoppingapp-primary to-blue-600 rounded-lg"
            >
              {editingCategory ? 'Save Changes' : 'Add Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesPage;
