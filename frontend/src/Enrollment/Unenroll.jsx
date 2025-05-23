import "../App.css";
import {
  Box,
  Stack,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import { SmmApi } from "../SmmApi.jsx";
import MyButton from "../components/FormElements/MyButton.jsx";
import AlertBox from "../components/Common/AlertBox.jsx";
import { useState, useEffect } from "react";

const Unenroll = ({ athlete, meetId, onBack, setChangeEnrollment }) => {
  const [canUnenroll, setCanUnenroll] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorOnLoading, setErrorOnLoading] = useState(false);
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  let typeAlert = error ? "error" : "success";
  let message = error
    ? error
    : `Successfully unenrolled ${athlete.full_name} from the swim meet`;

  useEffect(() => {
    let ignore = false;
    async function fetchCanUnenroll() {
      setLoading(true);
      setErrorOnLoading(false);
      try {
        const response = await SmmApi.getAthleteUnenrollCheck(
          meetId,
          athlete.id
        );
        if (!ignore) {
          setCanUnenroll(response.can_unenroll);
        }
      } catch (error) {
        setErrorOnLoading(true);
      } finally {
        setLoading(false);
      }
    }
    fetchCanUnenroll();
    return () => {
      ignore = true;
    };
  }, []);

  const handleUnenroll = async () => {
    setSubmitted(false);
    let unenrollmentSuccessful = false;
    try {
      await SmmApi.deleteEnrolledAthlete(meetId, { athlete_id: athlete.id });
      setChangeEnrollment(true);
      setError(false);
      unenrollmentSuccessful = true;
    } catch (error) {
      if (
        error.response?.data?.error ===
        "Athlete cannot be unenrolled because they have already competed."
      ) {
        setError(error.response.data.error);
      } else {
        setError(
          "Unable to unenroll athlete, an unexpected error occurred. Please try again!"
        );
      }
    }
    setSubmitted(true);
    setTimeout(() => {
      if (unenrollmentSuccessful) {
        onBack();
      }
    }, 2000);
  };

  const Header = () => (
    <>
      <Box>
        <Typography
          variant="subtitle1"
          color="primary"
          padding={0.5}
          align="center"
          sx={{ fontWeight: 600 }}
        >
          UNENROLL
        </Typography>
      </Box>
      <Divider sx={{ borderBottomWidth: 3 }} />
    </>
  );

  const AthleteMessage = ({ text }) => (
    <>
      <Box>
        <Typography variant="subtitle1" padding={1} align="center" color="primary">
          {athlete.full_name}
        </Typography>
      </Box>
      <Box>
        <Typography
          variant="caption"
          color="primary"
          padding={0.5}
          align="left"
          sx={{ fontWeight: 300 }}
        >
          {text}
        </Typography>
      </Box>
    </>
  );

  const renderButtons = (canConfirm = false) => (
    <Stack className="itemBox">
      {canConfirm ? (
        <>
          <MyButton key="confirm" label="Confirm" onClick={handleUnenroll} />
          <Box sx={{ marginTop: 2 }} />
        </>
      ) : (
        <Box sx={{ marginTop: 8 }} />
      )}
      <MyButton key="cancel" label="Cancel" onClick={onBack} />
    </Stack>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <Stack
          alignItems="center"
          justifyContent="center"
          style={{ height: "100px" }}
        >
          <CircularProgress />
        </Stack>
      );
    }

    if (errorOnLoading) {
      return (
        <Stack
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            width: "300px",
            margin: "auto",
          }}
        >
          <AlertBox
            type="error"
            message="We were unable to load the required data. Please try again."
          />
        </Stack>
      );
    }

    let contentMessage = "";
    let allowConfirm = false;

    if (canUnenroll === true) {
      contentMessage = (
        <>
          Click <strong>Confirm</strong> to unenroll this athlete from the swim
          meet, or <strong>Cancel</strong> to keep them enrolled.
        </>
      );
      allowConfirm = true;
    } else if (canUnenroll === false) {
      contentMessage = (
        <>
          This athlete cannot be unenrolled because they have already competed
          in at least one event.
        </>
      );
    }

    return (
      <Stack alignItems="center" justifyContent="space-between">
        <Stack alignItems="center">
          {!submitted ? (
            <div style={{ minHeight: "100px" }} />
          ) : (
            <AlertBox type={typeAlert} message={message} />
          )}
        </Stack>
        <Stack className="whiteBox">
          <Stack>
            <Header />
            <AthleteMessage text={contentMessage} />
          </Stack>
          <Stack>{renderButtons(allowConfirm)}</Stack>
        </Stack>
        <div style={{ minHeight: "100px" }} />
      </Stack>
    );
  };

  return (
    <div
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {renderContent()}
    </div>
  );
};

export default Unenroll;
