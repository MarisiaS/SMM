import { useState} from "react";
import {
  MenuItem,
  ListItemText,
  Checkbox,
  Select,
  useTheme,
  Box
} from "@mui/material";

const MultiSelectWithTags = ({
  label,
  options,
  setLastSelected,
  selectedOptions,
  setSelectedOptions,
}) => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    if (value.length > selectedOptions.length) {
      setLastSelected(value[value.length - 1]);
    }
    setSelectedOptions(value);
    setIsOpen(false);
  };

  return (
    <div>
        <Select
          id="multi-select-with-tags"
          sx={{ width: 300, height: 50 }}
          multiple
          value={selectedOptions.length > 0 ? selectedOptions : ["placeholder"]}
          onChange={handleChange}
          onClose={() => setIsOpen(false)}
          onOpen={() => setIsOpen(true)}
          open={isOpen}
          renderValue={(selected) =>
            <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: theme.palette.primary.dark,
              fontWeight: "bolder",
            }}
          >
            {label}
          </Box>
          }
        >
          {options.map((option) => (
            <MenuItem
              key={option.id}
              value={option.id}
              disabled={selectedOptions.includes(option.id)}
            >
              <Checkbox checked={selectedOptions.includes(option.id)} />
              <ListItemText primary={option.name} />
            </MenuItem>
          ))}
        </Select>
    </div>
  );
};

export default MultiSelectWithTags;
