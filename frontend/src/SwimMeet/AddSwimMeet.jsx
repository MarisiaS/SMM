import { Add as AddIcon } from "@mui/icons-material";
import { Stack } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "../App.css";
import AlertBox from "../components/Common/AlertBox.jsx";
import { SmmApi } from "../SmmApi.jsx";
import SwimMeetForm from "./SwimMeetForm.jsx";

const AddSwimMeet = () => {
  const [error, setError] = useState(false);
  const [errorOnLoading, setErrorOnLoading] = useState(false);
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [sites, setSites] = useState([{ id: "", name: "" }]);
  const [lastSwimMeetData, setLastSwimMeetData] = useState(null);

  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty, isValid },
  } = useForm({
    defaultValues: {
      name: "",
      date: dayjs(Date.now()),
      time: dayjs(Date.now()),
      site: "",
    },
    mode: "onChange",
  });

  let typeAlert = error ? "error" : "success";
  let message = error
    ? "Unable to create the Swim Meet. Please try again!"
    : "Swim meet created successfully.";

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
        const response = await SmmApi.getSites();
        const _sites = response.map((site) => {
          return {
            id: site.id,
            name: site.name,
          };
        });
        if (!ignore) {
          setSites(_sites);
          reset({
            name: "",
            date: dayjs(Date.now()),
            time: dayjs(Date.now()),
            site: _sites[0]?.id || "",
          });
        }
      } catch (error) {
        setErrorOnLoading(true);
      }
    }
    fetchOptions();
    return () => {
      ignore = true;
    };
  }, []);

  const handleCancel = () => {
    navigate(`/swim-meets`);
  };

  const handleAddEvents = () => {
    navigate(`/swim-meets/${lastSwimMeetData.id}/events`, {
      state: { showAddEvent: true, meetData: lastSwimMeetData },
    });
  };

  let actionButtonsSuccess = [
    { label: "events", onClick: handleAddEvents, icon: <AddIcon /> },
  ];

  let actionButtons = error ? [] : actionButtonsSuccess;

  const submission = async (data) => {
    console.log(data);
    const time = dayjs(data.time).format("HH:mm");
    //To get an error use this date
    //const date = dayjs(data.date);
    const date = dayjs(data.date).format("YYYY-MM-DD");
    const formatData = {
      ...data,
      date: date,
      time: time,
    };
    setSubmitted(true);
    try {
      const response = await SmmApi.createSwimMeet(formatData);
      const formattedResponse = {
        ...response.data,
        date: dayjs(response.data.date).format("MM/DD/YYYY"),
      };
      setLastSwimMeetData(formattedResponse);
    } catch (error) {
      setError(true);
    }
    reset({
      name: "",
      date: dayjs(Date.now()),
      time: dayjs(Date.now()),
      site: sites[0].id,
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
            <SwimMeetForm
              handleSubmit={handleSubmit(submission)}
              control={control}
              handleCancel={handleCancel}
              options={sites}
              isValid={isValid}
            />
          </Stack>
        </Stack>
      </div>
    );
  }
};

export default AddSwimMeet;
