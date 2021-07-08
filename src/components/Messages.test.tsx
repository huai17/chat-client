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

  test("renders NoticedMessage", () => {
    const { members, notices } = renderMessages();
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
    expect(joinedMessage).toBeInTheDocument();
    expect(leftMessage).toBeInTheDocument();
  });

  test("renders SentMessage", () => {
    const { notices } = renderMessages();
    if (notices[2].type !== "message") throw new Error();
    const message = screen.getByText(notices[2].message);
    const timestamp = screen.getByText(
      format(new Date(notices[2].timestamp), "HH:mm:ss")
    );
    expect(message).toBeInTheDocument();
    expect(timestamp).toBeInTheDocument();
  });

  test("renders ReceivedMessage", () => {
    const { members, notices } = renderMessages();
    if (notices[1].type !== "message") throw new Error();
    const message = screen.getByText(notices[1].message);
    const timestamp = screen.getByText(
      format(new Date(notices[1].timestamp), "HH:mm:ss")
    );
    const avatar = screen.getByText(members[notices[1].id].name[0]);
    expect(message).toBeInTheDocument();
    expect(timestamp).toBeInTheDocument();
    expect(avatar).toBeInTheDocument();
  });
});
