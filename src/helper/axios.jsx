import axios from "axios";

let apiEndpoint = "http://localhost:6070/api";

const service = axios.create({
  headers: {},
});
export const GetApiCall = async (method, path, header) => {
  try {
    const responce = await service.request({
      method,
      url: apiEndpoint + path,
      responseType: "json",
      headers: header,
    });
    return responce;
  } catch (error) {
    return error.response;
  }
};

export const ApiCall = async (
  method,
  path,
  payload,
  header,
  timeout = 10000,
  responseType = "json"
) => {
  try {
    const responce = await service.request({
      method,
      url: `${apiEndpoint}${path}`,
      responseType,
      data: payload,
      timeout,
      headers: header,
    });
    return responce;
  } catch (error) {
    return error.response;
  }
};