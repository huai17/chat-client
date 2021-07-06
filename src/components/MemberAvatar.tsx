import { Avatar, Badge, Tooltip, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  badgeColorPrimary: { background: theme.palette.success.main },
}));

type Props = { name: string; left: boolean };

export const MemberAvatar = ({ name, left }: Props) => {
  const classes = useStyles();

  return (
    <Badge
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      badgeContent=" "
      overlap="circle"
      color={left ? "error" : "primary"}
      classes={{ colorPrimary: classes.badgeColorPrimary }}
    >
      <Tooltip title={name}>
        <Avatar>{name[0]}</Avatar>
      </Tooltip>
    </Badge>
  );
};
