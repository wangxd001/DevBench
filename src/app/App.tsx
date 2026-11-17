import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './router';
import { GlobalProviders } from './providers';

export default function App() {
  return (
    <BrowserRouter>
      <GlobalProviders>
        <AppRoutes />
      </GlobalProviders>
    </BrowserRouter>
  );
}
