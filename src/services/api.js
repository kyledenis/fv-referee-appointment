import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Create axios instance with default config
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Auth endpoints
export const authService = {
    login: (credentials) => api.post("/auth/login/", credentials),
    register: (userData) => api.post("/auth/register/", userData),
    logout: () => api.post("/auth/logout/"),
    getCurrentUser: () => api.get("/auth/current-user/"),
};

// Referee endpoints
export const refereeService = {
    getRefereeProfile: async (id) => {
        try {
            const response = await api.get(`/referee/${id}/`);
            return response.data;
        } catch (error) {
            throw new Error(
                error.response?.data?.error ||
                    "Failed to fetch referee profile",
            );
        }
    },
    updateRefereeProfile: (id, data) => api.put(`/referee/${id}/`, data),
    getAllReferees: async () => {
        try {
            const response = await api.get("/referee/");

            // Ensure we always return an array
            return {
                data: Array.isArray(response.data)
                    ? response.data
                    : response.data?.results
                    ? response.data.results
                    : [],
            };
        } catch (error) {
            console.error("Error fetching referees:", error);
            throw new Error(
                error.response?.data?.error || "Failed to fetch referees",
            );
        }
    },
    getRefereesByFilters: (filters) => {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.append(key, value);
            }
        });

        return api.get(`/referee/filter/?${params.toString()}`);
    },
};

// Appointment endpoints
export const appointmentService = {
    getAllAppointments: async (page = 1) => {
        try {
            const response = await api.get("/appointments/", {
                params: {
                    page,
                    page_size: 20,
                    ordering: "-appointment_date,appointment_time",
                },
                timeout: 15000, // 15 seconds
            });

            // Handle both paginated and non-paginated responses
            const appointments = response.data.results || response.data;
            const count = response.data.count || appointments.length;

            return {
                data: Array.isArray(appointments) ? appointments : [],
                meta: {
                    count: count,
                    next: response.data.next,
                    previous: response.data.previous,
                    current_page: page,
                    total_pages: Math.ceil(count / 20),
                },
            };
        } catch (error) {
            console.error("Appointment fetch error:", error);
            throw new Error(
                error.response?.data?.error || "Failed to fetch appointments",
            );
        }
    },

    getAppointment: async (id) => {
        try {
            const response = await api.get(`/appointments/${id}/`);
            return response.data;
        } catch (error) {
            throw new Error(
                error.response?.data?.error ||
                    "Failed to fetch appointment details",
            );
        }
    },

    createAppointment: async (appointmentData) => {
        try {
            // Format data for submission
            const formattedData = {
                appointment_id: appointmentData.appointment_id,
                referee: appointmentData.referee,
                venue: appointmentData.venue,
                match: appointmentData.match,
                appointment_date: appointmentData.appointment_date,
                // Add null check for appointment_time
                appointment_time: appointmentData.appointment_time
                    ? appointmentData.appointment_time.includes(":")
                        ? appointmentData.appointment_time
                        : `${appointmentData.appointment_time}:00`
                    : "00:00:00", // Default time if null
                status: "upcoming",
                distance: appointmentData.distance || 0,
            };

            console.log(
                "Submitting formatted appointment data:",
                formattedData,
            );

            const response = await api.post("/appointments/", formattedData);
            return response.data;
        } catch (error) {
            console.error("Appointment creation error:", error);
            console.error("Error response:", error.response?.data);

            // Improve error handling
            let errorMessage = "Failed to create appointment";

            if (error.response?.data) {
                if (typeof error.response.data === "string") {
                    errorMessage = error.response.data;
                } else if (error.response.data.error) {
                    errorMessage = error.response.data.error;
                } else if (error.response.data.detail) {
                    errorMessage = error.response.data.detail;
                }
            }

            throw new Error(errorMessage);
        }
    },

    updateAppointment: async (appointmentId, data) => {
        try {
            console.log('Updating appointment:', appointmentId, 'with data:', data);

            // Format the data to match backend expectations
            const formattedData = {
                appointment_id: appointmentId,
                referee: data.referee,
                venue: data.venue,
                match: data.match,
                status: data.status,
                decline_reason: data.decline_reason,
                appointment_date: data.appointment_date,
                appointment_time: data.appointment_time,
                distance: data.distance || 0
            };

            const response = await api.put(`/appointments/${appointmentId}/`, formattedData);
            return response;
        } catch (error) {
            console.error('Error updating appointment:', error);
            console.error('Error response:', error.response?.data);

            // Enhance error handling
            const errorMessage = error.response?.data?.detail ||
                               error.response?.data?.error ||
                               'An error occurred while updating the appointment';

            throw new Error(errorMessage);
        }
    },

    deleteAppointment: async (id) => {
        try {
            await api.delete(`/appointments/${id}/`);
        } catch (error) {
            throw new Error(
                error.response?.data?.error || "Failed to delete appointment",
            );
        }
    },
};

// Availability endpoints
export const availabilityService = {
    getAvailability: (refereeId) =>
        api.get(`/availability/?referee=${refereeId}`),
    updateAvailability: (refereeId, data) =>
        api.post(`/availability/`, {
            referee: refereeId,
            ...data,
        }),
    getAvailableDates: (refereeId) =>
        api.get(`/availability/dates/?referee=${refereeId}`),
    getUnavailableDates: (refereeId) =>
        api.get(`/availability/unavailable/?referee=${refereeId}`),
};

// Venue endpoints
export const venueService = {
    getAllVenues: async () => {
        try {
            const response = await api.get("/venues/");

            // Ensure we always return an array
            return {
                data: Array.isArray(response.data)
                    ? response.data
                    : response.data?.results
                    ? response.data.results
                    : [],
            };
        } catch (error) {
            console.error("Error fetching venues:", error);
            throw new Error(
                error.response?.data?.error || "Failed to fetch venues",
            );
        }
    },
    getVenue: async (id) => {
        try {
            const response = await api.get(`/venues/${id}/`);
            return response.data;
        } catch (error) {
            throw new Error(
                error.response?.data?.error || "Failed to fetch venue",
            );
        }
    },
    createVenue: (data) => api.post("/venues/", data),
    updateVenue: (id, data) => api.put(`/venues/${id}/`, data),
    deleteVenue: (id) => api.delete(`/venues/${id}/`),
};

// Team endpoints
export const teamService = {
    getAllTeams: () => api.get("/teams/"),
    getTeam: (id) => api.get(`/teams/${id}/`),
    createTeam: (data) => api.post("/teams/", data),
    updateTeam: (id, data) => api.put(`/teams/${id}/`, data),
    deleteTeam: (id) => api.delete(`/teams/${id}/`),
};

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("authToken");
            window.location.href = "/login";
        }

        // Format error message
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "An error occurred";

        // Enhance error object
        error.userMessage = errorMessage;
        return Promise.reject(error);
    },
);

export default api;

export const matchService = {
    getAllMatches: async () => {
        try {
            const response = await api.get("/matches/");
            return {
                data: Array.isArray(response.data)
                    ? response.data
                    : response.data?.results
                    ? response.data.results
                    : [],
            };
        } catch (error) {
            console.error("Error fetching matches:", error);
            throw new Error(
                error.response?.data?.error || "Failed to fetch matches",
            );
        }
    },

    getMatch: async (id) => {
        try {
            const response = await api.get(`/matches/${id}/`, {
                timeout: 5000, // 5 second timeout
            });
            return response.data;
        } catch (error) {
            if (error.code === "ECONNABORTED") {
                throw new Error("Request timed out - please try again");
            }
            throw new Error(
                error.response?.data?.error || "Failed to fetch match details",
            );
        }
    },

    // Get matches that don't have appointments yet
    getAvailableMatches: async () => {
        try {
            const response = await api.get("/matches/available/");
            return {
                data: Array.isArray(response.data)
                    ? response.data
                    : response.data?.results
                    ? response.data.results
                    : [],
            };
        } catch (error) {
            console.error("Error fetching available matches:", error);
            throw new Error(
                error.response?.data?.error ||
                    "Failed to fetch available matches",
            );
        }
    },

    // Get matches for a specific venue
    getMatchesByVenue: async (venueId) => {
        try {
            const response = await api.get(`/matches/venue/${venueId}/`);
            return {
                data: Array.isArray(response.data)
                    ? response.data
                    : response.data?.results
                    ? response.data.results
                    : [],
            };
        } catch (error) {
            throw new Error(
                error.response?.data?.error || "Failed to fetch venue matches",
            );
        }
    },

    // Get matches for a specific date range
    getMatchesByDateRange: async (startDate, endDate) => {
        try {
            const response = await api.get("/matches/", {
                params: {
                    start_date: startDate,
                    end_date: endDate,
                },
            });
            return {
                data: Array.isArray(response.data)
                    ? response.data
                    : response.data?.results
                    ? response.data.results
                    : [],
            };
        } catch (error) {
            throw new Error(
                error.response?.data?.error ||
                    "Failed to fetch matches for date range",
            );
        }
    },
};
