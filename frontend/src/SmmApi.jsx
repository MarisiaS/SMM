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
    return res.data;
  }

  static async getSwimMeetDetails(meetId) {
    let res = await axios.get(`${BASE_URL}/swimmeet/${meetId}/`, {
      headers: getConfig(),
    });
    return res.data;
  }

  static async getGroups() {
    return await axios.get(`${BASE_URL}/group/`, {
      headers: getConfig(),
    });
  }

  static async getEventTypes() {
    return await axios.get(`${BASE_URL}/eventtype/`, {
      headers: getConfig(),
    });
  }

  static async createEvent(meetId, data) {
    return await axios.post(`${BASE_URL}/meet_event/${meetId}/`, data, {
      headers: getConfig(),
    });
  }

  static async getEventHeats(eventId) {
    return await axios.get(`${BASE_URL}/event_heat/${eventId}/`, {
      headers: getConfig(),
    });
  }

  static async createHeats(eventId, data) {
    return await axios.post(`${BASE_URL}/event_heat/${eventId}/`, data, {
      headers: getConfig(),
    });
  }

  static async deleteHeats(eventId) {
    return await axios.delete(`${BASE_URL}/event_heat/${eventId}/`, {
      headers: getConfig(),
    });
  }

  static async getHeatDetails(eventId, heatNum) {
    return await axios.get(`${BASE_URL}/event_heat/${eventId}/${heatNum}/`, {
      headers: getConfig(),
    });
  }

  static async getEventLanes(eventId) {
    return await axios.get(`${BASE_URL}/event_lane/${eventId}/`, {
      headers: getConfig(),
    });
  }

  static async getLaneDetails(eventId, laneNum) {
    return await axios.get(`${BASE_URL}/event_lane/${eventId}/${laneNum}/`, {
      headers: getConfig(),
    });
  }

  static async getSeedTimes(eventId) {
    return await axios.get(`${BASE_URL}/seed_times/${eventId}/`, {
      headers: getConfig(),
    });
  }

  static async registerSeedTime(eventId, data) {
    return await axios.post(`${BASE_URL}/seed_times/${eventId}/`, data, {
      headers: getConfig(),
    });
  }

  static async downloadHeatDetailsForEvent(swimMeetName, eventName, eventId) {
    try {
      const response = await axios.post(
        `${BASE_URL}/download-heats-details/${eventId}/`,
        {},
        {
          headers: getConfig(),
          responseType: "blob", // Important for file downloads
        }
      );

      // Create a URL for the blob and trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Set the file name
      link.setAttribute("download", `${swimMeetName}_${eventName}.xlsx`);

      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading heats file:", error);
      throw error;
    }
  }

  static async downloadHeatDetailsForSwimMeet(swimMeetName, meetId) {
    try {
      const response = await axios.post(
        `${BASE_URL}/download-all-heats-details/${meetId}/`,
        {},
        {
          headers: getConfig(),
          responseType: "blob", // Important for file downloads
        }
      );

      // Create a URL for the blob and trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Set the file name
      link.setAttribute(
        "download",
        `${swimMeetName}- All Event Heat Details.xlsx`
      );

      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading heats file:", error);
      throw error;
    }
  }

  static async registerHeatTimes(data) {
    return await axios.post(`${BASE_URL}/event_lane/update_heat_times/`, data, {
      headers: getConfig(),
    });
  }
}
