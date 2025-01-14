import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "@material-tailwind/react";
import { BrowserRouter } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
	<BrowserRouter
		future={{
			v7_startTransition: true,
			v7_relativeSplatPath: true,
		}}
	>
		<ThemeProvider>
			<AppContextProvider>
				<App />
				<Toaster
					position="top-center"
					toastOptions={{
						style: {
							zIndex: 9999, // Ensure this is higher than the dialog
						},
					}}
				/>
			</AppContextProvider>
		</ThemeProvider>
	</BrowserRouter>
);
