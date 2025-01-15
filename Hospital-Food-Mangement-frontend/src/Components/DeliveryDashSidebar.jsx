/* eslint-disable react/prop-types */
import { User } from "lucide-react";

const DeliveryDashSidebar = ({ personnelDetails, onLogout }) => {
	return (
		<div className="flex flex-col h-full bg-white">
			<div className="p-6">
				<div className="flex flex-col items-center mb-6">
					<div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-3">
						<User className="h-10 w-10 text-white" />
					</div>
					<h2 className="text-lg font-medium text-gray-800">
						{personnelDetails.name}
					</h2>
					<p className="text-sm text-gray-500">Delivery Personnel</p>
				</div>

				<div className="space-y-4">
					<div className="space-y-1">
						<label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
							Email
						</label>
						<p className="text-sm text-gray-700">
							{personnelDetails.email}
						</p>
					</div>
					<div className="space-y-1">
						<label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
							Contact
						</label>
						<p className="text-sm text-gray-700">
							{personnelDetails.contactInfo}
						</p>
					</div>
				</div>
			</div>

			<div className="mt-auto p-6 border-t border-gray-200">
				<button
					onClick={onLogout}
					className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 px-4 transition-colors duration-200"
				>
					Logout
				</button>
			</div>
		</div>
	);
};

export default DeliveryDashSidebar;
