/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import AppContext from "../context/AppContext";
import { jwtDecode } from "jwt-decode";
import { Menu, X } from "lucide-react";
import DeliveryCard from "../Components/DeliveryDashCard";
import toast from "react-hot-toast";
import DeliveryDashSidebar from "../Components/DeliveryDashSidebar";

const DeliveryDashboard = () => {
	const [deliveries, setDeliveries] = useState([]);
	const [personnelDetails, setPersonnelDetails] = useState(null);
	const [mobileOpen, setMobileOpen] = useState(false);
	const { token, api } = useContext(AppContext);
	const deliveryPersonId = jwtDecode(token).id;

	const loadDeliveries = async () => {
		try {
			const data = await api.getAssignedDeliveries(deliveryPersonId);
			setPersonnelDetails(data);
			setDeliveries(
				data.activeDeliveries.filter(
					(delivery) => delivery.meal.status === "DELIVERING"
				)
			);
		} catch (error) {
			console.log(error);
			toast.error("Failed to load deliveries");
		}
	};

	useEffect(() => {
		loadDeliveries();
		const intervalId = setInterval(() => {
			loadDeliveries();
			toast.success("Data Updated successfully");
		}, 300000);

		return () => clearInterval(intervalId);
	}, []);

	const handleStatusUpdate = async (deliveryId, status, mealId) => {
		try {
			await api.updateDeliveryStatus(deliveryId, status, mealId);
			await loadDeliveries();
			toast.success("Status update successful");
		} catch (err) {
			console.log(err);
			toast.error("Failed to update status");
		}
	};

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	return (
		<div className="min-h-screen bg-[#f0f4f8]">
			{/* Mobile App Bar */}
			<div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 md:hidden z-20">
				<div className="flex items-center px-4 h-16">
					<button
						onClick={handleDrawerToggle}
						className="p-2 rounded-lg hover:bg-gray-100 mr-2"
					>
						{mobileOpen ? (
							<X className="h-6 w-6 text-gray-600" />
						) : (
							<Menu className="h-6 w-6 text-gray-600" />
						)}
					</button>
					<h1 className="text-lg font-semibold text-gray-800">
						Delivery Dashboard
					</h1>
				</div>
			</div>

			{/* Sidebar */}
			{personnelDetails && (
				<>
					{/* Desktop Sidebar */}
					<div className="hidden md:block fixed w-[280px] h-screen bg-white border-r border-gray-200 shadow-sm">
						<DeliveryDashSidebar
							personnelDetails={personnelDetails}
							onLogout={() => api.logout()}
						/>
					</div>

					{/* Mobile Sidebar */}
					<div
						className={`fixed md:hidden w-[280px] h-screen bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-30 ${
							mobileOpen ? "translate-x-0" : "-translate-x-full"
						}`}
					>
						<DeliveryDashSidebar
							personnelDetails={personnelDetails}
							onLogout={() => api.logout()}
						/>
					</div>
				</>
			)}

			{/* Backdrop for mobile */}
			{mobileOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
					onClick={handleDrawerToggle}
				/>
			)}

			{/* Main Content */}
			<main className="md:ml-[280px] pt-20 md:pt-6 px-4 md:px-6">
				<div className="max-w-7xl mx-auto">
					<div className="mb-6">
						<h1 className="text-2xl font-semibold text-gray-800">
							Active Deliveries
						</h1>
						<p className="text-sm text-gray-500">
							{deliveries.length} deliveries assigned to you
						</p>
					</div>

					<div className="grid gap-4">
						{deliveries.length === 0 ? (
							<div className="bg-white rounded-lg shadow-sm p-6 text-center">
								<p className="text-gray-500">
									No active deliveries at the moment
								</p>
							</div>
						) : (
							deliveries.map((delivery, index) => (
								<DeliveryCard
									key={index}
									delivery={delivery}
									onStatusChange={() =>
										handleStatusUpdate(
											delivery.id,
											delivery.status,
											delivery.meal.id
										)
									}
								/>
							))
						)}
					</div>
				</div>
			</main>
		</div>
	);
};

export default DeliveryDashboard;
