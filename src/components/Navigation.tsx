
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, BarChart2, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/lists', label: 'Lists', icon: ShoppingBag },
    { path: '/stats', label: 'Stats', icon: BarChart2 },
    { path: '/categories', label: 'Categories', icon: Tag },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 pb-safe">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = 
            (item.path === '/' && location.pathname === '/') || 
            (item.path !== '/' && location.pathname.startsWith(item.path));
            
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center py-3 px-5 relative",
                isActive ? "text-shoppingapp-primary" : "text-shoppingapp-muted"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-0.5 w-8 h-1 bg-shoppingapp-primary rounded-b-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
