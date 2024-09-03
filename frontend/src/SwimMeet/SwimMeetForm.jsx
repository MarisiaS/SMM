import "../App.css";
import { Box, Stack, Container } from "@mui/material";
import MyTextField from "../components/FormElements/MyTextField.jsx";
import MyButton from "../components/FormElements/MyButton.jsx";
import MyDatePicker from "../components/FormElements/MyDatePicker.jsx";
import MyTimePicker from "../components/FormElements/MyTimePicker.jsx";
import MySelect from "../components/FormElements/MySelect.jsx";

const SwimMeetForm = ({ handleSubmit, control, handleCancel, options }) => {
  return (
    <form onSubmit={handleSubmit} className={"whiteBox"}>
      <Stack alignItems="center" justifyContent="space-between">
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
              rules={{ required: "Date is required" }}
            />
          </Box>
          <Box className={"itemBox"}>
            <MyTimePicker
              label={"Time"}
              name={"time"}
              control={control}
              rules={{ required: "Time is required" }}
            />
          </Box>
          <Box className={"itemBox"}>
            <MySelect
              label={"Site"}
              name={"site"}
              control={control}
              options={options}
              rules={{ required: "Site is required" }}
            />
          </Box>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box className={"itemBox"} sx={{ marginLeft: 5 }}>
            <MyButton key={"cancel"} label={"Cancel"} onClick={handleCancel} />
          </Box>
          <Box sx={{ marginLeft: 5, marginRight: 5 }}></Box>
          <Box className={"itemBox"} sx={{ marginRight: 5 }}>
            <MyButton key={"create"} label={"Create"} type={"submit"} />
          </Box>
        </Stack>
      </Stack>
    </form>
  );
};

export default SwimMeetForm;