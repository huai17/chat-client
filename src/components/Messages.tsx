import { useEffect, useRef } from "react";
import { List, ListItem, makeStyles } from "@material-ui/core";
import { ReceivedMessage } from "./ReceivedMessage";
import { SentMessage } from "./SentMessage";
import { NoticedMessage } from "./NoticedMessage";
import { Members, Notice } from "../service/chat-service";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: 0,
    flex: 1,
    overflow: "auto",
    padding: theme.spacing(0, 2),
  },
}));

type Props = { id: string; members: Members; notices: Notice[] };

export const Messages = ({ id, members, notices }: Props) => {
  const classes = useStyles();
  const ref = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (ref) ref.current?.scrollIntoView();
  }, [notices]);

  return (
    <List className={classes.root}>
      {notices.map((notice, index) =>
        notice.type === "message" ? (
          notice.id !== id ? (
            <ReceivedMessage
              key={index}
              name={members[notice.id].name}
              left={members[notice.id].left}
              message={notice.message}
              timestamp={notice.timestamp}
            />
          ) : (
            <SentMessage
              key={index}
              message={notice.message}
              timestamp={notice.timestamp}
            />
          )
        ) : (
          <NoticedMessage
            key={index}
            name={members[notice.id].name}
            message={notice.type}
            timestamp={notice.timestamp}
          />
        )
      )}
      <ListItem ref={ref} />
    </List>
  );
};
