// Same render -> query -> assert shape as FirstTest, but this component needs a
// `data` prop to render anything, so a shared fixture (mockData, defined in App.jsx)
// is passed in directly instead of the component fetching real data.
import TestWithMockData from "../components/TestWithMockData";
import { mockData } from "../App";
import { render, screen } from "@testing-library/react";

describe("TestWithMockData component", () => {
  test("List render successfully", () => {
    render(<TestWithMockData data={mockData} />);

    // screen.logTestingPlaygroundURL();

    // Only checking for ONE known name from the mock list is enough to prove the
    // list actually rendered - no need to assert on every row.
    let element = screen.getByText(/fletcher/i);
    expect(element).toBeInTheDocument();
  });
});
