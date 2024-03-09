import axios from 'axios'
const { apiEndpoint } = require('./commonApi')
const service = axios.create({
    headers: {
  
    }
  })

export const ApiCall = async (
  method,
  path,
  payload,
  header,
  timeout = 30000
) => {
  try {
    const responce = await service.request({
      method,
      url: apiEndpoint + path,
      responseType: "json",
      data: payload,
      timeout,
      headers: header,
    });
    return responce;
  } catch (error) {
    if (error.message === "Network Error") {
      console.log(
        `${error}, Server is not responding, please try again after some time`
      );
    }
  }
};

export const GetApiCall = async (method, path, header, flag = false) => {
  try {
    const responce = await service.request({
      method,
      url: apiEndpoint + path,
      responseType: "json",
      headers: header,
    });
    return responce;
  } catch (error) {
    console.log(
      `${error}, Server is not responding, please try again after some time`
    );
  }
};
