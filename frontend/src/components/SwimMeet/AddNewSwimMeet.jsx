import "../../App.css";
import { Box } from "@mui/material";
import MyTextField from "../FormElements/MyTextField";
import MyButton from "../FormElements/MyButton";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SmmApi } from "../../SmmApi.jsx";
import MyDatePicker from "../FormElements/MyDatePicker.jsx";
import MyTimePicker from "../FormElements/MyTimePicker.jsx";
import MySelect from "../FormElements/MySelect.jsx";

const AddNewSwimMeet = () => {
  const { handleSubmit, control, reset, register } = useForm();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const options =[
    {id:1, name:"hola"},
    {id:2, name:"adios"},
  ]

  /*
  Por hacer:
    Formatear el time
    Options tienen que venir del backend
    Agregar cancel, "create and details"
    Arreglar el estilo
  
  */

  const submission = async (data) => {
    console.log("Creating..");
    console.log(data);
    //Time has to be formated before sending the request
    // try {
    //     const response = await SmmApi.login(data);
    //     navigate(`/NavBar`)
    // } catch (error) {
    //     if (error.response.status === 401) {
    //         setError("Email and/or password are invalid.");
    //     } else {
    //         setError("Error conecting, try again!");
    //     }
    //     reset();
    // }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(submission)}>
        <Box>
          <Box>{error && <span className={"errorText"}>{error}</span>}</Box>
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
              options={options}
              {...register("site", { required: "Site is required" })}

            />
          </Box>
          <Box className={"itemBox"}>
            <MyButton key={"create"} label={"Create"} type={"submit"} />
          </Box>
        </Box>
      </form>
    </div>
  );
};

export default AddNewSwimMeet;
