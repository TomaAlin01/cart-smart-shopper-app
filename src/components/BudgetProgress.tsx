
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { useShoppingList } from '@/context/ShoppingListContext';

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
    <div className="px-4 py-3">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-shoppingapp-text">Budget</span>
        <span className={`text-sm font-medium ${isOverBudget ? 'text-shoppingapp-danger' : 'text-shoppingapp-text'}`}>
          ${total.toFixed(2)} / ${list.budget.toFixed(2)}
        </span>
      </div>
      <Progress 
        value={percentage} 
        className={`h-2 ${isOverBudget ? 'bg-red-200' : 'bg-blue-100'}`} 
        indicatorClassName={isOverBudget ? 'bg-shoppingapp-danger' : 'bg-shoppingapp-primary'}
      />
    </div>
  );
};

export default BudgetProgress;
