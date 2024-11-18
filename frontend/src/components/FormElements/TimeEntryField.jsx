import {
  Box,
  FormHelperText,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { useRef, useState } from "react";
import { Controller } from "react-hook-form";

const TimeEntryField = ({ label, name, control, rules, aditional_options }) => {
  const inputRefs = useRef([null, null, null]);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const [time, setTime] = useState({
          option: "",
          minutes: "",
          seconds: "",
          milliseconds: "",
        });

        const handleChange = (field, newValue, currentIndex) => {
          if (field === "option") {
            setTime((prevTime) => {
              const updatedTime = {
                minutes: "",
                seconds: "",
                milliseconds: "",
                option: newValue === prevTime.option ? "" : newValue,
              };
              onChange(updatedTime.option || null);
              return updatedTime;
            });
          } else {
            setTime((prevTime) => {
              const updatedTime = {
                ...prevTime,
                [field]: newValue,
                option: "",
              };
              const formattedTime = `${
                updatedTime.minutes.padStart(2, "0") || "00"
              }:${updatedTime.seconds.padStart(2, "0") || "00"}.${
                updatedTime.milliseconds.padEnd(2, "0") || "00"
              }`;
              if (formattedTime === "00:00.00") {
                onChange(null);
              } else {
                onChange(formattedTime);
              }
              if (
                newValue.length === 2 &&
                currentIndex < inputRefs.current.length - 1
              ) {
                inputRefs.current[currentIndex + 1]?.focus();
              }
              return updatedTime;
            });
          }
        };

        const handleKeyDown = (e, field, currentIndex) => {
          if (e.key === "Backspace" && !time[field]) {
            if (currentIndex > 0) {
              e.preventDefault();
              const prevInput = inputRefs.current[currentIndex - 1];
              if (prevInput) {
                prevInput.focus();
                setTimeout(() => {
                  prevInput.setSelectionRange(
                    prevInput.value.length,
                    prevInput.value.length
                  );
                }, 0);
              }
            }
          } else if (e.key === "ArrowLeft" && currentIndex > 0) {
            e.preventDefault();
            const prevInput = inputRefs.current[currentIndex - 1];
            if (prevInput) {
              prevInput.focus();
              setTimeout(() => {
                prevInput.setSelectionRange(
                  prevInput.value.length,
                  prevInput.value.length
                );
              }, 0);
            }
          } else if (
            e.key === "ArrowRight" &&
            currentIndex < inputRefs.current.length - 1
          ) {
            e.preventDefault();
            const nextInput = inputRefs.current[currentIndex + 1];
            if (nextInput) {
              nextInput.focus();
              setTimeout(() => {
                nextInput.setSelectionRange(
                  nextInput.value.length,
                  nextInput.value.length
                );
              }, 0);
            }
          }
        };

        const handlePaste = (e, focusedField) => {
          e.preventDefault();
          const pastedText = e.clipboardData.getData("text/plain");
          switch (focusedField) {
            case "minutes":
              const minutePattern = /^(\d{1,2}):?(\d{2})?\.?(\d{0,2})?$/;
              const minuteMatch = pastedText.match(minutePattern);
              if (minuteMatch) {
                const [_, minutes, seconds = "00", milliseconds = "00"] =
                  minuteMatch;
                let shouldPaste = true;
                if (!minuteMatch[2] && minuteMatch[3]) {
                  shouldPaste = false;
                }
                if (shouldPaste) {
                  setTime({
                    minutes: minutes.padStart(2, "0"),
                    seconds: seconds,
                    milliseconds: milliseconds.padEnd(2, "0"),
                  });
                  onChange(
                    `${minutes.padStart(
                      2,
                      "0"
                    )}:${seconds}.${milliseconds.padEnd(2, "0")}`
                  );
                  inputRefs.current[2]?.focus();
                }
              }
              break;
            case "seconds":
              const secondPattern = /^(\d{1,2})\.?(\d{0,2})$/;
              const secondMatch = pastedText.match(secondPattern);
              if (secondMatch) {
                const [_, seconds, milliseconds = "00"] = secondMatch;
                setTime({
                  minutes: "00",
                  seconds: seconds.padStart(2, "0"),
                  milliseconds: milliseconds.padEnd(2, "0"),
                });
                onChange(
                  `${"00"}:${seconds.padStart(2, "0")}.${milliseconds.padEnd(
                    2,
                    "0"
                  )}`
                );
                inputRefs.current[2]?.focus();
              }
              break;
            case "milliseconds":
              const millisecondsPattern = /^(\d{1,2})$/;
              const millisecondsMatch = pastedText.match(millisecondsPattern);
              if (millisecondsMatch) {
                const [_, milliseconds] = millisecondsMatch;
                setTime({
                  minutes: "00",
                  seconds: "00",
                  milliseconds: milliseconds.padEnd(2, "0"),
                });
                onChange(`${"00"}:${"00"}.${milliseconds.padEnd(2, "0")}`);
              }
              break;
          }
        };

        return (
          <Box className={"myForm"}>
            {label && (
              <Typography variant="subtitle1" padding={0.5}>
                <Typography component="span" color="primary">
                  {label}:{" "}
                </Typography>
                <Typography component="span" color="black">
                  {value}
                </Typography>
              </Typography>
            )}
            <Grid
              container
              spacing={0}
              alignItems="center"
              justifyContent="flex-start"
              direction="row"
              wrap="nowrap"
              sx={{
                border: error ? "2px solid red" : "none",
                padding: error ? 0.5 : 0,
                borderRadius: 1,
                marginLeft: error ? "-5px" : "0",
                width: error ? "102%" : "100%",
              }}
            >
              <Grid item xs="auto">
                <TextField
                  label="MM"
                  value={time.minutes}
                  onChange={(e) => handleChange("minutes", e.target.value, 0)}
                  onKeyDown={(e) => handleKeyDown(e, "minutes", 0)}
                  inputRef={(el) => (inputRefs.current[0] = el)}
                  onPaste={(e) => handlePaste(e, "minutes")}
                  inputProps={{
                    placeholder: "MM",
                    maxLength: 2,
                  }}
                  sx={{ maxWidth: 75 }}
                  disabled={!!time.status}
                />
              </Grid>
              <Grid item>
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
                  onPaste={(e) => handlePaste(e, "seconds")}
                  inputProps={{
                    placeholder: "SS",
                    maxLength: 2,
                  }}
                  sx={{ maxWidth: 75 }}
                  disabled={!!time.status}
                />
              </Grid>
              <Grid item>
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
                  onPaste={(e) => handlePaste(e, "milliseconds")}
                  inputProps={{
                    placeholder: "ms",
                    maxLength: 2,
                  }}
                  sx={{ maxWidth: 75 }}
                  disabled={!!time.status}
                />
              </Grid>
              {aditional_options && (
                <>
                  <Grid item xs="auto">
                    <Box
                      sx={{
                        borderLeft: "2px solid gray",
                        height: "56px",
                        marginLeft: 2,
                        marginRight: 2,
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <ToggleButtonGroup
                      value={time.option}
                      exclusive
                      onChange={(_, newStatus) =>
                        handleChange("option", newStatus)
                      }
                      aria-label="Options"
                      sx={{ alignSelf: "flex-start" }}
                    >
                      {aditional_options.map((option,index) => {
                        return (
                          <ToggleButton
                            key={index}
                            value={option}
                            sx={{ height: 56 }}
                          >
                            {option}
                          </ToggleButton>
                        );
                      })}
                    </ToggleButtonGroup>
                  </Grid>
                </>
              )}
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

export default TimeEntryField;
