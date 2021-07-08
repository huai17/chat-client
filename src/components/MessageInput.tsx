import { useState } from "react";
import {
  IconButton,
  TextField,
  InputAdornment,
  Paper,
  makeStyles,
} from "@material-ui/core";
import { Send as SendIcon } from "@material-ui/icons";
import { Send } from "../service/chat-service";

const useStyles = makeStyles((theme) => ({
  root: { padding: theme.spacing(2) },
}));

type Props = { send: Send };

export const MessageInput = ({ send }: Props) => {
  const classes = useStyles();
  const [message, setMessage] = useState<string>("");

  return (
    <Paper className={classes.root} square>
      <TextField
        multiline
        rows={4}
        autoFocus
        fullWidth
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                data-testid="send message"
                disabled={!message}
                onClick={() => {
                  send(message);
                  setMessage("");
                }}
              >
                <SendIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        placeholder="Send Message..."
        value={message}
        onKeyPress={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.stopPropagation();
            e.preventDefault();
            if (message) {
              send(message);
              setMessage("");
            }
          }
        }}
        onChange={(e) => setMessage(e.target.value)}
      />
    </Paper>
  );
};
