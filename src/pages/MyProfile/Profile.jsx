import React, { useEffect, useState } from "react";
import "./Profile.css";
import BaseLayout from "../../layouts/BaseLayout";
import { useNavigate } from "react-router-dom";
import UserProfile from "../../components/ProfileComponents/UserProfile";
import axios from "axios";
import { BASE_URL } from "../../utils/Element";
import useAuth from "../../hooks/useAuth";
import { NotificationManager } from "react-notifications";

const Profile = () => {
  const [config] = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(true);

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
      <UserProfile from="profile" loading={loading} userData={userData} fetchProfile={fetchProfile} />
    </BaseLayout>
  );
};

export default Profile;
