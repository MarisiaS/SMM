import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { useForm } from "react-hook-form";
import '../../App.css'
import { Stack, Box} from '@mui/material'
import MyTextField from '../FormElements/MyTextField'
import MyButton from '../FormElements/MyButton'

const SearchBar = () => {
  const { handleSubmit, control, reset, register } = useForm();
  const [error, setError] = useState(null);

  const search = () => {
    console.log('Searching...')
  };

  return (
    <div >
      <form onSubmit={handleSubmit(search)}>
        <Stack direction='row' className={"whiteBox"}>
          <Box className={"itemBox"}>
            <MyTextField label={"Search"} name={"search"} control={control} />
          </Box>
          <Box className={"itemBox"}>
            <MyButton type={"submit"}  label="Searching test">
                <SearchIcon />
            </MyButton>
          </Box>
        </Stack>
      </form>
    </div>
  );
};

export default SearchBar;
