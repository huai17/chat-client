import { renderHook, act } from "@testing-library/react-hooks";
import { useChatService } from "./chat-service";
import { createServer } from "http";
import { AddressInfo } from "net";
import { Server, Socket } from "socket.io";

describe("useChatService", () => {
  const hookServerListener = (socket: Socket) => {
    socket.on(
      "join",
      (
        name: string,
        room: string,
        cb: (err: null | string, members: { [id: string]: string }) => void
      ): void => {
        cb(null, { [socket.id]: name });
      }
    );

    socket.on(
      "message",
      (message: string, cb: (err: null | string) => void): void => {
        cb(null);
      }
    );

    socket.on("leave", (cb: (err: null | string) => void): void => {
      cb(null);
    });
  };

  test("status should be connecting by default", () => {
    const { result } = renderHook(() => useChatService());
    expect(result.current.error).toBeUndefined();
    expect(result.current.status).toBe("connecting");
  });

  test("join should trigger error while connecting", () => {
    const { result } = renderHook(() => useChatService());
    act(() => {
      result.current.join("Name", "Room");
    });
    expect(result.current.error).toBe("NOT_CONNECTED");
  });

  test("send should trigger error while connecting", () => {
    const { result } = renderHook(() => useChatService());
    act(() => {
      result.current.send("Message");
    });
    expect(result.current.error).toBe("NOT_CONNECTED");
  });

  test("leave should trigger error while connecting", () => {
    const { result } = renderHook(() => useChatService());
    act(() => {
      result.current.leave();
    });
    expect(result.current.error).toBe("NOT_CONNECTED");
  });

  describe("socket connect", () => {
    let srv: Server;
    let port: number;
    let socket: Socket;

    beforeAll((done) => {
      const httpServer = createServer();
      srv = new Server(httpServer, { path: "/chat-service/" });
      srv.on("connection", (_socket) => {
        socket = _socket;
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

    test("should update state", async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useChatService(`http://localhost:${port}`)
      );
      await waitForNextUpdate();
      expect(result.current.error).toBeUndefined();
      expect(result.current.status).toBe("connected");
      if (result.current.status !== "connected") throw new Error();
      expect(result.current.id).toBe(socket.id);
    });
  });

  describe("join", () => {
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

    test("should update state", async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useChatService(`http://localhost:${port}`)
      );
      await waitForNextUpdate();
      result.current.join("Name", "Room");
      await waitForNextUpdate();
      expect(result.current.error).toBeUndefined();
      expect(result.current.status).toBe("joined");
      if (result.current.status !== "joined") throw new Error();
      expect(result.current.id).toBe(socket.id);
      expect(result.current.room).toBe("Room");
      expect(result.current.members).toMatchObject({
        [socket.id]: { name: "Name", left: false },
      });
      expect(result.current.notices).toMatchObject([]);
    });
  });

  describe("send", () => {
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

    test("should update state", async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useChatService(`http://localhost:${port}`)
      );
      await waitForNextUpdate();
      result.current.join("Name", "Room");
      await waitForNextUpdate();
      result.current.send("Message");
      await waitForNextUpdate();
      expect(result.current.error).toBeUndefined();
      expect(result.current.status).toBe("joined");
      if (result.current.status !== "joined") throw new Error();
      expect(result.current.id).toBe(socket.id);
      expect(result.current.room).toBe("Room");
      expect(result.current.members).toMatchObject({
        [socket.id]: { name: "Name", left: false },
      });
      expect(result.current.notices.length).toBe(1);
      expect(result.current.notices[0].type).toBe("message");
      if (result.current.notices[0].type !== "message") throw new Error();
      expect(result.current.notices[0].id).toBe(socket.id);
      expect(result.current.notices[0].message).toBe("Message");
      expect(result.current.notices[0].timestamp).toBeLessThanOrEqual(
        new Date().getTime()
      );
    });
  });

  describe("leave", () => {
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

    test("should update state", async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useChatService(`http://localhost:${port}`)
      );
      await waitForNextUpdate();
      result.current.join("Name", "Room");
      await waitForNextUpdate();
      result.current.leave();
      await waitForNextUpdate();
      expect(result.current.error).toBeUndefined();
      expect(result.current.status).toBe("connected");
      if (result.current.status !== "connected") throw new Error();
      expect(result.current.id).toBe(socket.id);
    });
  });

  describe("joined", () => {
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

    test("should update state", async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useChatService(`http://localhost:${port}`)
      );
      await waitForNextUpdate();
      result.current.join("Name", "Room");
      await waitForNextUpdate();
      socket.emit("joined", "id", "Another Name");
      await waitForNextUpdate();
      expect(result.current.error).toBeUndefined();
      expect(result.current.status).toBe("joined");
      if (result.current.status !== "joined") throw new Error();
      expect(result.current.id).toBe(socket.id);
      expect(result.current.room).toBe("Room");
      expect(result.current.members).toMatchObject({
        [socket.id]: { name: "Name", left: false },
        ["id"]: { name: "Another Name", left: false },
      });
      expect(result.current.notices.length).toBe(1);
      expect(result.current.notices[0].type).toBe("joined");
      if (result.current.notices[0].type !== "joined") throw new Error();
      expect(result.current.notices[0].id).toBe("id");
      expect(result.current.notices[0].timestamp).toBeLessThanOrEqual(
        new Date().getTime()
      );
    });
  });

  describe("message", () => {
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

    test("should update state", async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useChatService(`http://localhost:${port}`)
      );
      await waitForNextUpdate();
      result.current.join("Name", "Room");
      await waitForNextUpdate();
      socket.emit("joined", "id", "Another Name");
      await waitForNextUpdate();
      socket.emit("message", "id", "Hello");
      await waitForNextUpdate();
      expect(result.current.error).toBeUndefined();
      expect(result.current.status).toBe("joined");
      if (result.current.status !== "joined") throw new Error();
      expect(result.current.id).toBe(socket.id);
      expect(result.current.room).toBe("Room");
      expect(result.current.members).toMatchObject({
        [socket.id]: { name: "Name", left: false },
        ["id"]: { name: "Another Name", left: false },
      });
      expect(result.current.notices.length).toBe(2);
      expect(result.current.notices[0].type).toBe("joined");
      if (result.current.notices[0].type !== "joined") throw new Error();
      expect(result.current.notices[0].id).toBe("id");
      expect(result.current.notices[0].timestamp).toBeLessThanOrEqual(
        new Date().getTime()
      );
      expect(result.current.notices[1].type).toBe("message");
      if (result.current.notices[1].type !== "message") throw new Error();
      expect(result.current.notices[1].id).toBe("id");
      expect(result.current.notices[1].message).toBe("Hello");
      expect(result.current.notices[1].timestamp).toBeLessThanOrEqual(
        new Date().getTime()
      );
    });
  });

  describe("left", () => {
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

    test("should update state", async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useChatService(`http://localhost:${port}`)
      );
      await waitForNextUpdate();
      result.current.join("Name", "Room");
      await waitForNextUpdate();
      socket.emit("joined", "id", "Another Name");
      await waitForNextUpdate();
      socket.emit("left", "id");
      await waitForNextUpdate();
      expect(result.current.error).toBeUndefined();
      expect(result.current.status).toBe("joined");
      if (result.current.status !== "joined") throw new Error();
      expect(result.current.id).toBe(socket.id);
      expect(result.current.room).toBe("Room");
      expect(result.current.members).toMatchObject({
        [socket.id]: { name: "Name", left: false },
        ["id"]: { name: "Another Name", left: true },
      });
      expect(result.current.notices.length).toBe(2);
      expect(result.current.notices[0].type).toBe("joined");
      if (result.current.notices[0].type !== "joined") throw new Error();
      expect(result.current.notices[0].id).toBe("id");
      expect(result.current.notices[0].timestamp).toBeLessThanOrEqual(
        new Date().getTime()
      );
      expect(result.current.notices[1].type).toBe("left");
      if (result.current.notices[1].type !== "left") throw new Error();
      expect(result.current.notices[1].id).toBe("id");
      expect(result.current.notices[1].timestamp).toBeLessThanOrEqual(
        new Date().getTime()
      );
    });
  });
});
