import "../App.css";
import { Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SmmApi } from "../SmmApi.jsx";
import AddEventForm from "./AddEventForm.jsx";
import AlertBox from "../components/Common/AlertBox.jsx";
import { Build as BuildIcon } from "@mui/icons-material";

const AddEvent = () => {
  const { meetId } = useParams();

  const [error, setError] = useState(false);
  const [errorOnLoading, setErrorOnLoading] = useState(false);
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [groups, setGroups] = useState([{ id: "", name: "", gender: "" }]);
  const [eventTypes, setEventTypes] = useState([{ id: "", name: "" }]);
  const [lastEventId, setLastEventId] = useState(null);

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
  let message = error
    ? "Unable to create the Event. Please try again!"
    : "Event created successfully.";

  let typeAlertLoading = errorOnLoading ? "error" : "success";
  let messageOnLoading = errorOnLoading
    ? "Data upload failed. Please try again!"
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
      try {
        const responseGroups = await SmmApi.getGroups();
        const _groups = responseGroups.data.results.map((groups) => {
          return {
            id: groups.id,
            name: groups.name,
          };
        });

        const responseEvents = await SmmApi.getEventTypes();
        const _eventTypes = responseEvents.data.results.map((eventTypes) => {
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
        console.log(error);
      }
    }
    fetchOptions();
    return () => {
      ignore = true;
    };
  }, []);

  const handleCancel = () => {
    navigate(`/events`);
  };

  const handleAddHeats = () => {
    //Change it to add heats for the new event
    navigate(`/heats`);
  };

  let actionButtonsSuccess = [
    { label: "heats", onClick: handleAddHeats, icon: <BuildIcon /> },
  ];

  let actionButtons = error ? [] : actionButtonsSuccess;

  const submission = async (data) => {
    setSubmitted(true);
    try {
      const response = await SmmApi.createEvent(meetId, data);
      setLastEventId(response.data.id);
    } catch (error) {
      setError(true);
      console.log(error);
    }
    reset({
      group: groups[0]?.id || "",
      event_type: eventTypes[0]?.id || "",
    });
  };

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
        <AlertBox type={typeAlertLoading} message={messageOnLoading} />
      </Stack>
    );
  } else {
    return (
      <div>
        <div style={{ minHeight: !submitted ? "100px" : "0" }}></div>
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
              handleCancel={handleCancel}
              options={{ groups, eventTypes }}
            />
          </Stack>
        </Stack>
      </div>
    );
  }
};

export default AddEvent;
