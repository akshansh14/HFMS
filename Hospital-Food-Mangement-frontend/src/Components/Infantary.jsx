import React, { useContext, useState } from "react";
import { Button, Select, MenuItem } from "@mui/material";
import { AppContext } from "../context/AppContext";

const InfantryTasks = () => {
  const [pendingMeals, setPendingMeals] = useState([
    { id: 1, description: "Meal 1: Chicken and Rice" },
    { id: 2, description: "Meal 2: Beef Stew" },
    { id: 3, description: "Meal 3: Vegetarian Pasta" },
  ]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const { api } = useContext(AppContext);

  const fetchPendingMeals = async () => {
    const { data } = await api.getPendingMeals();
    setPendingMeals(data);
  };

  const handleAssignTask = async () => {
    await api.assignTask({
      staffId: selectedStaff,
      meals: pendingMeals.map((meal) => meal.id),
    });
    setPendingMeals([]); // Clear the list after assignment
  };

  return (
    <div className="flex flex-col gap-4 p-6 bg-gray-100 rounded-lg shadow-md max-w-xl mx-auto">
      <button
        onClick={fetchPendingMeals}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Load Pending Meals
      </button>
      <Select
        value={selectedStaff}
        onChange={(e) => setSelectedStaff(e.target.value)}
        className="border border-gray-300 rounded py-2 px-3 text-gray-700"
      >
        <MenuItem value="staff1">Staff 1</MenuItem>
        <MenuItem value="staff2">Staff 2</MenuItem>
      </Select>
      <button
        onClick={handleAssignTask}
        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
      >
        Assign Tasks
      </button>
      <ul className="list-disc list-inside">
        {pendingMeals.map((meal) => (
          <li key={meal.id} className="text-gray-800">
            {meal.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InfantryTasks;
