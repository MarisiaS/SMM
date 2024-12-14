import { forwardRef, useImperativeHandle } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useForm } from "react-hook-form";
import "../../App.css";
import { Stack, Box } from "@mui/material";
import CleanableTextField from "../FormElements/CleanableTextField";
import MyButton from "../FormElements/MyButton";

const SearchBar = forwardRef(({ setSearchPar, setOffset, setPage }, ref) => {
  const { handleSubmit, control, setValue } = useForm();

  const search = (data) => {
    setSearchPar(data.search);
    setOffset(0);
    setPage(0);
  };

  const clearSearch = () => {
    setValue("search", ""); 
    setSearchPar("");
    setOffset(0);
    setPage(0);
  };

  useImperativeHandle(ref, () => ({
    clearSearch,
  }));

  return (
    <div>
      <form onSubmit={handleSubmit(search)}>
        <Stack direction="row" spacing={2}>
          <Box className={"itemBox"}>
            <CleanableTextField
              label={"Search"}
              name={"search"}
              control={control}
              setValue={setValue}
              onSubmit={handleSubmit(search)}
            />
          </Box>
          <Box className={"iconButton"} sx={{ marginLeft: 2 }}>
            <MyButton type={"submit"} label={"Search"}>
              <SearchIcon />
            </MyButton>
          </Box>
        </Stack>
      </form>
    </div>
  );
});

export default SearchBar;
