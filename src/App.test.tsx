import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders Afro90s branding", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /afro/i })).toBeInTheDocument();
  });
});
