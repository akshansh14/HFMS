import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Login from "./Pages/Login";
import DeliveryDashboard from "./Pages/DeliveryDashBoard";
import InfantryDashboard from "./Pages/InfantryDashboard";
import ManagerDashboard from "./Pages/ManagerDashboard";
import { useContext, useEffect } from "react";
import AppContext from "./context/AppContext";

function App() {
	const { token, role, setToken, setRole } = useContext(AppContext);
	const navigate = useNavigate();

	// Effect to handle local storage validation and redirection
	useEffect(() => {
		const storedToken = localStorage.getItem("token");
		const storedRole = localStorage.getItem("role");

		if (storedToken && storedRole) {
			if (["ADMIN", "DELIVERY", "INFANTRY"].includes(storedRole)) {
				setToken(storedToken);
				setRole(storedRole);
			} else {
				// Invalid role, clear local storage and redirect to login
				localStorage.clear();
				setToken(null);
				setRole(null);
				navigate("/login", { replace: true });
			}
		} else {
			// Missing token or role, clear local storage and redirect to login
			localStorage.clear();
			setToken(null);
			setRole(null);
			navigate("/login", { replace: true });
		}
	}, [setToken, setRole, navigate]);

	return (
		<Routes>
			{/* Public Route */}
			<Route
				path="/login"
				element={
					!token ? (
						<Login />
					) : role === "ADMIN" ? (
						<Navigate to="/MD" replace />
					) : role === "DELIVERY" ? (
						<Navigate to="/DD" replace />
					) : (
						<Navigate to="/ID" replace />
					)
				}
			/>

			{/* Protected Routes */}
			{token && role === "ADMIN" && (
				<Route path="/MD" element={<ManagerDashboard />} />
			)}
			{token && role === "DELIVERY" && (
				<Route path="/DD" element={<DeliveryDashboard />} />
			)}
			{token && role === "INFANTRY" && (
				<Route path="/ID" element={<InfantryDashboard />} />
			)}

			{/* Wildcard Route */}
			<Route path="*" element={<Navigate to="/login" replace />} />
		</Routes>
	);
}

export default App;
