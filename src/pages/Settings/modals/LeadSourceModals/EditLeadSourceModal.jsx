import React, { useEffect, useState } from "react";
import Modal from "../../../../components/Modal/Modal";
import { leadSourceCategoryOptions } from "../../../../utils/options";
import Dropdown from "react-dropdown";
import axios from "axios";
import { BASE_URL } from "../../../../utils/Element";
import useAuth from "../../../../hooks/useAuth";
import { NotificationManager } from "react-notifications";

const EditLeadSourceModal = ({ showModal, onClose, onCallApi, id }) => {
  const [config] = useAuth();
  const [error, setError] = useState();
  const [disable, setDisable] = useState(false);
  const [data, setData] = useState({
    sourceName: "",
    category: "",
  });

  const handleChange = (value, name) => {
    setError({ ...error, [name]: "" });
    setData({ ...data, [name]: value });
  };

  const handleClose = () => {
    onClose();
    setDisable(false);
    setError();
  };

  useEffect(() => {
    if (id) {
      axios
        .get(`${BASE_URL}/lead-source-getbyid/${id}`, config)
        .then((res) => {
          // if (res?.data?.message) {
          //   NotificationManager.success(res?.data?.message);
          // }
          setData({
            sourceName: res?.data?.data?.name,
            // category: res?.data?.data?.category,
          });
        })
        .catch((err) => {
          setError(err?.response?.data?.errors);
          if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
            NotificationManager.error(err.response?.data?.message);
          }
        });
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setDisable(true);
    const dataToSend = {
      name: data?.sourceName,
      // category: data.category
    };

    axios
      .post(`${BASE_URL}/edit-lead-source/${id}`, dataToSend, config)
      .then((res) => {
        onCallApi();
        handleClose();
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        setError(err?.response?.data?.errors);
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => {
        setDisable(false);
      });
  };

  return (
    <Modal title={"Edit Lead Source"} desc={"This source will be accessible for any contact that is owned by Tri-Oak Consulting Group"} show={showModal} onClose={handleClose}>
      <form className="mt-3" onSubmit={handleSubmit}>
        <div>
          <label className="dark-H head-4 mb-2 required:*:">
            Source Name
            <span className="red-D">*</span>
          </label>
          <input
            className="body-N capitalize"
            name="sourceName"
            type="text"
            placeholder="enter name here....."
            value={data.sourceName}
            onChange={(e) => {
              const onlyAlphabets = e.target.value.replace(/[^a-zA-Z ]/g, "");
              handleChange(onlyAlphabets, "sourceName");
            }}
          />
          {error?.name && <span className="body-S red-D">{error?.name}</span>}
        </div>

        {/* <div className="mt-6">
          <p className="head-4 dark-H mb-2 ">
            Lead Category
            <span className="red-D">*</span>
          </p>
          <Dropdown
            className="repeat company-select body-N"
            options={leadSourceCategoryOptions}
            placeholder={"Select"}
            value={leadSourceCategoryOptions?.find((el) => el?.value === data?.category)?.label}
            onChange={(option) => {
              handleChange(option.value, "category");
            }}
          />
          {error?.category && <span className="body-S red-D">{error?.category}</span>}
        </div> */}

        <div className="mt-8">
          <button type="submit" disabled={disable} className="save-button light-L head-5 green-bg-H">
            Edit
          </button>
          <button type="button" onClick={handleClose} className="green-H ml-5">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditLeadSourceModal;
