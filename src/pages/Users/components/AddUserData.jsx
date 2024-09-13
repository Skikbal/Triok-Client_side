import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useSelector } from "react-redux";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../components/Loader";
import Toggle from "../../../components/Toggle";
import { BASE_URL } from "../../../utils/Element";
import ProgressBar from "../../../components/ProgressBar";
import PasswordInput from "../../../components/PasswordInput";
import usePasswordValidation from "../../../hooks/usePasswordValidation";
import ChangePasswordModal from "../../../components/ProfileComponents/Modal/ChangePasswordModal";
import { Radio, RadioGroup, Stack } from "@chakra-ui/react";

const AddUserData = ({ showModal, userData, onSetUserData, onSetError, onSetPasswordErr, error, isEdit = false, selectedId, onSetIsAutoGeneratePassword, isAutoGeneratePassword, passwordErr }) => {
  const [config] = useAuth();
  const [isLoading, setLoading] = useState(false);
  const userType = useSelector((state) => state.userType);
  const [progress, handleProgress] = usePasswordValidation();
  const [accountTypeOptions, setAccountTypeOptions] = useState([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleChange = (value, name) => {
    // const { name, value } = e.target;
    const onlyAlphabets = value?.replace(/[^a-zA-Z ]/g, "");
    const onlyNumber = value?.replace(/[^0-9 ]/, "");
    const numberAlphabets = value?.replace(/[^a-zA-Z0-9 ]/g, "");

    const valueToSet = name == "firstName" || name == "lastName" ? onlyAlphabets : name == "zipCode" || name == "phone" ? onlyNumber : name == "license" ? numberAlphabets : value;

    onSetUserData({ ...userData, [name]: valueToSet });
  };

  useEffect(() => {
    handleProgress(userData?.password);
  }, [userData?.password]);

  const fetchAccountTypes = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/get-datalisting?list=roles`, config)
      .then((res) => {
        const roles = res?.data?.data?.roles;
        setAccountTypeOptions(roles || []);
        // if (res?.data?.message) {
        //   NotificationManager.success(res?.data?.message);
        // }
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (showModal) {
      fetchAccountTypes();
    }
  }, [showModal]);

  const handleAutoGenerate = () => {
    axios
      .get(`${BASE_URL}/auto-generate-password`, config)
      .then((res) => {
        const password = res?.data?.data?.password;
        handleChange(password, "password");
        onSetIsAutoGeneratePassword(true);
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
        onSetIsAutoGeneratePassword(false);
      });
  };

  const accountOptions = userType === 2 ? accountTypeOptions.filter((el) => el.id === 3) : accountTypeOptions;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <div>
            <label className="dark-H head-4 mb-2 required:*:">
              Email<span className="red-D">*</span>
            </label>
            <input
              className="body-N"
              autoComplete="false"
              name="email"
              type="email"
              placeholder="write email here"
              value={userData.email}
              disabled={isEdit}
              onChange={(e) => {
                onSetError({ ...error, email: "" });
                handleChange(e.target.value, "email");
              }}
            />
            {error?.email && <span className="body-S red-D">{error?.email}</span>}
          </div>

          <div className="flex gap-5 mt-6">
            <div>
              <label className="dark-H head-4 mb-2 required:*:">
                First Name<span className="red-D">*</span>
              </label>
              <input
                className="body-N capitalize"
                name="firstName"
                type="text"
                placeholder="write first name here"
                value={userData.firstName}
                onChange={(e) => {
                  onSetError({ ...error, first_name: "" });
                  handleChange(e.target.value, "firstName");
                }}
              />
              {error?.first_name && <span className="body-S red-D">{error?.first_name}</span>}
            </div>

            <div>
              <label className="dark-H head-4 mb-2 ">
                Last Name<span className="red-D">*</span>
              </label>
              <input
                className="body-N capitalize"
                name="lastName"
                type="text"
                placeholder="write last name here"
                value={userData.lastName}
                onChange={(e) => {
                  onSetError({ ...error, last_name: "" });
                  handleChange(e.target.value, "lastName");
                }}
              />
              {error?.last_name && <span className="body-S red-D">{error?.last_name}</span>}
            </div>
          </div>

          <div className="mt-6 mb-4">
            <label className="dark-H head-4 mb-2 flex justify-between items-center" htmlFor="newPassword">
              <p>
                Password<span className="red-D">*</span>
              </p>
              {isEdit ? (
                <p role="button" onClick={() => setShowPasswordModal(true)} className="green-H body-S">
                  Change Password
                </p>
              ) : (
                <p role="button" className="green-H body-S" onClick={handleAutoGenerate}>
                  Auto Generate
                </p>
              )}
            </label>

            {isEdit ? (
              <input type="password" disabled={true} value={userData.password} />
            ) : (
              <PasswordInput
                autoComplete="false"
                name="password"
                value={userData.password}
                disabled={isEdit}
                onChange={(e) => {
                  onSetPasswordErr(false);
                  handleChange(e.target.value, "password");
                }}
              />
            )}
          </div>

          {isAutoGeneratePassword ? null : (
            <>
              <ProgressBar width={progress} />
              <p className={`body-S mt-4 ${passwordErr ? "red-D" : "dark-M"}`}>Password must be 8+ characters with at least one uppercase, one lowercase, one number, and one special character.</p>
            </>
          )}

          <div className="mt-6 flex justify-between">
            <div>
              <p className="dark-H head-4">
                Account Type<span className="red-D">*</span>
              </p>
              <div className="mt-2 capitalize">
                <RadioGroup
                  onChange={(value) => {
                    // handleChange(Number(value), "accountType");
                    onSetUserData({ ...userData, accountType: Number(value) });
                  }}
                  value={userData?.accountType}
                >
                  <Stack direction="row" gap={5}>
                    {accountOptions?.flatMap((el, idx) => (
                      <Radio key={idx} value={el?.id}>
                        {el.name}
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>
              </div>
              {error?.account_type && <span className="body-S red-D">{error?.account_type}</span>}
            </div>

            {isEdit && (
              <div>
                <p className="dark-H head-4 mb-2">Status</p>
                <Toggle
                  isActive={userData?.status}
                  onSetIsActive={(value) => {
                    // handleChange(value, "status");
                    onSetUserData({ ...userData, status: value });
                  }}
                  text={userData?.status ? "Active" : "Inactive"}
                />
              </div>
            )}
          </div>

          <ChangePasswordModal id={selectedId} handleChange={handleChange} from="list" showModal={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
        </div>
      )}
    </>
  );
};

export default AddUserData;
