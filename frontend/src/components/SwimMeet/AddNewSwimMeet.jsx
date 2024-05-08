import "../../App.css";
import { Box, Stack } from "@mui/material";
import MyTextField from "../FormElements/MyTextField";
import MyButton from "../FormElements/MyButton";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SmmApi } from "../../SmmApi.jsx";
import MyDatePicker from "../FormElements/MyDatePicker.jsx";
import MyTimePicker from "../FormElements/MyTimePicker.jsx";
import MySelect from "../FormElements/MySelect.jsx";
import dayjs from "dayjs";

const AddNewSwimMeet = () => {
  const { handleSubmit, control, reset, register } = useForm();
  const [error, setError] = useState(null);
  const [errorOnLoading, setErrorOnLoading] = useState(false);
  const navigate = useNavigate();

  const getSites = async () => {
    try {
      let response = await SmmApi.getSites();
      let sites = response.data.results.map((site) => {
        return {
          id: site.id,
          name: site.name,
        };
      });
      return sites;
    } catch (error) {
      setErrorOnLoading(true);
    }
  };

  const handleCancel = () => {
    navigate(`/SwimMeet`);
  };

  /*
  Por hacer:
    Decidir que hacer en caso de error cargando los sites y error al guardar
    Agregar cancel, "create and details"
    Arreglar el estilo
  
  */

  const submission = async (data) => {
    const time = dayjs(data.time).format("HH:mm:ss");
    const date = dayjs(data.date).format("YYYY-MM-DD");
    const formatData = {
      ...data,
      date: date,
      time: time,
    };
    try {
      const response = await SmmApi.createSwimMeet(formatData);
      //We want to navegate to event details
      navigate(`/SwimMeet`);
    } catch (error) {
      if (error.response.status === 400) {
        setError("Error creating swim meet");
      } else {
        setError("Error conecting, try again!");
      }
      reset();
    }
  };

  return (
    <div>
      {errorOnLoading && <h1>Error loading sites</h1>}
      {!errorOnLoading && (
        <form onSubmit={handleSubmit(submission)}>
          <Box>
            <Box className={"itemBox"}>
              <MyTextField
                label={"Name"}
                name={"name"}
                control={control}
                {...register("name", { required: "Name is required" })}
              />
            </Box>
            <Box className={"itemBox"}>
              <MyDatePicker
                label={"Date"}
                name={"date"}
                control={control}
                {...register("date", { required: "Date is required" })}
              />
            </Box>
            <Box className={"itemBox"}>
              <MyTimePicker
                label={"Time"}
                name={"time"}
                control={control}
                {...register("time", { required: "Time is required" })}
              />
            </Box>
            <Box className={"itemBox"}>
              <MySelect
                label={"Site"}
                name={"site"}
                control={control}
                getOptions={getSites}
                {...register("site", { required: "Site is required" })}
              />
            </Box>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box className={"itemBox"} sx={{ marginLeft: 5 }}>
                <MyButton
                  key={"cancel"}
                  label={"Cancel"}
                  onClick={handleCancel}
                />
              </Box>
              <Box className={"itemBox"} sx={{ marginRight: 5 }}>
                <MyButton key={"create"} label={"Create"} type={"submit"} />
              </Box>
            </Stack>
          </Box>
        </form>
      )}
    </div>
  );
};

export default AddNewSwimMeet;
