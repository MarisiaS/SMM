import { Add as AddIcon } from "@mui/icons-material";
import { Stack } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "../App.css";
import AlertBox from "../components/Common/AlertBox.jsx";
import { SmmApi } from "../SmmApi.jsx";
import AthleteForm from "./AthleteForm.jsx";

const AddAthlete = ({onCancel, setLastAthleteCreated, setNumNewAthletes}) => {
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty, isValid },
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      date_of_birth: dayjs(Date.now()),
      gender: "",
    },
    mode: "onChange",
  });

  let typeAlert = error ? "error" : "success";
  let message = error
    ? "Unable to add the Athlete. Please try again!"
    : "Athlete added successfully.";

  useEffect(() => {
    if (isDirty) {
      setSubmitted(false);
      setError(false);
    }
  }, [isDirty]);


  const submission = async (data) => {
    console.log(data);
    const date_of_birth = dayjs(data.date_of_birth).format("YYYY-MM-DD");
    const gender = data.gender === 1 ? "F" : "M";
    const status = "ACTIVE";
    const formatData = {
      ...data,
      date_of_birth: date_of_birth,
      gender: gender,
      status: status,
      school: 1,
    };
    console.log(formatData);
    try {
      const response = await SmmApi.createAthlete(formatData);
      setNumNewAthletes(1);
      setLastAthleteCreated(response.data.id);
    } catch (error) {
      setError(true);
    }
    setSubmitted(true);
    reset({
        first_name: "",
        last_name: "",
        date_of_birth: dayjs(Date.now()),
        gender: "",
    });
  };

  const handleCancel = () => {
    onCancel(); 
  };
    return (
      <div>
        <div style={{ minHeight: !submitted ? "100px" : "0" }}></div>
        <Stack alignItems="center" justifyContent="space-between">
          <Stack alignItems="center" justifyContent="space-between">
            {submitted && (
              <AlertBox
                type={typeAlert}
                message={message}
              />
            )}
          </Stack>
          <Stack alignItems="center" justifyContent="space-between">
            <AthleteForm
              handleSubmit={handleSubmit(submission)}
              control={control}
              onCancel={handleCancel}
              isValid={isValid}
            />
          </Stack>
        </Stack>
      </div>
    );
};

export default AddAthlete;
