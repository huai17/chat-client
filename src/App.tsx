import { CssBaseline, CircularProgress } from "@material-ui/core";
import { JoinRoomForm } from "./components/JoinRoomForm";
import { ChatRoom } from "./components/ChatRoom";
import { useChatService } from "./service/chat-service";

type Props = { serverUrl?: string };

const App = ({ serverUrl }: Props) => {
  const { join, error, ...chat } = useChatService(serverUrl);

  return (
    <>
      <CssBaseline />
      {chat.status === "joined" ? (
        <ChatRoom {...chat} />
      ) : chat.status === "connected" ? (
        <JoinRoomForm error={error} join={join} />
      ) : (
        <CircularProgress data-testid="loading" />
      )}
    </>
  );
};

export default App;
