import { render, screen } from "@testing-library/react";
import { format } from "date-fns";
import { SentMessage } from "./SentMessage";

describe("SentMessage", () => {
  const renderSentMessage = (): { message: string; timestamp: number } => {
    const message = "Hello World";
    const timestamp = new Date().getTime();
    render(<SentMessage message={message} timestamp={timestamp} />);

    return { message, timestamp };
  };

  test("renders message", () => {
    const { message } = renderSentMessage();
    const element = screen.getByText(message);
    expect(element).toBeInTheDocument();
  });

  test("renders timestamp", () => {
    const { timestamp } = renderSentMessage();
    const element = screen.getByText(format(new Date(timestamp), "HH:mm:ss"));
    expect(element).toBeInTheDocument();
  });
});
