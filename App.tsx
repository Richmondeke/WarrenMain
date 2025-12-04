import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dealflow } from './pages/investor/Dealflow';
import { Tracker } from './pages/investor/Tracker';
import { Directory } from './pages/investor/Directory';
import { Portfolio } from './pages/investor/Portfolio';
import { FindInvestors } from './pages/founder/FindInvestors';
import { DealRoom } from './pages/founder/DealRoom';
import { Messages } from './pages/Messages';
import { useUser } from './context/UserContext';
import { Role } from './types';

const App: React.FC = () => {
  const { role } = useUser();

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Redirect root based on role */}
          <Route index element={<Navigate to={role === Role.INVESTOR ? "/investor/dealflow" : "/founder/investors"} replace />} />
          
          {/* Investor Routes */}
          <Route path="investor/dealflow" element={<Dealflow />} />
          <Route path="investor/tracker" element={<Tracker />} />
          <Route path="investor/directory" element={<Directory />} />
          <Route path="investor/portfolio" element={<Portfolio />} />

          {/* Founder Routes */}
          <Route path="founder/investors" element={<FindInvestors />} />
          <Route path="founder/dealroom" element={<DealRoom />} />

          {/* Shared Routes */}
          <Route path="messages" element={<Messages />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;