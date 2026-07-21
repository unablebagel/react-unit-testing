// This component renders different markup depending on the `displayUnorderedList`
// prop (an <ul> vs an <ol>), so each branch gets its own test - one render per
// possible prop combination is the standard way to cover conditional JSX.
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TestWithMockDataWithBranching from "../components/TestWithMockDataWithBranching";
import { mockData } from "../App";

describe("TestWithMockDataWithBranching component", () => {
  // Branch 1: displayUnorderedList = true -> <ul> path
  test("List renders successfully", () => {
    render(
      <TestWithMockDataWithBranching
        data={mockData}
        displayUnorderedList={true}
      />
    );

    expect(screen.getByText(/fletcher/i)).toBeInTheDocument();
  });

  // Branch 2: displayUnorderedList = false -> <ol> path
  test("Ordered list renders", () => {
    render(
      <TestWithMockDataWithBranching
        data={mockData}
        displayUnorderedList={false}
      />
    );

    expect(screen.getByText(/McVanamy/i)).toBeInTheDocument();
  });

  // Interaction test: simulate a real user click and check the *callback* fired,
  // rather than checking any visual result. jest.fn() creates a fake function whose
  // calls are recorded, so passing it in as a prop lets the test spy on whether the
  // component actually invoked it.
  test("Email link click handler called", async () => {
    const mockFn = jest.fn();

    render(
      <TestWithMockDataWithBranching
        data={mockData}
        displayUnorderedList={true}
        handleClick={mockFn}
      />
    );

    // userEvent simulates a real browser click (as opposed to fireEvent, which
    // dispatches a raw DOM event). This project's @testing-library/user-event
    // version (v13) is actually synchronous - click() doesn't return a real
    // promise - but `await` is harmless here and future-proofs against upgrading
    // to v14+, where click() genuinely is async and must be awaited.
    await userEvent.click(screen.getByText(/mmcvanamy0@e-recht24.de/i));
    expect(mockFn).toHaveBeenCalled();
  });
});
