import { render, screen, fireEvent } from "@testing-library/react";
import { format, addMinutes } from "date-fns";
import { ChatRoom } from "./ChatRoom";
import { Notice, Members } from "../service/chat-service";

describe("ChatRoom", () => {
  const renderChatRoom = (): {
    room: string;
    members: Members;
    notices: Notice[];
    send: jest.Mock<void, [message: string]>;
    leave: jest.Mock<void, []>;
  } => {
    const id1 = "id";
    const id2 = "anotherId";
    const now = new Date();
    const t1 = now.getTime();
    const t2 = addMinutes(now, 1).getTime();
    const t3 = addMinutes(now, 2).getTime();
    const t4 = addMinutes(now, 3).getTime();
    const members: Members = {
      [id1]: { name: "User", left: false },
      [id2]: { name: "New User", left: true },
    };
    const notices: Notice[] = [
      { type: "joined", id: id2, timestamp: t1 },
      { type: "message", id: id2, timestamp: t2, message: "Hello" },
      { type: "message", id: id1, timestamp: t3, message: "Goodbye" },
      { type: "left", id: id2, timestamp: t4 },
    ];
    const room = "Room Name";
    const send = jest.fn<void, [message: string]>();
    const leave = jest.fn<void, []>();
    render(
      <ChatRoom
        id={id1}
        room={room}
        members={members}
        notices={notices}
        send={send}
        leave={leave}
      />
    );

    return { room, members, notices, send, leave };
  };

  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = function () {};
  });

  test("renders RoomHeader", () => {
    const openTestId = "open member list";
    const leaveTestId = "leave room";
    const { room, leave } = renderChatRoom();
    const title = screen.getByText(room);
    const openButton = screen.getByTestId(openTestId);
    const leaveButton = screen.getByTestId(leaveTestId);
    expect(title).toBeInTheDocument();
    expect(openButton).toBeInTheDocument();
    expect(leaveButton).toBeInTheDocument();
    fireEvent.click(leaveButton);
    expect(leave.mock.calls.length).toBe(1);
  });

  test("rendersMemberList", () => {
    const testId = "close member list";
    const { members } = renderChatRoom();
    const ids = Object.keys(members);
    const title = screen.getByText("Member List");
    const avatar1 = screen.getByText(members[ids[0]].name[0]);
    const avatar2 = screen.getAllByText(members[ids[1]].name[0]);
    const name1 = screen.getByText(members[ids[0]].name);
    const name2 = screen.getByText(members[ids[1]].name);
    const online = screen.getByText("online");
    const offline = screen.getByText("offline");
    const button = screen.getByTestId(testId);
    expect(title).toBeInTheDocument();
    expect(avatar2.length).toBe(2);
    expect(avatar1).toBeInTheDocument();
    expect(avatar2[0]).toBeInTheDocument();
    expect(avatar2[1]).toBeInTheDocument();
    expect(name1).toBeInTheDocument();
    expect(name2).toBeInTheDocument();
    expect(online).toBeInTheDocument();
    expect(offline).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  test("renders MessageInput", () => {
    const testId = "send message";
    const value = "Hello World";
    const { send } = renderChatRoom();
    const textarea = screen.getByPlaceholderText(
      "Send Message..."
    ) as HTMLTextAreaElement;
    const button = screen.getByTestId(testId);
    expect(textarea).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    fireEvent.change(textarea, { target: { value } });
    fireEvent.click(button);
    expect(send.mock.calls.length).toBe(1);
    expect(send.mock.calls[0][0]).toBe(value);
    expect(textarea.value).toBe("");
    fireEvent.click(button);
    expect(send.mock.calls.length).toBe(1);
  });

  test("renders Messages", () => {
    const { members, notices } = renderChatRoom();
    const joinedMessage = screen.getByText(
      `${members[notices[0].id].name} has ${notices[0].type} - ${format(
        new Date(notices[0].timestamp),
        "HH:mm:ss"
      )}`
    );
    const leftMessage = screen.getByText(
      `${members[notices[3].id].name} has ${notices[3].type} - ${format(
        new Date(notices[3].timestamp),
        "HH:mm:ss"
      )}`
    );
    if (notices[2].type !== "message") throw new Error();
    const sentMessage = screen.getByText(notices[2].message);
    const sentTimestamp = screen.getByText(
      format(new Date(notices[2].timestamp), "HH:mm:ss")
    );
    const avatar = screen.getAllByText(members[notices[1].id].name[0]);
    if (notices[1].type !== "message") throw new Error();
    const reveivedMessage = screen.getByText(notices[1].message);
    const receivedTimestamp = screen.getByText(
      format(new Date(notices[1].timestamp), "HH:mm:ss")
    );
    expect(joinedMessage).toBeInTheDocument();
    expect(leftMessage).toBeInTheDocument();
    expect(sentMessage).toBeInTheDocument();
    expect(sentTimestamp).toBeInTheDocument();
    expect(avatar.length).toBe(2);
    expect(avatar[0]).toBeInTheDocument();
    expect(avatar[1]).toBeInTheDocument();
    expect(reveivedMessage).toBeInTheDocument();
    expect(receivedTimestamp).toBeInTheDocument();
  });
});
