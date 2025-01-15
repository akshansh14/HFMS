import { useContext, useState, useEffect } from "react";
import AppContext from "../context/AppContext";
import { LocateFixedIcon, Mail, Phone, MapPin, Clock } from "lucide-react";
import toast from "react-hot-toast";

const DeliveryAssignment = () => {
	const [deliveries, setDeliveries] = useState([]);
	const [deliveryPersons, setDeliveryPersons] = useState([]);
	const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState({});
	const [selectedPersonDetails, setSelectedPersonDetails] = useState(null);

	const { api } = useContext(AppContext);

	const fetchDeliveryData = async () => {
		try {
			const deliveryData = await api.getDeliveryDetails();
			setDeliveries(deliveryData || []);

			const deliveryPersonData = await api.getDeliveryPerson();
			setDeliveryPersons(deliveryPersonData);
		} catch (error) {
			console.error("Error fetching delivery data:", error);
		}
	};
	useEffect(() => {
		fetchDeliveryData();

		const intervalId = setInterval(() => {
			fetchDeliveryData();
			toast.success("Data Updated successfully");
		}, 300000);

		return () => clearInterval(intervalId);
	}, []);

	const handleDeliveryPersonSelect = (deliveryId, personId) => {
		setSelectedDeliveryPerson({
			...selectedDeliveryPerson,
			[deliveryId]: personId,
		});
		const person = deliveryPersons.find((p) => p.id === personId);
		setSelectedPersonDetails(person);
	};

	const handleAssignDelivery = async (deliveryId, mealId, notes) => {
		const deliveryPersonId = selectedDeliveryPerson[deliveryId];

		if (!deliveryPersonId) {
			toast.error("Please select a delivery person for this delivery.");
			return;
		}

		try {
			await api.assignDelivery(deliveryPersonId, mealId, notes);
			toast.success("Delivery assigned successfully!");
		} catch (error) {
			console.error("Error assigning delivery:", error);
			toast.error("Failed to assign delivery. Please try again.");
		}
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleString();
	};

	return (
		<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="bg-white rounded-lg shadow-lg mb-6">
				<div className="bg-blue-600 p-4 rounded-t-lg">
					<div className="flex items-center gap-4">
						<LocateFixedIcon className="w-8 h-8 text-white" />
						<div>
							<h1 className="text-xl font-semibold text-white">
								Delivery Assignment
							</h1>
							<p className="text-blue-100">
								Assign pending deliveries to a delivery person
							</p>
						</div>
					</div>
				</div>

				<div className="p-6">
					{deliveries.filter(
						(delivery) => delivery.status === "READY"
					).length > 0 ? (
						<div className="space-y-8">
							{deliveries.map((delivery) => (
								<div
									key={delivery.id}
									className="border rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
								>
									<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
										{/* Left Column - Delivery Assignment */}
										<div>
											<div className="mb-4">
												<div className="mt-2 space-y-2 text-sm">
													<p>
														<span className="font-medium">
															Status:
														</span>{" "}
														{delivery.status}
													</p>
													<p>
														<span className="font-medium">
															Start Time:
														</span>{" "}
														{formatDate(
															delivery.startTime
														)}
													</p>
													{delivery.notes && (
														<p>
															<span className="font-medium">
																Notes:
															</span>{" "}
															{delivery.notes}
														</p>
													)}
												</div>
											</div>

											<select
												value={
													selectedDeliveryPerson[
														delivery.id
													] || ""
												}
												onChange={(e) =>
													handleDeliveryPersonSelect(
														delivery.id,
														e.target.value
													)
												}
												className="w-full p-3 border rounded-lg bg-white text-gray-700 mb-4"
											>
												<option value="" disabled>
													Select a Delivery Person
												</option>
												{deliveryPersons.map(
													(person) => (
														<option
															key={person.id}
															value={person.id}
														>
															{`${person.name} (${person.currentLocation})`}
														</option>
													)
												)}
											</select>

											<button
												onClick={() =>
													handleAssignDelivery(
														delivery.id,
														delivery.mealId,
														delivery.notes
													)
												}
												className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
											>
												Assign Delivery
											</button>

											{/* Selected Delivery Person Card */}
											{selectedDeliveryPerson[
												delivery.id
											] &&
												selectedPersonDetails && (
													<div className="mt-4 bg-gray-50 rounded-lg p-4">
														<h4 className="font-semibold mb-3">
															Selected Delivery
															Person
														</h4>
														<div className="space-y-2">
															<div className="flex items-center gap-2">
																<span className="font-medium">
																	{
																		selectedPersonDetails.name
																	}
																</span>
															</div>
															<div className="flex items-center gap-2 text-gray-600">
																<Mail className="w-4 h-4" />
																<span>
																	{
																		selectedPersonDetails.email
																	}
																</span>
															</div>
															<div className="flex items-center gap-2 text-gray-600">
																<Phone className="w-4 h-4" />
																<span>
																	{
																		selectedPersonDetails.contactInfo
																	}
																</span>
															</div>
															<div className="flex items-center gap-2 text-gray-600">
																<MapPin className="w-4 h-4" />
																<span>
																	{
																		selectedPersonDetails.currentLocation
																	}
																</span>
															</div>
															<div className="flex items-center gap-2 text-gray-600">
																<Clock className="w-4 h-4" />
																<span>
																	Since{" "}
																	{new Date(
																		selectedPersonDetails.createdAt
																	).toLocaleDateString()}
																</span>
															</div>
														</div>
													</div>
												)}
										</div>

										{/* Right Column - Meal Details */}
										<div className="bg-gray-50 rounded-lg p-4">
											<h4 className="font-semibold mb-3">
												Meal Details
											</h4>
											<div className="space-y-3">
												<p>
													<span className="font-medium">
														Meal ID:
													</span>{" "}
													{delivery.meal.id}
												</p>
												<p>
													<span className="font-medium">
														Patient ID:
													</span>{" "}
													{delivery.meal.patientId}
												</p>
												<p>
													<span className="font-medium">
														Meal Time:
													</span>{" "}
													{delivery.meal.mealTime}
												</p>
												<div>
													<p className="font-medium mb-2">
														Ingredients:
													</p>
													<ul className="list-disc pl-5">
														{delivery.meal.Ingredients.map(
															(
																ingredient,
																index
															) => (
																<li key={index}>
																	{ingredient}
																</li>
															)
														)}
													</ul>
												</div>
												<p>
													<span className="font-medium">
														Instructions:
													</span>{" "}
													{delivery.meal.Instructions}
												</p>
												<p>
													<span className="font-medium">
														Status:
													</span>{" "}
													{delivery.meal.status}
												</p>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<p className="text-gray-500">
							No pending deliveries to assign.
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default DeliveryAssignment;
