import { Add as AddIcon } from "@mui/icons-material";
import { CircularProgress, Stack } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "../App.css";
import AlertBox from "../components/Common/AlertBox.jsx";
import { SmmApi } from "../SmmApi.jsx";
import SwimMeetForm from "./SwimMeetForm.jsx";

const AddSwimMeet = ({ onCancel }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorOnLoading, setErrorOnLoading] = useState(false);
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [sites, setSites] = useState([{ id: "", name: "" }]);
  const [lastSwimMeetData, setLastSwimMeetData] = useState(null);

  const {
    handleSubmit,
    control,
    reset,
    watch,
    resetField,
    formState: { isDirty, isValid },
  } = useForm({
    defaultValues: {
      name: "",
      date: dayjs(Date.now()),
      time: dayjs(Date.now()),
      site: "",
      num_lanes: "",
    },
    mode: "onChange",
  });

  let typeAlert = error ? "error" : "success";
  let message = error
    ? "Unable to create the Swim Meet. Please try again!"
    : "Swim meet created successfully.";

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
      setErrorOnLoading(false);
      try {
        const response = await SmmApi.getSites();
        const _sites = response.map((site) => {
          return {
            id: site.id,
            name: site.name,
            num_lanes: site.num_lanes,
          };
        });
        if (!ignore) {
          setSites(_sites);
          reset({
            name: "",
            date: dayjs(Date.now()),
            time: dayjs(Date.now()),
            site: "",
            num_lanes: "",
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

  const handleCancel = () => {
    onCancel();
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
      site: "",
      num_lanes: "",
    });
  };

  let actionButtonsErrorOnLoading = [
    { label: "Go to Swim Meets", onClick: handleCancel },
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
            width: "550px",
            margin: "auto",
          }}
        >
          <AlertBox
            type="error"
            message="We were unable to load the required data. Please try again."
            actionButtons={actionButtonsErrorOnLoading}
          />
        </Stack>
      );
    }
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
              resetField={resetField}
              watch={watch}
              handleCancel={handleCancel}
              options={sites}
              isValid={isValid}
            />
          </Stack>
        </Stack>
        <div style={{ minHeight: "20px"}}></div>
      </div>
    );
  };

  return <div>{renderContent()}</div>;
};

export default AddSwimMeet;
