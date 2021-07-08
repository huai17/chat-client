import { fireEvent, render, screen } from "@testing-library/react";
import { RoomHeader } from "./RoomHeader";

describe("RoomHeader", () => {
  const renderRoomHeader = (): {
    room: string;
    openMemberList: jest.Mock<void, []>;
    leave: jest.Mock<void, []>;
  } => {
    const open = false;
    const openMemberList = jest.fn<void, []>();
    const room = "Room Name";
    const leave = jest.fn<void, []>();
    render(
      <RoomHeader
        open={open}
        openMemberList={openMemberList}
        room={room}
        leave={leave}
      />
    );

    return { room, openMemberList, leave };
  };

  test("renders room name", () => {
    const { room } = renderRoomHeader();
    const element = screen.getByText(room);
    expect(element).toBeInTheDocument();
  });

  test("renders open member list button", () => {
    const testId = "open member list";
    renderRoomHeader();
    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();
  });

  test("renders leave room button", () => {
    const testId = "leave room";
    renderRoomHeader();
    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();
  });

  test("triggers openMemberList", () => {
    const testId = "open member list";
    const { openMemberList } = renderRoomHeader();
    const element = screen.getByTestId(testId);
    fireEvent.click(element);
    expect(openMemberList.mock.calls.length).toBe(1);
  });

  test("triggers leave", () => {
    const testId = "leave room";
    const { leave } = renderRoomHeader();
    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();
    fireEvent.click(element);
    expect(leave.mock.calls.length).toBe(1);
  });
});
