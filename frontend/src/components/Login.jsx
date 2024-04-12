import '../App.css'
import { Box } from '@mui/material'
import MyTextField from './FormElements/MyTextField'
import MyPasswordField from './FormElements/MyPasswordField'
import MyButton from './FormElements/MyButton'
import {useForm} from 'react-hook-form'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { SmmApi } from '../SmmApi.jsx'

const Login = () =>{
    const {handleSubmit, control, reset} = useForm()
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    const submission = async (data) => {
        try {
            const response = await SmmApi.login(data);
            const { access } = response.data;
            sessionStorage.setItem("token", JSON.stringify({ access }));
            navigate(`/NavBar`)
        } catch (error) {
            console.log(error.response.data)
            setError(error.response.data.detail);
            reset();
        }
    }

    return(
        <div className={"myBackground"}>
             <form onSubmit={handleSubmit(submission)}>
                <Box className={"whiteBox"}>
                    <Box className={"itemBox"}>
                        <Box className={"title"}> Login </Box>
                    </Box>
                    <Box className={"itemBox"}>
                        <MyTextField
                            label = {"Email"}
                            name = {"email"}
                            control = {control}
                        />
                    </Box>
                    <Box className={"itemBox"}>
                        <MyPasswordField
                            label={"Password"}
                            name = {"password"}
                            control = {control}
                        />
                    </Box>
                    <Box className={"itemBox"}>
                        <MyButton 
                            label={"Login"}
                            type={"submit"}
                        />
                    </Box>
                </Box>
            </form>
        </div>
    )
}

export default Login