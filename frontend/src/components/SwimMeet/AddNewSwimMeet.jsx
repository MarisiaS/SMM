import "../../App.css";
import { Box, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { SmmApi } from "../../SmmApi.jsx";
import dayjs from "dayjs";
import SwimMeetForm from "./SwimMeetForm.jsx";
import AlertBox from "../Common/AlertBox.jsx";

const AddNewSwimMeet = () => {
  const [error, setError] = useState(false);
  const [errorOnLoading, setErrorOnLoading] = useState(false);
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [sites, setSites] = useState([{ id: "", name: "" }]);
  const [lastSwimMeetId, setLastSwimMeetId] = useState(null);

  const {
    handleSubmit,
    control,
    reset,
    register,
    formState: { isDirty },
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
        const _sites = response.data.results.map((site) => {
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
    navigate(`/SwimMeet`);
  };

  const handleAddEvents = () => {
    //Change it to add events for the swim meet generated
    navigate(`/NavBar`);
  };

  let actionButtonsSuccess = [{ label: "+ events", onClick: handleAddEvents }];

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
      setLastSwimMeetId(response.data.id);
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
      <Stack style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "300px",
        margin: "auto",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}>
        <AlertBox type={typeAlertLoading} message={messageOnLoading} />
      </Stack>
    );
  } else {
    return (
      <div>
        <Stack alignItems="center" justifyContent="space-between">
          <Stack>
            <div style={{ minHeight: !submitted ? "100px" : "0" }}></div>
            {submitted && (
              <AlertBox
                type={typeAlert}
                message={message}
                actionButtons={actionButtons}
              />
            )}
            <SwimMeetForm
              handleSubmit={handleSubmit(submission)}
              control={control}
              register={register}
              handleCancel={handleCancel}
              options={sites}
            />
          </Stack>
        </Stack>
      </div>
    );
  }
};

export default AddNewSwimMeet;
