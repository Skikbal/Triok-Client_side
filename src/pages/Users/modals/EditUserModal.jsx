import React, { useEffect, useState } from "react";
import Modal from "../../../components/Modal/Modal";
import AddUserData from "../components/AddUserData";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import { BASE_URL } from "../../../utils/Element";
import Loader from "../../../components/Loader";
import { NotificationManager } from "react-notifications";
import { completeRegex } from "../../../utils/utils";

const initialData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  accountType: 2,
  status: false,
};

const EditUserModal = ({ showModal, onClose, selectedId, fetchUsers }) => {
  const [config] = useAuth();
  const [error, setError] = useState();
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(initialData);
  const [passwordErr, setPasswordErr] = useState(false);

  const handleClose = () => {
    setDisable(false);
    setUserData(initialData);
    setPasswordErr(false);
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      first_name: userData?.firstName,
      last_name: userData.lastName,
      // password: userData.password,
      account_type: userData.accountType,
      status: userData.status ? 1 : 0,
    };

    if (userData.password?.match(completeRegex)) {
      axios
        .post(`${BASE_URL}/user-edit/${selectedId}`, dataToSend, config)
        .then((res) => {
          handleClose();
          fetchUsers();
          if (res?.data?.message) {
            NotificationManager.success(res?.data?.message);
          }
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

  const fetchDetails = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/user-getbyid/${selectedId}`, config)
      .then((res) => {
        const value = res?.data?.data;
        setUserData({
          firstName: value?.first_name,
          lastName: value?.last_name,
          email: value?.email,
          password: value?.password ?? "",
          accountType: value?.role_id,
          status: value?.status === 1 ? true : false,
        });
        // if (res?.data?.message) {
        //   NotificationManager.success(res?.data?.message);
        // }
      })
      .catch((err) => {
        setDisable(false);
        setError(err.response.data.errors);
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (selectedId && showModal) {
      fetchDetails();
    }
  }, [selectedId, showModal]);

  return (
    <Modal title={"Edit User"} desc={"Enter user details to edit profile."} show={showModal} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        {loading ? (
          <Loader />
        ) : (
          <AddUserData
            error={error}
            passwordErr={passwordErr}
            onSetUserData={(value) => {
              setUserData(value);
            }}
            onSetError={(value) => setError(value)}
            onSetPasswordErr={(value) => setPasswordErr(value)}
            selectedId={selectedId}
            userData={userData}
            isEdit={true}
            showModal={showModal}
          />
        )}
        <div className="mt-6">
          <button type="submit" disabled={disable} className="save-button light-L head-5 green-bg-H">
            Edit User
          </button>
          <button type="button" onClick={handleClose} className="green-H ml-5">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditUserModal;
