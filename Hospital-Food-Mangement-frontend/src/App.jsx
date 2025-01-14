import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import DeliveryDashboard from "./Pages/DeliveryDashBoard";
import InfantryDashboard from "./Pages/InfantryDashboard";
import ManagerDashboard from "./Pages/ManagerDashboard";
import { useContext } from "react";
import AppContext from "./context/AppContext";

function App() {
	const { token } = useContext(AppContext);

	return (
		<Routes>
			<Route path="/" element={<Login />} />

			{token ? (
				<>
					<Route path="/DD" element={<DeliveryDashboard />} />
					<Route path="/ID" element={<InfantryDashboard />} />
					<Route path="/MD" element={<ManagerDashboard />} />
				</>
			) : (
				<Route path="*" element={<Navigate to="/" />} />
			)}
		</Routes>
	);
}

export default App;
