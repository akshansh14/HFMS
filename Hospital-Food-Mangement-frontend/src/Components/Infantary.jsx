import { useContext, useState, useEffect } from "react";
import {
	Button,
	Select,
	MenuItem,
	Typography,
	Paper,
	Box,
	CardHeader,
	Avatar,
	Card,
	CardContent,
} from "@mui/material";
import AppContext from "../context/AppContext";

const InfantryTasks = () => {
	const [meals, setMeals] = useState([]);
	const [patients, setPatients] = useState([]);
	const [staffMembers, setStaffMembers] = useState([]); // To hold available staff
	const [selectedStaff, setSelectedStaff] = useState({}); // Holds selected staff for each meal
	const { api } = useContext(AppContext);

	// Fetch Meals, Patients, and Staff Members on Component Mount
	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetching meals and patients
				const { data: mealsData } = await api.getPendingMeals();
				setMeals(mealsData.meals);
				setPatients(mealsData.patient);

				// Fetching available staff
				const staffData = await api.getStaff();
				setStaffMembers(staffData);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, [api]);

	const handleAssignTask = async (mealId) => {
		const staffId = selectedStaff[mealId];

		if (!staffId) {
			alert("Please select a staff member for this meal.");
			return;
		}

		console.log(staffId, mealId);

		try {
			await api.assignTask(staffId, mealId); // Assign task to specific meal and staff
			alert("Task assigned successfully!");
		} catch (error) {
			console.error("Error assigning task:", error);
			alert("Failed to assign task.");
		}
	};

	// Get the patient data associated with a meal
	const getPatientDetails = (patientId) => {
		return patients.find((patient) => patient.id === patientId);
	};

	return (
		<Box
			component={Paper}
			elevation={5}
			sx={{
				padding: "30px",
				borderRadius: "20px",
				maxWidth: "600px",
				margin: "20px auto",
				backgroundColor: "#ffffff",
				boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.1)",
			}}
		>
			<Card sx={{ borderRadius: "12px", overflow: "hidden" }}>
				<CardHeader
					avatar={
						<Avatar sx={{ bgcolor: "#1976d2" }}>
							<i className="fas fa-utensils"></i>
						</Avatar>
					}
					title={<Typography variant="h5">Infantry Tasks</Typography>}
					subheader={
						<Typography variant="body1">
							Assign pending meals to a staff member
						</Typography>
					}
					sx={{
						backgroundColor: "#1976d2",
						color: "#fff",
						borderRadius: "12px 12px 0 0",
					}}
				/>

				<CardContent sx={{ padding: "20px" }}>
					<Typography variant="h6" gutterBottom>
						All Meals
					</Typography>

					{meals.length > 0 ? (
						<ul>
							{meals.map((meal) => {
								const patient = getPatientDetails(
									meal.patientId
								); // Get patient data for this meal

								return (
									<Card
										key={meal.id}
										sx={{
											marginBottom: "16px",
											borderRadius: "8px",
											boxShadow:
												"0 4px 10px rgba(0, 0, 0, 0.1)",
											backgroundColor: "#f5f5f5",
											"&:hover": {
												boxShadow:
													"0 8px 15px rgba(0, 0, 0, 0.1)",
											},
										}}
									>
										<CardContent>
											<Typography
												variant="body2"
												fontWeight="bold"
											>
												Meal Time: {meal.mealTime}
											</Typography>
											<Typography variant="body2">
												Ingredients:{" "}
												{meal.Ingredients.join(", ")}
											</Typography>
											<Typography variant="body2">
												Instructions:{" "}
												{meal.Instructions}
											</Typography>

											{/* Staff Assignment Dropdown */}
											<Select
												value={
													selectedStaff[meal.id] || ""
												}
												onChange={(e) =>
													setSelectedStaff({
														...selectedStaff,
														[meal.id]:
															e.target.value,
													})
												}
												displayEmpty
												fullWidth
												sx={{
													marginBottom: "16px",
												}}
											>
												<MenuItem value="" disabled>
													Select a Staff Member
												</MenuItem>
												{staffMembers.map((staff) => (
													<MenuItem
														key={staff.id}
														value={staff.id}
													>
														{staff.name}
													</MenuItem>
												))}
											</Select>

											<Button
												onClick={() =>
													handleAssignTask(meal.id)
												}
												variant="contained"
												color="primary"
												fullWidth
												sx={{
													marginBottom: "16px",
													padding: "10px 0",
												}}
											>
												Assign Task
											</Button>

											{/* Patient Information */}
											{patient && (
												<Box sx={{ marginTop: "10px" }}>
													<Typography
														variant="body2"
														fontWeight="bold"
													>
														Patient Details
													</Typography>
													<Typography variant="body2">
														Patient Name:{" "}
														{patient.name}
													</Typography>
													<Typography variant="body2">
														Age: {patient.age}
													</Typography>
													<Typography variant="body2">
														Gender: {patient.gender}
													</Typography>
													<Typography variant="body2">
														Room:{" "}
														{patient.roomNumber} -
														Bed: {patient.bedNumber}
													</Typography>
													<Typography variant="body2">
														Diseases:{" "}
														{patient.diseases.join(
															", "
														)}
													</Typography>
													<Typography variant="body2">
														Allergies:{" "}
														{patient.allergies.join(
															", "
														)}
													</Typography>
												</Box>
											)}
										</CardContent>
									</Card>
								);
							})}
						</ul>
					) : (
						<Typography variant="body2" color="textSecondary">
							No meals to display.
						</Typography>
					)}
				</CardContent>
			</Card>
		</Box>
	);
};

export default InfantryTasks;
