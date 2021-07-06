import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import { format } from "date-fns";
import { MemberAvatar } from "./MemberAvatar";

const useStyles = makeStyles((theme) => ({
  root: { paddingRight: "30%" },
  primary: { display: "flex", justifyContent: "flex-start" },
  chatBox: {
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    background: theme.palette.info.main,
    color: theme.palette.info.contrastText,
  },
}));

type Props = {
  name: string;
  left: boolean;
  message: string;
  timestamp: number;
};

export const ReceivedMessage = ({ name, left, message, timestamp }: Props) => {
  const classes = useStyles();

  return (
    <ListItem className={classes.root} alignItems="flex-start">
      <ListItemAvatar>
        <MemberAvatar name={name} left={left} />
      </ListItemAvatar>
      <ListItemText
        classes={{ primary: classes.primary }}
        primary={<div className={classes.chatBox}>{message}</div>}
        secondary={format(new Date(timestamp), "HH:mm:ss")}
      />
    </ListItem>
  );
};
