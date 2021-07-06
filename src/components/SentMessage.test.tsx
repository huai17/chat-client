import { render, screen } from "@testing-library/react";
import { format } from "date-fns";
import { SentMessage } from "./SentMessage";

describe("SentMessage", () => {
  test("renders message", () => {
    const message = "Name";
    const timestamp = new Date().getTime();
    render(<SentMessage message={message} timestamp={timestamp} />);
    const element = screen.getByText(message);
    expect(element).toBeInTheDocument();
  });

  test("renders timestamp", () => {
    const message = "Name";
    const timestamp = new Date().getTime();
    render(<SentMessage message={message} timestamp={timestamp} />);
    const element = screen.getByText(format(new Date(timestamp), "HH:mm:ss"));
    expect(element).toBeInTheDocument();
  });
});
