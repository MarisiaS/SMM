import { Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material";

export default function Title({ data, fields }) {
  const theme = useTheme();

  return (
    <Box sx={{ textAlign: "center", padding: 2 }}>
      {fields.map((field, index) => (
        <Typography
          key={index}
          variant={index === 0 ? "h4" : "h6"}
          component="div"
          sx={{ color: "text.secondary" }}
        >
          {data[field]}
        </Typography>
      ))}
    </Box>
  );
}
