import "../App.css";
import { Box, Stack, Container } from "@mui/material";
import MyButton from "../components/FormElements/MyButton.jsx";
import MySelect from "../components/FormElements/MySelect.jsx";

const AddEventForm = ({ handleSubmit, control, handleCancel, options }) => {
  const { groups, eventTypes } = options;

  return (
    <form onSubmit={handleSubmit} className={"whiteBox"}>
      <Stack alignItems="center" justifyContent="space-between">
        <Stack>
          <Box className={"itemBox"}>
            <MySelect
              label={"Group"}
              name={"group"}
              control={control}
              options={groups}
              rules={{ required: "Group is required" }}
            />
          </Box>
          <Box className={"itemBox"}>
            <MySelect
              label={"Event Type"}
              name={"event_type"}
              control={control}
              options={eventTypes}
              rules={{ required: "Event Type is required" }}
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

export default AddEventForm;
