import '../App.css'
import { Box } from '@mui/material'
import MyTextField from './forms/MyTextField'
import MyPassField from './forms/MyPassField'
import MyButton from './forms/MyButton'
import {useForm} from 'react-hook-form'
import AxiosInstance from './AxiosInstance'
import { useNavigate } from 'react-router-dom'

const Login = () =>{
    const navigate = useNavigate()
    const {handleSubmit, control} = useForm()

    const submission = (data) => {
        AxiosInstance.post(`login/`,{
            email: data.email, 
            password: data.password,
        })
        .then((response) => {
            localStorage.setItem('Token', response.data.access);
            navigate(`/home`);
        })
        .catch((error) => {
            //Need to send a message of error
            console.error('Error during login:', error);
        });
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
                        label={"Email"}
                        name ={"email"}
                        control={control}
                        />
                    </Box>

                    <Box className={"itemBox"}>
                        <MyPassField
                        label={"Password"}
                        name ={"password"}
                        control={control}
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