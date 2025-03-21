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
        return (window.location.href = ``);
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

  static async logout() {
    return await axios.post(
      `${BASE_URL}/logout/`,
      {},
      {
        headers: getConfig(),
      }
    );
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
    let res = await axios.get(`${BASE_URL}/site/`, {
      headers: getConfig(),
    });
    return res.data;
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

  static async getGroups(groupId = null) {
    const url = new URL(`${BASE_URL}/group/`);
    if (groupId) {
      url.searchParams.append("filtering_group_id", groupId);
    }

    let res = await axios.get(url, {
      headers: getConfig(),
    });
    return res.data;
  }

  static async getEventTypes() {
    let res = await axios.get(`${BASE_URL}/eventtype/`, {
      headers: getConfig(),
    });
    return res.data;
  }

  static async createEvent(meetId, data) {
    return await axios.post(`${BASE_URL}/meet_event/${meetId}/`, data, {
      headers: getConfig(),
    });
  }

  static async getEventHeats(eventId) {
    let res = await axios.get(`${BASE_URL}/event_heat/${eventId}/`, {
      headers: getConfig(),
    });
    return res.data;
  }

  static async createHeats(eventId, data) {
    return await axios.post(`${BASE_URL}/event_heat/${eventId}/`, data, {
      headers: getConfig(),
    });
  }

  static async deleteHeats(eventId) {
    let res = await axios.delete(`${BASE_URL}/event_heat/${eventId}/`, {
      headers: getConfig(),
    });
    return res.data;
  }

  static async getHeatDetails(eventId, heatNum) {
    let res = await axios.get(`${BASE_URL}/event_heat/${eventId}/${heatNum}/`, {
      headers: getConfig(),
    });
    return res.data;
  }

  static async getEventLanes(eventId) {
    let res = await axios.get(`${BASE_URL}/event_lane/${eventId}/`, {
      headers: getConfig(),
    });
    return res.data;
  }

  static async getLaneDetails(eventId, laneNum) {
    let res = await axios.get(`${BASE_URL}/event_lane/${eventId}/${laneNum}/`, {
      headers: getConfig(),
    });
    return res.data;
  }

  static async getSeedTimes(eventId) {
    let res = await axios.get(`${BASE_URL}/seed_times/${eventId}/`, {
      headers: getConfig(),
    });
    return res.data;
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
    return await axios.put(`${BASE_URL}/event_lane/update_heat_times/`, data, {
      headers: getConfig(),
    });
  }

  static async getEventResults(eventId, groupId) {
    let url = `${BASE_URL}/event_result/${eventId}/?`;
    const extraParams = new URLSearchParams();

    if (groupId) {
      extraParams.set("group_id", groupId);
    }

    url += extraParams.toString();

    let res = await axios.get(url, {
      headers: getConfig(),
    });
    return res.data;
  }

  static async downloadResultsForEvent(swimMeetName, eventName, eventId, data) {
    try {
      const response = await axios.post(
        `${BASE_URL}/download-event-results/${eventId}/`,
        data,
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
        `Results_${swimMeetName}_${eventName}.xlsx`
      );

      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading results file:", error);
      throw error;
    }
  }

  static async downloadResultsForAllEvents(swimMeetName, meetId) {
    try {
      const response = await axios.post(
        `${BASE_URL}/download-all-event-results/${meetId}/`,
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
        `Results_${swimMeetName}_General Results.xlsx`
      );

      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading results file:", error);
      throw error;
    }
  }

  static async getAthleteList(search, offset, limit) {
    let url = `${BASE_URL}/athlete/?`;
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

  static async getAthlete(athleteId) {
    let res = await axios.get(`${BASE_URL}/athlete/${athleteId}/`, {
      headers: getConfig(),
    });
    return res.data;
  }

  static async createAthlete(data) {
    return await axios.post(`${BASE_URL}/athlete/`, data, {
      headers: getConfig(),
    });
  }

  static async updateAthlete(athleteId, data) {
    return await axios.patch(`${BASE_URL}/athlete/${athleteId}/`, data, {
      headers: getConfig(),
    });
  }

  static async getEnrolledAthletes(meetId, search, offset, limit) {
    let url = `${BASE_URL}/meet_enroll/${meetId}/?`;
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

  static async createEnrollment(meetId, data) {
    return await axios.post(`${BASE_URL}/meet_enroll/${meetId}/`, data, {
      headers: getConfig(),
    });
  }

  static async deleteEnrolledAthlete(meetId, data) {
    return await axios.patch(`${BASE_URL}/meet_enroll/${meetId}/`, data, {
      headers: getConfig(),
    });
  }

  static async getUnenrolledAthletes(meetId) {
    let res = await axios.get(`${BASE_URL}/meet_unenrolled/${meetId}/`, {
      headers: getConfig(),
    });
    return res.data;
  }
}
