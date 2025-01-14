import React, { useContext, useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardActions,
	Typography,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Select,
	MenuItem,
} from "@mui/material";
import AppContext from "../context/AppContext";
import toast from "react-hot-toast";

const Patients = () => {
	const [patients, setPatients] = useState([]);
	const [openDialog, setOpenDialog] = useState(false);
	const [mealData, setMealData] = useState({
		patientId: "",
		mealType: "",
		ingredients: "",
		instructions: "",
	});
	const { api } = useContext(AppContext);

	// Fetch patients on component mount
	useEffect(() => {
		const fetchPatients = async () => {
			try {
				const { patients } = await api.getPatients(); // Adjusted to match your API's response structure
				setPatients(patients);
			} catch (error) {
				console.error("Error fetching patients:", error);
			}
		};

		fetchPatients();
	}, [api]);

	const handleCreateMeal = async () => {
		try {
			await api.createMeal(mealData);
			toast.success("Meal created successfully!"); // Optional success toast
			setOpenDialog(false);
			setMealData({
				patientId: "",
				mealType: "",
				ingredients: "",
				instructions: "",
			});
		} catch (error) {
			toast.error("Failed to create meal. Please try again."); // Optional error toast
			console.error("Error creating meal:", error);
		}
	};

	return (
		<div className="patients-tab" style={{ padding: "20px" }}>
			<div
				style={{
					display: "grid",
					gridTemplateColumns:
						"repeat(auto-fill, minmax(300px, 1fr))",
					gap: "20px",
				}}
			>
				{patients.map((patient) => (
					<Card
						key={patient.id}
						style={{
							boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
							borderRadius: "10px",
							overflow: "hidden",
						}}
					>
						<CardContent>
							<Typography
								variant="h6"
								component="div"
								gutterBottom
							>
								<strong>{patient.name}</strong>
							</Typography>
							<Typography
								variant="body2"
								color="textSecondary"
								gutterBottom
							>
								Age: {patient.age} | Gender: {patient.gender}
							</Typography>
							<Typography variant="body2" gutterBottom>
								Room: {patient.roomNumber}, Bed:{" "}
								{patient.bedNumber}
							</Typography>
							<Typography variant="body2" color="textSecondary">
								Diseases: {patient.diseases.join(", ")}
							</Typography>
							<Typography variant="body2" color="textSecondary">
								Allergies: {patient.allergies.join(", ")}
							</Typography>
						</CardContent>
						<CardActions>
							<Button
								size="small"
								color="primary"
								variant="contained"
								onClick={() => {
									setMealData({
										...mealData,
										patientId: patient.id,
									});
									setOpenDialog(true);
								}}
							>
								Create Meal
							</Button>
						</CardActions>
					</Card>
				))}
			</div>

			<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
				<DialogTitle>Create Meal</DialogTitle>
				<DialogContent>
					<Select
						value={mealData.mealType}
						onChange={(e) =>
							setMealData({
								...mealData,
								mealType: e.target.value,
							})
						}
						fullWidth
						displayEmpty
						style={{ marginBottom: "20px" }}
					>
						<MenuItem value="" disabled>
							Select Meal Type
						</MenuItem>
						<MenuItem value="Breakfast">Breakfast</MenuItem>
						<MenuItem value="Lunch">Lunch</MenuItem>
						<MenuItem value="Dinner">Dinner</MenuItem>
					</Select>
					<TextField
						label="Ingredients"
						value={mealData.ingredients}
						onChange={(e) =>
							setMealData({
								...mealData,
								ingredients: e.target.value,
							})
						}
						fullWidth
						margin="normal"
					/>
					<TextField
						label="Instructions"
						value={mealData.instructions}
						onChange={(e) =>
							setMealData({
								...mealData,
								instructions: e.target.value,
							})
						}
						fullWidth
						margin="normal"
					/>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => setOpenDialog(false)}
						color="secondary"
					>
						Cancel
					</Button>
					<Button
						onClick={handleCreateMeal}
						color="primary"
						variant="contained"
					>
						Submit
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default Patients;
