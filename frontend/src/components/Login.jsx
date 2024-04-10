import '../App.css'
import { Box } from '@mui/material'
import MyTextField from './FormElements/MyTextField'
import MyPasswordField from './FormElements/MyPasswordField'
import MyButton from './FormElements/MyButton'

const Login = () =>{
    return(
        <div className={"myBackground"}> 
                <Box className={"whiteBox"}>
                    <Box className={"itemBox"}>
                        <Box className={"title"}> Login </Box>
                    </Box>
                    <Box className={"itemBox"}>
                        <MyTextField
                        label={"Email"}
                        />
                    </Box>
                    <Box className={"itemBox"}>
                        <MyPasswordField
                        label={"Password"}
                        />
                    </Box>
                    <Box className={"itemBox"}>
                        <MyButton 
                            label={"Login"}
                        />
                    </Box>
                </Box>
        </div>
    )
}

export default Login