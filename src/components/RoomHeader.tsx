import {
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  makeStyles,
} from "@material-ui/core";
import {
  Group as GroupIcon,
  ExitToApp as ExitToAppIcon,
} from "@material-ui/icons";
import clsx from "clsx";
import { Leave } from "../service/chat-service";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: { marginRight: theme.spacing(2) },
  hide: { display: "none" },
  title: { flex: 1 },
}));

type Props = {
  open: boolean;
  openMemberList: () => void;
  room: string;
  leave: Leave;
};

export const RoomHeader = ({ open, openMemberList, room, leave }: Props) => {
  const classes = useStyles();

  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, { [classes.appBarShift]: open })}
    >
      <Toolbar>
        <Tooltip title="Open Member List">
          <IconButton
            data-testid="open member list"
            color="inherit"
            edge="start"
            onClick={openMemberList}
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <GroupIcon />
          </IconButton>
        </Tooltip>
        <Typography variant="h6" noWrap className={classes.title}>
          {room}
        </Typography>
        <Tooltip title="Leave Room">
          <IconButton
            data-testid="leave room"
            color="inherit"
            onClick={leave}
            edge="end"
          >
            <ExitToAppIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};
