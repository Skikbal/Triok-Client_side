import React from "react";
import Modal from "../../../components/Modal/Modal";
import { Radio, RadioGroup, Stack } from "@chakra-ui/react";

const SmartPlanStartDateModal = ({ showModal, onClose, handleSubmit, onSetStartDate, startDate }) => {
  return (
    <Modal title={"Select Start Date"} desc={"Information about start date of this smartplan"} show={showModal} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <p className="head-4 dark-H mb-2">When should the plan start?</p>

        <RadioGroup
          onChange={(value) => {
            onSetStartDate({ ...startDate, type: value });
          }}
          value={startDate.type}
        >
          <Stack direction="column" gap={2}>
            <Radio value="today">Start Now</Radio>
            <Radio value="other">Start on a specific date</Radio>
          </Stack>
        </RadioGroup>

        {startDate.type === "other" && (
          <input
            type="date"
            className="ml-6 mt-2"
            value={startDate.selectedDate}
            style={{ width: "50%" }}
            onChange={(e) => {
              onSetStartDate({ ...startDate, selectedDate: e.target.value });
            }}
          />
        )}

        <div className="mt-6">
          <button type="submit" className="save-button light-L head-5 green-bg-H">
            Save
          </button>
          <button type="button" onClick={onClose} className="green-H ml-5">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SmartPlanStartDateModal;
