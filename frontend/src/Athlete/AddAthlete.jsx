import { Add as AddIcon } from "@mui/icons-material";
import { Stack } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "../App.css";
import AlertBox from "../components/Common/AlertBox.jsx";
import { SmmApi } from "../SmmApi.jsx";
import AthleteForm from "./AthleteForm.jsx";

const AddAthlete = ({
  onCancel,
  setLastAthleteCreated,
  setNumNewAthletes,
  athleteToEditId,
}) => {
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [athleteToEdit, setAthleteToEdit] = useState(null);

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
    ? "Unable to save the Athlete. Please try again!"
    : athleteToEditId
    ? "Athlete updated successfully."
    : "Athlete added successfully.";

  useEffect(() => {
    if (isDirty) {
      setSubmitted(false);
      setError(false);
    }
  }, [isDirty]);

  useEffect(() => {
    if (athleteToEditId) {
      // Fetch athlete data for editing
      const fetchAthlete = async () => {
        try {
          const response = await SmmApi.getAthlete(athleteToEditId);
          console.log(response);
          setAthleteToEdit(response);
          reset({
            first_name: response.first_name,
            last_name: response.last_name,
            date_of_birth: dayjs(response.date_of_birth),
            gender: response.gender === "F" ? 1 : 2,
          });
        } catch (error) {
          console.error("Error fetching athlete data:", error);
          setError(true);
        }
      };

      fetchAthlete();
    }
  }, []);

  const submission = async (data) => {
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
    if (athleteToEdit) {
      try {
        const response = await SmmApi.updateAthlete(athleteToEdit.id,formatData);
        setNumNewAthletes(0);
        setLastAthleteCreated(response.data.id);
        setTimeout(() => {
          onCancel();
        }, 1000);
      } catch (error) {
        setError(true);
      }
    } else {
      try {
        const response = await SmmApi.createAthlete(formatData);
        setNumNewAthletes(1);
        setLastAthleteCreated(response.data.id);
      } catch (error) {
        setError(true);
      }
      reset({
        first_name: "",
        last_name: "",
        date_of_birth: dayjs(Date.now()),
        gender: "",
      });
    }
    setSubmitted(true);
  };

  const handleCancel = () => {
    onCancel();
  };
  return (
    <div>
      <div style={{ minHeight: !submitted ? "100px" : "0" }}></div>
      <Stack alignItems="center" justifyContent="space-between">
        <Stack alignItems="center" justifyContent="space-between">
          {submitted && <AlertBox type={typeAlert} message={message} />}
        </Stack>
        <Stack alignItems="center" justifyContent="space-between">
          <AthleteForm
            handleSubmit={handleSubmit(submission)}
            control={control}
            onCancel={handleCancel}
            isValid={isValid}
            isEditing={athleteToEditId ? true : false}
          />
        </Stack>
      </Stack>
    </div>
  );
};

export default AddAthlete;
