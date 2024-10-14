import { useState, useRef } from "react";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";
import { Grid, Box, Typography, FormHelperText } from "@mui/material";

const TimeField = ({ label, name, control, rules }) => {
  const inputRefs = useRef([null, null, null]);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const [time, setTime] = useState({
          minutes: "",
          seconds: "",
          milliseconds: "",
        });

        const handleChange = (field, newValue, currentIndex) => {
          const trimmedValue = newValue.slice(0, 2);
          setTime((prevTime) => {
            const updatedTime = { ...prevTime, [field]: trimmedValue };
            const formattedTime = `${
              updatedTime.minutes.padStart(2, "0") || "00"
            }:${updatedTime.seconds.padStart(2, "0") || "00"}.${
              updatedTime.milliseconds.padStart(2, "0") || "00"
            }`;
            if (formattedTime === "00:00.00") {
              onChange(null);
            } else {
              onChange(formattedTime);
            }
            if (
              trimmedValue.length === 2 &&
              currentIndex < inputRefs.current.length - 1
            ) {
              inputRefs.current[currentIndex + 1]?.focus();
            }
            return updatedTime;
          });
        };

        const handleKeyDown = (e, field, currentIndex) => {
          if (e.key === "Backspace" && !time[field]) {
            if (currentIndex > 0) {
              inputRefs.current[currentIndex - 1]?.focus();
            }
          } else if (e.key === "ArrowLeft" && currentIndex > 0) {
            inputRefs.current[currentIndex - 1]?.focus();
          } else if (
            e.key === "ArrowRight" &&
            currentIndex < inputRefs.current.length - 1
          ) {
            inputRefs.current[currentIndex + 1]?.focus();
          }
        };

        const handlePaste = (e) => {
          e.preventDefault();
          const pastedText = e.clipboardData
            .getData("text/plain")
            .replace(/\D/g, "");
          if (pastedText.length === 6) {
            setTime({
              minutes: pastedText.slice(0, 2),
              seconds: pastedText.slice(2, 4),
              milliseconds: pastedText.slice(4, 6),
            });
            onChange(
              `${pastedText.slice(0, 2)}:${pastedText.slice(
                2,
                4
              )}.${pastedText.slice(4, 6)}`
            );
            inputRefs.current[2]?.focus();
          }
        };

        return (
          <Box className={"myForm"}>
            <Typography variant="subtitle1" padding={0.5}>
              <Typography component="span" color="primary">
                {label}:{"  "}
              </Typography>
              <Typography component="span" color="black">
                {value}
              </Typography>
            </Typography>
            <Grid container direction="row" alignItems="center">
              <Grid item xs="auto">
                <TextField
                  label="MM"
                  value={time.minutes}
                  onChange={(e) => handleChange("minutes", e.target.value, 0)}
                  onKeyDown={(e) => handleKeyDown(e, "minutes", 0)}
                  inputRef={(el) => (inputRefs.current[0] = el)}
                  onPaste={handlePaste}
                  inputProps={{
                    placeholder: "MM",
                    maxLength: 2,
                  }}
                  error={!!error}
                  sx={{ maxWidth: 75 }}
                />
              </Grid>
              <Grid item xs="auto">
                <Typography
                  variant="subtitle1"
                  color="primary"
                  padding={0.5}
                  style={{ fontWeight: 600 }}
                >
                  :
                </Typography>
              </Grid>
              <Grid item xs="auto">
                <TextField
                  label="SS"
                  value={time.seconds}
                  onChange={(e) => handleChange("seconds", e.target.value, 1)}
                  onKeyDown={(e) => handleKeyDown(e, "seconds", 1)}
                  inputRef={(el) => (inputRefs.current[1] = el)}
                  onPaste={handlePaste}
                  inputProps={{
                    placeholder: "SS",
                    maxLength: 2,
                  }}
                  error={!!error}
                  sx={{ maxWidth: 75 }}
                />
              </Grid>
              <Grid item xs="auto">
                <Typography
                  variant="subtitle1"
                  color="primary"
                  padding={0.5}
                  style={{ fontWeight: 600 }}
                >
                  .
                </Typography>
              </Grid>
              <Grid item xs="auto">
                <TextField
                  label="ms"
                  value={time.milliseconds}
                  onChange={(e) =>
                    handleChange("milliseconds", e.target.value, 2)
                  }
                  onKeyDown={(e) => handleKeyDown(e, "milliseconds", 2)}
                  inputRef={(el) => (inputRefs.current[2] = el)}
                  onPaste={handlePaste}
                  inputProps={{
                    placeholder: "ms",
                    maxLength: 2,
                  }}
                  error={!!error}
                  sx={{ maxWidth: 75 }}
                />
              </Grid>
            </Grid>
            {error && (
              <FormHelperText padding={2} error>
                {error.message}
              </FormHelperText>
            )}
          </Box>
        );
      }}
    />
  );
};

export default TimeField;