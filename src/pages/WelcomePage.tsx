
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useShoppingList } from '@/context/ShoppingListContext';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/EmptyState';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ShoppingBag, BarChart2, Plus, ChevronRight, Tag } from 'lucide-react';
import AppHeader from '@/components/AppHeader';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const WelcomePage = () => {
  const navigate = useNavigate();
  const { lists } = useShoppingList();
  
  const totalItems = lists.reduce((total, list) => total + list.items.length, 0);
  const totalLists = lists.length;
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/80">
      <AppHeader 
        title="Shopping Assistant" 
        showSearchButton={false}
      />
      
      <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
        {/* Welcome Header */}
        <section className="mb-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-500 mb-2">
              Welcome to Shopping Assistant
            </h1>
            <p className="text-shoppingapp-muted max-w-md mx-auto">
              Keep track of your shopping lists, stay within budget, and never forget an item again.
            </p>
          </div>
          
          {lists.length === 0 ? (
            <EmptyState
              title="Get started with your first list"
              description="Create a shopping list to begin tracking your items and expenses"
              actionLabel="Create List"
              onAction={() => navigate('/lists')}
              icon={<ShoppingBag className="h-12 w-12" />}
              className="mt-8"
            />
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <MotionCard 
                  className="text-center p-6 glass-card"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <CardContent className="pt-6">
                    <ShoppingBag className="w-10 h-10 mx-auto mb-2 text-blue-500" />
                    <h3 className="text-3xl font-bold text-shoppingapp-text">{totalLists}</h3>
                    <p className="text-shoppingapp-muted">Active Lists</p>
                  </CardContent>
                </MotionCard>
                
                <MotionCard 
                  className="text-center p-6 glass-card"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <CardContent className="pt-6">
                    <Tag className="w-10 h-10 mx-auto mb-2 text-violet-500" />
                    <h3 className="text-3xl font-bold text-shoppingapp-text">{totalItems}</h3>
                    <p className="text-shoppingapp-muted">Total Items</p>
                  </CardContent>
                </MotionCard>
              </div>
            </>
          )}
        </section>
        
        {/* Quick Access Cards */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
          <div className="grid gap-4">
            <MotionCard 
              className="glass-card overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
              onClick={() => navigate('/lists')}
            >
              <CardContent className="p-6 flex items-center justify-between cursor-pointer">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4">
                    <ShoppingBag className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">My Shopping Lists</h3>
                    <p className="text-sm text-shoppingapp-muted">View and manage your shopping lists</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-shoppingapp-muted" />
              </CardContent>
            </MotionCard>
            
            <MotionCard 
              className="glass-card overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
              onClick={() => navigate('/stats')}
            >
              <CardContent className="p-6 flex items-center justify-between cursor-pointer">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mr-4">
                    <BarChart2 className="h-6 w-6 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Shopping Statistics</h3>
                    <p className="text-sm text-shoppingapp-muted">View insights and spending trends</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-shoppingapp-muted" />
              </CardContent>
            </MotionCard>
            
            <MotionCard 
              className="glass-card overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
              onClick={() => navigate('/categories')}
            >
              <CardContent className="p-6 flex items-center justify-between cursor-pointer">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mr-4">
                    <Tag className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Categories</h3>
                    <p className="text-sm text-shoppingapp-muted">Manage your shopping categories</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-shoppingapp-muted" />
              </CardContent>
            </MotionCard>
          </div>
        </section>
      </main>
    </div>
  );
};

export default WelcomePage;
