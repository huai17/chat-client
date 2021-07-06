import { render, screen } from "@testing-library/react";
import { format } from "date-fns";
import { ReceivedMessage } from "./ReceivedMessage";

describe("ReceivedMessage", () => {
  test("renders message", () => {
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
    const element = screen.getByText(message);
    expect(element).toBeInTheDocument();
  });

  test("renders timestamp", () => {
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
    const element = screen.getByText(format(new Date(timestamp), "HH:mm:ss"));
    expect(element).toBeInTheDocument();
  });

  test("renders sender avatar", () => {
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
    const element = screen.getByText(name[0]);
    expect(element).toBeInTheDocument();
  });
});
