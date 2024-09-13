import React, { useContext, useEffect, useState } from "react";
import { Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { NotificationManager } from "react-notifications";
import { useParams } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import useAuth from "../../../../hooks/useAuth";
import { BASE_URL } from "../../../../utils/Element";
import AssignToComponent from "../AssignToComponent";
import { handleScrollToTop } from "../../../../utils/utils";
import { CreateSmartPlanContext } from "../../../../context/CreateSmartPlanContext";

const SendMessageForm = () => {
  const { id } = useParams();
  const [config] = useAuth();
  const [error, setError] = useState({});
  const { setActive, activeTask, onSuccess, setIsAddStep, activeDay, designatedData } = useContext(CreateSmartPlanContext);

  const initialData = {
    textType: "Send an automated Text",
    text: "",
    isDesignated: true,
    assignTo: designatedData?.message_agent,
    taskDue: { date: moment().format("MM-DD-YYYY"), hours: "11", mins: "59", period: "all_day" },
    timeOfDay: "Any Time",
    taskDay: "",
  };

  const [formData, setFormData] = useState(initialData);

  const handleInputChange = (value, name) => {
    setFormData({ ...formData, [name]: value });
    setError((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCancel = () => {
    setActive("details");
    setFormData(initialData);
    setIsAddStep("");
    handleScrollToTop();
  };

  useEffect(() => {
    if (activeTask !== undefined) {
      setFormData({
        textType: activeTask?.title,
        text: activeTask?.description,
        isDesignated: activeTask?.assign_to === designatedData?.message_agent ? true : false,
        assignTo: activeTask?.assign_to,
        taskDue: { date: activeTask?.due_date?.date, hours: activeTask?.due_date?.hours, mins: activeTask?.due_date?.mins, period: activeTask?.due_date?.period },
        timeOfDay: activeTask?.time_of_day === "Immediately" ? "Any Time" : activeTask?.time_of_day,
        taskDay: activeTask?.day_id?.toString(),
      });
    }
  }, [activeTask]);

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
      category: "message",
      title: formData?.textType,
      description: formData?.text,
      assign_to: formData?.assignTo,
      due_date: {
        date: formData?.taskDue?.date,
        hours: formData?.taskDue?.hours,
        mins: formData?.taskDue?.mins,
        period: formData?.taskDue?.period,
      },
      time_of_day: Number(activeDay?.day_id) === 1 ? "Immediately" : formData?.timeOfDay,
    };

    if (activeTask === undefined) {
      handleAddStep(dataToSend);
    } else {
      handleEditStep(dataToSend);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <p className="head-2 dark-H">Send Text</p>

      <div className="mt-6">
        <RadioGroup
          onChange={(value) => {
            handleInputChange(value, "textType");
          }}
          value={formData.textType}
        >
          <Stack direction="column" gap={2}>
            <Radio value="Send an automated Text">Send an automated Text</Radio>
            <Radio value="Create a Text Task">Create a Text Task</Radio>
          </Stack>
        </RadioGroup>
        {error?.title && <span className="body-S red-D">{error.title}</span>}
      </div>

      <div className="flex-1 mt-6">
        <p className="head-4 dark-H">
          Text <span className="body-S dark-M">(optional)</span>
        </p>
        <textarea
          rows={5}
          placeholder="write text here..."
          className="mt-2 w-full body-N"
          name="text"
          value={formData.text}
          onChange={(e) => {
            handleInputChange(e.target.value, "text");
          }}
        />
        {error?.description && <span className="body-S red-D">{error.description}</span>}
      </div>

      <AssignToComponent
        title="Send From"
        formData={formData}
        onSetFormData={(value) => setFormData(value)}
        onSetError={(value) => {
          setError(value);
        }}
        type="message"
      />

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

export default SendMessageForm;
