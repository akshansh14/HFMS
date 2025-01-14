import { useContext, useState, useEffect } from "react";
import {
	Button,
	Select,
	MenuItem,
	Typography,
	Paper,
	Box,
	List,
	ListItem,
	ListItemText,
	CircularProgress,
} from "@mui/material";
import AppContext from "../context/AppContext";

const DeliveryAssignment = () => {
	const [deliveries, setDeliveries] = useState([]);
	const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState("");
	const [loading, setLoading] = useState(false);
	const { api } = useContext(AppContext);

	// Fetch deliveries on component mount
	useEffect(() => {
		const fetchDeliveryDetails = async () => {
			setLoading(true);
			try {
				const { data } = await api.getDeliveryDetails();
				setDeliveries(data);
			} catch (error) {
				console.error("Error fetching delivery details:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchDeliveryDetails();
	}, [api]);

	const handleAssignDelivery = async () => {
		if (!selectedDeliveryPerson) {
			alert("Please select a delivery person.");
			return;
		}

		try {
			await api.assignDelivery({
				deliveryPersonId: selectedDeliveryPerson,
				deliveries: deliveries.map((delivery) => delivery.id),
			});

			// Clear the state and notify the user
			setDeliveries([]);
			setSelectedDeliveryPerson("");
			alert("Deliveries assigned successfully!");
		} catch (error) {
			console.error("Error assigning deliveries:", error);
			alert("Failed to assign deliveries.");
		}
	};

	return (
		<Box
			component={Paper}
			elevation={3}
			sx={{
				padding: "20px",
				borderRadius: "10px",
				maxWidth: "600px",
				margin: "20px auto",
				backgroundColor: "#ffffff",
			}}
		>
			<Typography variant="h5" gutterBottom>
				Delivery Assignment
			</Typography>

			<Typography variant="body1" gutterBottom>
				Assign pending deliveries to a delivery person.
			</Typography>

			<Select
				value={selectedDeliveryPerson}
				onChange={(e) => setSelectedDeliveryPerson(e.target.value)}
				displayEmpty
				fullWidth
				sx={{
					marginBottom: "16px",
				}}
			>
				<MenuItem value="" disabled>
					Select a Delivery Person
				</MenuItem>
				<MenuItem value="delivery1">Delivery Person 1</MenuItem>
				<MenuItem value="delivery2">Delivery Person 2</MenuItem>
			</Select>

			<Button
				onClick={handleAssignDelivery}
				variant="contained"
				color="primary"
				fullWidth
				sx={{
					marginBottom: "16px",
				}}
			>
				Assign Deliveries
			</Button>

			<Typography variant="h6" gutterBottom>
				Pending Deliveries
			</Typography>

			{loading ? (
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						padding: "16px",
					}}
				>
					<CircularProgress />
				</Box>
			) : deliveries.length > 0 ? (
				<List>
					{deliveries.map((delivery) => (
						<ListItem
							key={delivery.id}
							sx={{ borderBottom: "1px solid #ddd" }}
						>
							<ListItemText primary={delivery.details} />
						</ListItem>
					))}
				</List>
			) : (
				<Typography variant="body2" color="textSecondary">
					No pending deliveries to display.
				</Typography>
			)}
		</Box>
	);
};

export default DeliveryAssignment;
