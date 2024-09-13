import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import Modal from "../../Modal/Modal";
import useAuth from "../../../hooks/useAuth";
import { BASE_URL } from "../../../utils/Element";
import { NotificationManager } from "react-notifications";

export const communicationData = [
  { label: "Do Not Send", value: "do not send" },
  { label: "Do Not Blast", value: "do not blast" },
  { label: "Bad #", value: "bad" },
];

const AddTagModal = ({ showModal, onClose, selectedTags, onSetTags, from, selectedItem, onSuccess }) => {
  const [config] = useAuth();
  const [error, setError] = useState();
  const [selectedValues, setSelectedValues] = useState([]);
  const [contactTagOptions, setContactTagOptions] = useState([]);

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
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  useEffect(() => {
    if (from === "contact" && showModal) {
      fetchContactTags();
    }
  }, [from, showModal]);

  let optionsToUse = [];
  if (from === "contact") {
    optionsToUse = contactTagOptions;
  } else if (from === "company") {
    optionsToUse = communicationData;
  }

  const handleClose = () => {
    setSelectedValues("");
    setError();
    onClose();
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    const dataToSend = {
      action: "add_tag",
      ids: selectedItem,
      tag: selectedValues,
      type: from,
    };
    axios
      .post(`${BASE_URL}/handleBulk-Actions`, dataToSend, config)
      .then((res) => {
        onSuccess();
        handleClose();
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
        setError(err.response.data.message);
      });
  };

  return (
    <Modal title={"Add Tag"} desc={"This tag will be accessible for item owned by Tri-Oak Consulting Group"} show={showModal} onClose={handleClose}>
      <form onSubmit={handleConfirm}>
        <div className="">
          <label className="dark-H head-4">Tag Name</label>
          <div className="mt-2">
            <Select
              isMulti
              className="service-area"
              placeholder="add tag here"
              options={optionsToUse}
              value={optionsToUse?.filter((el) => selectedValues.includes(el.value))}
              onChange={(options) => {
                const values = options?.map((el) => el.value);
                setSelectedValues(values);
                onSetTags(values);
              }}
            />
          </div>
          {error && <p className="red-D body-S">{error}</p>}
        </div>

        <div className="mt-6">
          <button type="submit" className="save-button light-L head-5 green-bg-H">
            Add
          </button>
          <button type="button" onClick={handleClose} className="green-H ml-5">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTagModal;
