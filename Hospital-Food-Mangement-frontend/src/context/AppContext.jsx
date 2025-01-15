/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Initialize context with default values
const AppContext = createContext(null);

const BASE_URL = "https://hfms-3w5u.onrender.com"; // Update with your API base URL

export function AppContextProvider({ children }) {
	const navigate = useNavigate();

	// Initialize state from localStorage
	const [token, setToken] = useState(() => localStorage.getItem("token"));
	const [role, setRole] = useState(() => localStorage.getItem("role"));

	// Handle token and role changes
	useEffect(() => {
		if (!token) {
			navigate("/login"); // Redirect to login if no token
			return;
		}

		// Validate role
		if (!["ADMIN", "INFANTRY", "DELIVERY"].includes(role)) {
			toast.error("Unauthorized access");
			navigate("/login");
		}

		// Set Authorization header
		axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	}, [token, role]);

	// Axios instance with base configuration
	const axiosInstance = axios.create({
		baseURL: BASE_URL,
		timeout: 5000,
		headers: {
			"Content-Type": "application/json",
		},
	});

	// Add response interceptor for error handling
	axiosInstance.interceptors.response.use(
		(response) => response,
		(error) => {
			if (error.response?.status === 401) {
				// Handle unauthorized access
				toast.error("Session expired. Please log in again.");
				api.logout();
			}
			return Promise.reject(error);
		}
	);

	// API Functions
	const api = {
		login: async (data) => {
			try {
				const result = await axiosInstance.post("/api/login", data);
				const userToken = result.data?.user?.token;
				const userRole = result.data?.user?.role;

				if (!userToken || !userRole) {
					throw new Error("Token or role not found in the response");
				}

				// Save token and role in localStorage and state
				localStorage.setItem("token", userToken);
				localStorage.setItem("role", userRole);
				setToken(userToken);
				setRole(userRole);

				toast.success("Successfully logged in!");
			} catch (error) {
				toast.error(
					error.response?.data?.message ||
						"Invalid email or password. Please try again."
				);
				throw error;
			}
		},

		getPatients: async () => {
			try {
				const response = await axiosInstance.get("/api/get-patient");
				return response.data;
			} catch (error) {
				throw new Error(
					error.response?.data?.message || "Failed to fetch patients"
				);
			}
		},

		updatePatient: async (id, data) => {
			try {
				await axiosInstance.put(`/api/update-patient/${id}`, data);
			} catch (error) {
				throw new Error(
					error.response?.data?.message || "Failed to update patients"
				);
			}
		},

		createMeal: async (data, patientId) => {
			try {
				const response = await axiosInstance.post(
					`/api/meals/${patientId}`,
					data
				);
				return response.data;
			} catch (error) {
				throw new Error(
					error.response?.data?.message || "Failed to create meal"
				);
			}
		},

		getStaff: async () => {
			try {
				const response = await axiosInstance.get("/api/get-staff");
				return response.data;
			} catch (error) {
				throw new Error(
					error.response?.data?.message || "Failed to fetch staff"
				);
			}
		},

		createStaff: async (data) => {
			try {
				await axiosInstance.post(`/api/staff`, data);
			} catch (error) {
				throw new Error(
					error.response?.data?.message ||
						"Failed to create new staff"
				);
			}
		},

		getPantryStaff: async (staffId) => {
			try {
				const response = await axiosInstance.get(
					`/api/staff/${staffId}`
				);
				return response.data;
			} catch (error) {
				throw new Error(
					error.response?.data?.message || "Failed to fetch staff"
				);
			}
		},

		updateTasks: async (taskId, data) => {
			try {
				await axiosInstance.put(
					`/api/staff/task-update/${taskId}`,
					data
				);
			} catch (error) {
				throw new Error(
					error.response?.data?.message || "Failed to update patients"
				);
			}
		},

		getPendingMeals: async () => {
			try {
				const response = await axiosInstance.get("/api/meals");
				return response;
			} catch (error) {
				throw new Error(
					error.response?.data?.message ||
						"Failed to fetch pending meals"
				);
			}
		},

		assignTask: async (staffId, mealId) => {
			try {
				const response = await axiosInstance.post(
					`/api/tasks/${staffId}`,
					{ mealId }
				);
				return response.data;
			} catch (error) {
				throw new Error(
					error.response?.data?.message || "Failed to assign task"
				);
			}
		},

		getDeliveryPerson: async () => {
			try {
				const response = await axiosInstance.get(
					"/api/get-deliveryperson"
				);

				return response.data;
			} catch (error) {
				throw new Error(
					error.response?.data?.message ||
						"Failed to fetch delivery personnel details"
				);
			}
		},

		getDeliveryDetails: async () => {
			try {
				const response = await axiosInstance.get("/api/get-delivery");
				return response.data;
			} catch (error) {
				throw new Error(
					error.response?.data?.message ||
						"Failed to fetch delivery details"
				);
			}
		},

		assignDelivery: async (deliveryPersonId, mealId, notes) => {
			try {
				const response = await axiosInstance.post(
					`/api/delivery/${deliveryPersonId}`,
					{ mealId, notes }
				);
				return response.data;
			} catch (error) {
				throw new Error(
					error.response?.data?.message || "Failed to assign delivery"
				);
			}
		},

		getAssignedDeliveries: async (deliveryPersonId) => {
			try {
				const response = await axiosInstance.get(
					`/api/deliveryperson/${deliveryPersonId}`
				);
				return response.data;
			} catch (error) {
				throw new Error(
					error.response?.data?.message ||
						"Failed to get delivery details"
				);
			}
		},

		updateDeliveryStatus: async (deliveryId, status, mealId) => {
			try {
				const response = await axiosInstance.put(
					`/api/deliveryperson/${deliveryId}`,
					{
						status,
						mealId,
					}
				);
				return response.data;
			} catch (error) {
				throw new Error(
					error.response?.data?.message || "Failed to update status"
				);
			}
		},

		logout: () => {
			// Clear state and localStorage
			setToken(null);
			setRole(null);
			localStorage.removeItem("token");
			localStorage.removeItem("role");
			axios.defaults.headers.common["Authorization"] = null;
			navigate("/login"); // Redirect to login
		},
	};

	const contextValue = {
		role,
		setRole,
		token,
		setToken,
		api,
	};

	return (
		<AppContext.Provider value={contextValue}>
			{children}
		</AppContext.Provider>
	);
}

export default AppContext;
