// Tests for a component whose UI changes purely from internal useState, triggered
// by button clicks - no API calls involved. The recurring pattern in every test
// below is: render -> click (the "action") -> waitFor (the "reaction").
//
// IMPORTANT: the click and the waitFor are two separate statements, not one nested
// inside the other. waitFor exists to poll an *assertion* until a state update has
// propagated to the DOM - it is not a helper for "do this, then wait a bit".
// Putting the click itself inside waitFor's callback (as this file originally did)
// trips the `testing-library/no-wait-for-side-effects` ESLint rule, because
// waitFor's callback can be invoked more than once, which would fire the click
// repeatedly instead of once.
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TestingStateChange from "../components/TestingStateChange";

describe("TestingStateChange Component", () => {
  // No interaction here - just proves the component's initial useEffect
  // (setLoaded(true)) ran and the "Page Loaded" text is showing.
  test("Testing state change", () => {
    render(<TestingStateChange />);

    expect(screen.getByText(/page loaded/i)).toBeInTheDocument();
  });

  test("Testing state change on button click", async () => {
    render(<TestingStateChange />);

    // Action: click happens once, synchronously, outside of waitFor.
    userEvent.click(screen.getByText(/toggle text/i));

    // Reaction: wait for the re-render caused by that click's state update.
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

    // Baseline assertion before the action, so the later assertion (4) actually
    // proves something changed, instead of just proving the end state exists.
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
