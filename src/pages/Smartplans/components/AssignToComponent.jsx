import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@chakra-ui/react";
import Dropdown from "react-dropdown";
import moment from "moment";
import { amPmOptions, assignTimeOptions } from "../../../utils/options";
import { CreateSmartPlanContext } from "../../../context/CreateSmartPlanContext";
import { setIsShowSettingSidebar, setIsSidebarCollapsed } from "../../../redux/Action/AuthActions";

const options = [
  { value: "Contact Assignee", label: "Contact Assignee" },
  { value: "Rainmaker", label: "Rainmaker" },
];

const dateFormat = "YYYY-MM-DD";

const dueOptions = [
  { value: moment().format(dateFormat), label: "Same day" },
  { value: moment().add(1, "days").format(dateFormat), label: "Next day" },
  { value: moment().add(2, "days").format(dateFormat), label: "In 2 days" },
  { value: moment().add(3, "days").format(dateFormat), label: "In 3 days" },
  { value: moment().add(4, "days").format(dateFormat), label: "In 4 days" },
  { value: moment().add(5, "days").format(dateFormat), label: "In 5 days" },
  { value: moment().add(6, "days").format(dateFormat), label: "In 6 days" },
  { value: moment().add(7, "days").format(dateFormat), label: "In 7 days" },
  { value: moment().add(8, "days").format(dateFormat), label: "In 8 days" },
  { value: moment().add(9, "days").format(dateFormat), label: "In 9 days" },
  { value: moment().add(10, "days").format(dateFormat), label: "In 10 days" },
  { value: moment().add(11, "days").format(dateFormat), label: "In 11 days" },
  { value: moment().add(12, "days").format(dateFormat), label: "In 12 days" },
  { value: moment().add(13, "days").format(dateFormat), label: "In 13 days" },
  { value: moment().add(14, "days").format(dateFormat), label: "In 14 days" },
];

const AssignToComponent = ({ title, formData, onSetFormData, error, onSetError, type }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userType = useSelector((state) => state.userType);
  const { data, activeDay, activeTask, userOptions, designatedData } = useContext(CreateSmartPlanContext);

  useEffect(() => {
    if (activeTask === undefined) {
      onSetFormData({ ...formData, taskDay: activeDay?.day_id?.toString() });
    }
  }, [activeDay, activeTask]);

  const dayOptions = data?.map((el) => ({ label: el.day?.toString(), value: el.day_id?.toString() })) ?? [];

  const designatedAgent = type === "task" ? designatedData?.task_agent : type === "email" ? designatedData?.email_agent : type === "message" ? designatedData?.message_agent : "";

  return (
    <div className="mt-6">
      <div>
        <label className="dark-H head-4">
          {title ? title : "Assign To"} <span className="red-D">*</span>
        </label>

        {userType !== 3 && (
          <p className="body-S dark-M">
            Checking the box below will automatically apply the Designated Agent selected in{" "}
            <span
              className="green-H underline font-bold"
              role="button"
              onClick={() => {
                window.open(`${window.location.origin}/settings/designated-agents`, "_blank");
                // navigate("/settings/designated-agents");
                dispatch(setIsShowSettingSidebar(true));
                dispatch(setIsSidebarCollapsed(false));
              }}
            >
              Settings.
            </span>
          </p>
        )}

        <label className="container body-N dark-H mt-4">
          <p>Assign to Designated Agent</p>
          <input
            type="checkbox"
            checked={formData.isDesignated}
            onChange={(e) => {
              const value = e.target.checked;
              onSetFormData({ ...formData, isDesignated: value, assignTo: value ? designatedAgent : "" });
              onSetError({ ...error, assign_to: "" });
            }}
          />
          <span className="checkmark"></span>
        </label>

        <div className="mt-4 body-N" style={{ opacity: `${formData.isDesignated ? "0.5" : ""}` }}>
          <Dropdown
            disabled={formData.isDesignated}
            className="repeat company-select"
            options={userOptions}
            placeholder="Select"
            value={userOptions?.find((el) => Number(el.value) === Number(formData?.assignTo))?.label}
            onChange={(option) => {
              onSetFormData({ ...formData, assignTo: option.value });
              onSetError({ ...error, assign_to: "" });
            }}
          />
        </div>
        {error?.assign_to && <span className="body-S red-D">{error?.assign_to}</span>}
      </div>

      <div className="mt-6 body-N">
        <label className="dark-H head-4">When is the Task Due?</label>

        <div className="mt-4 body-N dark-H flex gap-2 items-center">
          <p>Due</p>
          <Dropdown
            className="repeat company-select"
            options={dueOptions}
            placeholder="Select"
            value={dueOptions.find((el) => el?.value === formData?.taskDue?.date)?.label}
            onChange={(option) => {
              onSetFormData({ ...formData, taskDue: { ...formData?.taskDue, date: option.value } });
              onSetError({ ...error, due_date: { ...error?.due_date, date: "" } });
            }}
          />
        </div>

        {error?.due_date?.date && <span className="body-S red-D">{error?.due_date?.date}</span>}

        <div className="flex gap-2 items-center mt-2 body-S">
          <p>at</p>
          <div className="w-[18%]" style={{ opacity: `${formData?.taskDue?.period === "all_day" ? "0.5" : ""}` }}>
            <input
              type="number"
              placeholder="hh"
              style={{ marginTop: "0px" }}
              value={formData?.taskDue?.hours}
              disabled={formData?.taskDue?.period === "all_day"}
              onChange={(e) => {
                const value = e.target.value;
                if (value > 12) {
                  return;
                } else {
                  onSetFormData({ ...formData, taskDue: { ...formData?.taskDue, hours: value } });
                  onSetError({ ...error, due_date: { ...error?.due_date, hours: "" } });
                }
              }}
              onWheel={(e) => e.target.blur()}
            />
          </div>

          <p>:</p>

          <div className="w-[18%]" style={{ opacity: `${formData?.taskDue?.period === "all_day" ? "0.5" : ""}` }}>
            <input
              type="number"
              placeholder="mm"
              value={formData?.taskDue?.mins}
              disabled={formData?.taskDue?.period === "all_day"}
              style={{ marginTop: "0px" }}
              onChange={(e) => {
                const value = e.target.value;
                if (value > 59) {
                  return;
                } else {
                  onSetFormData({ ...formData, taskDue: { ...formData?.taskDue, mins: value } });
                  onSetError({ ...error, due_date: { ...error?.due_date, mins: "" } });
                }
              }}
              onWheel={(e) => e.target.blur()}
            />
          </div>

          <div className="w-[25%]" style={{ opacity: `${formData?.taskDue?.period === "all_day" ? "0.5" : ""}` }}>
            <Dropdown
              className="repeat company-select"
              disabled={formData?.taskDue?.period === "all_day"}
              options={amPmOptions}
              placeholder="Select"
              value={formData?.taskDue?.period === "all_day" ? amPmOptions[1]?.value : amPmOptions.find((el) => el.value === formData?.taskDue?.period)?.label}
              onChange={(option) => {
                onSetFormData({ ...formData, taskDue: { ...formData?.taskDue, period: option.value } });
                onSetError({ ...error, due_date: { ...error?.due_date, period: "" } });
              }}
            />
          </div>

          <label className="container body-N dark-H mt-4">
            <p style={{ paddingLeft: "25px" }}>All Day</p>
            <input
              type="checkbox"
              checked={formData?.taskDue?.period === "all_day"}
              onChange={(e) => {
                onSetFormData({ ...formData, taskDue: { ...formData?.taskDue, period: e.target.checked ? "all_day" : "PM" } });
                onSetError({ ...error, due_date: { ...error?.due_date, period: "" } });
              }}
            />
            <span className="checkmark"></span>
          </label>
        </div>
      </div>

      <div className="mt-6 body-N">
        <label className="dark-H head-4">When should the Task be Created?</label>

        <div className="flex gap-2 items-center mt-2">
          <p className="body-N dark-H">Day</p>

          <div className="w-[24%]">
            <Dropdown
              className="repeat company-select"
              options={dayOptions}
              placeholder="Select"
              value={dayOptions?.find((el) => el?.value === formData?.taskDay)?.value}
              onChange={(option) => {
                onSetFormData({ ...formData, taskDay: option.value });
                onSetError({ ...error, day_id: "" });
              }}
            />
          </div>

          <p className="body-N dark-M">Time of Day</p>
          <Tooltip placement="top" isDisabled={Number(activeDay.day) !== 1} label="Time of day cannot be applied to steps on Day 1.">
            <div className="w-[42%]" style={{ opacity: `${Number(activeDay.day) === 1 ? "0.5" : ""}` }}>
              <Dropdown
                className="repeat company-select"
                options={assignTimeOptions}
                disabled={Number(activeDay.day) === 1}
                placeholder={Number(activeDay.day) === 1 ? "Immediately" : "Select"}
                value={Number(activeDay.day) === 1 ? "Immediately" : assignTimeOptions?.find((el) => el?.value === formData?.timeOfDay)?.label}
                onChange={(option) => {
                  onSetFormData({ ...formData, timeOfDay: option.value });
                  onSetError({ ...error, time_of_day: "" });
                }}
              />
            </div>
          </Tooltip>
        </div>
        {error?.day_id && <span className="body-S red-D">{error?.day_id}</span>}
        {error?.time_of_day && <span className="body-S red-D">{error?.time_of_day}</span>}
      </div>
    </div>
  );
};

export default AssignToComponent;
