import { Stack } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import "../App.css";
import AlertBox from "../components/Common/AlertBox.jsx";
import { SmmApi } from "../SmmApi.jsx";
import { formatTime } from "../utils/helperFunctions.js";
import UpdateHeatTimeForm from "./UpdateHeatTimeForm.jsx";

const UpdateHeatTime = ({ heat, onUpdate, onCancel }) => {
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      heat_time: "",
    },
    mode: "onChange",
  });

  // AlertBox variables
  let typeAlert = error ? "error" : "success";
  let message = error ? error : "Heat time updated successfully!";

  const handleClearError = () => {
    setError(false);
    setSubmitted(false);
  };

  const onSubmit = async (data) => {
    setError(false);

    const payload = [
      {
        heat_id: Number(heat.id),
        heat_time:
          data.heat_time === "DQ" || data.heat_time === "NS"
            ? data.heat_time
            : `00:${data.heat_time}`,
      },
    ];

    try {
      await SmmApi.registerHeatTimes(payload);
      onUpdate();
    } catch (error) {
      setError("Failed to update heat time. Please try again.");
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
        height: "75vh", 
        overflow: "hidden", 
      }}
    >
      <Stack alignItems="center" justifyContent="space-between">
        {submitted && <AlertBox type={typeAlert} message={message} />}
        <UpdateHeatTimeForm
          handleSubmit={handleSubmit(onSubmit)}
          control={control}
          handleCancel={onCancel}
          data={{
            athlete_name: heat.athlete_full_name,
            heat_time: formatTime(heat.heat_time),
          }}
          isValid={isValid}
        />
      </Stack>
    </div>
  );
};

export default UpdateHeatTime;
