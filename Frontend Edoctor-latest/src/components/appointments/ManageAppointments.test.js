import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import ManageAppointments from "./ManageAppointments";
import { AuthContext } from "../../context/AuthContext";

// Mock axios
jest.mock("axios");

const mockUser = {
    username: "testuser",
    password: "password",
    role: "DOCTOR", // Change to "PATIENT" to test patient views
};

const mockAppointments = [
    {
        id: 1,
        user: { username: "patient1" },
        doctor: { name: "Dr. Smith" },
        appointmentTime: "2024-12-07T10:30:00Z",
        status: "PENDING",
    },
];

describe("ManageAppointments Component", () => {
    it("renders loading message when user is not logged in", () => {
        render(
            <AuthContext.Provider value={{ user: null }}>
                <ManageAppointments />
            </AuthContext.Provider>
        );

        expect(screen.getByText(/Loading... Please log in to view appointments./i)).toBeInTheDocument();
    });

    it("fetches and displays appointments for a doctor", async () => {
        axios.get.mockResolvedValueOnce({ data: mockAppointments });

        render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <ManageAppointments />
            </AuthContext.Provider>
        );

        await waitFor(() => {
            expect(screen.getByText(/patient1/i)).toBeInTheDocument();
            expect(screen.getByText(/Dr. Smith/i)).toBeInTheDocument();
            expect(screen.getByText(/10:30 AM/i)).toBeInTheDocument(); // Adjust time format as necessary
            expect(screen.getByText(/PENDING/i)).toBeInTheDocument();
        });
    });

    it("handles confirm action correctly", async () => {
        axios.get.mockResolvedValueOnce({ data: mockAppointments });
        axios.post.mockResolvedValueOnce({});

        render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <ManageAppointments />
            </AuthContext.Provider>
        );

        await waitFor(() => expect(screen.getByText(/Confirm/i)).toBeInTheDocument());

        fireEvent.click(screen.getByText(/Confirm/i));

        await waitFor(() => {
            expect(screen.getByText(/Appointment confirmed!/i)).toBeInTheDocument();
        });
    });

    it("handles reject action correctly", async () => {
        axios.get.mockResolvedValueOnce({ data: mockAppointments });
        axios.post.mockResolvedValueOnce({});

        render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <ManageAppointments />
            </AuthContext.Provider>
        );

        await waitFor(() => expect(screen.getByText(/Reject/i)).toBeInTheDocument());

        fireEvent.click(screen.getByText(/Reject/i));

        await waitFor(() => {
            expect(screen.getByText(/Appointment rejected!/i)).toBeInTheDocument();
        });
    });

    it("displays an error message on API failure", async () => {
        axios.get.mockRejectedValueOnce(new Error("API Error"));

        render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <ManageAppointments />
            </AuthContext.Provider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Failed to fetch appointments/i)).toBeInTheDocument();
        });
    });
});
