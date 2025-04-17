// src/App.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom"; // Make sure BrowserRouter is imported
import App from "./App";

test("renders learn react link", () => {
  render(
    <BrowserRouter>
      {" "}
      {/* Wrap the component with BrowserRouter */}
      <App />
    </BrowserRouter>
  );
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
