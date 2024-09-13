import React, { useEffect, useState } from "react";
import Modal from "../../../../components/Modal/Modal";
import axios from "axios";
import { BASE_URL } from "../../../../utils/Element";
import useAuth from "../../../../hooks/useAuth";
import { NotificationManager } from "react-notifications";

const EditContactTagModal = ({ showModal, onClose, onCallApi, id }) => {
  const [config] = useAuth();
  const [tagName, setTagName] = useState("");
  const [disable, setDisable] = useState(false);
  const [error, setError] = useState();

  const handleClose = () => {
    onClose();
    setTagName("");
    setError();
    setDisable(false);
  };

  useEffect(() => {
    if (id) {
      axios
        .get(`${BASE_URL}/contact-tag-getbyid/${id}`, config)
        .then((res) => {
          // if (res?.data?.message) {
          //   NotificationManager.success(res?.data?.message);
          // }
          setTagName(res?.data?.data?.tag_name);
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
    axios
      .post(`${BASE_URL}/edit-contact-tag/${id}`, { tag_name: tagName }, config)
      .then((res) => {
        onCallApi();
        handleClose();
      })
      .catch((err) => {
        setError(err?.response?.data?.errors);
      })
      .finally(() => {
        setDisable(false);
      });
  };

  return (
    <Modal title={"Edit Tag"} desc={"This tag will be accessible for item owned by Tri-Oak Consulting Group"} show={showModal} onClose={handleClose}>
      <form className="mt-3" onSubmit={handleSubmit}>
        <div>
          <label className="dark-H head-4 mb-2 required:*:">
            Tag Name
            <span className="red-D">*</span>
          </label>
          <input
            className="body-N capitalize"
            name="tagName"
            type="text"
            placeholder="enter contact tag name here....."
            value={tagName}
            onChange={(e) => {
              setError();
              const onlyAlphabets = e.target.value.replace(/[^a-zA-Z ]/g, "");
              setTagName(onlyAlphabets);
            }}
          />
          {error?.tag_name && <span className="body-S red-D">{error?.tag_name}</span>}
        </div>

        <div className="mt-8">
          <button type="submit" disabled={disable || tagName === ""} className="save-button light-L head-5 green-bg-H">
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

export default EditContactTagModal;
