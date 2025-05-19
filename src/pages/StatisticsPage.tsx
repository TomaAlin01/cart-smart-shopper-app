
import React from 'react';
import { useShoppingList } from '@/context/ShoppingListContext';
import AppHeader from '@/components/AppHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/EmptyState';
import { BarChart2, PieChart as PieChartIcon, DollarSign } from 'lucide-react';

const StatisticsPage = () => {
  const { lists, categories, getListTotal } = useShoppingList();
  
  // Skip rendering charts if no data
  if (!lists.length) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/80">
        <AppHeader 
          title="Shopping Statistics" 
          showBackButton={true}
          showListsButton={true}
        />
        <main className="flex-1 p-6">
          <EmptyState
            title="No statistics available"
            description="Start by creating shopping lists to see your statistics"
            actionLabel="Go to Lists"
            onAction={() => window.location.href = '/lists'}
            icon={<BarChart2 className="h-12 w-12" />}
          />
        </main>
      </div>
    );
  }
  
  // Prepare data for spending by list chart
  const listSpendingData = lists.map(list => ({
    name: list.name.length > 15 ? list.name.substring(0, 15) + '...' : list.name,
    total: getListTotal(list.id),
  })).sort((a, b) => b.total - a.total);
  
  // Prepare data for items by category chart
  const categoryCounts: Record<string, number> = {};
  lists.forEach(list => {
    list.items.forEach(item => {
      if (!categoryCounts[item.categoryId]) {
        categoryCounts[item.categoryId] = 0;
      }
      categoryCounts[item.categoryId]++;
    });
  });
  
  const categoryData = Object.entries(categoryCounts).map(([categoryId, count]) => {
    const category = categories.find(c => c.id === categoryId);
    return {
      name: category?.name || 'Unknown',
      value: count,
    };
  }).sort((a, b) => b.value - a.value);
  
  // Custom colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Calculate total spending
  const totalSpending = lists.reduce((total, list) => total + getListTotal(list.id), 0);
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/80">
      <AppHeader 
        title="Shopping Statistics" 
        showBackButton={true}
        showListsButton={true}
      />
      
      <main className="flex-1 p-6 max-w-4xl mx-auto w-full space-y-8">
        {/* Total Spending Card */}
        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <DollarSign className="w-10 h-10 mx-auto mb-2 text-green-500" />
            <h3 className="text-3xl font-bold text-shoppingapp-text">${totalSpending.toFixed(2)}</h3>
            <p className="text-shoppingapp-muted">Total Spending</p>
          </CardContent>
        </Card>
        
        {/* Spending by List Chart */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart2 className="mr-2 h-5 w-5" />
              Spending by List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={listSpendingData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={60} 
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Total']}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
                    }}
                  />
                  <Bar 
                    dataKey="total" 
                    fill="#3B82F6" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Items by Category Chart */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChartIcon className="mr-2 h-5 w-5" />
              Items by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} items`, 'Count']}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StatisticsPage;
