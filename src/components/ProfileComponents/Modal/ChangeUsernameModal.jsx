import React, { useEffect, useState } from "react";
import Modal from "../../../components/Modal/Modal";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import { BASE_URL } from "../../../utils/Element";
import { NotificationManager } from "react-notifications";

const ChangeUsernameModal = ({ showModal, onClose, fetchProfile, userName }) => {
  const [config] = useAuth();
  const [username, setUsername] = useState(userName ?? "");

  useEffect(() => {
    if (userName) {
      setUsername(userName);
    }
  }, [userName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${BASE_URL}/update-username`, { user_name: username }, config)
      .then((res) => {
        fetchProfile();
        onClose();
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  return (
    <Modal title={"Change Username"} desc={"Enter a new username to simplify your login process."} show={showModal} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="dark-H head-4 mb-2">
            Username <span className="red-D">*</span>
          </label>
          <input className="body-N" name="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="write your username here" />
        </div>

        <div className="mt-6">
          <button type="submit" className="save-button light-L head-5 green-bg-H">
            Change
          </button>
          <button type="button" onClick={onClose} className="green-H ml-5">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ChangeUsernameModal;
