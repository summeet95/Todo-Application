// __tests__/Login.test.jsx
jest.mock("axios");

import {React} from 'react'
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../Login";
import { rest } from "msw";
import { setupServer } from "msw/node";
import "@testing-library/jest-dom";

// ✅ Setup mock server
const server = setupServer(
  rest.post("http://localhost:5000/login", (req, res, ctx) => {
    const { email, password } = req.body;
    if (email === "test@example.com" && password === "password123") {
      return res(ctx.json({ success: true }));
    } else {
      return res(
        ctx.status(401),
        ctx.json({ success: false, message: "Invalid credentials" })
      );
    }
  })
);

// ✅ Enable API mocking before tests
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// ✅ Helper to wrap component in Router
const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

// ✅ Tests
describe("Login Component", () => {
  test("renders form inputs and login button", () => {
    renderWithRouter(<Login />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("allows typing into input fields", () => {
    renderWithRouter(<Login />);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  test("shows error on failed login", async () => {
    renderWithRouter(<Login />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() =>
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    );
  });

  test("redirects to /home on successful login", async () => {
    renderWithRouter(<Login />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/home");
    });
  });
});
