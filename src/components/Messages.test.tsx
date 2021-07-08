import { render, screen } from "@testing-library/react";
import { format, addMinutes } from "date-fns";
import { Messages } from "./Messages";
import { Notice, Members } from "../service/chat-service";

describe("Messages", () => {
  const renderMessages = (): {
    members: Members;
    notices: Notice[];
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
    render(<Messages id={id1} members={members} notices={notices} />);

    return { members, notices };
  };

  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = function () {};
  });

  describe("NoticedMessage", () => {
    test("renders joined message", () => {
      const { members, notices } = renderMessages();
      const element = screen.getByText(
        `${members[notices[0].id].name} has ${notices[0].type} - ${format(
          new Date(notices[0].timestamp),
          "HH:mm:ss"
        )}`
      );
      expect(element).toBeInTheDocument();
    });

    test("renders left message", () => {
      const { members, notices } = renderMessages();
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
      const { notices } = renderMessages();
      if (notices[2].type !== "message") throw new Error();
      const element = screen.getByText(notices[2].message);
      expect(element).toBeInTheDocument();
    });

    test("renders timestamp", () => {
      const { notices } = renderMessages();
      const element = screen.getByText(
        format(new Date(notices[2].timestamp), "HH:mm:ss")
      );
      expect(element).toBeInTheDocument();
    });
  });

  describe("ReceivedMessage", () => {
    test("renders message", () => {
      const { notices } = renderMessages();
      if (notices[1].type !== "message") throw new Error();
      const element = screen.getByText(notices[1].message);
      expect(element).toBeInTheDocument();
    });

    test("renders timestamp", () => {
      const { notices } = renderMessages();
      const element = screen.getByText(
        format(new Date(notices[1].timestamp), "HH:mm:ss")
      );
      expect(element).toBeInTheDocument();
    });

    describe("MemberAvatar", () => {
      test("renders first character of name", () => {
        const { members, notices } = renderMessages();
        const element = screen.getByText(members[notices[1].id].name[0]);
        expect(element).toBeInTheDocument();
      });
    });
  });
});
