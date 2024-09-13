import React, { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { BASE_URL } from "../../utils/Element";
import BaseLayout from "../../layouts/BaseLayout";
import { useNavigate, useParams } from "react-router-dom";
import UserProfile from "../../components/ProfileComponents/UserProfile";
import { NotificationManager } from "react-notifications";

const UserProfileDetail = () => {
  const { id } = useParams();
  const [config] = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/user-getbyid/${id}`, config)
      .then((res) => {
        const value = res?.data?.data;
        setUserData(value);
        // if (res?.data?.message) {
        //   NotificationManager.success(res?.data?.message);
        // }
      })
      .catch((err) => {
        setError(err.response.data.errors);
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <BaseLayout>
      <p role="button" className="green-H head-5 underline" onClick={() => navigate("/users")}>
        Back to Users
      </p>
      <UserProfile from="users" userData={userData} loading={loading} />
    </BaseLayout>
  );
};

export default UserProfileDetail;
