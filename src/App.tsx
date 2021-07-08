import { CssBaseline, CircularProgress } from "@material-ui/core";
import { JoinRoomForm } from "./components/JoinRoomForm";
import { ChatRoom } from "./components/ChatRoom";
import { useChatService } from "./service/chat-service";

const App = () => {
  const { join, error, ...chat } = useChatService();

  return (
    <>
      <CssBaseline />
      {chat.status === "joined" ? (
        <ChatRoom {...chat} />
      ) : chat.status === "connected" ? (
        <JoinRoomForm error={error} join={join} />
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

export default App;
