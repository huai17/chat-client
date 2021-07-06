import { render, screen } from "@testing-library/react";
import { format } from "date-fns";
import { Messages } from "./Messages";
import { Notice } from "../service/chat-service";

describe("Messages", () => {
  test("renders messages", () => {
    window.HTMLElement.prototype.scrollIntoView = function () {};
    const timestamp = new Date().getTime();
    const formatted = format(new Date(timestamp), "HH:mm:ss");
    const members = {
      id1: { name: "A", left: false },
      id2: { name: "B", left: true },
    };
    const notices: Notice[] = [
      { type: "joined", id: "id2", timestamp },
      { type: "message", id: "id2", timestamp, message: "Hello" },
      { type: "message", id: "id1", timestamp, message: "Goodbye" },
      { type: "left", id: "id2", timestamp },
    ];
    render(<Messages id="id1" members={members} notices={notices} />);
    const joinedM = screen.getByText(`B has joined - ${formatted}`);
    expect(joinedM).toBeInTheDocument();
    const leftM = screen.getByText(`B has left - ${formatted}`);
    expect(leftM).toBeInTheDocument();
    const avatar = screen.getByText("B");
    expect(avatar).toBeInTheDocument();
    const receivedM = screen.getByText("Hello");
    expect(receivedM).toBeInTheDocument();
    const sentM = screen.getByText("Goodbye");
    expect(sentM).toBeInTheDocument();
  });
});
