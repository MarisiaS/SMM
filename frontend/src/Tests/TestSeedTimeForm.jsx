import "../App.css";
import { Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import AlertBox from "../components/Common/AlertBox.jsx";
import SeedTimeForm from "./SeedTimeForm.jsx";

const TestSeedTimeForm = () => {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      seed_time: "",
      date: dayjs(Date.now()),
    },
    mode: "onChange",
  });

  const handleCancel = () => {
    console.log("Cancel was pressed!");
  };

  const submission = async (data) => {
    console.log("Update was pressed!", data);
  };
  return (
    <div>
      <Stack alignItems="center" justifyContent="space-between">
        <SeedTimeForm
          handleSubmit={handleSubmit(submission)}
          control={control}
          handleCancel={handleCancel}
          data={{ athlete_name: "Luis Garcia", seed_time: "00:45.87" }}
        />
      </Stack>
    </div>
  );
};

export default TestSeedTimeForm;
