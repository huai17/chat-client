import { render, screen, fireEvent } from "@testing-library/react";
import { JoinRoomForm } from "./JoinRoomForm";

describe("JoinRoomForm", () => {
  const renderJoinRoomForm = (
    error?: string
  ): { join: jest.Mock<void, [name: string, room: string]> } => {
    const join = jest.fn<void, [name: string, room: string]>();
    render(<JoinRoomForm join={join} error={error} />);
    return { join };
  };

  test("renders error", () => {
    const error = "Error";
    renderJoinRoomForm(error);
    const element = screen.getByText(error);
    expect(element).toBeInTheDocument();
  });

  test("renders name field", () => {
    renderJoinRoomForm();
    const element = screen.getByPlaceholderText("Nick Name");
    expect(element).toBeInTheDocument();
  });

  test("renders room field", () => {
    renderJoinRoomForm();
    const element = screen.getByPlaceholderText("Room Name");
    expect(element).toBeInTheDocument();
  });

  test("renders join room button", () => {
    const testId = "join room";
    renderJoinRoomForm();
    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();
  });

  test("triggers join", () => {
    const testId = "join room";
    const { join } = renderJoinRoomForm();
    const nameInput = screen.getByPlaceholderText("Nick Name");
    const roomInput = screen.getByPlaceholderText("Room Name");
    const element = screen.getByTestId(testId);
    const name = "Name";
    const room = "Room";
    fireEvent.change(nameInput, { target: { value: name } });
    fireEvent.change(roomInput, { target: { value: room } });
    fireEvent.click(element);

    expect(join.mock.calls.length).toBe(1);
    expect(join.mock.calls[0]).toMatchObject([name, room]);
  });

  test("not triggers send while name field is empty", () => {
    const testId = "join room";
    const { join } = renderJoinRoomForm();
    const element = screen.getByTestId(testId);
    const roomInput = screen.getByPlaceholderText("Room Name");
    fireEvent.change(roomInput, { target: { value: "Room" } });
    fireEvent.click(element);
    expect(join.mock.calls.length).toBe(0);
  });

  test("not triggers send while room field is empty", () => {
    const testId = "join room";
    const { join } = renderJoinRoomForm();
    const element = screen.getByTestId(testId);
    const nameInput = screen.getByPlaceholderText("Nick Name");
    fireEvent.change(nameInput, { target: { value: "Name" } });
    fireEvent.click(element);
    expect(join.mock.calls.length).toBe(0);
  });
});
