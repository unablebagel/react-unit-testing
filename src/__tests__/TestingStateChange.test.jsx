import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TestingStateChange from "../components/TestingStateChange";

describe("TestingStateChange Component", () => {
  test("Testing state change", () => {
    render(<TestingStateChange />);

    expect(screen.getByText(/page loaded/i)).toBeInTheDocument();
  });

  test("Testing state change on button click", async () => {
    render(<TestingStateChange />);

    userEvent.click(screen.getByText(/toggle text/i));

    await waitFor(() => {
      expect(screen.getByText(/text visible/i)).toBeInTheDocument();
    });
  });

  test("Testing disabled on button click", async () => {
    render(<TestingStateChange />);

    userEvent.click(screen.getByText(/toggle button disabled/i));

    await waitFor(() => {
      expect(screen.getByText(/toggle text/i)).toBeDisabled();
    });
  });

  test("Testing adding elements to list on button click", async () => {
    render(<TestingStateChange />);

    expect(screen.getAllByTestId('record').length).toBe(3);

    userEvent.click(screen.getByText(/add to list/i));

    await waitFor(() => {
      expect(screen.getAllByTestId('record').length).toBe(4);
    });
  });

  test("Testing removing elements from the list on button click", async () => {
    render(<TestingStateChange />);

    expect(screen.getAllByTestId('record').length).toBe(3);

    userEvent.click(screen.getByText(/remove from list/i));

    await waitFor(() => {
      expect(screen.getAllByTestId('record').length).toBe(2);
    });
  });

});
