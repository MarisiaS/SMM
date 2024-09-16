import "../App.css";
import { Box, Stack, Container } from "@mui/material";
import MyButton from "../components/FormElements/MyButton.jsx";
import MySelect from "../components/FormElements/MySelect.jsx";

const AddEventForm = ({ handleSubmit, control, handleCancel, options }) => {
  const { groups, eventTypes } = options;

  return (
    <form onSubmit={handleSubmit} className={"whiteBox"}>
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
        <Stack className={"itemBox"}>
          <MyButton key={"create"} label={"Create"} type={"submit"} />
          <Box sx={{ marginTop: 2 }}></Box>
          <MyButton
            key={"cancel"}
            label={"Go to Events"}
            onClick={handleCancel}
          />
        </Stack>
    </form>
  );
};

export default AddEventForm;
