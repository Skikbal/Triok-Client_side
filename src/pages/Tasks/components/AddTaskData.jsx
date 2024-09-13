import React, { useEffect, useRef, useState } from "react";
import LinkContactsModal from "../modals/LinkContactsModal";
import text from "../../../assets/svgs/chat.svg";
import call from "../../../assets/svgs/call 2.svg";
import account from "../../../assets/svgs/account.svg";
import { priorityOptions, taskRepeatOptions } from "../../../utils/options";
import { handleDropdownClose } from "../../../utils/utils";
import { Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { AiOutlineClose as CrossIcon } from "react-icons/ai";

const AddTaskData = ({ taskData, error, handleInputChange, from, type, data, selectedContacts, handleSelectedContacts }) => {
  const dropdownRef = useRef(null);
  const dropdownRepeatRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenTask, setIsOpenTask] = useState(false);

  const selectedPriorityOption = priorityOptions.find((el) => el.value === taskData?.priority);

  useEffect(() => {
    const handleClose = () => {
      setIsOpen(false);
    };
    handleDropdownClose(dropdownRef, handleClose);
  }, []);

  useEffect(() => {
    const handleClose = () => {
      setIsOpenTask(false);
    };
    handleDropdownClose(dropdownRepeatRef, handleClose);
  }, []);

  const handleRemove = (id) => {
    const filteredData = selectedContacts.filter((el) => el.id !== id);
    handleSelectedContacts(filteredData);
  };

  return (
    <div>
      <div>
        <label className="dark-H head-4 mb-2">
          Task Name <span className="red-D">*</span>
        </label>
        <input
          className="body-N capitalize"
          name="task_name"
          type="text"
          placeholder="write your task name here"
          value={taskData.task_name}
          onChange={(e) => {
            handleInputChange(e.target.value, "task_name");
          }}
        />
        {error?.task_name && <span className="body-S red-D">{error.task_name}</span>}
      </div>

      <div className="mt-6">
        <p className="head-4 dark-H">Linked To</p>
        {from === "contact" ? (
          <div role="button" className="head-5 green-H flex items-center gap-2 tags mt-2">
            <img src={account} alt="" /> {`${data?.first_name} ${data?.last_name}`}
          </div>
        ) : (
          <div>
            {selectedContacts?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedContacts?.map((el, index) => (
                  <div key={index} className="head-5 green-H flex items-center gap-2 tags p-2 rounded-full bg-light-bg-L dark:bg-dark-bg-D">
                    <img src={account} alt="" /> {el?.name} <CrossIcon role="button" onClick={() => handleRemove(el.id)} />
                  </div>
                ))}
              </div>
            )}
            <div role="button" onClick={() => setIsOpenModal(true)} className="head-5 green-H flex items-center gap-2 tags mt-2">
              <img src={account} alt="" /> Link Contact
            </div>
          </div>
        )}
        {error?.contact_id && <span className="body-S red-D">{error.contact_id}</span>}
      </div>

      <div className="mt-6">
        <p className="head-4 dark-H">
          Task Type <span className="red-D">*</span>
        </p>
        <div className="mt-3 capitalize">
          <RadioGroup
            onChange={(value) => {
              handleInputChange(value, "task_type");
            }}
            value={taskData.task_type}
          >
            <Stack direction="row" justifyContent="space-between" gap={5}>
              {["call", "text", "other"]?.flatMap((el, idx) => (
                <Radio key={idx} value={el}>
                  <div className="flex items-center gap-2">
                    <p>{el}</p>
                    {el === "call" && <img src={call} alt="" />}
                    {el === "text" && <img src={text} alt="" />}
                  </div>
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        </div>

        {error?.task_type && <span className="body-S red-D">{error.task_type}</span>}
      </div>

      <div className="flex-1 mt-6">
        <p className="head-4 dark-H">
          Description <span className="body-S dark-M">(optional)</span>
        </p>
        <textarea
          rows={4}
          placeholder="Enter description here..."
          className="mt-2 w-full body-N"
          name="description"
          value={taskData.description}
          onChange={(e) => {
            handleInputChange(e.target.value, "description");
          }}
        />
        {error?.description && <span className="body-S red-D">{error.description}</span>}
      </div>

      <div className="mt-6">
        <label className="dark-H head-4 mb-2">
          Hyperlink <span className="body-S dark-M">(optional)</span>
        </label>
        <input
          className="body-N"
          name="hyperlink"
          type="text"
          placeholder="Add an optional link..."
          value={taskData.hyperlink}
          onChange={(e) => {
            handleInputChange(e.target.value, "hyperlink");
          }}
        />
        {error?.hyperlink && <span className="body-S red-D">{error.hyperlink}</span>}
      </div>

      <div className="flex gap-3 mt-6">
        <div className="w-[50%] pl-0.5">
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
                      className={`${taskData.priority === el.value ? "active" : ""}`}
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

        <div className="w-[50%]">
          <label className="head-4 dark-H">
            Due Date <span className="red-D">*</span>
          </label>
          <input
            type="date"
            className="body-N"
            name="due_date"
            value={taskData.due_date}
            onChange={(e) => {
              handleInputChange(e.target.value, "due_date");
            }}
          />
          {error?.due_date && <span className="body-S red-D">{error.due_date}</span>}
        </div>
      </div>

      <div className="mt-6">
        <div className="w-[100%] pl-0.5">
          <p className="head-4 dark-H">Repeat</p>
          <div ref={dropdownRepeatRef} className="custom-dropdown mt-[6px]">
            <div role="button" className="select-header-input capitalize light-bg-L body-N dark-M flex justify-between items-center" onClick={() => setIsOpenTask(!isOpenTask)}>
              {taskData.repeat === "" ? "Select" : taskData.repeat === "custom" ? taskData.repeat_date : taskRepeatOptions.find((el) => el.value === taskData.repeat)?.label}
            </div>

            {isOpenTask && (
              <div className="dropdown-list-container light-bg-L dark-M body-N shadow rounded-box" style={{ width: "100%", bottom: "40px" }}>
                <ul className="dropdown-list">
                  {taskRepeatOptions.flatMap((el, i) => (
                    <li
                      key={i}
                      role="button"
                      onClick={() => {
                        handleInputChange(el.value, "repeat");
                        if (el.value !== "custom") {
                          setIsOpenTask(false);
                        }
                      }}
                      className={`${taskData.repeat === el.value ? "active" : ""}`}
                    >
                      {el.label}
                    </li>
                  ))}
                  {taskData.repeat === "custom" && (
                    <li>
                      <input
                        type="date"
                        value={taskData.repeat_date}
                        onChange={(e) => {
                          handleInputChange(e.target.value, "repeat_date");
                          setIsOpenTask(false);
                        }}
                      />
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
        {error?.repeat && <span className="body-S red-D">{error.repeat}</span>}
      </div>

      <LinkContactsModal
        showModal={isOpenModal}
        selectedIds={type === "add" ? selectedContacts : []}
        onClose={() => {
          setIsOpenModal(false);
        }}
        onLink={handleSelectedContacts}
        from={from}
      />
    </div>
  );
};

export default AddTaskData;
