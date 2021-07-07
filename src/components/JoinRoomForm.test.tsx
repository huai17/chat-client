import { render, screen, fireEvent } from "@testing-library/react";
import { JoinRoomForm } from "./JoinRoomForm";

describe("JoinRoomForm", () => {
  test("renders error", () => {
    const error = "Error";
    const join = jest.fn<void, [name: string, room: string]>();
    render(<JoinRoomForm join={join} error={error} />);
    const element = screen.getByText(error);
    expect(element).toBeInTheDocument();
  });

  test("renders name field", () => {
    const join = jest.fn<void, [name: string, room: string]>();
    render(<JoinRoomForm join={join} />);
    const input = screen.getByPlaceholderText("Nick Name") as HTMLInputElement;
    expect(input).toBeInTheDocument();
  });

  test("renders room field", () => {
    const join = jest.fn<void, [name: string, room: string]>();
    render(<JoinRoomForm join={join} />);
    const input = screen.getByPlaceholderText("Room Name") as HTMLInputElement;
    expect(input).toBeInTheDocument();
  });

  test("renders join room button & triggers join", () => {
    const join = jest.fn<void, [name: string, room: string]>();
    render(<JoinRoomForm join={join} />);
    const nameInput = screen.getByPlaceholderText(
      "Nick Name"
    ) as HTMLInputElement;
    const roomInput = screen.getByPlaceholderText(
      "Room Name"
    ) as HTMLInputElement;
    const button = screen.getByTestId("join room");
    expect(button).toBeInTheDocument();
    const name = "Name";
    const room = "Room";
    fireEvent.change(nameInput, { target: { value: name } });
    fireEvent.change(roomInput, { target: { value: room } });
    fireEvent.click(button);

    expect(join.mock.calls.length).toBe(1);
    expect(join.mock.calls[0]).toMatchObject([name, room]);
  });
});
