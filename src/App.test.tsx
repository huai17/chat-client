import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import App from "./App";
import { createServer } from "http";
import { AddressInfo } from "net";
import { Server, Socket } from "socket.io";

describe("App", () => {
  const hookServerListener = (s: Socket) => {
    s.on(
      "join",
      (
        n: string,
        r: string,
        cb: (e: null, m: { [id: string]: string }) => void
      ): void => {
        cb(null, { [s.id]: n });
      }
    );
    s.on("message", (m: string, cb: (e: null) => void): void => {
      cb(null);
    });
    s.on("leave", (cb: (e: null) => void): void => {
      cb(null);
    });
  };

  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = function () {};
  });

  test("renders loading by default", () => {
    const testId = "loading";
    render(<App />);
    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();
  });

  describe("use case", () => {
    let srv: Server;
    let port: number;
    let socket: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer, { path: "/chat-service/" });
      srv.on("connection", (_socket) => {
        socket = _socket;
        hookServerListener(socket);
      });
      httpServer.listen(() => {
        const { port: _port } = httpServer.address() as AddressInfo;
        port = _port;
        done();
      });
    });

    afterAll(() => {
      srv.close();
    });

    test("basic flow", async () => {
      render(<App serverUrl={`http://localhost:${port}`} />);
      // connected
      const joinButton = await waitFor(() => screen.getByTestId("join room"));
      const nameInput = screen.getByPlaceholderText("Nick Name");
      const roomInput = screen.getByPlaceholderText("Room Name");
      expect(joinButton).toBeInTheDocument();
      expect(nameInput).toBeInTheDocument();
      expect(roomInput).toBeInTheDocument();
      // join button disabled check
      expect(joinButton).toBeDisabled();
      fireEvent.change(nameInput, { target: { value: "Name" } });
      fireEvent.change(roomInput, { target: { value: "" } });
      expect(joinButton).toBeDisabled();
      fireEvent.change(nameInput, { target: { value: "" } });
      fireEvent.change(roomInput, { target: { value: "Room" } });
      expect(joinButton).toBeDisabled();
      fireEvent.change(nameInput, { target: { value: "Name" } });
      fireEvent.change(roomInput, { target: { value: "Room" } });
      expect(joinButton).not.toBeDisabled();
      // joined
      fireEvent.click(joinButton);
      const leaveButton = await waitFor(() => screen.getByTestId("leave room"));
      const openButton = screen.getByTestId("open member list");
      const roomTitle = screen.getByText("Room");
      const memberListTitle = screen.getByText("Member List");
      const avatar = screen.getByText("N");
      const name = screen.getByText("Name");
      const online = screen.getByText("online");
      const closeButton = screen.getByTestId("close member list");
      const textarea = screen.getByPlaceholderText(
        "Send Message..."
      ) as HTMLTextAreaElement;
      const sendButton = screen.getByTestId("send message");
      expect(roomTitle).toBeInTheDocument();
      expect(openButton).toBeInTheDocument();
      expect(leaveButton).toBeInTheDocument();
      expect(memberListTitle).toBeInTheDocument();
      expect(avatar).toBeInTheDocument();
      expect(name).toBeInTheDocument();
      expect(online).toBeInTheDocument();
      expect(closeButton).toBeInTheDocument();
      expect(textarea).toBeInTheDocument();
      expect(sendButton).toBeInTheDocument();
      // send button disabled check
      expect(sendButton).toBeDisabled();
      fireEvent.change(textarea, { target: { value: "" } });
      expect(sendButton).toBeDisabled();
      fireEvent.change(textarea, { target: { value: "Hello" } });
      expect(sendButton).not.toBeDisabled();
      // receive joined
      socket.emit("joined", "someId", "Another Name");
      const joinedMessage = await waitFor(() =>
        screen.getByText(/Another Name has joined - /)
      );
      const joinedAvatar = screen.getByText("A");
      const joinedName = screen.getByText("Another Name");
      const joinedOnline = screen.getAllByText("online");
      expect(joinedMessage).toBeInTheDocument();
      expect(joinedAvatar).toBeInTheDocument();
      expect(joinedName).toBeInTheDocument();
      expect(joinedOnline.length).toBe(2);
      expect(joinedOnline[0]).toBeInTheDocument();
      expect(joinedOnline[1]).toBeInTheDocument();
      // send message
      fireEvent.click(sendButton);
      expect(textarea.value).toBe("");
      const sentMessage = await waitFor(() => screen.getByText("Hello"));
      expect(sentMessage).toBeInTheDocument();
      // receive message
      socket.emit("message", "someId", "Goodbye");
      const receivedMessage = await waitFor(() => screen.getByText("Goodbye"));
      const receivedAvatar = screen.getAllByText("A");
      expect(receivedMessage).toBeInTheDocument();
      expect(receivedAvatar.length).toBe(2);
      expect(receivedAvatar[0]).toBeInTheDocument();
      expect(receivedAvatar[1]).toBeInTheDocument();
      // receive left
      socket.emit("left", "someId");
      const leftMessage = await waitFor(() =>
        screen.getByText(/Another Name has left - /)
      );
      const leftOffline = screen.getByText("offline");
      expect(leftMessage).toBeInTheDocument();
      expect(leftOffline).toBeInTheDocument();
      // leave
      fireEvent.click(leaveButton);
      const leftJoinButton = await waitFor(() =>
        screen.getByTestId("join room")
      );
      const leftNameInput = screen.getByPlaceholderText("Nick Name");
      const leftRoomInput = screen.getByPlaceholderText("Room Name");
      expect(leftJoinButton).toBeInTheDocument();
      expect(leftNameInput).toBeInTheDocument();
      expect(leftRoomInput).toBeInTheDocument();
    });
  });
});
