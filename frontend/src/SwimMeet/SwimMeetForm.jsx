import "../App.css";
import { Box, Stack } from "@mui/material";
import MyTextField from "../components/FormElements/MyTextField.jsx";
import MyButton from "../components/FormElements/MyButton.jsx";
import MyDatePicker from "../components/FormElements/MyDatePicker.jsx";
import MyTimePicker from "../components/FormElements/MyTimePicker.jsx";
import MySelect from "../components/FormElements/MySelect.jsx";
import dayjs from "dayjs";

const SwimMeetForm = ({
  handleSubmit,
  control,
  handleCancel,
  options,
  isValid,
}) => {
  return (
    <form onSubmit={handleSubmit} className={"whiteBox"}>
      <Stack>
        <Box className={"itemBox"}>
          <MyTextField
            label={"Swim Meet Name"}
            name={"name"}
            control={control}
            rules={{ required: "Name is required" }}
          />
        </Box>
        <Box className={"itemBox"}>
          <MyDatePicker
            label={"Date"}
            name={"date"}
            control={control}
            disablePast={true}
            rules={{ required: "Date is required",
              validate: (value) => {
                if (!dayjs(value).isValid()) return "Invalid date";
                if (dayjs(value).startOf('day').isBefore(dayjs().startOf('day')))
                  return "Date cannot be in the past";
                return true;
              },
             }}
          />
        </Box>
        <Box className={"itemBox"}>
          <MyTimePicker
            label={"Time"}
            name={"time"}
            control={control}
            rules={{
              required: "Time is required",
              validate: (value) => {
                if (!dayjs(value).isValid()) return "Invalid time";
                return true;
              },
            }}
          />
        </Box>
        <Box className={"itemBox"}>
          <MySelect
            label={"Site"}
            name={"site"}
            control={control}
            options={options}
            rules={{
              required: "Site is required",
            }}
          />
        </Box>
      </Stack>
      <Stack className={"itemBox"}>
        <MyButton
          key={"create"}
          label={"Create"}
          type={"submit"}
          disabled={!isValid}
        />
        <Box sx={{ marginTop: 2 }}></Box>
        <MyButton
          key={"cancel"}
          label={"Go to Swim Meets"}
          onClick={handleCancel}
        />
      </Stack>
    </form>
  );
};

export default SwimMeetForm;
