import { useState, useContext } from "react";
import { Box, Typography, Tabs, Tab, Paper } from "@mui/material";
import Patients from "../Components/Patients";
import InfantryTasks from "../Components/Infantary";
import DeliveryAssignment from "../Components/Delivery";
import AppContext from "../context/AppContext"; // Import the context

const ManagerDashboard = () => {
	const [activeTab, setActiveTab] = useState("patients");
	const { account } = useContext(AppContext); // Access user data from context

	const handleTabChange = (event, newValue) => {
		setActiveTab(newValue);
	};

	return (
		<Box
			sx={{
				display: "flex",
				minHeight: "100vh",
				backgroundColor: "#f5f5f5",
			}}
		>
			<Paper
				elevation={3}
				sx={{
					width: "250px",
					padding: "20px",
					backgroundColor: "#ffffff",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Typography variant="h6" gutterBottom>
					Manager Dashboard
				</Typography>
				{/* Display user name and email */}
				<Typography variant="body2" color="textSecondary" gutterBottom>
					{account?.name
						? `Welcome, ${account.name}`
						: "No user data available"}
				</Typography>
				<Typography variant="body2" color="textSecondary">
					{account?.email
						? `Email: ${account.email}`
						: "No email available"}
				</Typography>

				<Tabs
					orientation="vertical"
					value={activeTab}
					onChange={handleTabChange}
					textColor="primary"
					indicatorColor="primary"
					sx={{ width: "100%", marginTop: "20px" }}
				>
					<Tab
						label="Patients"
						value="patients"
						sx={{ textAlign: "left" }}
					/>
					<Tab
						label="Infantry Tasks"
						value="infantry"
						sx={{ textAlign: "left" }}
					/>
					<Tab
						label="Delivery Assignments"
						value="delivery"
						sx={{ textAlign: "left" }}
					/>
				</Tabs>
			</Paper>

			<Box
				sx={{
					flex: 1,
					padding: "20px",
					overflowY: "auto",
					backgroundColor: "#f0f4f8",
				}}
			>
				{activeTab === "patients" && <Patients />}
				{activeTab === "infantry" && <InfantryTasks />}
				{activeTab === "delivery" && <DeliveryAssignment />}
			</Box>
		</Box>
	);
};

export default ManagerDashboard;
