import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../context/AppContext";
import toast from "react-hot-toast";

const LoginComponent = () => {
	const { api } = useContext(AppContext); // Make sure `setAccount` is provided to update account state

	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null); // Reset error state

		const data = {
			email: formData.email?.trim(), // Ensure no leading/trailing spaces
			password: formData.password,
		};

		// Input validation
		if (!data.email || !data.password) {
			setError("Both email and password are required.");
			setIsLoading(false);
			return;
		}

		try {
			// Attempt to log in using the API
			await api.login(data);

			// Retrieve role from localStorage
			const role = localStorage.getItem("role");

			// Ensure a valid role is present
			if (!["ADMIN", "INFANTRY", "DELIVERY"].includes(role)) {
				throw new Error("Invalid role detected. Redirecting to login.");
			}

			// Navigate based on role
			switch (role) {
				case "ADMIN":
					navigate("/MD");
					break;
				case "INFANTRY":
					navigate("/ID");
					break;
				case "DELIVERY":
					navigate("/DD");
					break;
				default:
					// Unexpected case fallback
					throw new Error(
						"Unhandled role detected. Redirecting to login."
					);
			}
		} catch (error) {
			// Log the error for debugging
			toast.error(error);
		} finally {
			// Always reset loading state
			setIsLoading(false);
		}
	};

	return (
		<section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
			<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
				<div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
					<div className="p-6 flex flex-col space-y-4 md:space-y-6 sm:p-8">
						<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
							Sign in to your account
						</h1>

						{/* Display any error messages */}
						{error && (
							<div className="text-red-500 text-sm mb-4">
								{error}
							</div>
						)}

						<form
							onSubmit={handleSubmit}
							className="space-y-4 md:space-y-6"
						>
							<div>
								<label
									htmlFor="email"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									Email address
								</label>
								<input
									type="email"
									name="email"
									id="email"
									value={formData.email}
									onChange={handleChange}
									className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors"
									placeholder="name@company.com"
									required
								/>
							</div>

							<div>
								<label
									htmlFor="password"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									Password
								</label>
								<input
									type="password"
									name="password"
									id="password"
									value={formData.password}
									onChange={handleChange}
									placeholder="••••••••"
									className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-colors"
									required
								/>
							</div>

							<button
								type="submit"
								disabled={isLoading}
								className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							>
								{isLoading ? (
									<div className="flex items-center justify-center">
										<svg
											className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											></circle>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
										Signing in...
									</div>
								) : (
									"Log in"
								)}
							</button>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
};

export default LoginComponent;
