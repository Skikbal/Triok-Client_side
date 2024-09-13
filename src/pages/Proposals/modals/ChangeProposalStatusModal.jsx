import React, { useEffect, useState } from "react";
import Modal from "../../../components/Modal/Modal";
import axios from "axios";
import { BASE_URL } from "../../../utils/Element";
import useAuth from "../../../hooks/useAuth";
import { NotificationManager } from "react-notifications";
import { Radio, RadioGroup, Stack } from "@chakra-ui/react";

const ChangeProposalStatusModal = ({ showModal, onClose, onCallApi, id, status }) => {
  const [config] = useAuth();
  const [selectedStatus, setStatus] = useState("followup");

  useEffect(() => {
    if (status === 0) {
      setStatus("followup");
    } else if (status === 1) {
      setStatus("won");
    } else {
      setStatus("lost");
    }
  }, [status]);

  const handleUpdateStatus = (e) => {
    e.preventDefault();

    axios
      .post(`${BASE_URL}/markAs-Proposal/${id}`, { status: selectedStatus === "followup" ? 0 : selectedStatus === "won" ? 1 : 2 }, config)
      .then((res) => {
        onCallApi();
        onClose();
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  return (
    <Modal title={"Change Proposal Status"} desc={`Fill the required information.`} show={showModal} onClose={onClose}>
      <form onSubmit={handleUpdateStatus}>
        <div className="">
          <label className="dark-H head-4 required:*:">
            Status<span className="red-D">*</span>
          </label>
          <div className="mt-2">
            <RadioGroup
              onChange={(value) => {
                setStatus(value);
              }}
              value={selectedStatus}
            >
              <Stack direction="row" justifyContent={"space-between"} gap={5}>
                <Radio value="followup">Follow-Up</Radio>
                <Radio value="won">Won</Radio>
                <Radio value="lost">Lost</Radio>
              </Stack>
            </RadioGroup>
          </div>
        </div>

        <div className="mt-7">
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

export default ChangeProposalStatusModal;
