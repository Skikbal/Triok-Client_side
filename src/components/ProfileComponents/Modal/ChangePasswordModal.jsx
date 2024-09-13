import React, { useEffect, useState } from "react";
import Modal from "../../../components/Modal/Modal";
import ProgressBar from "../../../components/ProgressBar";
import PasswordInput from "../../../components/PasswordInput";
import usePasswordValidation from "../../../hooks/usePasswordValidation";
import axios from "axios";
import { BASE_URL } from "../../../utils/Element";
import useAuth from "../../../hooks/useAuth";
import { NotificationManager } from "react-notifications";

const ChangePasswordModal = ({ showModal, onClose, from, id, handleChange }) => {
  const [config] = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [progress, handleProgress] = usePasswordValidation();
  const [isAutoGeneratePassword, setIsAutoGeneratePassword] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");

  useEffect(() => {
    handleProgress(newPassword);
  }, [newPassword]);

  const handleAutoGenerate = () => {
    axios
      .get(`${BASE_URL}/auto-generate-password`, config)
      .then((res) => {
        const password = res?.data?.data?.password;
        setNewPassword(password);
        setConfirmPassword(password);
        setIsAutoGeneratePassword(true);
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
        setIsAutoGeneratePassword(false);
      });
  };

  const handleClose = () => {
    setNewPassword("");
    setConfirmPassword("");
    setOldPassword("");
    setIsAutoGeneratePassword(false);
    setMsgType("");
    setMsg("");
    onClose();
  };

  const handleChangeUserPassword = (e) => {
    e.preventDefault();
    const dataToSend = {
      new_password: newPassword,
      new_password_confirmation: confirmPassword,
    };

    if (id) {
      axios
        .post(`${BASE_URL}/change-user-password/${id}`, dataToSend, config)
        .then((res) => {
          if (handleChange) {
            handleChange(newPassword, "password");
          }
          setMsg("Password updated successfully!");
          setMsgType("success");
          if (res?.data?.message) {
            NotificationManager.success(res?.data?.message);
          }
          setTimeout(() => {
            handleClose();
          }, [2000]);
        })
        .catch((err) => {
          if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
            NotificationManager.error(err.response?.data?.message);
          }
          setMsgType("fail");
          setMsg("Password not updated!");
        });
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    // if (from === "list") {
    handleChangeUserPassword(e);
    // }
  };

  return (
    <Modal title={"Change Password"} desc={"Enter new password."} show={showModal} onClose={handleClose}>
      <form onSubmit={handleChangePassword}>
        {/* {from !== "list" && (
          <div className="mb-6">
            <label className="dark-H head-4 mb-2" htmlFor="oldPassword">
              Old Password
            </label>
            <PasswordInput name="oldPassword" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
          </div>
        )} */}

        <div className=" mb-4">
          <label className="dark-H head-4 mb-2 flex justify-between items-center" htmlFor="newPassword">
            New Password
            <p role="button" onClick={handleAutoGenerate} className="green-H body-S">
              Auto Generate
            </p>
          </label>
          <PasswordInput
            name="newPassword"
            value={newPassword}
            onChange={(e) => {
              setIsAutoGeneratePassword(false);
              setNewPassword(e.target.value);
            }}
          />
        </div>

        <div className="mb-6">
          <label className="dark-H head-4 mb-2" htmlFor="username">
            Again Password
          </label>
          <PasswordInput name="againPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>

        {isAutoGeneratePassword ? null : (
          <>
            <ProgressBar width={progress} />
            <p className="body-S dark-M mt-4">Password must be 8+ characters with at least one uppercase, one lowercase, one number, and one special character.</p>
          </>
        )}
        <div className="mt-6">
          {msg !== "" && <p className={` ${msgType === "fail" ? "red-D body-S mb-2" : "green-H body-S mb-2"}`}>{msg}</p>}
          <button type="button" onClick={handleChangeUserPassword} className="save-button light-L head-5 green-bg-H">
            Change Password
          </button>
          <button type="button" onClick={handleClose} className="green-H ml-5">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ChangePasswordModal;
