
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

type SearchBarProps = {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  autofocus?: boolean;
};

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = 'Search items...', 
  className,
  autofocus = false
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autofocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autofocus]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch(newQuery);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={cn('relative', className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <Input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="pl-10 pr-8 py-2 w-full focus-visible:ring-shoppingapp-primary"
      />
      {query && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute inset-y-0 right-0 pr-2 flex items-center h-full"
          onClick={handleClear}
        >
          <X className="h-4 w-4 text-gray-400" />
        </Button>
      )}
    </div>
  );
};

export default SearchBar;
