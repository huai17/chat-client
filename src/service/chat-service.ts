import { useEffect, useState, useReducer, useCallback } from "react";
import { io, Socket } from "socket.io-client";

export type Join = (name: string, room: string) => void;
export type Send = (message: string) => void;
export type Leave = () => void;
export type Notice = (
  | { type: "message"; message: string }
  | { type: "joined" | "left" }
) & { id: string; timestamp: number };
export type Members = { [id: string]: { name: string; left: boolean } };

type State = (
  | ((
      | { status: "connected" }
      | { status: "joined"; members: Members; room: string; notices: Notice[] }
    ) & { id: string })
  | { status: "connecting" }
) & { error?: string };
type Action =
  | ((
      | ((
          | { type: "message"; message: string }
          | { type: "joined"; name: string }
          | { type: "left" }
        ) & { timestamp: number })
      | { type: "connected" }
    ) & { id: string })
  | { type: "join"; name: string; room: string; members: Members }
  | { type: "error"; error: string }
  | { type: "leave" };
type ChatService = State & { join: Join; send: Send; leave: Leave };

const reducer = ({ error, ...state }: State, action: Action): State => {
  switch (action.type) {
    case "connected":
      return { status: "connected", id: action.id };
    case "join":
      return state.status === "connected"
        ? {
            ...state,
            status: "joined",
            room: action.room,
            members: action.members,
            notices: [],
          }
        : state;
    case "leave":
      return state.status === "joined"
        ? { status: "connected", id: state.id }
        : state;
    case "message":
      return state.status === "joined"
        ? { ...state, notices: [...state.notices, { ...action }] }
        : state;
    case "joined":
      return state.status === "joined"
        ? {
            ...state,
            members: {
              ...state.members,
              [action.id]: { name: action.name, left: false },
            },
            notices: [
              ...state.notices,
              { type: action.type, id: action.id, timestamp: action.timestamp },
            ],
          }
        : state;
    case "left":
      return state.status === "joined"
        ? {
            ...state,
            members: {
              ...state.members,
              [action.id]: { ...state.members[action.id], left: true },
            },
            notices: [...state.notices, { ...action }],
          }
        : state;
    case "error":
      return { ...state, error: action.error };
  }
};

export const useChatService = (port: number = 5566): ChatService => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [state, dispatch] = useReducer(reducer, { status: "connecting" });

  const join = useCallback(
    (name: string, room: string): void => {
      if (!socket)
        return void dispatch({ type: "error", error: "NOT_CONNECTED" });
      if (name && room)
        socket.emit(
          "join",
          name,
          room,
          (error: string | null, _members: { [id: string]: string }): void => {
            if (error) return void dispatch({ type: "error", error });
            const members: Members = {};
            for (const id in _members)
              members[id] = { name: _members[id], left: false };
            dispatch({ type: "join", name, room, members });
          }
        );
    },
    [socket]
  );

  const leave = useCallback((): void => {
    if (!socket)
      return void dispatch({ type: "error", error: "NOT_CONNECTED" });
    socket.emit("leave", (error: string | null): void => {
      if (error) return void dispatch({ type: "error", error });
      dispatch({ type: "leave" });
    });
  }, [socket]);

  const send = useCallback(
    (message: string): void => {
      if (!socket)
        return void dispatch({ type: "error", error: "NOT_CONNECTED" });
      if (message)
        socket.emit("message", message, (err: string | null): void => {
          if (err) return void console.error(err);
          dispatch({
            type: "message",
            id: socket.id,
            timestamp: new Date().getTime(),
            message,
          });
        });
    },
    [socket]
  );

  useEffect(() => {
    let ignore = false;
    const socket = io(`http://localhost:${port}`, { path: "/chat-service/" });

    socket.on("connect", () => {
      if (!ignore) {
        dispatch({ type: "connected", id: socket.id });
        setSocket(socket);
      }
    });
    socket.on("joined", (id: string, name: string) => {
      if (!ignore)
        dispatch({ type: "joined", id, timestamp: new Date().getTime(), name });
    });
    socket.on("left", (id: string) => {
      if (!ignore)
        dispatch({ type: "left", id, timestamp: new Date().getTime() });
    });
    socket.on("message", (id: string, message: string) => {
      if (!ignore)
        dispatch({
          type: "message",
          id,
          timestamp: new Date().getTime(),
          message,
        });
    });

    return () => {
      socket.close();
      ignore = true;
    };
  }, []);

  return { ...state, join, leave, send };
};
