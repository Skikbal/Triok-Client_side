import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/Element";
import useAuth from "./useAuth";
import { NotificationManager } from "react-notifications";

const useOptions = (needOptions) => {
  const [config] = useAuth();
  const [companyOptions, setCompanyOptions] = useState([]);
  const [contactOptions, setContactOptions] = useState([]);
  const [contactTagOptions, setContactTagOptions] = useState([]);
  const [leadSourcesOptions, setLeadSourcesOptions] = useState([]);

  const fetchContactTags = () => {
    axios
      .get(`${BASE_URL}/get-datalisting?list=contact_tags`, config)
      .then((res) => {
        const value = res?.data?.data?.contact_tags;
        setContactTagOptions(value?.map((el) => ({ value: el?.id, label: el?.tag_name })));
        // if (res?.data?.message) {
        //   NotificationManager.success(res?.data?.message);
        // }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const fetchLeadSources = () => {
    axios
      .get(`${BASE_URL}/get-datalisting?list=lead_sources`, config)
      .then((res) => {
        const value = res?.data?.data?.lead_sources;
        setLeadSourcesOptions(value?.map((el) => ({ value: el?.id, label: el?.name, category: el?.category })));
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const fetchCompanies = () => {
    axios
      .get(`${BASE_URL}/get-datalisting?list=companies`, config)
      .then((res) => {
        const value = res?.data?.data?.company_list;
        setCompanyOptions(
          value?.map((data) => ({
            value: data.id,
            label: data.company_name,
          }))
        );
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const fetchContacts = () => {
    axios
      .get(`${BASE_URL}/get-datalisting?list=contacts`, config)
      .then((res) => {
        const value = res?.data?.data?.contact_list;
        setContactOptions(
          value?.map((data) => ({
            value: data?.id,
            label: `${data?.first_name} ${data?.last_name}`,
          }))
        );
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  useEffect(() => {
    if (needOptions?.includes("companies")) {
      fetchCompanies();
    }
    if (needOptions?.includes("contacts")) {
      fetchContacts();
    }

    if (needOptions?.includes("contact_tags")) {
      fetchContactTags();
    }
    if (needOptions?.includes("lead_sources")) {
      fetchLeadSources();
    }
  }, [needOptions]);

  return [companyOptions, contactOptions, contactTagOptions, leadSourcesOptions];
};

export default useOptions;
