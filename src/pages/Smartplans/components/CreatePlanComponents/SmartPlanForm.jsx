import React, { useContext, useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import Dropdown from "react-dropdown";
import axios from "axios";
import { useParams } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";
import { BASE_URL } from "../../../../utils/Element";
import { handleScrollToTop } from "../../../../utils/utils";
import { assignTimeOptions } from "../../../../utils/options";
import { CreateSmartPlanContext } from "../../../../context/CreateSmartPlanContext";

const initialData = {
  addTo: "",
  timeOfDay: "Any Time",
  taskDay: "",
};

const SmartPlanForm = () => {
  const { id } = useParams();
  const [config] = useAuth();
  const [error, setError] = useState();
  const [formData, setFormData] = useState(initialData);
  const [smartPlanOptions, setSmartPlanOptions] = useState([]);
  const { setActive, setIsAddStep, activeDay, onSuccess, data, activeTask } = useContext(CreateSmartPlanContext);

  const handleCancel = () => {
    setActive("details");
    setFormData(initialData);
    setIsAddStep("");
    handleScrollToTop();
  };

  useEffect(() => {
    if (activeTask === undefined) {
      setFormData({ ...formData, taskDay: activeDay?.day_id?.toString() });
    }
  }, [activeDay, activeTask]);

  useEffect(() => {
    if (activeTask !== undefined) {
      setFormData({
        addTo: activeTask?.add_name?.id,
        timeOfDay: activeTask?.time_of_day === "Immediately" ? "Any Time" : activeTask?.time_of_day,
        taskDay: activeTask?.day_id?.toString(),
      });
    }
  }, [activeTask]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/list`, config)
      .then((res) => {
        const value = res?.data?.smartplan?.filter((el) => el?.id !== id);
        const options = value?.map((el) => ({ value: el?.id, label: el?.name?.toUpperCase() }));
        setSmartPlanOptions(options);
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  }, []);

  const handleAddStep = (dataToSend) => {
    axios
      .post(`${BASE_URL}/addStepsTo-day/${id}`, { ...dataToSend, step_number: activeDay?.steps?.length + 1 }, config)
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

  const handleEditStep = (dataToSend) => {
    const newDataToSend = { ...dataToSend, old_day_id: activeDay?.day_id, step_id: activeTask?.step_id, step_number: activeTask?.step_number };

    axios
      .post(`${BASE_URL}/updateStepsIn-Day/${id}`, newDataToSend, config)
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

    const dataToSend = {
      day_id: formData?.taskDay,
      category: "smartPlan",
      add_name: formData?.addTo,
      time_of_day: Number(activeDay?.day_id) === 1 ? "Immediately" : formData?.timeOfDay,
    };

    if (activeTask === undefined) {
      handleAddStep(dataToSend);
    } else {
      handleEditStep(dataToSend);
    }
  };

  const dayOptions = data?.map((el) => ({ label: el.day?.toString(), value: el.day_id?.toString() })) ?? [];

  return (
    <form onSubmit={handleSubmit}>
      <p className="head-2 dark-H">SmartPlan Details</p>

      <div className="mt-6 body-N">
        <label className="dark-H head-4">
          Add To <span className="red-D">*</span>
        </label>
        <div className="mt-4">
          <Dropdown
            className="repeat company-select"
            options={smartPlanOptions}
            placeholder="Select Plan"
            value={smartPlanOptions?.find((el) => el?.value === formData?.addTo)?.label}
            onChange={(option) => {
              setFormData({ ...formData, addTo: option.value });
              setError({ ...error, add_name: "" });
            }}
          />
        </div>
        {error?.add_name && <span className="body-S red-D">{error?.add_name}</span>}
      </div>

      <div className="body-N mt-6">
        <p className="dark-H head-4">When should the Task be Created?</p>
        <div className="flex gap-2 items-center mt-4">
          <p className=" dark-H">Day</p>
          <div className="w-[24%]">
            <Dropdown
              className="repeat company-select"
              options={dayOptions}
              placeholder="Select"
              value={dayOptions?.find((el) => el?.value === formData?.taskDay)?.value}
              onChange={(option) => {
                setFormData({ ...formData, taskDay: option.value });
                setError({ ...error, day_id: "" });
              }}
            />
          </div>

          <p className="body-N dark-M">Time of Day</p>
          <div className="w-[40%]">
            <Dropdown
              className="repeat company-select"
              options={assignTimeOptions}
              disabled={Number(activeDay.day) === 1}
              placeholder={Number(activeDay.day) === 1 ? "Immediately" : "Select"}
              value={assignTimeOptions?.find((el) => el?.value === formData?.timeOfDay)?.label}
              onChange={(option) => {
                setFormData({ ...formData, timeOfDay: option.value });
                setError({ ...error, time_of_day: "" });
              }}
            />
          </div>
        </div>
        {error?.day_id && <span className="body-S red-D">{error?.day_id}</span>}
        {error?.time_of_day && <span className="body-S red-D">{error?.time_of_day}</span>}
      </div>

      <div className="mt-6">
        <button type="submit" className="save-button light-L head-5 green-bg-H">
          Save
        </button>
        <button type="button" onClick={handleCancel} className="green-H ml-5">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default SmartPlanForm;
