import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { useForm } from "react-hook-form";
import "../../App.css";
import { Stack, Box } from "@mui/material";
import MyTextField from "../FormElements/MyTextField";
import MyButton from "../FormElements/MyButton";

const SearchBar = ({setSearchPar}) => {
  const { handleSubmit, control } = useForm();

  const search = (data) => {
    console.log("Searching...", data);
    setSearchPar(data.search)
  };

  return (
    <div>
      <form onSubmit={handleSubmit(search)}>
        <Stack direction="row" >
          <Box className={"itemBox"}>
            <MyTextField label={"Search"} name={"search"} control={control} />
          </Box>
          <Box className={"iconButton"} sx={{marginLeft:2}}>
            <MyButton type={"submit"} label={"Search"} >
              <SearchIcon />
            </MyButton>
          </Box>
        </Stack>
      </form>
    </div>
  );
};

export default SearchBar;
