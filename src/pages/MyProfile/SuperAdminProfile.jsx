import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";
import phone from "../../assets/svgs/call.svg";
import { BASE_URL } from "../../utils/Element";
import BaseLayout from "../../layouts/BaseLayout";
import Edit from "../../assets/svgs/Pencil 2.svg";
import avatar from "../../assets/images/avatar.png";
import Message from "../../assets/svgs/message 2.svg";
import EditProfileModal from "../../components/ProfileComponents/Modal/EditProfileModal";
import RecoveryEmailModal from "../../components/ProfileComponents/Modal/RecoveryEmailModal";
import ChangePasswordModal from "../../components/ProfileComponents/Modal/ChangePasswordModal";
import ChangeUsernameModal from "../../components/ProfileComponents/Modal/ChangeUsernameModal";
import { NotificationManager } from "react-notifications";

const SuperAdminProfile = () => {
  const [config] = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState();
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showRecoveryEmailModal, setShowRecoveryEmailModal] = useState(false);

  const fetchProfile = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/get-profile`, config)
      .then((res) => {
        setUserData(res?.data?.data);
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
    fetchProfile();
  }, []);

  return (
    <BaseLayout>
      <p className="head-1 dark-H">My Profile</p>
      {loading ? (
        <Loader />
      ) : (
        <div className="light-bg-L p-4 mt-5 flex h-[76vh] overflow-auto">
          <div className="w-[60%] pr-6">
            <div className="flex items-start gap-2">
              <div className="w-[100%]">
                <div className="flex gap-4">
                  <img src={userData?.profile_photo ? userData?.profile_photo : avatar} className="h-[100px] w-[100px] rounded-full object-cover" alt="" />
                  <div>
                    <p className="head-2 dark-H capitalize">
                      {userData?.first_name} {userData?.last_name} <span className="green-H body-XS tags">{userData?.roles?.name}</span>
                    </p>
                    <p className="body-L dark-M mt-1">{userData?.my_bio ?? "Not Provided"}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-6 px-4">
                  <div className="flex items-center gap-2">
                    <img src={phone} alt="" />
                    <p className="dark-H head-5">
                      {userData?.phone === null ? "Not Provided" : userData?.phone?.[0]?.country_code} {userData?.phone?.[0]?.phone_number}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <img src={Message} alt="" />
                    <p className="dark-H head-5">{userData?.email}</p>
                  </div>
                </div>
              </div>

              <img
                src={Edit}
                alt=""
                role="button"
                onClick={() => {
                  setShowEditProfileModal(true);
                }}
              />
            </div>

            <hr className="my-8" />

            <div>
              <p className="head-5 dark-H">Service Area</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {userData?.service_areas === null || userData?.service_areas?.lenght === 0 ? (
                  <p className="body-N dark-M">Not Provided</p>
                ) : (
                  userData?.service_areas?.flatMap((el, idx) => (
                    <p className="green-H body-S tags" key={idx}>
                      {el}
                    </p>
                  ))
                )}
              </div>
            </div>

            <div className="mt-6">
              <p className="head-5 dark-H">Specialties</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {userData?.specialties === null || userData?.specialties?.length === 0 ? (
                  <p className="body-N dark-M">Not Provided</p>
                ) : (
                  userData?.specialties?.flatMap((el, idx) => (
                    <p className="body-S green-bg-H light-L add-contact-button capitalize" key={idx}>
                      {el}
                    </p>
                  ))
                )}
              </div>
            </div>

            <hr className="my-8" />

            <div className=" w-[70%]">
              <div className="flex justify-between">
                <div>
                  <p className="head-5 dark-H">Date of Birth</p>
                  <p className="body-N dark-M">{userData?.birthday ?? "Not Provided"}</p>
                </div>

                <div>
                  <p className="head-5 dark-H">Languages</p>
                  {userData?.language === null || userData?.language?.lenght === 0 ? (
                    <p className="body-N dark-M">Not Provided</p>
                  ) : (
                    userData?.language?.flatMap((el, i) => (
                      <p key={i} className="body-N dark-M capitalize">
                        {el}
                      </p>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-4">
                <p className="head-5 dark-H">Real Estate License</p>
                <p className="body-N dark-M">
                  {userData?.real_estate_licence?.licence_number} (OR)
                  <br /> Expires: {userData?.license_expiry_date === null ? "Not Provided" : moment(userData?.license_expiry_date).format("MMM DD, YYYY")}
                </p>
                <p className="dark-M body-S italic"> {userData?.real_estate_licence?.state}</p>
              </div>
            </div>
          </div>

          <div className="w-[40%] border-l-[1px] pl-6">
            <div>
              <p className="head-3 dark-H">Login Credentials</p>

              <div className="mt-6 flex justify-between">
                <div>
                  <p className="head-5 dark-H">Email</p>
                  <p className="body-N dark-M">{userData?.email}</p>
                </div>
                {/* <p role="button" className="underline green-H body-S" onClick={() => setShowRecoveryEmailModal(true)}>
                Add Recovery Mail
              </p> */}
              </div>

              <div className="mt-4 flex justify-between">
                <div>
                  <p className="head-5 dark-H">Username</p>
                  <p className="body-N dark-M">{userData?.user_name ?? "N/A"}</p>
                </div>
                <p role="button" className="underline green-H body-S" onClick={() => setShowUsernameModal(true)}>
                  Change Username
                </p>
              </div>

              <div className="mt-4 flex justify-between">
                <div>
                  <p className="head-5 dark-H">Password</p>
                  <p className="body-N dark-M">•••••••••</p>
                </div>
                <p role="button" className="underline green-H body-S" onClick={() => setShowPasswordModal(true)}>
                  Change Password
                </p>
              </div>
            </div>

            <hr className="my-8" />

            {/* <div className="pr-10">
              <p className="body-L dark-M">Choose which account you want to be selected when you log in to Command.</p>
              <div className="mt-4">
                <div className="mt-3 dark-M body-N">
                  <div className="capitalize">
                    <input type="radio" id="admin" name="admin" checked={account === "admin"} onChange={() => setAccount("admin")} />
                    <label htmlFor="admin">
                      <span></span> {userData?.first_name} {userData?.last_name} (Personal)
                    </label>
                  </div>

                  <div className="mt-4">
                    <input type="radio" id="sales" name="sales" checked={account === "sales"} onChange={() => setAccount("sales")} />
                    <label htmlFor="sales">
                      <span></span>Tri-Oak Consulting Group
                    </label>
                  </div>
                </div>
              </div>

              <button className="save-button light-L body-S green-bg-H mt-6">Save</button>
            </div> */}
          </div>
        </div>
      )}

      <EditProfileModal userData={userData} fetchProfile={fetchProfile} showModal={showEditProfileModal} onClose={() => setShowEditProfileModal(false)} />

      <ChangeUsernameModal userName={userData?.user_name} fetchProfile={fetchProfile} showModal={showUsernameModal} onClose={() => setShowUsernameModal(false)} />

      <ChangePasswordModal id={userData?.id} showModal={showPasswordModal} onClose={() => setShowPasswordModal(false)} />

      <RecoveryEmailModal showModal={showRecoveryEmailModal} onClose={() => setShowRecoveryEmailModal(false)} />
    </BaseLayout>
  );
};

export default SuperAdminProfile;
