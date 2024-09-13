import React from "react";
import low from "../../../assets/svgs/low.svg";
import high from "../../../assets/svgs/high.svg";
import none from "../../../assets/svgs/None.svg";
import text from "../../../assets/svgs/chat.svg";
import call from "../../../assets/svgs/call 2.svg";
import medium from "../../../assets/svgs/medium.svg";
import { RiArrowUpSLine as UpArrow } from "react-icons/ri";
import { Radio, RadioGroup, Stack } from "@chakra-ui/react";

const dueDate = [
  { label: "All", value: "all" },
  { label: "No Due Date", value: "no_due_date" },
  { label: "Due Later", value: "due_later" },
  { label: "Due Today", value: "due_today" },
  { label: "Past Due", value: "past_due" },
  { label: "Due Next 7 Days", value: "due_next_7_days" },
];

const priorityData = [
  { label: "None", value: "none" },
  { label: "Low", value: "low" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
];

const taskType = [
  { label: "Call", value: "call" },
  { label: "Text", value: "text" },
  { label: "Other", value: "other" },
];

const linkedOptions = [
  { label: "Contact", value: "contact" },
  // { label: "Opportunity", value: "opportunity" },
  { label: "Unlinked", value: "unlinked" },
];

const TaskFilterData = ({ filterData, onSetFilterData, isSidebarOpen }) => {
  const handlePriorityChange = (value) => {
    if (filterData?.selectedPriorities.includes(value)) {
      onSetFilterData({ ...filterData, selectedPriorities: filterData?.selectedPriorities.filter((item) => item !== value) });
    } else {
      onSetFilterData({ ...filterData, selectedPriorities: [...filterData?.selectedPriorities, value] });
    }
  };

  const handleTasktype = (value) => {
    if (filterData?.selectedTaskTypes.includes(value)) {
      onSetFilterData({ ...filterData, selectedTaskTypes: filterData?.selectedTaskTypes.filter((item) => item !== value) });
    } else {
      onSetFilterData({ ...filterData, selectedTaskTypes: [...filterData?.selectedTaskTypes, value] });
    }
  };

  const handleLinkedto = (value) => {
    if (filterData?.selectedLinkedOptions.includes(value)) {
      onSetFilterData({ ...filterData, selectedLinkedOptions: filterData?.selectedLinkedOptions.filter((item) => item !== value) });
    } else {
      onSetFilterData({ ...filterData, selectedLinkedOptions: [...filterData?.selectedLinkedOptions, value] });
    }
  };

  return (
    <div className="">
      <div>
        <div className="flex justify-between items-center mb-4">
          <p className="head-4 dark-H">Due Date</p>
          {/* <UpArrow /> */}
        </div>

        <RadioGroup
          onChange={(value) => {
            onSetFilterData({ ...filterData, selectedDueDate: value });
          }}
          value={filterData?.selectedDueDate}
        >
          <Stack direction="column" gap={3}>
            {dueDate.flatMap((el, i) => (
              <Radio key={i} value={el.value}>
                <p className={`due-date body-S ${el.label.includes("Past") ? "red-D red-bg-L" : el.label.includes("All") ? "dark-M body-N" : el.label.includes("Today") ? "green-bg-L green-H" : "dark-bg-L dark-M"}`}>{el.label}</p>
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <div className="flex justify-between items-center">
          <p className="head-4 dark-H">Repeating Tasks</p>
          {/* <UpArrow /> */}
        </div>

        <div className="mt-4">
          <label className="container">
            <input
              type="checkbox"
              checked={filterData?.isRepeatingTask === "yes"}
              onChange={() => {
                onSetFilterData({ ...filterData, isRepeatingTask: filterData?.isRepeatingTask === "yes" ? "no" : "yes" });
              }}
            />
            <span className="checkmark"></span>
            <p className="dark-M body-N ">Repeating Tasks Only</p>
          </label>
        </div>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <div className="flex justify-between items-center">
          <p className="head-4 dark-H">Priority Level</p>
          {/* <UpArrow /> */}
        </div>

        <div className="mt-4">
          {priorityData.flatMap((el, idx) => (
            <label key={idx} className="container">
              <input
                type="checkbox"
                checked={filterData?.selectedPriorities.includes(el.value)}
                onChange={() => {
                  handlePriorityChange(el.value);
                }}
              />
              <span className="checkmark"></span>
              <p className="tags flex items-center gap-2 capitalize dark-M body-XS" style={{ border: "1px solid #6F6F6F" }}>
                {el.label === "Medium" ? <img src={medium} alt="" /> : el.label === "Low" ? <img src={low} alt="" /> : el.label === "High" ? <img src={high} alt="" /> : <img src={none} alt="" />}
                {el.label}
              </p>
            </label>
          ))}
        </div>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <div className="flex justify-between items-center">
          <p className="head-4 dark-H">Task Type</p>
          {/* <UpArrow /> */}
        </div>

        <div className="mt-4">
          {taskType?.flatMap((el, idx) => (
            <label key={idx} className="container">
              <input
                type="checkbox"
                checked={filterData?.selectedTaskTypes.includes(el.value)}
                onChange={() => {
                  handleTasktype(el.value);
                }}
              />
              <span className="checkmark"></span>
              <p className="dark-M body-N flex items-center gap-2">
                {el.label} {el.label === "Call" ? <img src={call} alt="" /> : el.label === "Text" ? <img src={text} alt="" /> : null}
              </p>
            </label>
          ))}
        </div>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <div className="flex justify-between items-center">
          <p className="head-4 dark-H">Linked To</p>
          {/* <UpArrow /> */}
        </div>

        <div className="mt-4">
          {linkedOptions?.flatMap((el, idx) => (
            <label key={idx} className="container">
              <input
                type="checkbox"
                checked={filterData?.selectedLinkedOptions?.includes(el.value)}
                onChange={() => {
                  handleLinkedto(el.value);
                }}
              />
              <span className="checkmark"></span>
              <p className="dark-M body-N ">{el?.label}</p>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskFilterData;
