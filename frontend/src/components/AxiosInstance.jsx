import axios from 'axios'

const baseUrl = 'http://localhost:8000'

const AxiosInstance = axios.create({
    baseUrl: baseUrl,
    timeout: 5000,
    headers:{
        "Content-Type":"application/json",
         accept: "application/json"
    }
})

export default AxiosInstance