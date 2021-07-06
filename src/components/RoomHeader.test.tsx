import { fireEvent, render, screen } from "@testing-library/react";
import { RoomHeader } from "./RoomHeader";

describe("RoomHeader", () => {
  test("renders room name", () => {
    const open = false;
    const openMemberList = jest.fn(() => void 0);
    const room = "Room Name";
    const leave = jest.fn(() => void 0);
    render(
      <RoomHeader
        open={open}
        openMemberList={openMemberList}
        room={room}
        leave={leave}
      />
    );
    const element = screen.getByText(room);
    expect(element).toBeInTheDocument();
  });

  test("renders open member list button & triggers openMemberList", () => {
    const open = false;
    const openMemberList = jest.fn(() => void 0);
    const room = "Room Name";
    const leave = jest.fn(() => void 0);
    render(
      <RoomHeader
        open={open}
        openMemberList={openMemberList}
        room={room}
        leave={leave}
      />
    );
    const element = screen.getByTestId("open member list");
    expect(element).toBeInTheDocument();

    fireEvent.click(element);
    expect(openMemberList.mock.calls.length).toBe(1);
  });

  test("renders leave room button & triggers leave", () => {
    const open = false;
    const openMemberList = jest.fn(() => void 0);
    const room = "Room Name";
    const leave = jest.fn(() => void 0);
    render(
      <RoomHeader
        open={open}
        openMemberList={openMemberList}
        room={room}
        leave={leave}
      />
    );
    const element = screen.getByTestId("leave room");
    expect(element).toBeInTheDocument();

    fireEvent.click(element);
    expect(leave.mock.calls.length).toBe(1);
  });
});
