// src/components/appointments/AppointmentList.test.js
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import AppointmentList from "./AppointmentList";
import { act } from "react-dom/test-utils";

// Mock axios
jest.mock("axios");

afterEach(() => {
    jest.clearAllMocks();
});

describe("AppointmentList Component", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("renders the heading", () => {
        render(<AppointmentList />);
        const heading = screen.getByText(/Your Appointments/i);
        expect(heading).toBeInTheDocument();
    });

    test("fetches and displays appointments on successful API call", async () => {
        const mockAppointments = [
            { id: 1, doctor: { name: "Dr. Smith" }, appointmentTime: "2024-12-10T10:00:00" },
            { id: 2, doctor: { name: "Dr. Brown" }, appointmentTime: "2024-12-11T14:00:00" },
        ];

        axios.get.mockResolvedValueOnce({ data: mockAppointments });

        render(<AppointmentList />);

        // Wait for the appointments to appear
        await waitFor(() => {
            expect(screen.getByText(/Dr. Smith/i)).toBeInTheDocument();
            expect(screen.getByText(/Dr. Brown/i)).toBeInTheDocument();
            expect(screen.getByText(/2024-12-10T10:00:00/i)).toBeInTheDocument();
            expect(screen.getByText(/2024-12-11T14:00:00/i)).toBeInTheDocument();
        });

        // Check API call was made
        expect(axios.get).toHaveBeenCalledWith("http://localhost:8080/api/appointments/user/john_doe");
    });

    test("displays error message on failed API call", async () => {
        axios.get.mockRejectedValueOnce(new Error("Error fetching appointments"));

        render(<AppointmentList />);

        // Wait for any side-effects to complete
        await act(async () => { });

        // Console.error mock validation (optional)
        expect(console.error).toHaveBeenCalledWith(
            "Error fetching appointments",
            expect.any(Error)
        );
    });
});
