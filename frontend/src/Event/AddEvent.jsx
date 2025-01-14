import { Build as BuildIcon } from "@mui/icons-material";
import { CircularProgress, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import "../App.css";
import AlertBox from "../components/Common/AlertBox.jsx";
import { SmmApi } from "../SmmApi.jsx";
import AddEventForm from "./AddEventForm.jsx";

const AddEvent = ({ onBack, onCreateHeats, onCreateEvent }) => {
  const { meetId } = useParams();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorOnLoading, setErrorOnLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [groups, setGroups] = useState([{ id: "", name: "", gender: "" }]);
  const [eventTypes, setEventTypes] = useState([{ id: "", name: "" }]);
  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      group: "",
      event_type: "",
    },
    mode: "onChange",
  });

  let typeAlert = error ? "error" : "success";
  let message = error ? error : "Event created successfully.";

  let typeAlertLoading = errorOnLoading ? "error" : "success";
  let messageOnLoading = errorOnLoading
    ? "Unable to load Event types and Groups. Please try again!"
    : "";

  useEffect(() => {
    if (isDirty) {
      setSubmitted(false);
      setError(false);
    }
  }, [isDirty]);

  useEffect(() => {
    let ignore = false;
    async function fetchOptions() {
      setLoading(true);
      try {
        const [responseGroups, responseEventTypes] = await Promise.all([
          SmmApi.getGroups(),
          SmmApi.getEventTypes(),
        ]);
        const _groups = responseGroups.map((groups) => {
          return {
            id: groups.id,
            name: groups.name,
          };
        });
        const _eventTypes = responseEventTypes.map((eventTypes) => {
          return {
            id: eventTypes.id,
            name: eventTypes.name,
          };
        });
        if (!ignore) {
          setGroups(_groups);
          setEventTypes(_eventTypes);

          reset({
            event_type: _eventTypes[0]?.id || "",
            group: _groups[0]?.id || "",
          });
        }
      } catch (error) {
        setErrorOnLoading(true);
      } finally {
        setLoading(false);
      }
    }
    fetchOptions();
    return () => {
      ignore = true;
    };
  }, []);

  let actionButtonsSuccess = [
    {
      label: "Create Heats",
      onClick: onCreateHeats,
      icon: <BuildIcon />,
    },
  ];

  let actionButtons = error ? [] : actionButtonsSuccess;

  const submission = async (data) => {
    try {
      const response = await SmmApi.createEvent(meetId, data);
      onCreateEvent();
      setError(false);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const nonFieldErrorMessage = error.response.data.non_field_errors
          ? "An Event with this group and event type already exists for the swim meet."
          : "Unable to create the Event, an unexpected error occurred. Please try again!";
        setError(nonFieldErrorMessage);
      } else {
        setError(
          "Unable to create the Event, an unexpected error occurred. Please try again!"
        );
      }
    }
    setSubmitted(true);
    reset({
      group: groups[0]?.id || "",
      event_type: eventTypes[0]?.id || "",
    });
  };

  let actionButtonsErrorOnLoading = [
    { label: "Go to Events", onClick: onBack },
  ];

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
            width: "650px",
            margin: "auto",
          }}
        >
          <AlertBox
            type={typeAlertLoading}
            message={messageOnLoading}
            actionButtons={actionButtonsErrorOnLoading}
          />
        </Stack>
      );
    }
    return (
      <div>
        {!submitted && <div style={{ minHeight: "100px" }} />}
        <Stack alignItems="center" justifyContent="space-between">
          <Stack alignItems="center" justifyContent="space-between">
            {submitted && (
              <AlertBox
                type={typeAlert}
                message={message}
                actionButtons={actionButtons}
              />
            )}
          </Stack>
          <Stack alignItems="center" justifyContent="space-between">
            <AddEventForm
              handleSubmit={handleSubmit(submission)}
              control={control}
              handleCancel={onBack}
              options={{ groups, eventTypes }}
            />
          </Stack>
        </Stack>
      </div>
    );
  };

  return <div>{renderContent()}</div>;
};

export default AddEvent;
