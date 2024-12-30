import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import ForgotPassword from "./ForgotPassword";

// Mock axios
jest.mock("axios");

describe("ForgotPassword Component", () => {
    it("renders form elements correctly", () => {
        render(<ForgotPassword />);

        expect(screen.getByText(/Forgot Password/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter your email/i)).toBeInTheDocument();
        expect(screen.getByText(/Send Reset Link/i)).toBeInTheDocument();
    });

    it("submits email and shows success message", async () => {
        const mockSuccessResponse = "Reset link sent successfully!";
        axios.post.mockResolvedValueOnce({ data: mockSuccessResponse });

        render(<ForgotPassword />);

        fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
            target: { value: "testuser@example.com" },
        });
        fireEvent.click(screen.getByText(/Send Reset Link/i));

        await waitFor(() => {
            expect(screen.getByText(mockSuccessResponse)).toBeInTheDocument();
        });
    });

    it("handles error response correctly", async () => {
        const mockErrorResponse = "Email not found!";
        axios.post.mockRejectedValueOnce({ response: { data: mockErrorResponse } });

        render(<ForgotPassword />);

        fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
            target: { value: "wrongemail@example.com" },
        });
        fireEvent.click(screen.getByText(/Send Reset Link/i));

        await waitFor(() => {
            expect(screen.getByText(mockErrorResponse)).toBeInTheDocument();
        });
    });

    it("displays a default error message if no specific error is returned", async () => {
        axios.post.mockRejectedValueOnce({ response: { data: "" } });

        render(<ForgotPassword />);

        fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
            target: { value: "testuser@example.com" },
        });
        fireEvent.click(screen.getByText(/Send Reset Link/i));

        await waitFor(() => {
            expect(screen.getByText(/Error occurred. Please try again./i)).toBeInTheDocument();
        });
    });

    it("does not submit if the email is empty", async () => {
        render(<ForgotPassword />);

        fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), {
            target: { value: "" },
        });
        fireEvent.click(screen.getByText(/Send Reset Link/i));

        await waitFor(() => {
            expect(screen.queryByText(/Reset link sent successfully!/i)).not.toBeInTheDocument();
        });
    });
});
