import { CircularProgress, Stack } from "@mui/material";
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
  const [loading, setLoading] = useState(false);
  const [errorOnLoading, setErrorOnLoading] = useState(false);

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
        setLoading(true);
        setErrorOnLoading(false);
        try {
          const response = await SmmApi.getAthlete(athleteToEditId);
          setAthleteToEdit(response);
          reset({
            first_name: response.first_name,
            last_name: response.last_name,
            date_of_birth: dayjs(response.date_of_birth),
            gender: response.gender === "F" ? 1 : 2,
          });
        } catch (error) {
          setErrorOnLoading(true);
        } finally {
          setLoading(false);
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
        const response = await SmmApi.updateAthlete(
          athleteToEdit.id,
          formatData
        );
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

  let actionButtonsErrorOnLoading = [
    { label: "Go to Athletes", onClick: onCancel },
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
      <div
        sx={{
          overflowY: "auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Stack alignItems="center" justifyContent="space-between">
          <Stack alignItems="center" justifyContent="space-between">
            {!submitted && <div style={{ minHeight: "100px" }} />}
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
          <div style={{ minHeight: "100px" }}></div>
        </Stack>
      </div>
    );
  };

  return <div>{renderContent()}</div>;
};

export default AddAthlete;
