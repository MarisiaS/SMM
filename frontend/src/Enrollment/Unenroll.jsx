import "../App.css";
import { Box, Stack, Typography, Divider } from "@mui/material";
import { SmmApi } from "../SmmApi.jsx";
import MyButton from "../components/FormElements/MyButton.jsx";
import AlertBox from "../components/Common/AlertBox.jsx";
import { useState } from "react";

const Unenroll = ({ athlete, meetId, onBack, setChangeEnrollment }) => {
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  let typeAlert = error ? "error" : "success";
  let message = error
    ? "Unable to unenroll athlete, an unexpected error occurred. Please try again!"
    : `Successfully unenrolled ${athlete.full_name} from the swim meet`;

  const handleUnenroll = async () => {
    let unenrollmentSuccessful = false;
    try {
      await SmmApi.deleteEnrolledAthlete(meetId, { athlete_id: athlete.id });
      setChangeEnrollment(true);
      setError(false);
      unenrollmentSuccessful = true;
    } catch (error) {
      setError(true);
    }
    setSubmitted(true);
    console.log(error);
    setTimeout(() => {
      if (unenrollmentSuccessful) {
        onBack();
      }
      setSubmitted(false);
    }, 2000);
  };

  return (
    <div
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack alignItems="center" justifyContent="space-between">
        <Stack alignItems="center" justifyContent="space-between">
          {!submitted && <div style={{ minHeight: "100px" }} />}
          {submitted && <AlertBox type={typeAlert} message={message} />}
        </Stack>
        <Stack className={"whiteBox"}>
          <Stack>
            <Box>
              <Typography
                variant="subtitle1"
                color="primary"
                padding={0.5}
                align="center"
                style={{ fontWeight: 600 }}
              >
                UNENROLL ATHLETE
              </Typography>
            </Box>
            <Divider sx={{ borderBottomWidth: 3 }} />
            <Box className={"itemBox"}>
              <Typography
                variant="caption"
                color="primary"
                padding={0.5}
                align="center"
                style={{ fontWeight: 300 }}
              >
                Please confirm if you want to unenroll{" "}
                <strong>{athlete.full_name}</strong> from the swim meet, or
                click Cancel to keep them enrolled.
              </Typography>
            </Box>
          </Stack>
          <Stack className={"itemBox"}>
            <MyButton
              key={"confirm"}
              label={"Confirm"}
              onClick={handleUnenroll}
            />
            <Box sx={{ marginTop: 2 }} />
            <MyButton key={"cancel"} label={"Cancel"} onClick={onBack} />
          </Stack>
        </Stack>
      </Stack>
      <div style={{ minHeight: "100px" }}></div>
    </div>
  );
};

export default Unenroll;
