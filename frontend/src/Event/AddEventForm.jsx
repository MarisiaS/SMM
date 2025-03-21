import "../App.css";
import { Box, Stack, Typography, Divider } from "@mui/material";
import MyButton from "../components/FormElements/MyButton.jsx";
import MySelect from "../components/FormElements/MySelect.jsx";

const AddEventForm = ({
  handleSubmit,
  control,
  handleCancel,
  options,
  isValid,
}) => {
  const { groups, eventTypes } = options;

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
            {"ADD EVENT"}
          </Typography>
        </Box>
        <Divider sx={{ borderBottomWidth: 3 }}></Divider>
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
        <MyButton
          key={"create"}
          label={"Create"}
          type={"submit"}
          disabled={!isValid}
        />
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
