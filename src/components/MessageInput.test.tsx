import { fireEvent, render, screen } from "@testing-library/react";
import { MessageInput } from "./MessageInput";

describe("MessageInput", () => {
  test("renders testarea", () => {
    const send = jest.fn<void, [message: string]>();
    render(<MessageInput send={send} />);
    const element = screen.getByPlaceholderText("Send Message...");
    expect(element).toBeInTheDocument();
  });

  test("renders send message button & triggers send", () => {
    const send = jest.fn<void, [message: string]>();
    render(<MessageInput send={send} />);
    const textarea = screen.getByPlaceholderText(
      "Send Message..."
    ) as HTMLTextAreaElement;
    const value = "Hello World";
    fireEvent.change(textarea, { target: { value } });

    const element = screen.getByTestId("send message");
    expect(element).toBeInTheDocument();
    fireEvent.click(element);
    expect(send.mock.calls.length).toBe(1);
    expect(send.mock.calls[0][0]).toBe(value);
    expect(textarea.value).toBe("");
  });

  test("not triggers send while textarea is empty", () => {
    const send = jest.fn<void, [message: string]>();
    render(<MessageInput send={send} />);
    const element = screen.getByPlaceholderText("Send Message...");
    fireEvent.click(element);
    expect(send.mock.calls.length).toBe(0);
  });
});
