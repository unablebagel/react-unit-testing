// This component calls a real API (FetchData in ../utils/services) inside a
// useEffect. Tests shouldn't hit a real network, so the module function is mocked
// instead - the component still calls FetchData, but gets fake data back instantly.
import { render, waitFor, screen } from "@testing-library/react";
import TestingAPICalls from "../components/TestingAPICalls";
import * as services from "../utils/services";

describe("TestingAPICalls component", () => {
  test("Fetch Data API Called", async () => {
    // jest.spyOn(...).mockImplementation(...) replaces the real FetchData with a
    // fake async function that resolves to canned data - the component under test
    // never actually calls fetch().
    const mockFetch = jest
      .spyOn(services, "FetchData")
      .mockImplementation(async () => {
        return [{ name: "kunal" }];
      });

    render(<TestingAPICalls />);

    // Confirms the component actually called the (mocked) API on mount.
    expect(mockFetch).toHaveBeenCalled();

    // The fetched data arrives asynchronously (it's set into state inside a
    // .then()), so the resulting text won't be in the DOM immediately after
    // render(). waitFor polls the callback until the assertion passes (or times
    // out) instead of asserting once, immediately, and failing on a race.
    await waitFor(() => {
      expect(screen.getByText(/kunal/i)).toBeInTheDocument();
    });
  });
});
