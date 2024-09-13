import axios from "axios";
import useAuth from "./useAuth";
import { useState } from "react";
import { BASE_URL } from "../utils/Element";
import { NotificationManager } from "react-notifications";

const useApi = () => {
  const [config] = useAuth();
  const [err, setErr] = useState();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  const handleApi = (url, configuration, dataToSend, method) => {
    const configToSend = configuration ? configuration : config;
    const Axios = method === "post" ? axios.post : method === "delete" ? axios.delete : method === "put" ? axios.put : axios.get;
    const fetchApi = method === "post" || method === "put" ? Axios(`${BASE_URL}/${url}`, dataToSend, configToSend) : Axios(`${BASE_URL}/${url}`, configToSend);

    fetchApi
      .then((res) => {
        setData(res.data);
        setLoading(false);
        // if (res?.data?.message) {
        //   NotificationManager.success(res?.data?.message);
        // }
        return res;
      })
      .catch((error) => {
        setErr(error);
        if (error.response?.data?.message) {
          NotificationManager.error(error.response?.data?.message);
        }
        setLoading(false);
        return error;
      });
  };

  return [data, handleApi, err, loading];
};

export default useApi;
