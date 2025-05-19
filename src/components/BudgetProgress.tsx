
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { useShoppingList } from '@/context/ShoppingListContext';
import { cn } from '@/lib/utils';

type BudgetProgressProps = {
  listId: string;
};

const BudgetProgress: React.FC<BudgetProgressProps> = ({ listId }) => {
  const { lists, getListTotal } = useShoppingList();
  const list = lists.find(l => l.id === listId);
  
  if (!list || !list.budget) return null;
  
  const total = getListTotal(listId);
  const percentage = Math.min((total / list.budget) * 100, 100);
  const isOverBudget = total > (list.budget || 0);
  
  return (
    <div className="px-6 py-4 bg-white/50 backdrop-blur-sm shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-shoppingapp-muted">Budget</span>
          <span className="text-xl font-semibold">
            ${list.budget.toFixed(2)}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-sm font-medium text-shoppingapp-muted">Spent</span>
          <span className={`text-xl font-semibold ${isOverBudget ? 'text-shoppingapp-danger' : 'text-shoppingapp-primary'}`}>
            ${total.toFixed(2)}
          </span>
        </div>
      </div>
      
      <Progress 
        value={percentage} 
        className={cn(
          'h-2.5 rounded-full bg-blue-100',
          isOverBudget ? 'bg-red-100' : 'bg-blue-100'
        )}
      />
      
      <div className="flex justify-between mt-2 text-xs text-shoppingapp-muted">
        <span>0%</span>
        <span>{isOverBudget ? 'Exceeded budget!' : `${Math.round(percentage)}% spent`}</span>
        <span>100%</span>
      </div>
    </div>
  );
};

export default BudgetProgress;
