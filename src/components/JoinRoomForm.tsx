import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  makeStyles,
} from "@material-ui/core";
import { Join } from "../service/chat-service";

const useStyles = makeStyles((theme) => ({
  button: { marginTop: theme.spacing(3) },
}));

type Props = { error?: string; join: Join };

export const JoinRoomForm = ({ error, join }: Props) => {
  const classes = useStyles();
  const [name, setName] = useState<string>("");
  const [room, setRoom] = useState<string>("");

  return (
    <Container maxWidth="xs">
      <Box display="flex" flexDirection="column" marginTop={8}>
        <TextField
          type="text"
          autoFocus
          variant="outlined"
          margin="normal"
          required
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nick Name"
        />
        <TextField
          type="text"
          variant="outlined"
          margin="normal"
          required
          label="Room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Room Name"
        />
        <Button
          data-testid="join room"
          className={classes.button}
          type="button"
          variant="contained"
          disabled={!name || !room}
          onClick={() => join(name, room)}
        >
          Join Room
        </Button>
        {error && (
          <Typography color="error" variant="body1">
            {error}
          </Typography>
        )}
      </Box>
    </Container>
  );
};
