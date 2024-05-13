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
    const {handleSubmit, control, reset, register, formState: { errors, isValid}} = useForm({ mode: 'onChange' })
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    const submission = async (data) => {
        try {
            const response = await SmmApi.login(data);
            sessionStorage.setItem("token", JSON.stringify(response.data));
            navigate(`/NavBar`)
        } catch (error) {
            if (error.response.status === 401) {
                setError("Email and/or password are invalid.");
            } else {
                setError("Error conecting, try again!");
            }
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
                    <Box >
                        {error && <span className={"errorText"}>{error}</span>}
                    </Box>
                    <Box className={"itemBox"}>
                        <MyTextField
                            label = {"Email"}
                            name = {"email"}
                            control = {control}
                            {...register("email", {required: "Email is required"})}
                        />
                    </Box>
                    <Box className={"itemBox"}>
                        <MyPasswordField
                            label={"Password"}
                            name = {"password"}
                            control = {control}
                            {...register("password", {required: "Password is required"})}
                        />
                    </Box>
                    <Box className={"itemBox"}>
                        <MyButton 
                            label={"Login"}
                            type={"submit"}
                            disabled ={!isValid}
                        />
                    </Box>
                </Box>
            </form>
        </div>
    )
}

export default Login