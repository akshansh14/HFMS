import React from 'react';
import { Clock, User, MapPin, Phone, FileText } from 'lucide-react';

const DeliveryTaskCard = ({ task, handleStatusUpdate }) => {
  const statusColors = {
    'IN_PROGRESS': 'bg-orange-50 text-orange-700 border-orange-200',
    'COMPLETED': 'bg-green-50 text-green-700 border-green-200',
    'PENDING': 'bg-gray-50 text-gray-700 border-gray-200'
  };

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
                value={task.status}
                onChange={(e) => handleStatusUpdate(task.id, task.mealId, e.target.value)}
                className="flex-grow px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
              <span className={`px-3 py-1 text-sm rounded-full border ${statusColors[task.status]}`}>
                {task.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Meal Details */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="h-4 w-4 text-blue-600" />
              <h4 className="font-medium text-blue-800">Meal Information</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Scheduled Time:</span>
                <span className="text-gray-800 font-medium">{task.meal.mealTime}</span>
              </div>
              <div className="text-sm">
                <p className="text-gray-600 mb-1">Instructions:</p>
                <p className="text-gray-800 bg-white p-2 rounded border border-blue-100">
                  {task.meal.Instructions}
                </p>
              </div>
              <div className="text-sm">
                <p className="text-gray-600 mb-2">Ingredients:</p>
                <div className="flex flex-wrap gap-2">
                  {task.meal.Ingredients?.map((ingredient, index) => (
                    <span
                      key={index}
                      className="bg-white px-2 py-1 rounded-full text-gray-700 border border-blue-100 text-sm"
                    >
                      {ingredient}
                    </span>
                  ))}
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
              <h4 className="font-medium text-gray-800">Patient Details</h4>
            </div>
            <div className="space-y-3 text-sm flex flex-col items-center">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium text-gray-800">{task.meal.patient?.name}</span>
              </div>
              <div className="flex sm:flex-col lg:flex-row gap-3 items-center">
                <MapPin className="h-4 w-4 text-gray-500" />
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Room:</span>
                  <span className="font-medium text-gray-800 bg-white px-2 py-1 rounded border border-gray-200">
                    {task.meal.patient?.roomNumber}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Bed:</span>
                  <span className="font-medium text-gray-800 bg-white px-2 py-1 rounded border border-gray-200">
                    {task.meal.patient?.bedNumber}
                  </span>
                </div>
              </div>
              {task.meal.patient?.allergies && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-gray-600">Allergies:</span>
                  {task.meal.patient.allergies.map((allergy, index) => (
                    <span
                      key={index}
                      className="bg-red-50 px-2 py-1 rounded-full text-red-700 border border-red-100 text-sm"
                    >
                      {allergy}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Additional Notes Section */}
          {task.notes && (
            <div className="bg-amber-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="h-4 w-4 text-amber-600" />
                <h4 className="font-medium text-amber-800">Delivery Notes</h4>
              </div>
              <p className="text-sm text-gray-700">{task.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryTaskCard;