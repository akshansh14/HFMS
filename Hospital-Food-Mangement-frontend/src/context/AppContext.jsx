/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode"; // Corrected import statement

// Initialize context with default values
const AppContext = createContext(null);

const BASE_URL = "http://localhost:7000"; // Update with your API base URL

export function AppContextProvider({ children }) {
	const [account, setAccount] = useState({});
	const [token, setToken] = useState(() => {
		return localStorage.getItem("token") || null;
	});

	useEffect(() => {
		if (token) {
			axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
			localStorage.setItem("token", token);

			// Decode the token and set the account when token changes
			try {
				const decodedToken = jwtDecode(token);
				setAccount(decodedToken);
			} catch (error) {
				console.error("Invalid token, unable to decode:", error);
				setAccount(null);
			}
		} else {
			delete axios.defaults.headers.common["Authorization"];
			localStorage.removeItem("token");
			setAccount(null);
		}
	}, [token]);

	// Configure axios instance
	const axiosInstance = axios.create({
		baseURL: BASE_URL,
		timeout: 5000,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});

	// Add response interceptor for error handling
	axiosInstance.interceptors.response.use(
		(response) => response,
		(error) => {
			if (error.response?.status === 401) {
				// Handle unauthorized access
				setToken(null);
				setAccount(null);
			}
			return Promise.reject(error);
		}
	);

	// API Functions
	const api = {
		login: async (data) => {
			try {
				const result = await axiosInstance.post("/api/login", data);

				// Retrieve token from response
				const userToken = result.data?.user.token;

				// Set token and decode account immediately
				setToken(userToken);

				const decodedToken = jwtDecode(userToken);
				setAccount(decodedToken);

				toast.success("Successfully logged in!");
				return result;
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

		createMeal: async (data) => {
			try {
				const response = await axiosInstance.post("/api/meals/:patientId", data);
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

		getDeliveryDetails: async () => {
			try {
				const response = await axiosInstance.get("/api/deliveryperson");
				return response.data;
			} catch (error) {
				throw new Error(
					error.response?.data?.message ||
						"Failed to fetch delivery details"
				);
			}
		},

		assignDelivery: async (data) => {
			try {
				const response = await axiosInstance.post(
					"/api/deliveries/assign",
					data
				);
				return response.data;
			} catch (error) {
				throw new Error(
					error.response?.data?.message || "Failed to assign delivery"
				);
			}
		},

		logout: () => {
			setToken(null);
			setAccount(null);
		},
	};

	const contextValue = {
		account,
		setAccount,
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
