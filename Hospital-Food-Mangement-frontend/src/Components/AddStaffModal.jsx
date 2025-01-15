/* eslint-disable react/prop-types */
import { X } from "lucide-react";

export const AddStaffModal = ({
	setIsModalOpen,
	setNewStaff,
	newStaff,
	handleSaveStaff,
}) => {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 w-full max-w-md">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-semibold">
						Add New Staff Member
					</h2>
					<button
						onClick={() => setIsModalOpen(false)}
						className="text-gray-500 hover:text-gray-700"
					>
						<X className="w-6 h-6" />
					</button>
				</div>

				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Name
						</label>
						<input
							type="text"
							value={newStaff.name}
							onChange={(e) =>
								setNewStaff({
									...newStaff,
									name: e.target.value,
								})
							}
							className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							placeholder="Enter staff name"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Contact Info
						</label>
						<input
							type="text"
							value={newStaff.contactInfo}
							onChange={(e) =>
								setNewStaff({
									...newStaff,
									contactInfo: e.target.value,
								})
							}
							className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							placeholder="Enter contact number"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Email
						</label>
						<input
							type="email"
							value={newStaff.email}
							onChange={(e) =>
								setNewStaff({
									...newStaff,
									email: e.target.value,
								})
							}
							className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							placeholder="Enter email address"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Password
						</label>
						<input
							type="text"
							value={newStaff.password}
							onChange={(e) =>
								setNewStaff({
									...newStaff,
									password: e.target.value,
								})
							}
							className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							placeholder="Enter password"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Location
						</label>
						<input
							type="text"
							value={newStaff.location}
							onChange={(e) =>
								setNewStaff({
									...newStaff,
									location: e.target.value,
								})
							}
							className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							placeholder="Enter location"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Shift
						</label>
						<select
							value={newStaff.shift}
							onChange={(e) =>
								setNewStaff({
									...newStaff,
									shift: e.target.value,
								})
							}
							className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="MORNING">Morning</option>
							<option value="AFTERNOON">Afternoon</option>
							<option value="NIGHT">Evening</option>
						</select>
					</div>
				</div>

				<div className="mt-6 flex justify-end space-x-3">
					<button
						onClick={() => setIsModalOpen(false)}
						className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
					>
						Cancel
					</button>
					<button
						onClick={handleSaveStaff}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
					>
						Save Staff
					</button>
				</div>
			</div>
		</div>
	);
};
