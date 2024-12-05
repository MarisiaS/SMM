import "../App.css";
import { Box, Stack, Typography, Divider } from "@mui/material";
import TimeEntryField from "../components/FormElements/TimeEntryField.jsx";
import MyButton from "../components/FormElements/MyButton.jsx";

const UpdateHeatTimeForm = ({
  handleSubmit,
  control,
  handleCancel,
  data,
  isValid,
}) => {
  return (
    <form onSubmit={handleSubmit} className={"whiteBox"}>
      <Stack>
        <Box>
          <Typography
            variant="subtitle1"
            color="primary"
            padding={0.5}
            align="center"
            style={{ fontWeight: 600 }}
          >
            UPDATE HEAT TIME
          </Typography>
        </Box>
        <Divider sx={{ borderBottomWidth: 3 }}></Divider>
        <Box>
          <Typography variant="h6" padding={1} align="center" color="primary">
            {data.athlete_name}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle1" padding={0.5} color="primary">
            Current Heat Time: {data.heat_time}
          </Typography>
        </Box>
        <Box className={"itemBox"}>
          <TimeEntryField
            label={"New Heat Time"}
            name={"heat_time"}
            control={control}
            rules={{
              required: "Heat time is required",
              pattern: {
                value: /^([0-5]?[0-9]):[0-5][0-9]\.[0-9]{1,2}$/,
                message: "Invalid time format",
              },
            }}
          />
        </Box>
      </Stack>
      <Stack className={"itemBox"}>
        <MyButton
          key={"create"}
          label={"Update"}
          type={"submit"}
          disabled={!isValid}
        />
        <Box sx={{ marginTop: 2 }}></Box>
        <MyButton key={"cancel"} label={"Cancel"} onClick={handleCancel} />
      </Stack>
    </form>
  );
};

export default UpdateHeatTimeForm;
