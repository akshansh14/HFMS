/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Select,
	MenuItem,
	IconButton,
} from "@mui/material";
import { Plus, X } from "lucide-react";
import AppContext from "../context/AppContext";
import toast from "react-hot-toast";

const Patients = () => {
	const [patients, setPatients] = useState([]);
	const [openDialog, setOpenDialog] = useState(false);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [mealData, setMealData] = useState({
		patientId: "",
		mealTime: "",
		Ingredients: [""], // Initialize with one empty ingredient
		Instructions: "",
	});
	const [editPatientData, setEditPatientData] = useState({
		id: "",
		name: "",
		age: "",
		gender: "",
		contactInfo: "",
		emergencyContact: "",
		roomNumber: "",
		bedNumber: "",
		floorNumber: "",
		diseases: [],
		allergies: [],
		address: "",
	});
	const { api } = useContext(AppContext);

	const fetchPatients = async () => {
		try {
			const { patients } = await api.getPatients();
			setPatients(patients);
		} catch (error) {
			console.error("Error fetching patients:", error);
		}
	};
	useEffect(() => {
		fetchPatients();

		const intervalId = setInterval(() => {
			fetchPatients();
			toast.success("Data Updated successfully");
		}, 300000);

		return () => clearInterval(intervalId);
	}, []);

	const handleIngredientChange = (index, value) => {
		const newIngredients = [...mealData.Ingredients];
		newIngredients[index] = value;
		setMealData({
			...mealData,
			Ingredients: newIngredients,
		});
	};

	const addIngredient = () => {
		setMealData({
			...mealData,
			Ingredients: [...mealData.Ingredients, ""],
		});
	};

	const removeIngredient = (index) => {
		const newIngredients = mealData.Ingredients.filter(
			(_, i) => i !== index
		);
		setMealData({
			...mealData,
			Ingredients: newIngredients,
		});
	};

	const handleCreateMeal = async () => {
		if (
			!mealData.patientId ||
			!mealData.mealTime ||
			!mealData.Ingredients.some((ingredient) => ingredient.trim()) ||
			!mealData.Instructions
		) {
			toast.error("All fields are required to create a meal.");
			return;
		}

		try {
			const formattedMealData = {
				...mealData,
				Ingredients: mealData.Ingredients.filter((ingredient) =>
					ingredient.trim()
				),
				mealTime: mealData.mealTime.toUpperCase(),
			};

			await api.createMeal(formattedMealData, mealData.patientId);

			toast.success("Meal created successfully!");
			setOpenDialog(false);
			setMealData({
				patientId: "",
				mealTime: "",
				Ingredients: [""],
				Instructions: "",
			});
		} catch (error) {
			toast.error("Failed to create meal. Please try again.");
			console.error("Error creating meal:", error);
		}
	};

	const handleUpdatePatient = async (id) => {
		if (!editPatientData.name || !editPatientData.age) {
			toast.error("Name and age are required.");
			return;
		}

		try {
			await api.updatePatient(id, editPatientData);

			toast.success("Patient details updated successfully!");
			setOpenEditDialog(false);
			fetchPatients();
		} catch (error) {
			toast.error("Failed to update patient details.");
			console.error("Error updating patient:", error);
		}
	};

	const handleEditPatient = (patient) => {
		setEditPatientData(patient);
		setOpenEditDialog(true);
	};

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="mb-8 pb-4 border-b border-gray-200">
				<h1 className="text-3xl font-semibold text-gray-900">
					Patient Management
				</h1>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{patients.map((patient) => (
					<div
						key={patient.id}
						className="bg-white flex flex-col justify-between rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1"
					>
						<div className="p-6">
							<div className="space-y-4">
								<h2 className="text-xl font-semibold text-gray-800">
									{patient.name}
								</h2>
								<div className="space-y-1">
									<p className="text-sm font-medium text-gray-500">
										Demographics
									</p>
									<p className="text-sm text-gray-700">
										{patient.age} years • {patient.gender}
									</p>
								</div>
								<div className="space-y-1">
									<p className="text-sm font-medium text-gray-500">
										Location
									</p>
									<p className="text-sm text-gray-700">
										Room {patient.roomNumber} • Bed{" "}
										{patient.bedNumber}
									</p>
								</div>
								<div className="space-y-1">
									<p className="text-sm font-medium text-gray-500">
										Medical Conditions
									</p>
									<p className="text-sm text-gray-700">
										{patient.diseases.join(", ") ||
											"None Reported"}
									</p>
								</div>
								<div className="space-y-1">
									<p className="text-sm font-medium text-gray-500">
										Allergies
									</p>
									<p className="text-sm text-gray-700">
										{patient.allergies.join(", ") ||
											"None reported"}
									</p>
								</div>
							</div>
						</div>

						<div className="px-6 py-4 border-t border-gray-100 space-y-2">
							<button
								onClick={() => handleEditPatient(patient)}
								className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
							>
								Edit Patient Details
							</button>
							<button
								onClick={() => {
									setMealData({
										...mealData,
										patientId: patient.id,
									});
									setOpenDialog(true);
								}}
								className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
							>
								Create Meal Plan
							</button>
						</div>
					</div>
				))}
			</div>

			{/* Dialog to Create Meal */}
			<Dialog
				open={openDialog}
				onClose={() => setOpenDialog(false)}
				maxWidth="md"
				fullWidth
				className="rounded-lg"
			>
				<DialogTitle className="border-b border-gray-200 px-6 py-4">
					<div className="text-xl font-semibold text-gray-900">
						Create New Meal Plan
					</div>
				</DialogTitle>

				<DialogContent className="p-6 space-y-6">
					<Select
						value={mealData.mealTime}
						onChange={(e) =>
							setMealData({
								...mealData,
								mealTime: e.target.value,
							})
						}
						fullWidth
						displayEmpty
						className="rounded-md"
					>
						<MenuItem value="" disabled>
							Select Meal Type
						</MenuItem>
						<MenuItem value="Breakfast">Breakfast</MenuItem>
						<MenuItem value="Lunch">Lunch</MenuItem>
						<MenuItem value="Dinner">Dinner</MenuItem>
					</Select>

					{/* Ingredients Input */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<p className="text-sm font-medium text-gray-700">
								Ingredients
							</p>
							<IconButton
								onClick={addIngredient}
								className="text-blue-600 hover:text-blue-700"
								size="small"
							>
								<Plus className="w-5 h-5" />
							</IconButton>
						</div>
						{mealData.Ingredients.map((ingredient, index) => (
							<div key={index} className="flex gap-2">
								<TextField
									value={ingredient}
									onChange={(e) =>
										handleIngredientChange(
											index,
											e.target.value
										)
									}
									fullWidth
									placeholder={`Ingredient ${index + 1}`}
									className="rounded-md"
								/>
								{mealData.Ingredients.length > 1 && (
									<IconButton
										onClick={() => removeIngredient(index)}
										className="text-red-600 hover:text-red-700"
										size="small"
									>
										<X className="w-5 h-5" />
									</IconButton>
								)}
							</div>
						))}
					</div>

					<TextField
						label="Preparation Instructions"
						value={mealData.Instructions}
						onChange={(e) =>
							setMealData({
								...mealData,
								Instructions: e.target.value,
							})
						}
						fullWidth
						multiline
						rows={4}
						className="rounded-md"
					/>
				</DialogContent>

				<DialogActions className="border-t border-gray-200 px-6 py-4">
					<button
						onClick={() => setOpenDialog(false)}
						className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-md transition-colors duration-200"
					>
						Cancel
					</button>
					<button
						onClick={handleCreateMeal}
						className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md ml-3 transition-colors duration-200"
					>
						Create Meal Plan
					</button>
				</DialogActions>
			</Dialog>

			{/* Dialog to Edit Patient */}
			<Dialog
				open={openEditDialog}
				onClose={() => setOpenEditDialog(false)}
				maxWidth="md"
				fullWidth
				className="rounded-lg"
			>
				<DialogTitle className="border-b border-gray-200 px-6 py-4">
					<div className="text-xl font-semibold text-gray-900">
						Update Patient Details
					</div>
				</DialogTitle>

				<DialogContent className="p-6 space-y-6">
					{/* Patient basic details */}
					<TextField
						label="Name"
						value={editPatientData.name}
						onChange={(e) =>
							setEditPatientData({
								...editPatientData,
								name: e.target.value,
							})
						}
						fullWidth
					/>
					<TextField
						label="Age"
						type="number"
						value={editPatientData.age}
						onChange={(e) =>
							setEditPatientData({
								...editPatientData,
								age: e.target.value,
							})
						}
						fullWidth
					/>
					<TextField
						label="Gender"
						value={editPatientData.gender}
						onChange={(e) =>
							setEditPatientData({
								...editPatientData,
								gender: e.target.value,
							})
						}
						fullWidth
					/>
					<TextField
						label="Contact Info"
						value={editPatientData.contactInfo}
						onChange={(e) =>
							setEditPatientData({
								...editPatientData,
								contactInfo: e.target.value,
							})
						}
						fullWidth
					/>
					<TextField
						label="Emergency Contact"
						value={editPatientData.emergencyContact}
						onChange={(e) =>
							setEditPatientData({
								...editPatientData,
								emergencyContact: e.target.value,
							})
						}
						fullWidth
					/>
					<TextField
						label="Room Number"
						value={editPatientData.roomNumber}
						onChange={(e) =>
							setEditPatientData({
								...editPatientData,
								roomNumber: e.target.value,
							})
						}
						fullWidth
					/>
					<TextField
						label="Bed Number"
						value={editPatientData.bedNumber}
						onChange={(e) =>
							setEditPatientData({
								...editPatientData,
								bedNumber: e.target.value,
							})
						}
						fullWidth
					/>
					<TextField
						label="Floor Number"
						value={editPatientData.floorNumber}
						onChange={(e) =>
							setEditPatientData({
								...editPatientData,
								floorNumber: e.target.value,
							})
						}
						fullWidth
					/>
					<TextField
						label="Address"
						value={editPatientData.address}
						onChange={(e) =>
							setEditPatientData({
								...editPatientData,
								address: e.target.value,
							})
						}
						fullWidth
					/>

					{/* Diseases */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<p className="text-sm font-medium text-gray-700">
								Diseases
							</p>
							<IconButton
								onClick={() =>
									setEditPatientData((prevState) => ({
										...prevState,
										diseases: [...prevState.diseases, ""], // Adds empty string as a placeholder for a new disease
									}))
								}
								className="text-blue-600 hover:text-blue-700"
								size="small"
							>
								<Plus className="w-5 h-5" />
							</IconButton>
						</div>
						{editPatientData.diseases.map((disease, index) => (
							<div key={index} className="flex gap-2">
								<TextField
									value={disease}
									onChange={(e) => {
										setEditPatientData((prevState) => {
											const updatedDiseases = [
												...prevState.diseases,
											];
											updatedDiseases[index] =
												e.target.value; // Updates the specific disease value
											return {
												...prevState,
												diseases: updatedDiseases,
											};
										});
									}}
									fullWidth
									placeholder={`Disease ${index + 1}`}
									className="rounded-md"
								/>
								{editPatientData.diseases.length > 1 && (
									<IconButton
										onClick={() => {
											setEditPatientData((prevState) => {
												const updatedDiseases =
													prevState.diseases.filter(
														(_, i) => i !== index // Removes the disease at the current index
													);
												return {
													...prevState,
													diseases: updatedDiseases,
												};
											});
										}}
										className="text-red-600 hover:text-red-700"
										size="small"
									>
										<X className="w-5 h-5" />
									</IconButton>
								)}
							</div>
						))}
					</div>

					{/* Allergies */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<p className="text-sm font-medium text-gray-700">
								Allergies
							</p>
							<IconButton
								onClick={() =>
									setEditPatientData((prevState) => ({
										...prevState,
										allergies: [...prevState.allergies, ""], // Adds empty string as a placeholder for a new allergy
									}))
								}
								className="text-blue-600 hover:text-blue-700"
								size="small"
							>
								<Plus className="w-5 h-5" />
							</IconButton>
						</div>
						{editPatientData.allergies.map((allergy, index) => (
							<div key={index} className="flex gap-2">
								<TextField
									value={allergy}
									onChange={(e) => {
										setEditPatientData((prevState) => {
											const updatedAllergies = [
												...prevState.allergies,
											];
											updatedAllergies[index] =
												e.target.value;
											return {
												...prevState,
												allergies: updatedAllergies,
											};
										});
									}}
									fullWidth
									placeholder={`Allergy ${index + 1}`}
									className="rounded-md"
								/>
								{editPatientData.allergies.length > 1 && (
									<IconButton
										onClick={() => {
											setEditPatientData((prevState) => {
												const updatedAllergies =
													prevState.allergies.filter(
														(_, i) => i !== index
													);
												return {
													...prevState,
													allergies: updatedAllergies,
												};
											});
										}}
										className="text-red-600 hover:text-red-700"
										size="small"
									>
										<X className="w-5 h-5" />
									</IconButton>
								)}
							</div>
						))}
					</div>
				</DialogContent>

				<DialogActions className="border-t border-gray-200 px-6 py-4">
					<button
						onClick={() => setOpenEditDialog(false)}
						className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-md transition-colors duration-200"
					>
						Cancel
					</button>
					<button
						onClick={handleUpdatePatient}
						className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md ml-3 transition-colors duration-200"
					>
						Save Changes
					</button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default Patients;
