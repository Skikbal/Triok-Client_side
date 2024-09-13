import React, { useContext, useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useParams } from "react-router-dom";
import Dropdown from "react-dropdown";
import axios from "axios";
import useAuth from "../../../../hooks/useAuth";
import { BASE_URL } from "../../../../utils/Element";
import { CreateSmartPlanContext } from "../../../../context/CreateSmartPlanContext";

const options = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
  { value: "Unlimited", label: "Unlimited" },
];

const initialData = {
  delay: 0,
  repeat: "1",
};

const RepeatForm = () => {
  const { id } = useParams();
  const [config] = useAuth();
  const [error, setError] = useState();
  const [formData, setFormData] = useState(initialData);
  const { setIsRepeatAdd, setActive, data, onSuccess, smartPlanInfo } = useContext(CreateSmartPlanContext);

  const lastDay = data?.[data?.length - 1]?.day;

  const handleInputChange = (value, name) => {
    setFormData({ ...formData, [name]: value });
    setError((prev) => ({ ...prev, [name]: "" }));
  };

  useEffect(() => {
    if (smartPlanInfo?.repeat !== null) {
      setFormData({
        delay: smartPlanInfo?.repeat?.delay,
        repeat: smartPlanInfo?.repeat?.number_of_repeat?.toString(),
      });
    }
  }, [smartPlanInfo?.repeat]);

  const handleCancel = () => {
    setIsRepeatAdd(true);
    setActive("details");
    setFormData(initialData);
  };

  const handleAddRepeat = (dataToSend) => {
    axios
      .post(`${BASE_URL}/add-repeat/${id}`, dataToSend, config)
      .then((res) => {
        handleCancel();
        onSuccess();
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        setError(err?.response?.data?.errors);
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const handleEditRepeat = (dataToSend) => {
    axios
      .post(`${BASE_URL}/update-repeat/${id}`, dataToSend, config)
      .then((res) => {
        handleCancel();
        onSuccess();
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        setError(err?.response?.data?.errors);
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Number(lastDay) + Number(formData?.delay) < 14) {
      setError({ ...error, delay: `Plan cannot repeat if the total duration is less than 14 days. The delay entered would make the duration ${Number(lastDay) + Number(formData?.delay)} days.` });
    } else {
      const dataToSend = {
        delay: formData?.delay,
        number_of_repeat: formData.repeat,
      };
      if (smartPlanInfo?.repeat === null) {
        handleAddRepeat(dataToSend);
      } else {
        handleEditRepeat(dataToSend);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <p className="head-2 dark-H">Edit Repeat</p>
      <div className="mt-6">
        <label className="dark-H head-4 mb-2 ">Delay (Days)</label>
        <input
          className="body-N"
          name="delay"
          type="number"
          min="0"
          placeholder="write here"
          value={formData?.delay}
          onWheel={(e) => e.target.blur()}
          onChange={(e) => {
            handleInputChange(e.target.value, "delay");
          }}
          // onKeyDown={(e) => {
          //   const value = e.target.value;
          //   if (Number(lastDay) + Number(value) < 14) {
          //     setError({ ...error, delay: `Plan cannot repeat if the total duration is less than 14 days. The delay entered would make the duration ${Number(lastDay) + Number(value)} days.` });
          //   }
          // }}
        />
        {error?.delay && <span className="body-S red-D">{error?.delay}</span>}
        <p className="body-S dark-M italic">Set the number of days to wait before the plan starts repeating.</p>
      </div>

      <div className="mt-6">
        <label className="dark-H head-4">Number of Repeats</label>
        <div className="mt-2">
          <Dropdown
            className="repeat company-select body-N"
            options={options}
            placeholder="Select"
            value={options?.find((el) => el?.value === formData?.repeat)?.label}
            onChange={(option) => {
              setFormData({ ...formData, repeat: option.value });
              setError({ ...error, repeat: "" });
            }}
          />
        </div>
        {error?.repeat && <span className="body-S red-D">{error?.repeat}</span>}
        <p className="body-S dark-M italic">Repeat the plan 1-6 times or select Unlimited to repeat the plan indefinitely.</p>
      </div>

      <div className="mt-6">
        <button type="submit" className="save-button light-L head-5 green-bg-H">
          Save
        </button>
        <button type="button" onClick={() => setActive("details")} className="green-H ml-5">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default RepeatForm;
