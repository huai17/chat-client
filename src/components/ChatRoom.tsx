import { useState, useCallback } from "react";
import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { RoomHeader } from "./RoomHeader";
import { MemberList } from "./MemberList";
import { Messages } from "./Messages";
import { MessageInput } from "./MessageInput";
import { Members, Notice, Send, Leave } from "../service/chat-service";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    width: "100%",
    height: "100%",
    display: "flex",
  },
  header: {
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  contentShift: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
    width: `calc(100% - ${drawerWidth}px)`,
  },
}));

type Props = {
  id: string;
  room: string;
  members: Members;
  notices: Notice[];
  send: Send;
  leave: Leave;
};

export const ChatRoom = ({
  id,
  room,
  members,
  notices,
  send,
  leave,
}: Props) => {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  const openMemberList = useCallback(() => setOpen(true), []);
  const closeMemberList = useCallback(() => setOpen(false), []);

  return (
    <div className={classes.root}>
      <RoomHeader
        open={open}
        openMemberList={openMemberList}
        room={room}
        leave={leave}
      />
      <MemberList
        open={open}
        closeMemberList={closeMemberList}
        members={members}
      />
      <main className={clsx(classes.content, { [classes.contentShift]: open })}>
        <div className={classes.header} />
        <Messages id={id} members={members} notices={notices} />
        <MessageInput send={send} />
      </main>
    </div>
  );
};
