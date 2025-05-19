
import React from 'react';
import { Link } from 'react-router-dom';
import { useShoppingList } from '@/context/ShoppingListContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Search, List } from 'lucide-react';

type AppHeaderProps = {
  title: string;
  showBackButton?: boolean;
  showSearchButton?: boolean;
  onSearchClick?: () => void;
  showListsButton?: boolean;
};

const AppHeader: React.FC<AppHeaderProps> = ({ 
  title, 
  showBackButton = false,
  showSearchButton = false,
  onSearchClick,
  showListsButton = false
}) => {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        {showBackButton && (
          <Link to="/" className="mr-3">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
        )}
        <h1 className="text-xl font-semibold text-shoppingapp-text truncate">
          {title}
        </h1>
      </div>
      <div className="flex items-center space-x-2">
        {showSearchButton && (
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onSearchClick}>
            <Search className="h-5 w-5" />
          </Button>
        )}
        {showListsButton && (
          <Link to="/lists">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <List className="h-5 w-5" />
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
