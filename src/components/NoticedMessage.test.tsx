import { render, screen } from "@testing-library/react";
import { format } from "date-fns";
import { NoticedMessage } from "./NoticedMessage";

describe("NoticedMessage", () => {
  const renderNoticedMessage = (
    type: "joined" | "left"
  ): { name: string; message: string; timestamp: number } => {
    const name = "Name";
    const message = type;
    const timestamp = new Date().getTime();
    render(
      <NoticedMessage name={name} message={message} timestamp={timestamp} />
    );

    return { name, message, timestamp };
  };

  test("renders joined message", () => {
    const { name, message, timestamp } = renderNoticedMessage("joined");
    const element = screen.getByText(
      `${name} has ${message} - ${format(new Date(timestamp), "HH:mm:ss")}`
    );
    expect(element).toBeInTheDocument();
  });

  test("renders left message", () => {
    const { name, message, timestamp } = renderNoticedMessage("left");
    const element = screen.getByText(
      `${name} has ${message} - ${format(new Date(timestamp), "HH:mm:ss")}`
    );
    expect(element).toBeInTheDocument();
  });
});
