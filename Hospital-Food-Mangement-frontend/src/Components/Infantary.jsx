import { useContext, useState, useEffect } from "react";
import AppContext from "../context/AppContext";
import { PlusIcon, Users } from "lucide-react";
import { AddStaffModal } from "./AddStaffModal";
import toast from "react-hot-toast";

const InfantryTasks = () => {
	const [meals, setMeals] = useState([]);
	const [patients, setPatients] = useState([]);
	const [staffMembers, setStaffMembers] = useState([]);
	const [selectedStaff, setSelectedStaff] = useState({});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [newStaff, setNewStaff] = useState({
		name: "",
		contactInfo: "",
		email: "",
		location: "",
		password: "",
		shift: "MORNING",
	});

	const { api } = useContext(AppContext);

	const fetchData = async () => {
		try {
			const { data: mealsData } = await api.getPendingMeals();
			setMeals(mealsData.meals || []);
			setPatients(mealsData.patient || []);

			const staffData = await api.getStaff();
			setStaffMembers(staffData || []);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};
	useEffect(() => {
		fetchData();

		const intervalId = setInterval(() => {
			fetchData();
			toast.success("Meals list updated");
		}, 300000);

		return () => clearInterval(intervalId);
	}, []);

	const handleAssignTask = async (mealId) => {
		const staffId = selectedStaff[mealId];

		if (!staffId) {
			toast.error("Please select a staff member for this meal.");
			return;
		}

		try {
			await api.assignTask(staffId, mealId);
			toast.success("Task assigned successfully!");

			const { data: mealsData } = await api.getPendingMeals();
			setMeals(mealsData.meals || []);
			setPatients(mealsData.patient || []);
		} catch (error) {
			console.error("Error assigning task:", error);
			toast.error("Failed to assign task. Please try again.");
		}
	};

	const getPatientDetails = (patientId) => {
		return patients.find((patient) => patient.id === patientId);
	};

	const handleAddStaff = () => {
		setIsModalOpen(true);
	};

	const handleSaveStaff = async () => {
		try {
			await api.createStaff(newStaff);
			const staffData = await api.getStaff();
			setStaffMembers(staffData || []);
		} catch (error) {
			console.log(error);
			toast.error("Failed to create staff");
		}
		setNewStaff({
			name: "",
			contactInfo: "",
			email: "",
			location: "",
			password: "",
			shift: "MORNING",
		});
		setIsModalOpen(false);
	};

	return (
		<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			{/* Add Staff Modal */}
			{isModalOpen && (
				<AddStaffModal
					setIsModalOpen={setIsModalOpen}
					setNewStaff={setNewStaff}
					newStaff={newStaff}
					handleSaveStaff={handleSaveStaff}
				/>
			)}

			<div className="bg-white rounded-lg shadow-lg">
				{/* Header */}
				<div className="bg-blue-600 p-4 rounded-t-lg flex justify-between items-center flex-col sm:flex-row">
					<div className="flex items-center gap-4">
						<div className="flex-shrink-0">
							<Users className="w-8 h-8 text-white" />
						</div>
						<div>
							<h1 className="text-xl sm:text-2xl font-semibold text-white">
								Infantry Tasks
							</h1>
							<p className="text-blue-100">
								Assign pending meals to a staff member
							</p>
						</div>
					</div>
					<button
						onClick={handleAddStaff}
						className="text-blue-600 bg-white md:text-xl font-semibold rounded-lg px-3 py-2 flex items-center gap-2 mt-4 sm:mt-0"
					>
						<PlusIcon />
						Add Staff
					</button>
				</div>

				{/* Rest of the component remains the same */}
				<div className="p-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">
						Pending Meals
					</h2>

					{meals.filter((meal) => meal.status === "PENDING").length >
					0 ? (
						<div className="space-y-6">
							{meals
								.filter((meal) => meal.status === "PENDING")
								.map((meal) => {
									const patient = getPatientDetails(
										meal.patientId
									);

									return (
										<div
											key={meal.id}
											className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200"
										>
											{/* Meal Information */}
											<div className="mb-4 space-y-2">
												<h3 className="font-semibold text-gray-900">
													Meal Time: {meal.mealTime}
												</h3>
												<p className="text-gray-700">
													<span className="font-medium">
														Ingredients:
													</span>{" "}
													{meal.Ingredients
														? meal.Ingredients.join(
																", "
														  )
														: "N/A"}
												</p>
												<p className="text-gray-700">
													<span className="font-medium">
														Instructions:
													</span>{" "}
													{meal.Instructions || "N/A"}
												</p>
											</div>

											{/* Staff Assignment */}
											<div className="relative mb-6">
												<select
													value={
														selectedStaff[
															meal.id
														] || ""
													}
													onChange={(e) =>
														setSelectedStaff({
															...selectedStaff,
															[meal.id]:
																e.target.value,
														})
													}
													className="w-full p-3 pl-12 border rounded-lg bg-white text-gray-700 appearance-none cursor-pointer
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        hover:border-blue-400 transition-all duration-200"
												>
													<option
														value=""
														disabled
														className="text-gray-500"
													>
														Select a Staff
													</option>
													{staffMembers.map(
														(staff) => (
															<option
																key={staff.id}
																value={staff.id}
																className="py-2"
															>
																{`${staff.name} - ${staff.shift} (${staff.location})`}
															</option>
														)
													)}
												</select>

												<div className="absolute left-3 top-1/2 -translate-y-1/2">
													<Users className="w-5 h-5 text-gray-400" />
												</div>

												<div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
													<svg
														className="w-5 h-5 text-gray-400"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth="2"
															d="M19 9l-7 7-7-7"
														/>
													</svg>
												</div>
											</div>

											{/* Staff Details Popup */}
											{selectedStaff[meal.id] && (
												<div className="my-2 w-full bg-white border rounded-lg shadow-md p-4">
													{staffMembers.map(
														(staff) => {
															if (
																staff.id ===
																selectedStaff[
																	meal.id
																]
															) {
																return (
																	<div
																		key={
																			staff.id
																		}
																		className="space-y-3"
																	>
																		<div className="font-medium text-gray-900">
																			{
																				staff.name
																			}
																		</div>
																		<div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
																			<div>
																				<span className="font-medium">
																					Email:
																				</span>{" "}
																				{
																					staff.email
																				}
																			</div>
																			<div>
																				<span className="font-medium">
																					Contact:
																				</span>{" "}
																				{
																					staff.contactInfo
																				}
																			</div>
																			<div>
																				<span className="font-medium">
																					Location:
																				</span>{" "}
																				{
																					staff.location
																				}
																			</div>
																			<div>
																				<span className="font-medium">
																					Shift:
																				</span>{" "}
																				<span
																					className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                                    ${
										staff.shift === "MORNING"
											? "bg-yellow-100 text-yellow-800"
											: staff.shift === "AFTERNOON"
											? "bg-blue-100 text-blue-800"
											: "bg-indigo-100 text-indigo-800"
									}`}
																				>
																					{
																						staff.shift
																					}
																				</span>
																			</div>
																		</div>
																	</div>
																);
															}
															return null;
														}
													)}
												</div>
											)}

											{/* Assign Task Button */}
											<button
												onClick={() =>
													handleAssignTask(meal.id)
												}
												className="w-full bg-blue-600 mt-2 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
											>
												Assign Task
											</button>

											{/* Patient Information */}
											{patient && (
												<div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
													<h4 className="font-semibold text-gray-900">
														Patient Details
													</h4>
													<p className="text-gray-700">
														Name:{" "}
														{patient.name || "N/A"}
													</p>
													<p className="text-gray-700">
														Age:{" "}
														{patient.age || "N/A"}
													</p>
													<p className="text-gray-700">
														Room:{" "}
														{patient.roomNumber ||
															"N/A"}
													</p>
												</div>
											)}
										</div>
									);
								})}
						</div>
					) : (
						<p className="text-gray-500">
							No pending meals to assign.
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default InfantryTasks;
