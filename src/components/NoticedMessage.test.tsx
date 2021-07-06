import { render, screen } from "@testing-library/react";
import { format } from "date-fns";
import { NoticedMessage } from "./NoticedMessage";

describe("NoticedMessage", () => {
  test("renders joined message", () => {
    const name = "Name";
    const message = "joined";
    const timestamp = new Date().getTime();
    render(
      <NoticedMessage name={name} message={message} timestamp={timestamp} />
    );
    const element = screen.getByText(
      `${name} has ${message} - ${format(new Date(timestamp), "HH:mm:ss")}`
    );
    expect(element).toBeInTheDocument();
  });

  test("renders left message", () => {
    const name = "Name";
    const message = "left";
    const timestamp = new Date().getTime();
    render(
      <NoticedMessage name={name} message={message} timestamp={timestamp} />
    );
    const element = screen.getByText(
      `${name} has ${message} - ${format(new Date(timestamp), "HH:mm:ss")}`
    );
    expect(element).toBeInTheDocument();
  });
});
