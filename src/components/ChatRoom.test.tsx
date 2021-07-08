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

  describe("RoomHeader", () => {
    test("renders room name", () => {
      const { room } = renderChatRoom();
      const element = screen.getByText(room);
      expect(element).toBeInTheDocument();
    });

    test("renders open member list button", () => {
      const testId = "open member list";
      renderChatRoom();
      const element = screen.getByTestId(testId);
      expect(element).toBeInTheDocument();
    });

    test("renders leave room button", () => {
      const testId = "leave room";
      renderChatRoom();
      const element = screen.getByTestId(testId);
      expect(element).toBeInTheDocument();
    });

    test("triggers leave", () => {
      const testId = "leave room";
      const { leave } = renderChatRoom();
      const element = screen.getByTestId(testId);
      expect(element).toBeInTheDocument();
      fireEvent.click(element);
      expect(leave.mock.calls.length).toBe(1);
    });
  });

  describe("MemberList", () => {
    test("renders member list", () => {
      renderChatRoom();
      const element = screen.getByText("Member List");
      expect(element).toBeInTheDocument();
    });

    describe("MemberListItem", () => {
      describe("MemberAvatar", () => {
        test("renders first character of name", () => {
          const { members } = renderChatRoom();
          const ids = Object.keys(members);
          const name1 = screen.getByText(members[ids[0]].name[0]);
          const name2 = screen.getAllByText(members[ids[1]].name[0]);
          expect(name2.length).toBe(2);
          expect(name1).toBeInTheDocument();
          expect(name2[0]).toBeInTheDocument();
          expect(name2[1]).toBeInTheDocument();
        });
      });

      test("renders full name", () => {
        const { members } = renderChatRoom();
        const ids = Object.keys(members);
        const name1 = screen.getByText(members[ids[0]].name);
        const name2 = screen.getByText(members[ids[1]].name);
        expect(name1).toBeInTheDocument();
        expect(name2).toBeInTheDocument();
      });

      test("renders online", () => {
        renderChatRoom();
        const element = screen.getByText("online");
        expect(element).toBeInTheDocument();
      });

      test("renders offline", () => {
        renderChatRoom();
        const element = screen.getByText("offline");
        expect(element).toBeInTheDocument();
      });
    });

    test("renders close member list button", () => {
      const testId = "close member list";
      renderChatRoom();
      const element = screen.getByTestId(testId);
      expect(element).toBeInTheDocument();
    });
  });

  describe("MessageInput", () => {
    test("renders testarea", () => {
      renderChatRoom();
      const element = screen.getByPlaceholderText("Send Message...");
      expect(element).toBeInTheDocument();
    });

    test("renders send message button", () => {
      const testId = "send message";
      renderChatRoom();
      const element = screen.getByTestId(testId);
      expect(element).toBeInTheDocument();
    });

    test("triggers send", () => {
      const testId = "send message";
      const value = "Hello World";
      const { send } = renderChatRoom();
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
      const { send } = renderChatRoom();
      const element = screen.getByTestId(testId);
      fireEvent.click(element);
      expect(send.mock.calls.length).toBe(0);
    });
  });

  describe("Messages", () => {
    describe("NoticedMessage", () => {
      test("renders joined message", () => {
        const { members, notices } = renderChatRoom();
        const element = screen.getByText(
          `${members[notices[0].id].name} has ${notices[0].type} - ${format(
            new Date(notices[0].timestamp),
            "HH:mm:ss"
          )}`
        );
        expect(element).toBeInTheDocument();
      });

      test("renders left message", () => {
        const { members, notices } = renderChatRoom();
        const element = screen.getByText(
          `${members[notices[3].id].name} has ${notices[3].type} - ${format(
            new Date(notices[3].timestamp),
            "HH:mm:ss"
          )}`
        );
        expect(element).toBeInTheDocument();
      });
    });

    describe("SentMessage", () => {
      test("renders message", () => {
        const { notices } = renderChatRoom();
        if (notices[2].type !== "message") throw new Error();
        const element = screen.getByText(notices[2].message);
        expect(element).toBeInTheDocument();
      });

      test("renders timestamp", () => {
        const { notices } = renderChatRoom();
        const element = screen.getByText(
          format(new Date(notices[2].timestamp), "HH:mm:ss")
        );
        expect(element).toBeInTheDocument();
      });
    });

    describe("ReceivedMessage", () => {
      test("renders message", () => {
        const { notices } = renderChatRoom();
        if (notices[1].type !== "message") throw new Error();
        const element = screen.getByText(notices[1].message);
        expect(element).toBeInTheDocument();
      });

      test("renders timestamp", () => {
        const { notices } = renderChatRoom();
        const element = screen.getByText(
          format(new Date(notices[1].timestamp), "HH:mm:ss")
        );
        expect(element).toBeInTheDocument();
      });

      describe("MemberAvatar", () => {
        test("renders first character of name", () => {
          const { members, notices } = renderChatRoom();
          const elements = screen.getAllByText(members[notices[1].id].name[0]);
          expect(elements.length).toBe(2);
          expect(elements[0]).toBeInTheDocument();
          expect(elements[1]).toBeInTheDocument();
        });
      });
    });
  });
});
