import React, { useState } from 'react';
import Patients from '../Components/Patients';
import InfantryTasks from '../Components/Infantary';
import DeliveryAssignment from '../Components/Delivery';

const ManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('patients');

  return (
    <div className="manager-dashboard">
      <aside>
        <button onClick={() => setActiveTab('patients')}>Patients</button>
        <button onClick={() => setActiveTab('infantry')}>Infantry Tasks</button>
        <button onClick={() => setActiveTab('delivery')}>Delivery Assignments</button>
      </aside>
      <main>
        {activeTab === 'patients' && <Patients />}
        {activeTab === 'infantry' && <InfantryTasks />}
        {activeTab === 'delivery' && <DeliveryAssignment />}
      </main>
    </div>
  );
};

export default ManagerDashboard;
