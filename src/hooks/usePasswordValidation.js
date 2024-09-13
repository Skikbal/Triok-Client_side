import { useState } from "react";
import { completeRegex } from "../utils/utils";

const usePasswordValidation = () => {
  const [progress, setProgress] = useState(0);

  const handleProgress = (password) => {
    if (password?.length === 0) {
      setProgress(0);
    }
    if (password?.length >= 8 || password?.match("^(?=.*?[A-Z])") || password?.match("^(?=.*?[a-z])") || password?.match("^(?=.*?[0-9])") || password?.match("^(?=.*?[#?!@$%^&*-])")) {
      setProgress(20);
    }
    if (password?.match("^(?=.*?[A-Z]).{8,}$") || password?.match("^(?=.*?[a-z]).{8,}$") || password?.match("^(?=.*?[0-9]).{8,}$") || password?.match("^(?=.*?[#?!@$%^&*-]).{8,}$") || password?.match("^(?=.*?[A-Z])(?=.*?[a-z])") || password?.match("^(?=.*?[A-Z])(?=.*?[0-9])") || password?.match("^(?=.*?[a-z])(?=.*?[0-9])") || password?.match("^(?=.*?[0-9])(?=.*?[#?!@$%^&*-])") || password?.match("^(?=.*?[A-Z])(?=.*?[#?!@$%^&*-])") || password?.match("^(?=.*?[a-z])(?=.*?[#?!@$%^&*-])")) {
      setProgress(40);
    }
    if (password?.match("^(?=.*?[A-Z])(?=.*?[a-z]).{8,}$") || password?.match("^(?=.*?[A-Z])(?=.*?[0-9]).{8,}$") || password?.match("^(?=.*?[A-Z])(?=.*?[#?!@$%^&*-]).{8,}$") || password?.match("^(?=.*?[0-9])(?=.*?[a-z]).{8,}$") || password?.match("^(?=.*?[a-z])(?=.*?[#?!@$%^&*-]).{8,}$") || password?.match("^(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")) {
      setProgress(60);
    }
    if (password?.match("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$") || password?.match("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-]).{8,}$") || password?.match("^(?=.*?[#?!@$%^&*-])(?=.*?[a-z])(?=.*?[0-9]).{8,}$") || password?.match("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])")) {
      setProgress(80);
    }
    if (password?.match(completeRegex)) {
      setProgress(100);
    }
  };

  return [progress, handleProgress];
};

export default usePasswordValidation;
