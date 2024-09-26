// App.tsx or main routing component
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserDashboard from '@/app/dashboard/userDashboard/page';
import UnitDashboard from '@/app/dashboard/unitDashboard/page'; // Import the UnitDashboard component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserDashboard />} />
        <Route path="/unit-dashboard/:unitCode" element={<UnitDashboard />} /> {/* Dynamic route for unit dashboard */}
      </Routes>
    </Router>
  );
};

export default App;
