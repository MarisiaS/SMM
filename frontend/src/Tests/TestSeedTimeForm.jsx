import "../App.css";
import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import SeedTimeForm from "../GenerateHeats/SeedTimeForm.jsx";

const TestSeedTimeForm = () => {
  const { handleSubmit, control, formState: { isValid } } = useForm({
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
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        className={"test"}
        sx={{ gap: "15px", width: "80%", height: "auto", margin: "2px", }}
      >
        <SeedTimeForm
          handleSubmit={handleSubmit(submission)}
          control={control}
          handleCancel={handleCancel}
          data={{ athlete_name: "Luis Garcia", seed_time: "00:45.87" }}
          isValid={isValid}
        />
      </Box>
    </div>
  );
};

export default TestSeedTimeForm;
