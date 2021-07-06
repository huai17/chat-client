import { useMemo } from "react";
import {
  Typography,
  Drawer,
  IconButton,
  Divider,
  List,
  makeStyles,
} from "@material-ui/core";
import {
  Group as GroupIcon,
  ChevronLeft as ChevronLeftIcon,
} from "@material-ui/icons";
import { MemberListItem } from "./MemberListItem";
import { Members } from "../service/chat-service";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: { width: drawerWidth, flexShrink: 0 },
  drawerPaper: { width: drawerWidth },
  header: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  title: { flex: 1 },
  icon: { margin: theme.spacing(0, 1) },
}));

type Props = { open: boolean; closeMemberList: () => void; members: Members };

export const MemberList = ({ open, closeMemberList, members }: Props) => {
  const classes = useStyles();
  const memberIds = useMemo(() => Object.keys(members), [members]);

  const renderMembers = () =>
    memberIds.map((id) => (
      <MemberListItem
        key={id}
        name={members[id].name}
        left={members[id].left}
      />
    ));

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={open}
      classes={{ paper: classes.drawerPaper }}
    >
      <div className={classes.header}>
        <GroupIcon className={classes.icon} />
        <Typography variant="h6" className={classes.title}>
          Member List
        </Typography>
        <IconButton data-testid="close member list" onClick={closeMemberList}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <List>{renderMembers()}</List>
    </Drawer>
  );
};
