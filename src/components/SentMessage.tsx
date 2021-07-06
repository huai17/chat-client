import { ListItem, ListItemText, makeStyles } from "@material-ui/core";
import { format } from "date-fns";

const useStyles = makeStyles((theme) => ({
  root: { paddingLeft: "30%" },
  primary: { display: "flex", justifyContent: "flex-end" },
  chatBox: {
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    background: theme.palette.info.main,
    color: theme.palette.info.contrastText,
  },
}));

type Props = { message: string; timestamp: number };

export const SentMessage = ({ message, timestamp }: Props) => {
  const classes = useStyles();

  return (
    <ListItem className={classes.root}>
      <ListItemText
        classes={{ primary: classes.primary }}
        primary={<div className={classes.chatBox}>{message}</div>}
        secondary={format(new Date(timestamp), "HH:mm:ss")}
        secondaryTypographyProps={{ align: "right" }}
      />
    </ListItem>
  );
};
