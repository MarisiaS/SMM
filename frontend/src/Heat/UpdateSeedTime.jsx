import { Stack } from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import "../App.css";
import AlertBox from "../components/Common/AlertBox.jsx";
import { SmmApi } from "../SmmApi.jsx";
import { formatSeedTime } from "../utils/helperFunctions.js";
import SeedTimeForm from "./SeedTimeForm.jsx";

const UpdateSeedTime = ({ eventId, athlete, onUpdate, onCancel }) => {
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      seed_time: "",
      date: dayjs(Date.now()),
    },
    mode: "onChange",
  });

  // AlertBox variables
  let typeAlert = error ? "error" : "success";
  let message = error ? error : "Seed time updated successfully!";

  const handleClearError = () => {
    setError(false);
    setSubmitted(false);
  };

  const onSubmit = async (data) => {
    setError(false);

    const payload = {
      id: athlete.id,
      date: data.date,
      time: `00:${data.seed_time}`,
    };

    const updatedAthlete = { ...athlete, seed_time: payload.time };

    try {
      await SmmApi.registerSeedTime(eventId, payload);
      onUpdate(updatedAthlete);
    } catch (error) {
      setError(
        "Unable to update Seed Time, an unexpected error occurred. Please try again!"
      );
    }
    setSubmitted(true);
  };

  return (
    <div
      onClick={handleClearError}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Stack alignItems="center" justifyContent="space-between">
        {submitted && <AlertBox type={typeAlert} message={message} />}
        <SeedTimeForm
          handleSubmit={handleSubmit(onSubmit)}
          control={control}
          handleCancel={onCancel}
          data={{
            athlete_name: athlete.athlete_full_name,
            seed_time: formatSeedTime(athlete.seed_time),
          }}
          isValid={isValid}
        />
      </Stack>
    </div>
  );
};

export default UpdateSeedTime;
