
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
};

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  actionLabel, 
  onAction,
  icon,
  className
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center h-[60vh] fadeIn", className)}>
      {icon && (
        <div className="mb-6 text-shoppingapp-muted p-6 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          {React.cloneElement(icon as React.ReactElement, { 
            className: "h-10 w-10 text-shoppingapp-primary animate-pulse" 
          })}
        </div>
      )}
      <h2 className="text-2xl font-semibold text-shoppingapp-text mb-3">{title}</h2>
      <p className="text-shoppingapp-muted mb-8 max-w-xs">{description}</p>
      {actionLabel && onAction && (
        <Button 
          onClick={onAction} 
          className="bg-shoppingapp-primary hover:bg-blue-600 rounded-full px-6 shadow-md hover:shadow-lg transition-all"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
