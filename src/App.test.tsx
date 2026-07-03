import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders Afro90s branding in header", () => {
    render(<App />);
    expect(screen.getByRole("navigation")).toHaveTextContent("AFRO90s");
    expect(screen.getByRole("button", { name: "Óculos" })).toBeInTheDocument();
  });
});
