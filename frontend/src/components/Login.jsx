import '../App.css'
import { Box } from '@mui/material'
import MyTextField from './forms/MyTextField'
import MyPassField from './forms/MyPassField'
import MyButton from './forms/MyButton'

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
                        <MyPassField
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