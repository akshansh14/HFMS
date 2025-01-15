import { User, Mail, Phone, Clock, MapPin, LogOut } from "lucide-react";

const InfantryDashSidebar = ({ staffDetails, handleLogout }) => (
  <div className="flex flex-col h-full bg-white">
    {/* Profile Section */}
    <div className="p-6 border-b border-gray-100">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
          <User className="h-12 w-12 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">
          {staffDetails.name}
        </h2>
        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mt-2">
          {staffDetails.role}
        </span>
      </div>
    </div>

    {/* Info Section */}
    <div className="p-6 flex-grow">
      <div className="space-y-6">
        {/* Email */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
            <Mail className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Email</p>
            <p className="text-sm text-gray-900">{staffDetails.email}</p>
          </div>
        </div>

        {/* Contact */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
            <Phone className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Contact</p>
            <p className="text-sm text-gray-900">{staffDetails.contactInfo}</p>
          </div>
        </div>

        {/* Shift */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
            <Clock className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Shift</p>
            <p className="text-sm text-gray-900">{staffDetails.shift}</p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
            <MapPin className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Location</p>
            <p className="text-sm text-gray-900">{staffDetails.location}</p>
          </div>
        </div>
      </div>
    </div>

    {/* Logout Section */}
    <div className="p-6 border-t border-gray-100">
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-all duration-200 group"
      >
        <LogOut className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
        <span className="font-medium">Sign Out</span>
      </button>
    </div>
  </div>
);

export default InfantryDashSidebar;