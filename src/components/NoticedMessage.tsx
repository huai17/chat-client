import { ListItem, ListItemText, makeStyles } from "@material-ui/core";
import { format } from "date-fns";

const useStyles = makeStyles(() => ({
  root: { margin: "auto" },
  secondary: { display: "flex", justifyContent: "center" },
}));

type Props = { name: string; message: "joined" | "left"; timestamp: number };

export const NoticedMessage = ({ name, message, timestamp }: Props) => {
  const classes = useStyles();

  return (
    <ListItem className={classes.root}>
      <ListItemText
        classes={{ secondary: classes.secondary }}
        secondary={`${name} has ${message} - ${format(
          new Date(timestamp),
          "HH:mm:ss"
        )}`}
      />
    </ListItem>
  );
};
