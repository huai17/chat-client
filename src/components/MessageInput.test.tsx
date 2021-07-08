import { fireEvent, render, screen } from "@testing-library/react";
import { MessageInput } from "./MessageInput";

describe("MessageInput", () => {
  const renderMessageInput = (): {
    send: jest.Mock<void, [message: string]>;
  } => {
    const send = jest.fn<void, [message: string]>();
    render(<MessageInput send={send} />);

    return { send };
  };

  test("renders testarea", () => {
    renderMessageInput();
    const element = screen.getByPlaceholderText("Send Message...");
    expect(element).toBeInTheDocument();
  });

  test("renders send message button", () => {
    const testId = "send message";
    renderMessageInput();
    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();
  });

  test("triggers send", () => {
    const testId = "send message";
    const value = "Hello World";
    const { send } = renderMessageInput();
    const textarea = screen.getByPlaceholderText(
      "Send Message..."
    ) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value } });
    const element = screen.getByTestId(testId);
    fireEvent.click(element);
    expect(send.mock.calls.length).toBe(1);
    expect(send.mock.calls[0][0]).toBe(value);
    expect(textarea.value).toBe("");
  });

  test("not triggers send while textarea is empty", () => {
    const testId = "send message";
    const { send } = renderMessageInput();
    const element = screen.getByTestId(testId);
    expect(element).toBeDisabled();
    fireEvent.click(element);
    expect(send.mock.calls.length).toBe(0);
  });
});
