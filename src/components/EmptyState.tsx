
import React from 'react';
import { Button } from '@/components/ui/button';

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
};

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  actionLabel, 
  onAction,
  icon
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center h-[60vh]">
      {icon && <div className="mb-4 text-shoppingapp-muted">{icon}</div>}
      <h2 className="text-xl font-semibold text-shoppingapp-text mb-2">{title}</h2>
      <p className="text-shoppingapp-muted mb-6 max-w-xs">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="bg-shoppingapp-primary hover:bg-blue-600">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
