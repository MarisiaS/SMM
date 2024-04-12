import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

const getConfig = () => {
    let { access } = JSON.parse(sessionStorage.getItem("token"));
    return {
      Authorization: `Bearer ${access}`,
      "Content-Type": "application/json",
    };
  };


export class SmmApi {

    static async login(data) {
        return await axios.post(`${BASE_URL}/login/`, data, {
            headers: { "content-type": "application/json" },
        });
    }

}

