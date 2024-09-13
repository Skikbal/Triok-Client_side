import React, { useState } from "react";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { BASE_URL } from "../../../utils/Element";
import Modal from "../../../components/Modal/Modal";
import AddUserData from "../components/AddUserData";
import { NotificationManager } from "react-notifications";
import { completeRegex } from "../../../utils/utils";

const initialData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  accountType: 3,
};

const AddUserModal = ({ showModal, onClose, fetchUsers }) => {
  const [config] = useAuth();
  const [error, setError] = useState();
  const [disable, setDisable] = useState(false);
  const [userData, setUserData] = useState(initialData);
  const [isAutoGeneratePassword, setIsAutoGeneratePassword] = useState(false);
  const [passwordErr, setPasswordErr] = useState(false);

  const handleClose = () => {
    setUserData(initialData);
    setPasswordErr(false);
    onClose();
    setDisable(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSend = {
      email: userData.email,
      first_name: userData?.firstName,
      last_name: userData.lastName,
      password: userData.password,
      account_type: userData.accountType,
    };

    if (userData.password?.match(completeRegex)) {
      axios
        .post(`${BASE_URL}/add-user`, dataToSend, config)
        .then((res) => {
          if (res?.data?.message) {
            NotificationManager.success(res?.data?.message);
          }
          setDisable(false);
          fetchUsers();
          handleClose();
        })
        .catch((err) => {
          setDisable(false);
          setError(err.response.data.errors);
          if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
            NotificationManager.error(err.response?.data?.message);
          }
        });
    } else {
      setPasswordErr(true);
    }
  };

  return (
    <Modal title={"Add User"} desc={"Enter user details to create a new profile."} show={showModal} onClose={handleClose}>
      <form onSubmit={handleSubmit} autoComplete="off">
        <AddUserData
          error={error}
          isEdit={false}
          userData={userData}
          passwordErr={passwordErr}
          onSetUserData={(value) => setUserData(value)}
          onSetError={(value) => setError(value)}
          onSetPasswordErr={(value) => setPasswordErr(value)}
          isAutoGeneratePassword={isAutoGeneratePassword}
          onSetIsAutoGeneratePassword={(value) => {
            setIsAutoGeneratePassword(value);
          }}
          showModal={showModal}
        />
        <div className="mt-6">
          <button type="submit" disabled={disable} className="save-button light-L head-5 green-bg-H">
            Add User
          </button>
          <button type="button" onClick={handleClose} className="green-H ml-5">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddUserModal;
