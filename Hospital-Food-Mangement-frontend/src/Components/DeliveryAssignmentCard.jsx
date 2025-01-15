import React from 'react';
import { Clock, User, MapPin, AlertCircle, Utensils } from 'lucide-react';

const DeliveryAssignmentCard = ({ task, deliveryStaff, handleAssignDelivery }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
        {/* Left Column - Patient and Meal Info */}
        <div className="space-y-4 flex-grow">
          {/* Patient Header */}
          <div className="flex items-start justify-between border-b pb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {task.meal.patient.name}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <User size={16} />
                <span>{task.meal.patient.gender}, {task.meal.patient.age} years</span>
              </div>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {task.meal.mealTime}
            </span>
          </div>

          {/* Location Info */}
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-gray-400 mt-1" />
            <div className="space-y-1">
              <h3 className="font-medium text-gray-900">Location Details</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Room: {task.meal.patient.roomNumber}, Bed: {task.meal.patient.bedNumber}</p>
                <p>Floor: {task.meal.patient.floorNumber}</p>
                <p>Address: {task.meal.patient.address}</p>
              </div>
            </div>
          </div>

          {/* Meal Info */}
          <div className="flex items-start gap-3">
            <Utensils className="h-5 w-5 text-gray-400 mt-1" />
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Meal Information</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Ingredients:</span> {task.meal.Ingredients.join(', ')}</p>
                <p><span className="font-medium">Instructions:</span> {task.meal.Instructions}</p>
                <p><span className="font-medium">Meal ID:</span> {task.mealId}</p>
              </div>
            </div>
          </div>

          {/* Medical Info */}
          {(task.meal.patient.allergies?.length > 0 || task.meal.patient.diseases?.length > 0) && (
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-1" />
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Medical Information</h3>
                <div className="space-y-2">
                  {task.meal.patient.allergies?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {task.meal.patient.allergies.map((allergy, index) => (
                        <span key={index} className="px-2 py-1 bg-red-50 text-red-700 text-sm rounded-full">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  )}
                  {task.meal.patient.diseases?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {task.meal.patient.diseases.map((disease, index) => (
                        <span key={index} className="px-2 py-1 bg-yellow-50 text-yellow-700 text-sm rounded-full">
                          {disease}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Notes if any */}
          {task.notes && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm text-gray-600">
              <p className="font-medium mb-1">Delivery Notes:</p>
              <p>{task.notes}</p>
            </div>
          )}
        </div>

        {/* Right Column - Assignment Controls */}
        <div className="flex flex-col items-start lg:items-end gap-3">
          <select
            className="w-full lg:w-64 p-2 border rounded-md text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => handleAssignDelivery(e.target.value, task.mealId, task.id)}
          >
            <option value="">Assign Delivery Staff</option>
            {deliveryStaff.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.name} (Location: {staff.currentLocation})
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock size={16} />
            <span>Created: {new Date(task.meal.createdAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAssignmentCard;