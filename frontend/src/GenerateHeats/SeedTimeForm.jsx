import "../App.css";
import { Box, Stack, Typography, Divider } from "@mui/material";
import TimeField from "../components/FormElements/TimeField.jsx";
import MyButton from "../components/FormElements/MyButton.jsx";
import MyDatePicker from "../components/FormElements/MyDatePicker.jsx";
import dayjs from "dayjs";

const SeedTimeForm = ({
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
            UPDATE SEED TIME
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
            Current Seed Time: {data.seed_time}
          </Typography>
        </Box>
        <Box className={"itemBox"}>
          <TimeField
            label={"New Seed Time"}
            name={"seed_time"}
            control={control}
            rules={{
              required: "Seed time is required",
              pattern: {
                value: /^([0-5]?[0-9]):[0-5][0-9]\.[0-9]{1,2}$/,
                message: "Invalid time format",
              },
            }}
          />
        </Box>
        <Box className={"itemBox"}>
          <MyDatePicker
            label={"Date"}
            name={"date"}
            control={control}
            disableFuture={true}
            rules={{
              required: "Date is required",
              validate: (value) => {
                if (!dayjs(value).isValid()) return "Invalid date";
                if (dayjs(value).isAfter(dayjs()))
                  return "Date cannot be in the future";
                return true;
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

export default SeedTimeForm;
