import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import ScheduleAppointment from "./ScheduleAppointment";
import { AuthContext } from "../../context/AuthContext";

// Mock axios
jest.mock("axios");

const mockUser = {
    username: "testpatient",
    password: "password",
    role: "PATIENT",
};

const mockDoctors = [
    { id: 1, name: "Dr. Smith" },
    { id: 2, name: "Dr. Jones" },
];

describe("ScheduleAppointment Component", () => {
    it("renders form elements correctly", () => {
        render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <ScheduleAppointment />
            </AuthContext.Provider>
        );

        expect(screen.getByText(/Schedule Appointment/i)).toBeInTheDocument();
        expect(screen.getByText(/Select Doctor/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Reason for appointment/i)).toBeInTheDocument();
        expect(screen.getByText(/Schedule Appointment/i)).toBeInTheDocument();
    });

    it("fetches and displays doctors", async () => {
        axios.get.mockResolvedValueOnce({ data: mockDoctors });

        render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <ScheduleAppointment />
            </AuthContext.Provider>
        );

        await waitFor(() => {
            expect(screen.getByText("Dr. Smith")).toBeInTheDocument();
            expect(screen.getByText("Dr. Jones")).toBeInTheDocument();
        });
    });

    it("handles errors while fetching doctors", async () => {
        axios.get.mockRejectedValueOnce(new Error("API Error"));

        render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <ScheduleAppointment />
            </AuthContext.Provider>
        );

        await waitFor(() => {
            expect(screen.queryByText("Dr. Smith")).not.toBeInTheDocument();
            expect(screen.queryByText("Dr. Jones")).not.toBeInTheDocument();
        });
    });

    it("schedules an appointment successfully", async () => {
        axios.get.mockResolvedValueOnce({ data: mockDoctors });
        axios.post.mockResolvedValueOnce({});

        render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <ScheduleAppointment />
            </AuthContext.Provider>
        );

        await waitFor(() => {
            fireEvent.change(screen.getByRole("combobox"), { target: { value: "Dr. Smith" } });
            fireEvent.change(screen.getByPlaceholderText(/Reason for appointment/i), {
                target: { value: "Routine checkup" },
            });
            fireEvent.change(screen.getByLabelText(/Date/), {
                target: { value: "2024-12-07T10:30" },
            });
        });

        fireEvent.click(screen.getByText(/Schedule Appointment/i));

        await waitFor(() => {
            expect(screen.getByText(/Appointment scheduled successfully!/i)).toBeInTheDocument();
        });
    });

    it("handles errors while scheduling an appointment", async () => {
        axios.get.mockResolvedValueOnce({ data: mockDoctors });
        axios.post.mockRejectedValueOnce({ response: { status: 500 } });

        render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <ScheduleAppointment />
            </AuthContext.Provider>
        );

        await waitFor(() => {
            fireEvent.change(screen.getByRole("combobox"), { target: { value: "Dr. Smith" } });
            fireEvent.change(screen.getByPlaceholderText(/Reason for appointment/i), {
                target: { value: "Routine checkup" },
            });
            fireEvent.change(screen.getByLabelText(/Date/), {
                target: { value: "2024-12-07T10:30" },
            });
        });

        fireEvent.click(screen.getByText(/Schedule Appointment/i));

        await waitFor(() => {
            expect(screen.getByText(/Failed to schedule appointment./i)).toBeInTheDocument();
        });
    });

    it("shows unauthorized error if user is not logged in", async () => {
        axios.post.mockRejectedValueOnce({ response: { status: 401 } });

        render(
            <AuthContext.Provider value={{ user: mockUser }}>
                <ScheduleAppointment />
            </AuthContext.Provider>
        );

        fireEvent.click(screen.getByText(/Schedule Appointment/i));

        await waitFor(() => {
            expect(screen.getByText(/Unauthorized. Please log in./i)).toBeInTheDocument();
        });
    });
});
