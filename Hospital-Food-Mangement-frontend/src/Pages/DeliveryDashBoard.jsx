import React, { useState, useEffect } from 'react';
import { User, LogOut, Package, Clock } from 'lucide-react';


// Mock API functions for deliveries (unchanged)
const fetchDeliveriesWithPerson = async (deliveryPersonId) => {
  try {
    const response = await fetch(`http://localhost:7000/api/deliveryperson/${deliveryPersonId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch deliveries: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    return [];
  }
};

const fetchDeliveriesWithPatients = async (mealId) => {
  try {
    const response = await fetch(`http://localhost:7000/api/deliveryperson/patients/${mealId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch deliveries: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    return [];
  }
};


const updateDeliveryStatus = async (deliveryId, newStatus) => {
  console.log(`Updating delivery ${deliveryId} to status: ${newStatus}`);
  return { success: true };
};




const Navbar = ({ onLogout }) => (
  <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-10">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex justify-between h-16">
        <div className="flex items-center">
          <Package className="h-6 w-6 text-blue-600" />
          <span className="ml-2 text-lg font-semibold">Delivery Dashboard</span>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </button>
      </div>
    </div>
  </nav>
);

const Aside = ({ personnelDetails }) => (
  <aside className="fixed left-0 top-16 h-full w-64 bg-white border-r border-gray-200 p-4">
    <div className="flex flex-col items-center mb-6">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-3">
        <User className="h-10 w-10 text-blue-600" />
      </div>
      <h2 className="text-xl font-semibold">{personnelDetails.name}</h2>
      <p className="text-gray-600 text-sm">ID: {personnelDetails.id}</p>
    </div>

    <div className="space-y-4">
      <div className="border-b pb-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Contact Info</h3>
        <p className="text-sm">{personnelDetails.email}</p>
        <p className="text-sm">{personnelDetails.contactInfo}</p>
      </div>

      <div className="border-b pb-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Statistics</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-blue-50 p-2 rounded">
            <p className="text-xs text-gray-500">Completed</p>
            {/* add deliveries completed  */}
            <p className="text-lg font-semibold">{personnelDetails.deliveriesToday}</p>   
          </div>
          <div className="bg-green-50 p-2 rounded">
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-lg font-semibold">{personnelDetails.activeDeliveries.length}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Rating</h3>
        <div className="flex items-center">
          <span className="text-lg font-semibold">4.8</span>
          <span className="text-yellow-400 ml-1">★</span>
        </div>
      </div>
    </div>
  </aside>
);

const DeliveryDashboard = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [personnelDetails, setPersonnelDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const deliveryPersonId= "67856f9592fe3a8044d8116f"
 
    const loadDeliveries = async () => {
      const data = await fetchDeliveriesWithPerson(deliveryPersonId);
      setPersonnelDetails(data);
      setDeliveries(data.activeDeliveries);
      setLoading(false);
    };

    useEffect(() => {
      // Fetch deliveries immediately
      loadDeliveries();
  
      // Set up interval to fetch deliveries every 5 seconds
      const intervalId = setInterval(loadDeliveries, 5000);
  
      // Clean up interval on component unmount
      return () => clearInterval(intervalId);
    }, [deliveryPersonId]);

  const getpatients=()=>{
    deliveries.forEach((delivery)=>{
       const data =fetchDeliveriesWithPatients(delivery.mealId)
       delivery.patient= data;
       console.log(delivery)
    })
  }

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logging out...');
  };

  const handleStatusUpdate = async (deliveryId, newStatus) => {
    try {
      await updateDeliveryStatus(deliveryId, newStatus);
      loadData();
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-100 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={handleLogout} />
      {personnelDetails && <Aside personnelDetails={personnelDetails} />}
      
      <main className="ml-64 pt-16 p-4">
        <div className="grid gap-4">
          {getpatients()}
          {
          console.log(deliveries)
          }
          {deliveries.map((delivery) => (
                 
            <div 
              key={delivery.id}
              className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{delivery.patient.name}</h2>
                  <p className="text-gray-600 mt-1">
                    <span className="font-medium">Location:</span> {delivery.patient.location}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Meal ID:</span> {delivery.mealId}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Time Assigned:</span>{' '}
                    {new Date(delivery.timeAssigned).toLocaleTimeString()}
                  </p>
                </div>
                
                <div className="flex flex-col items-end">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(delivery.status)}`}>
                    {delivery.status}
                  </span>
                  
                  <select
                    className="mt-2 p-2 border rounded-md text-sm"
                    value={delivery.status}
                    onChange={(e) => handleStatusUpdate(delivery.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DeliveryDashboard;