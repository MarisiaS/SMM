import '../App.css'
import { Box } from '@mui/material'
import MyTextField from './FormElements/MyTextField'
import MyPasswordField from './FormElements/MyPasswordField'
import MyButton from './FormElements/MyButton'
import {useForm} from 'react-hook-form'

const Login = () =>{
    const {handleSubmit, control} = useForm()

    const submission = (data) => {
        console.log(data)
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