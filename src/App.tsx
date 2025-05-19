
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ShoppingListProvider } from "@/context/ShoppingListContext";
import WelcomePage from "./pages/WelcomePage";
import ListsPage from "./pages/ListsPage";
import ListDetailPage from "./pages/ListDetailPage";
import StatisticsPage from "./pages/StatisticsPage";
import CategoriesPage from "./pages/CategoriesPage";
import Navigation from "./components/Navigation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ShoppingListProvider>
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80 pb-20">
          <Toaster />
          <Sonner position="top-center" />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/lists" element={<ListsPage />} />
              <Route path="/list/:listId" element={<ListDetailPage />} />
              <Route path="/stats" element={<StatisticsPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Navigation />
          </BrowserRouter>
        </div>
      </ShoppingListProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
