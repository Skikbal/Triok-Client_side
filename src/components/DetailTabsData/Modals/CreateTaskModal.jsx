import React, { useState } from "react";
import Dropdown from "react-dropdown";
import Modal from "../../Modal/Modal";
import Contact from "../../../assets/svgs/account.svg";
import call from "../../../assets/svgs/Vector.svg";
import message from "../../../assets/svgs/Message2.svg";
import { Radio, RadioGroup, Stack } from "@chakra-ui/react";

const options = [
  { value: "one", label: "One" },
  { value: "two", label: "Two" },
  { value: "three", label: "Three" },
  { value: "four", label: "Four" },
];

const CreateTaskModal = ({ showModal, onClose }) => {
  const [type, setType] = useState("call");
  return (
    <Modal title={"Create Task"} desc={"Enter information for the task"} show={showModal} onClose={onClose}>
      <form className="py-3">
        <div className="">
          <p className="head-4 dark-H">
            Task Name <span className="red-D">*</span>
          </p>
          <input type="text" placeholder="Write your task name here" className="mt-2 w-full body-N" />
        </div>

        <div className="mt-6">
          <label className="dark-H head-4 mb-2">Linked to</label>
          <div className="mt-2 flex items-center justify-center rounded-3xl border border-[#2D5B30] p-1 w-40">
            <img src={Contact} alt="Contact" className="mr-2" />
            <p className="head-5 text-[#2D5B30]">Link Contact</p>
          </div>
        </div>
        <div className="mt-6">
          <label className="dark-H head-4 mb-2">
            Task Type<span className="red-D">*</span>
          </label>

          <div className="mt-3 capitalize">
            <RadioGroup
              onChange={(value) => {
                setType(value);
              }}
              value={type}
            >
              <Stack direction="row" justifyContent="space-between" gap={5}>
                {["call", "text", "other"]?.flatMap((el, idx) => (
                  <Radio key={idx} value={el}>
                    <div className="flex items-center gap-2">
                      <p>{el}</p>
                      {el === "call" && <img src={call} alt="" />}
                      {el === "text" && <img src={message} alt="" />}
                    </div>
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </div>
        </div>

        <div className="flex-1 mt-6">
          <p className="head-4 dark-H">
            Description <span className="body-S dar-M"> (optional)</span>
          </p>
          <textarea rows={3} placeholder="Enter a description" className="mt-2 w-full body-N" />
        </div>

        <div className="mt-6">
          <p className="head-4 dark-H ">
            Hyperlink<span className="body-S dar-M"> (optional)</span>
          </p>
          <input type="text" placeholder="Add an optional link..." className="mt-2 w-full body-N" />
        </div>

        <div className="mt-6 flex gap-6 items-center">
          <div>
            <p className="head-4 dark-H">Priority Level</p>
            <Dropdown className="priority-select rounded-md company-select" options={options} placeholder="Select Priority" />
          </div>

          <div>
            <p className="head-4 dark-H">
              Due Date<span className="red-D">*</span>
            </p>
            <input className="body-N" type="date" placeholder="Due Date" />
          </div>
        </div>

        <div className="mt-6">
          <div>
            <p className="head-4 dark-H">Repeat</p>
            <Dropdown className="repeat company-select" options={options} placeholder="Select repeat" />
          </div>
        </div>

        <div className="mt-6">
          <button type="submit" className="save-button light-L head-5 green-bg-H">
            Create Task
          </button>
          <button type="button" onClick={onClose} className="green-H ml-5">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTaskModal;
