import React, { useContext, useEffect, useRef, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useParams } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import useAuth from "../../../../hooks/useAuth";
import AssignToComponent from "../AssignToComponent";
import { BASE_URL } from "../../../../utils/Element";
import { priorityOptions } from "../../../../utils/options";
import { handleScrollToTop } from "../../../../utils/utils";
import { CreateSmartPlanContext } from "../../../../context/CreateSmartPlanContext";

const TaskForm = () => {
  const { id } = useParams();
  const [config] = useAuth();
  const dropdownRef = useRef(null);
  const [error, setError] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const { setActive, activeTask, onSuccess, setIsAddStep, activeDay, designatedData } = useContext(CreateSmartPlanContext);

  const initialData = {
    task_name: "",
    description: "",
    priority: "none",
    isDesignated: true,
    assignTo: designatedData?.task_agent,
    taskDue: { date: moment().format("MM-DD-YYYY"), hours: "11", mins: "59", period: "all_day" },
    timeOfDay: "Any Time",
    taskDay: "",
  };

  const [formData, setFormData] = useState(initialData);
  const selectedPriorityOption = priorityOptions.find((el) => el.value === formData?.priority);

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
        task_name: activeTask?.title,
        description: activeTask?.description,
        priority: activeTask?.priority,
        isDesignated: activeTask?.assign_to === designatedData?.task_agent ? true : false,
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
      category: "task",
      title: formData?.task_name,
      description: formData?.description,
      priority: formData?.priority,
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
      <p className="head-2 dark-H">Task Details</p>

      <div className="mt-6">
        <label className="dark-H head-4">
          Task Name <span className="red-D">*</span>
        </label>
        <input
          className="body-N capitalize"
          name="task_name"
          type="text"
          placeholder="write your task name here"
          value={formData.task_name}
          onChange={(e) => {
            handleInputChange(e.target.value, "task_name");
          }}
        />
        {error?.title && <span className="body-S red-D">{error.title}</span>}
      </div>

      <div className="flex-1 mt-6">
        <p className="head-4 dark-H">
          Description <span className="body-S dark-M">(optional)</span>
        </p>
        <textarea
          rows={5}
          placeholder="Enter description here..."
          className="mt-2 w-full body-N"
          name="description"
          value={formData.description}
          onChange={(e) => {
            handleInputChange(e.target.value, "description");
          }}
        />
        {error?.description && <span className="body-S red-D">{error.description}</span>}
      </div>

      <div className="w-[100%] mt-6">
        <p className="head-4 dark-H">Priority Level</p>
        <div ref={dropdownRef} className="custom-dropdown mt-[6px]">
          <div role="button" className="select-header-input capitalize light-bg-L body-N dark-M flex justify-between items-center" onClick={() => setIsOpen(!isOpen)}>
            <p className="flex" style={{ color: selectedPriorityOption?.color }}>
              <img src={selectedPriorityOption?.icon} alt="" className="mr-2" /> {selectedPriorityOption?.label}
            </p>
          </div>

          {isOpen && (
            <div className="dropdown-list-container light-bg-L dark-M body-N shadow rounded-box" style={{ width: "100%" }}>
              <ul className="dropdown-list">
                {priorityOptions.flatMap((el, i) => (
                  <li
                    key={i}
                    role="button"
                    onClick={() => {
                      handleInputChange(el.value, "priority");
                      setIsOpen(false);
                    }}
                    className={`${formData.priority === el.value ? "active" : ""}`}
                    style={{ color: el.color }}
                  >
                    <img src={el.icon} alt="" className="mr-2" /> {el.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {error?.priority && <span className="body-S red-D">{error.priority}</span>}
      </div>

      <AssignToComponent
        formData={formData}
        onSetFormData={(value) => setFormData(value)}
        onSetError={(value) => {
          setError(value);
        }}
        type="task"
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

export default TaskForm;
