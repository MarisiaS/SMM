import { useState, useMemo } from "react";
import {
  InputLabel,
  MenuItem,
  ListItemText,
  Checkbox,
  Select,
  useTheme,
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

  const filteredOptions = useMemo(() =>
    options.filter((option) => !selectedOptions.includes(option.id)),
    [options, selectedOptions]
  );

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

  const allOptionsSelected = selectedOptions.length === options.length;

  return (
    <div>
      <InputLabel
        id="label-multi-select-tags"
        sx={{
          color: allOptionsSelected ? "gray" : theme.palette.primary.main,
        }}
      >
        {label}
      </InputLabel>
      <Select
        labelId="multi-select-with-tags"
        id="multi-select-with-tags"
        sx={{ width: 300, height: 50 }}
        multiple
        value={selectedOptions}
        onChange={handleChange}
        onClose={() => setIsOpen(false)}
        onOpen={() => setIsOpen(true)}
        open={isOpen}
        renderValue={() => null}
        disabled={allOptionsSelected}
      >
        {filteredOptions
          .map((option) => (
            <MenuItem key={option.id} value={option.id}>
              <Checkbox checked={selectedOptions.includes(option.id)} />
              <ListItemText primary={option.name} />
            </MenuItem>
          ))}
      </Select>
    </div>
  );
};

export default MultiSelectWithTags;