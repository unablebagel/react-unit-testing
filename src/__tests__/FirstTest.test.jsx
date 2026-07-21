// Simplest possible RTL (React Testing Library) test shape:
// 1. render()  - mounts the component into a virtual DOM (jsdom)
// 2. query     - find an element the way a user would (by visible text, role, etc.)
// 3. expect()  - assert something about what was found
import { render, screen } from "@testing-library/react";
import FirstTest from "../components/FirstTest";

describe("FirstTest Component", () => {
  test("First test render successfully", () => {
    render(<FirstTest />);

    // getByText throws if no match is found, so this line is itself a mini "did it
    // render" assertion even before the expect() below.
    const element = screen.getByText(/first test/i); // /i = case-insensitive regex match
    expect(element).toBeInTheDocument();
  });
});
