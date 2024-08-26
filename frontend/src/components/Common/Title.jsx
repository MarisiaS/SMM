import { Typography } from "@mui/material";
import { useTheme } from "@mui/material";

export default function Title({ message }) {
  const theme = useTheme();

  return (
    <Typography
      variant="h4"
      component="div"
      sx={{ padding: 2, textAlign: "center", color: "text.secondary" }}
    >
      {message}
    </Typography>
  );
}