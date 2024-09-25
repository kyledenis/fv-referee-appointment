import React from "react";
import TitleWithBar from "./components/TitleWithBar";

const Dashboard = ({ appointments, handleUpdateAvailability }) => {
    return (
        <div>
            <TitleWithBar title="Upcoming Appointments" />
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="px-3 py-3 border-b-2 border-gray-400 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Competition
                        </th>
                        <th className="px-3 py-3 border-b-2 border-gray-400 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                        </th>
                        <th className="px-3 py-3 border-b-2 border-gray-400 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                        </th>
                        <th className="px-3 py-3 border-b-2 border-gray-400 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Time
                        </th>
                        <th className="px-3 py-3 border-b-2 border-gray-400 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Teams
                        </th>
                        <th className="px-3 py-3 border-b-2 border-gray-400 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Venue
                        </th>
                        <th className="px-3 py-3 border-b-2 border-gray-400 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-3 py-3 border-b-2 border-gray-400 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                            <td className="px-3 py-3 whitespace-no-wrap border-b border-gray-200 text-left">
                                {appointment.competition}
                            </td>
                            <td className="px-3 py-3 whitespace-no-wrap border-b border-gray-200 text-left">
                                {appointment.type}
                            </td>
                            <td className="px-3 py-3 whitespace-no-wrap border-b border-gray-200 text-left">
                                {appointment.date}
                            </td>
                            <td className="px-3 py-3 whitespace-no-wrap border-b border-gray-200 text-left">
                                {appointment.time}
                            </td>
                            <td className="px-3 py-3 whitespace-no-wrap border-b border-gray-200 text-left">
                                {appointment.teams}
                            </td>
                            <td className="px-3 py-3 whitespace-no-wrap border-b border-gray-200 text-left">
                                {appointment.venue}
                            </td>
                            <td className="px-3 py-3 whitespace-no-wrap border-b border-gray-200 text-left">
                                {appointment.status}
                            </td>
                            <td className="px-3 py-3 whitespace-no-wrap border-b border-gray-200">
                                <button className="text-blue-600 hover:text-blue-900">
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;
