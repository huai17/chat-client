import { render, screen } from "@testing-library/react";
import { format } from "date-fns";
import { ReceivedMessage } from "./ReceivedMessage";

describe("ReceivedMessage", () => {
  const renderReceivedMessage = (): {
    name: string;
    message: string;
    timestamp: number;
  } => {
    const name = "Name";
    const left = false;
    const message = "Hello World";
    const timestamp = new Date().getTime();
    render(
      <ReceivedMessage
        name={name}
        left={left}
        message={message}
        timestamp={timestamp}
      />
    );

    return { name, message, timestamp };
  };

  test("renders message", () => {
    const { message } = renderReceivedMessage();
    const element = screen.getByText(message);
    expect(element).toBeInTheDocument();
  });

  test("renders timestamp", () => {
    const { timestamp } = renderReceivedMessage();
    const element = screen.getByText(format(new Date(timestamp), "HH:mm:ss"));
    expect(element).toBeInTheDocument();
  });

  describe("MemberAvatar", () => {
    test("renders first character of name", () => {
      const { name } = renderReceivedMessage();
      const element = screen.getByText(name[0]);
      expect(element).toBeInTheDocument();
    });
  });
});
