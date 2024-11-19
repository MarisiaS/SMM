import "../App.css";
import { Box } from "@mui/material";
import TimeEntryField from "../components/FormElements/TimeEntryField.jsx";

const HeatTimeForm = ({ handleSubmit, control, name}) => {
  return (
    <form onSubmit={handleSubmit} className={"heatTimeFormBox"}>
      <TimeEntryField
        name={name}
        control={control}
        rules={{
          required: "Heat time is required",
          pattern: {
            value: /^([0-5]?[0-9]):[0-5][0-9]\.[0-9]{1,2}$|^NS$|^DQ$/,
            message: "Invalid time format",
          },
        }}
        aditional_options={["NS", "DQ"]}
      />
    </form>
  );
};

export default HeatTimeForm;
