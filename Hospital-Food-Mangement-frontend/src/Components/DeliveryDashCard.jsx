/* eslint-disable react/prop-types */
import { Clock, User, MapPin, Phone, FileText } from "lucide-react";
import { useEffect, useState } from "react";

const DeliveryCard = ({ delivery, onStatusChange }) => {
	const [currentStatus, setCurrentStatus] = useState(
		delivery.status.toLowerCase()
	);

	const handleStatusChange = (event) => {
		const newStatus = event.target.value;
		setCurrentStatus(newStatus);
		if (onStatusChange) {
			onStatusChange();
		}
	};

	const statusColors = {
		pending: "text-amber-600 bg-amber-50 border-amber-200",
		"in-progress": "text-blue-600 bg-blue-50 border-blue-200",
		completed: "text-emerald-600 bg-emerald-50 border-emerald-200",
	};

	useEffect(() => {
		setCurrentStatus(delivery.status.toLowerCase());
	}, [delivery]);

	return (
		<div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
			<div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
				{/* Left Column */}
				<div className="p-6">
					{/* Status Section */}
					<div className="mb-6">
						<h4 className="text-sm font-medium text-gray-600 mb-3">
							Delivery Status
						</h4>
						<div className="flex flex-col sm:flex-row items-center gap-3">
							<select
								value={currentStatus}
								onChange={handleStatusChange}
								className="flex-grow px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
							>
								<option value="pending">Pending</option>
								<option value="in-progress">In Progress</option>
								<option value="completed">Completed</option>
							</select>
							<span
								className={`px-3 py-1 text-sm rounded-full border ${statusColors[currentStatus]}`}
							>
								{currentStatus.charAt(0).toUpperCase() +
									currentStatus.slice(1)}
							</span>
						</div>
					</div>

					{/* Meal Details */}
					<div className="bg-blue-50 rounded-lg p-4">
						<div className="flex items-center space-x-2 mb-4">
							<Clock className="h-4 w-4 text-blue-600" />
							<h4 className="font-medium text-blue-800">
								Meal Information
							</h4>
						</div>
						<div className="space-y-3">
							<div className="flex items-center justify-between text-sm">
								<span className="text-gray-600">
									Scheduled Time:
								</span>
								<span className="text-gray-800 font-medium">
									{delivery.meal.mealTime}
								</span>
							</div>
							<div className="text-sm">
								<p className="text-gray-600 mb-1">
									Instructions:
								</p>
								<p className="text-gray-800 bg-white p-2 rounded border border-blue-100">
									{delivery.meal.Instructions}
								</p>
							</div>
							<div className="text-sm">
								<p className="text-gray-600 mb-2">
									Ingredients:
								</p>
								<div className="flex flex-wrap gap-2">
									{delivery.meal.Ingredients.map(
										(ingredient, index) => (
											<span
												key={index}
												className="bg-white px-2 py-1 rounded-full text-gray-700 border border-blue-100 text-sm"
											>
												{ingredient}
											</span>
										)
									)}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Right Column */}
				<div className="p-6 space-y-6">
					{/* Patient Information */}
					<div className="bg-gray-50 rounded-lg p-4">
						<div className="flex items-center space-x-2 mb-4">
							<User className="h-4 w-4 text-gray-600" />
							<h4 className="font-medium text-gray-800">
								Patient Details
							</h4>
						</div>
						<div className="space-y-3 text-sm flex flex-col items-center">
							<div className="flex items-center space-x-2">
								<span className="text-gray-600">Name:</span>
								<span className="font-medium text-gray-800">
									{delivery.meal.patient.name}
								</span>
							</div>
							<div className="flex  sm:flex-col lg:flex-row gap-3  items-center">
									<MapPin className="h-4 w-4 text-gray-500" />
								<div className="flex items-center space-x-2">
									<span className="text-gray-600">Room:</span>
									<span className="font-medium text-gray-800 bg-white px-2 py-1 rounded border border-gray-200">
										{delivery.meal.patient.roomNumber}
									</span>
								</div>
								<div className="flex items-center space-x-2">
									<span className="text-gray-600">Bed:</span>
									<span className="font-medium text-gray-800 bg-white px-2 py-1 rounded border border-gray-200">
										{delivery.meal.patient.bedNumber}
									</span>
								</div>
							</div>
							<div className="flex flex-wrap items-center space-x-2">
								<Phone className="h-4 w-4 text-gray-500" />
								<span className="text-gray-600">Contact:</span>
								<span className="font-medium text-gray-800">
									{delivery.meal.patient.contactInfo}
								</span>
							</div>
						</div>
					</div>

					{/* Notes Section */}
					{delivery.notes && (
						<div className="bg-amber-50 rounded-lg p-4">
							<div className="flex items-center space-x-2 mb-2">
								<FileText className="h-4 w-4 text-amber-600" />
								<h4 className="font-medium text-amber-800">
									Delivery Notes
								</h4>
							</div>
							<p className="text-sm text-gray-700">
								{delivery.notes}
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default DeliveryCard;
