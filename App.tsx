import React from 'react';
import { FilterProvider } from './context/FilterContext';
import RootLayout from './app/layout';
import DashboardPage from './app/page';

// This file acts as the "Server" entry point in our simulated Next.js environment.
// It sets up the Context (which would handle Client State) and renders the Layout and Page.

const App: React.FC = () => {
  return (
    <FilterProvider>
      <RootLayout>
        <DashboardPage />
      </RootLayout>
    </FilterProvider>
  );
};

export default App;
