import { ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import { MemberAvatar } from "./MemberAvatar";

type Props = { name: string; left: boolean };

export const MemberListItem = ({ name, left }: Props) => (
  <ListItem>
    <ListItemAvatar>
      <MemberAvatar name={name} left={left} />
    </ListItemAvatar>
    <ListItemText primary={name} secondary={left ? "offline" : "online"} />
  </ListItem>
);
