
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { newTracker, enableActivityTracking } from '@snowplow/browser-tracker';
import { enableButtonClickTracking, ButtonClickTrackingPlugin } from '@snowplow/browser-plugin-button-click-tracking';

const queryClient = new QueryClient();
// https://com-snplow-sales-aws-prod1.mini.snplow.net
// https://collector-sales-aws.snowplow.io
function initializeSnowplow() {
  newTracker('sp', 'https://collector-sales-aws.snowplow.io', {
    plugins: [ ButtonClickTrackingPlugin() ],
    appId: 'hd-demo-gaming',
    platform: 'web',
    cookieDomain: null,
  });

  enableButtonClickTracking();
  
  enableActivityTracking({
    minimumVisitLength: 5, 
    heartbeatDelay: 30
  });
}



initializeSnowplow();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
