import { useState, useEffect, useContext } from "react";
import { Menu, X } from 'lucide-react';
import AppContext from "../context/AppContext";
import { jwtDecode } from "jwt-decode";
import InfantryDashSidebar from "../Components/InfantryDashSidebar";
import DeliveryTaskCard from "../Components/DeliveryTaskCard";
import DeliveryAssignmentCard from "../Components/DeliveryAssignmentCard";

const InfantryDashboard = () => {
  const [activeTab, setActiveTab] = useState("tasks");
  const [mealTasks, setMealTasks] = useState([]);
  const [deliveryStaff, setDeliveryStaff] = useState([]);
  const [staffDetails, setStaffDetails] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { token, api } = useContext(AppContext);
  const staffId = jwtDecode(token).id;

  const loadData = async () => {
    try {
      const pantryData = await api.getPantryStaff(staffId);
      const deliveryData = await api.getDeliveryPerson();
      console.log(pantryData);
      setStaffDetails(pantryData);
      setMealTasks(pantryData.tasks);
      setDeliveryStaff(deliveryData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusUpdate = async (taskId, mealId, status) => {
    const data = {
      mealId,
      status,
      updatedAt: Date.now(),
    };
    await api.updateTasks(taskId, data);
    loadData();
  };

  const handleAssignDelivery = async (deliveryStaffId, mealId, taskId) => {
    const noteTask = mealTasks.filter((task) => task.id === taskId);
    await api.assignDelivery(deliveryStaffId, mealId, noteTask.notes);
    console.log(`Assigning task ${taskId} to staff ${deliveryStaffId}`);
    loadData();
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-30 px-4 flex items-center">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen bg-white border-r border-gray-200 shadow-sm z-40
          transition-transform duration-300 ease-in-out
          w-[280px]
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {staffDetails && <InfantryDashSidebar staffDetails={staffDetails} handleLogout={()=>{api.logout()}} />}
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main
        className={`
          transition-all duration-300 ease-in-out
          pt-20 lg:pt-8 px-4 pb-4
          lg:ml-[280px]
        `}
      >
        {/* Tabs */}
        <div className="mb-6 border-b overflow-x-auto">
          <nav className="flex space-x-4 min-w-max">
            <button
              className={`px-4 py-2 font-medium whitespace-nowrap ${
                activeTab === "tasks"
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("tasks")}
            >
              Meal Tasks
            </button>
            <button
              className={`px-4 py-2 font-medium whitespace-nowrap ${
                activeTab === "assign"
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("assign")}
            >
              Assign Deliveries
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="grid gap-4 sm:gap-6">
          {activeTab === "tasks" ? (
            <>
              {mealTasks
                .filter((task) => task.status === "IN_PROGRESS")
                .map((task) => (
                  <DeliveryTaskCard
                    key={task.id}
                    task={task}
                    handleStatusUpdate={handleStatusUpdate}
                  />
                ))}
            </>
          ) : (
            <>
			{console.log(mealTasks.tasks)}
              {mealTasks
                .filter((task) => task.meal.status === "READY")
                .map((task) => (
                  <DeliveryAssignmentCard
                    key={task.id}
                    task={task}
                    deliveryStaff={deliveryStaff}
                    handleAssignDelivery={handleAssignDelivery}
                  />
                ))}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default InfantryDashboard;