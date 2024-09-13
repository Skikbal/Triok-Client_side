import { useSelector } from "react-redux";

const useAuth = () => {
  const token = useSelector((state) => state.token);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  };

  const configFormData = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
      "Access-Control-Allow-Origin": "*",
    },
  };

  return [config, configFormData];
};

export default useAuth;
