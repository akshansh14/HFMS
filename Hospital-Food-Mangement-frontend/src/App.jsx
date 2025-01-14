import React from 'react';
import {  Route, Routes } from 'react-router-dom';
import Login from './Pages/Login';
import DeliveryDashboard from './Pages/DeliveryDashBoard';
import InfantryDashboard from './Pages/InfantryDashboard';
import ManagerDashboard from './Pages/ManagerDashboard';


function App() {
  return (

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/DD" element={<DeliveryDashboard />} />
        <Route path="/ID" element={<InfantryDashboard />} />
        <Route path="/md" element={<ManagerDashboard />} />
      </Routes>
 
  );
}

export default App;
