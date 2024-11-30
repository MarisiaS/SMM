import "../App.css";
import { Box, Stack } from "@mui/material";
import MyTextField from "../components/FormElements/MyTextField.jsx";
import MyButton from "../components/FormElements/MyButton.jsx";
import MyDatePicker from "../components/FormElements/MyDatePicker.jsx";
import MySelect from "../components/FormElements/MySelect.jsx";
import dayjs from "dayjs";

const AthleteForm = ({
  handleSubmit,
  control,
  onCancel,
  isValid,
}) => {
  const  gender_options =[{"id":1, "name": "Girl"},{"id":2, "name": "Boy"}];
  return (
    <form onSubmit={handleSubmit} className={"whiteBox"}>
      <Stack>
        <Box className={"itemBox"}>
          <MyTextField
            id={"first_name"}
            label={"First Name"}
            name={"first_name"}
            control={control}
            rules={{ required: "First Name is required" }}
          />
        </Box>
        <Box className={"itemBox"}>
          <MyTextField
            id={"last_name"}
            label={"Last Name"}
            name={"last_name"}
            control={control}
            rules={{ required: "Last Name is required" }}
          />
        </Box>
        <Box className={"itemBox"}>
          <MyDatePicker
            id={"date_of_birth"}
            label={"Date Of Birth"}
            name={"date_of_birth"}
            control={control}
            disableFuture={true}
            rules={{ required: "Date Of Birth is required",
              validate: (value) => {
                if (!dayjs(value).isValid()) return "Invalid date";
                if (dayjs(value).startOf('day').isAfter(dayjs().startOf('day')))
                  return "Date cannot be in the future";
                return true;
              },
             }}
          />
        </Box>
        <Box className={"itemBox"}>
          <MySelect
            id={"gender"}
            label={"Gender"}
            name={"gender"}
            control={control}
            options={gender_options}
            rules={{
              required: "Gender is required",
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
          label={"Go to Athlete"}
          onClick={onCancel}
        />
      </Stack>
    </form>
  );
};

export default AthleteForm;