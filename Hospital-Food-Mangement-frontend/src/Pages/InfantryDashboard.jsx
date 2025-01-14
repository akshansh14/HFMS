import React, { useState, useEffect } from "react";
import { User, LogOut, ChefHat, Package, Users } from "lucide-react";

// Mock API functions
const fetchStaffDetails = async () => {
	return {
		id: "INF456",
		name: "Chris Miller",
		role: "Senior Chef",
		email: "chris.m@kitchen.com",
		phone: "(555) 987-6543",
		shift: "Morning (6 AM - 2 PM)",
		mealsPrepped: 45,
		totalMealsToday: 75,
	};
};

const fetchMealTasks = async () => {
	return [
		{
			id: 1,
			mealId: "MEAL001",
			patientName: "John Doe",
			dietaryRequirements: "Low Sodium",
			mealType: "Lunch",
			prepTime: "11:30 AM",
			status: "pending",
			allergies: ["nuts", "shellfish"],
		},
		{
			id: 2,
			mealId: "MEAL002",
			patientName: "Jane Smith",
			dietaryRequirements: "Diabetic",
			mealType: "Lunch",
			prepTime: "11:45 AM",
			status: "in-progress",
			allergies: ["dairy"],
		},
	];
};

const fetchDeliveryStaff = async () => {
	return [
		{ id: "D1", name: "Alex Johnson", activeDeliveries: 2 },
		{ id: "D2", name: "Sarah Wilson", activeDeliveries: 1 },
		{ id: "D3", name: "Mike Brown", activeDeliveries: 0 },
	];
};

const Navbar = ({ onLogout }) => (
	<nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-10">
		<div className="max-w-7xl mx-auto px-4">
			<div className="flex justify-between h-16">
				<div className="flex items-center">
					<ChefHat className="h-6 w-6 text-orange-600" />
					<span className="ml-2 text-lg font-semibold">
						Infantry Dashboard
					</span>
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

const Aside = ({ staffDetails }) => (
	<aside className="fixed left-0 top-16 h-full w-64 bg-white border-r border-gray-200 p-6">
		<div className="flex flex-col items-center mb-6">
			<div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-3">
				<User className="h-10 w-10 text-orange-600" />
			</div>
			<h2 className="text-xl font-semibold">{staffDetails.name}</h2>
			<p className="text-gray-600 text-sm">{staffDetails.role}</p>
		</div>

		<div className="space-y-4">
			<div className="border-b pb-4">
				<h3 className="text-sm font-medium text-gray-500 mb-2">
					Contact Info
				</h3>
				<p className="text-sm">{staffDetails.email}</p>
				<p className="text-sm">{staffDetails.phone}</p>
			</div>

			<div className="border-b pb-4">
				<h3 className="text-sm font-medium text-gray-500 mb-2">
					Shift Info
				</h3>
				<p className="text-sm">{staffDetails.shift}</p>
			</div>

			<div>
				<h3 className="text-sm font-medium text-gray-500 mb-2">
					Today's Progress
				</h3>
				<div className="bg-orange-50 p-3 rounded">
					<div className="flex justify-between items-center mb-2">
						<span className="text-sm">Meals Prepared:</span>
						<span className="font-semibold">
							{staffDetails.mealsPrepped}
						</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2.5">
						<div
							className="bg-orange-600 h-2.5 rounded-full"
							style={{
								width: `${
									(staffDetails.mealsPrepped /
										staffDetails.totalMealsToday) *
									100
								}%`,
							}}
						></div>
					</div>
					<p className="text-xs text-gray-500 mt-1">
						{staffDetails.mealsPrepped} of{" "}
						{staffDetails.totalMealsToday} meals
					</p>
				</div>
			</div>
		</div>
	</aside>
);

const InfantryDashboard = () => {
	const [activeTab, setActiveTab] = useState("tasks");
	const [mealTasks, setMealTasks] = useState([]);
	const [deliveryStaff, setDeliveryStaff] = useState([]);
	const [staffDetails, setStaffDetails] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const loadData = async () => {
		try {
			const [tasksData, staffData, deliveryData] = await Promise.all([
				fetchMealTasks(),
				fetchStaffDetails(),
				fetchDeliveryStaff(),
			]);
			setMealTasks(tasksData);
			setStaffDetails(staffData);
			setDeliveryStaff(deliveryData);
			setLoading(false);
		} catch (err) {
			setError("Failed to fetch data");
			setLoading(false);
		}
	};

	useEffect(() => {
		loadData();
		const interval = setInterval(loadData, 5000); // Refresh data every 5 seconds
		return () => clearInterval(interval);
	}, []);

	const handleStatusUpdate = async (taskId, newStatus) => {
		// Handle status update logic here
		console.log(`Updating task ${taskId} to ${newStatus}`);
		loadData();
	};

	const handleAssignDelivery = async (taskId, deliveryStaffId) => {
		// Handle delivery assignment logic here
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

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
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
			<Navbar onLogout={() => console.log("Logging out...")} />
			{staffDetails && <Aside staffDetails={staffDetails} />}

			<main className="ml-64 pt-16 p-4">
				<div className="mb-6 border-b">
					<nav className="flex space-x-4">
						<button
							className={`px-4 py-2 font-medium ${
								activeTab === "tasks"
									? "text-orange-600 border-b-2 border-orange-600"
									: "text-gray-500 hover:text-gray-700"
							}`}
							onClick={() => setActiveTab("tasks")}
						>
							Meal Tasks
						</button>
						<button
							className={`px-4 py-2 font-medium ${
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

				{activeTab === "tasks" ? (
					<div className="grid gap-4">
						{mealTasks.map((task) => (
							<div
								key={task.id}
								className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
							>
								<div className="flex justify-between items-start">
									<div>
										<div className="flex items-center mb-2">
											<h2 className="text-lg font-semibold">
												{task.patientName}
											</h2>
											<span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
												{task.mealType}
											</span>
										</div>
										<p className="text-gray-600">
											<span className="font-medium">
												Meal ID:
											</span>{" "}
											{task.mealId}
										</p>
										<p className="text-gray-600">
											<span className="font-medium">
												Dietary Requirements:
											</span>{" "}
											{task.dietaryRequirements}
										</p>
										<p className="text-gray-600">
											<span className="font-medium">
												Allergies:
											</span>{" "}
											{task.allergies.join(", ")}
										</p>
										<p className="text-gray-600">
											<span className="font-medium">
												Prep Time:
											</span>{" "}
											{task.prepTime}
										</p>
									</div>
									<div className="flex flex-col items-end">
										<span
											className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
												task.status
											)}`}
										>
											{task.status}
										</span>
										<select
											className="mt-2 p-2 border rounded-md text-sm"
											value={task.status}
											onChange={(e) =>
												handleStatusUpdate(
													task.id,
													e.target.value
												)
											}
										>
											<option value="pending">
												Pending
											</option>
											<option value="in-progress">
												In Progress
											</option>
											<option value="completed">
												Completed
											</option>
										</select>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="grid gap-4">
						{mealTasks
							.filter((task) => task.status === "completed")
							.map((task) => (
								<div
									key={task.id}
									className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
								>
									<div className="flex justify-between items-start">
										<div>
											<h2 className="text-lg font-semibold">
												{task.patientName}
											</h2>
											<p className="text-gray-600">
												<span className="font-medium">
													Meal ID:
												</span>{" "}
												{task.mealId}
											</p>
											<p className="text-gray-600">
												<span className="font-medium">
													Prep Time:
												</span>{" "}
												{task.prepTime}
											</p>
										</div>
										<div className="flex flex-col items-end">
											<select
												className="p-2 border rounded-md text-sm w-48"
												onChange={(e) =>
													handleAssignDelivery(
														task.id,
														e.target.value
													)
												}
											>
												<option value="">
													Assign Delivery Staff
												</option>
												{deliveryStaff.map((staff) => (
													<option
														key={staff.id}
														value={staff.id}
													>
														{staff.name} (Active:{" "}
														{staff.activeDeliveries}
														)
													</option>
												))}
											</select>
										</div>
									</div>
								</div>
							))}
					</div>
				)}
			</main>
		</div>
	);
};

export default InfantryDashboard;
