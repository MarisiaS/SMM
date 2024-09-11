import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

const getConfig = () => {
  let token = JSON.parse(sessionStorage.getItem("token"));
  return {
    Authorization: `Bearer ${token.access}`,
    "Content-Type": "application/json",
  };
};

//To manage refresh token in case the access token is expired
axios.interceptors.response.use(
  (response) => {
    return Promise.resolve(response);
  },
  function (error) {
    console.log(error);
    const { response, message } = error;
    const detail =
      response.data?.detail ||
      response.data?.error ||
      "Error details not defined";
    const code = response.data?.code || "Code not defined";
    console.error(message);
    console.error(`Interceptor error: ${detail}: ${code}`);

    const originalRequest = error.config;

    if (
      response.status === 401 &&
      !originalRequest._retry &&
      code === "token_not_valid"
    ) {
      // Access Token expired, get new token using the existing Refresh token
      if (
        sessionStorage.getItem("token") &&
        detail === "Given token not valid for any token type"
      ) {
        originalRequest._retry = true;
        const { refresh } = JSON.parse(sessionStorage.getItem("token"));
        return axios
          .post(`${BASE_URL}/login/refresh/`, { refresh: refresh })
          .then((res) => {
            if (res.status === 200) {
              console.log(res);
              let { access, refresh } = res.data;
              let token = { access, refresh };
              sessionStorage.setItem("token", JSON.stringify(token));
              console.log("Access token has been refreshed");
              originalRequest.headers = getConfig();
              return axios(originalRequest);
            }
          });
      }
      // Refresh Token expired. clean up the tokens stored in sessionStorage
      if (detail === "Token is invalid or expired") {
        console.log(
          "Refresh token expired, cleanup tokens and navigate to Login page"
        );
        sessionStorage.removeItem("token");
        return (window.location.href = `${BASE_URL}/login`);
      }
    }
    return Promise.reject(error);
  }
);

export class SmmApi {
  static async login(data) {
    return await axios.post(`${BASE_URL}/login/`, data, {
      headers: { "content-type": "application/json" },
    });
  }

  static async getSwimMeetList(search, offset, limit) {
    let url = `${BASE_URL}/swimmeet/?`;
    const extraParams = new URLSearchParams();

    if (search) {
      extraParams.set("search", search);
    }
    if (offset) {
      extraParams.set("offset", offset);
    }
    if (limit) {
      extraParams.set("limit", limit);
    }

    url += extraParams.toString();

    let res = await axios.get(url, {
      headers: getConfig(),
    });
    return res.data;
  }

  static async getSites() {
    return await axios.get(`${BASE_URL}/site/`, {
      headers: getConfig(),
    });
  }

  static async createSwimMeet(data) {
    return await axios.post(`${BASE_URL}/swimmeet/`, data, {
      headers: getConfig(),
    });
  }

  static async getSwimMeetEvents(meetId, offset, limit) {
    let url = `${BASE_URL}/meet_event/${meetId}/?`;
    const extraParams = new URLSearchParams();

    if (offset) {
      extraParams.set("offset", offset);
    }
    if (limit) {
      extraParams.set("limit", limit);
    }

    url += extraParams.toString();

    let res = await axios.get(url, {
      headers: getConfig(),
    });
    console.log(res.data);
    return res.data;
  }

  static async getSwimMeetDetails(meetId) {
    let res = await axios.get(`${BASE_URL}/swimmeet/${meetId}/`, {
      headers: getConfig(),
    });
    return res.data;
  }
}
