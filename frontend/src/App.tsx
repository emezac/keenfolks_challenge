import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CampaignCreator from './components/CampaignCreator';

const queryClient = new QueryClient();

export default function App() {
  const isCorrectPath = window.location.pathname === '/campaigns/new' || window.location.pathname === '/';

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-zinc-50 py-12">
        {isCorrectPath ? (
          <CampaignCreator />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <h1 className="text-4xl font-bold text-zinc-900 mb-4">404 - Not Found</h1>
            <a href="/campaigns/new" className="text-indigo-600 hover:text-indigo-500 font-medium">Go to Campaign Creator</a>
          </div>
        )}
      </div>
    </QueryClientProvider>
  );
}
