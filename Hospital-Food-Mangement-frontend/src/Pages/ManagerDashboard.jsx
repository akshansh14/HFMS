import { useState, useEffect, useRef, useContext } from "react";
import {
	Box,
	Typography,
	Tabs,
	Tab,
	Paper,
	AppBar,
	Toolbar,
	IconButton,
	useTheme,
	useMediaQuery,
} from "@mui/material";
import {
	Menu as MenuIcon,
	Person as PersonIcon,
	LocalShipping as LocalShippingIcon,
	Restaurant as RestaurantIcon,
	Logout as LogoutIcon,
} from "@mui/icons-material";
import Patients from "../Components/Patients";
import InfantryTasks from "../Components/Infantary";
import DeliveryAssignment from "../Components/Delivery";
import AppContext from "../context/AppContext";
import toast from "react-hot-toast";

const ManagerDashboard = () => {
	const [activeTab, setActiveTab] = useState("patients");
	const [mobileOpen, setMobileOpen] = useState(false);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const sidebarRef = useRef(null);
	const { api } = useContext(AppContext);

	const handleTabChange = (event, newValue) => {
		if (newValue === "logout") {
			api.logout();
			toast.success("Log out successful");
			return;
		}
		setActiveTab(newValue);
		if (isMobile) {
			setMobileOpen(false); // Close sidebar on tab change
		}
	};

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const sidebarContent = (
		<Box sx={{ width: "100%" }}>
			<Box sx={{ p: 3, borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}>
				<Typography variant="h6" fontWeight="600" color="primary">
					Manager Dashboard
				</Typography>
			</Box>

			<Tabs
				orientation="vertical"
				value={activeTab}
				onChange={handleTabChange}
				textColor="primary"
				indicatorColor="primary"
				sx={{
					"& .MuiTab-root": {
						minHeight: 60,
						justifyContent: "flex-start",
						alignItems: "center",
						px: 3,
						textAlign: "left",
						fontWeight: 500,
						fontSize: "0.95rem",
						"&.Mui-selected": {
							backgroundColor: "rgba(25, 118, 210, 0.08)",
						},
					},
					"& .MuiTabs-indicator": {
						left: 0,
						right: "auto",
						width: 4,
						borderRadius: "0 4px 4px 0",
					},
				}}
			>
				<Tab
					icon={<PersonIcon />}
					iconPosition="start"
					label="Patients"
					value="patients"
					sx={{ gap: 2 }}
				/>
				<Tab
					icon={<RestaurantIcon />}
					iconPosition="start"
					label="Inner Pantry Tasks"
					value="infantry"
					sx={{ gap: 2 }}
				/>
				<Tab
					icon={<LocalShippingIcon />}
					iconPosition="start"
					label="Delivery Assignments"
					value="delivery"
					sx={{ gap: 2 }}
				/>
				<Tab
					icon={<LogoutIcon />}
					iconPosition="start"
					label="Log Out"
					value="logout"
					sx={{ gap: 2 }}
				/>
			</Tabs>
		</Box>
	);

	// Close sidebar when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				sidebarRef.current &&
				!sidebarRef.current.contains(event.target)
			) {
				setMobileOpen(false);
			}
		};

		if (isMobile) {
			document.addEventListener("mousedown", handleClickOutside);
			return () =>
				document.removeEventListener("mousedown", handleClickOutside);
		}
	}, [isMobile]);

	return (
		<Box sx={{ display: "flex", minHeight: "100vh" }}>
			{/* Mobile App Bar */}
			<AppBar
				position="fixed"
				sx={{
					display: { md: "none" },
					bgcolor: "background.paper",
					color: "text.primary",
					boxShadow: 1,
				}}
			>
				<Toolbar>
					<IconButton
						color="inherit"
						edge="start"
						onClick={handleDrawerToggle}
						sx={{ mr: 2 }}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" noWrap component="div">
						Manager Dashboard
					</Typography>
				</Toolbar>
			</AppBar>

			{/* Sidebar */}
			<Paper
				elevation={3}
				sx={{
					width: { xs: 0, md: 280 },
					flexShrink: 0,
					position: "fixed",
					height: "100vh",
					borderRadius: 0,
					display: { xs: "none", md: "block" },
					overflowY: "auto",
					backgroundColor: "background.paper",
					borderRight: "1px solid rgba(0, 0, 0, 0.12)",
				}}
				ref={sidebarRef}
			>
				{sidebarContent}
			</Paper>

			{/* Mobile Drawer */}
			{isMobile && (
				<Paper
					elevation={3}
					sx={{
						position: "fixed",
						width: 280,
						height: "100vh",
						zIndex: theme.zIndex.appBar + 1,
						transform: `translateX(${mobileOpen ? "0" : "-100%"})`,
						transition: "transform 0.3s ease-in-out",
						overflowY: "auto",
						backgroundColor: "background.paper",
					}}
					ref={sidebarRef}
				>
					{sidebarContent}
				</Paper>
			)}

			{/* Main Content */}
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					p: 3,
					backgroundColor: "#f0f4f8",
					marginLeft: { xs: 0, md: "280px" },
					marginTop: { xs: "64px", md: 0 },
					minHeight: "100vh",
					overflowX: "hidden",
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
