import React, { useState } from "react";
import axios from "axios";
import Modal from "../../Modal/Modal";
import useAuth from "../../../hooks/useAuth";
import { BASE_URL } from "../../../utils/Element";
import { NotificationManager } from "react-notifications";

const AddNoteModal = ({ showModal, onClose, taskData, onnotesAdded }) => {
  const [config] = useAuth();
  const [note, setNote] = useState("");
  const [comment, setComment] = useState("");

  const handleAddNote = () => {
    const dataToSend = { note_title: note, note_description: comment };
    axios
      .post(`${BASE_URL}/perform-Action?action=add_note&task_id=${taskData?.id}`, dataToSend, config)
      .then((res) => {
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
        onClose();
        onnotesAdded();
        setComment("");
        setNote("");
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const handleclose = () => {
    setComment("");
    setNote("");
    onClose();
  };

  return (
    <Modal title={"Notes"} desc={"Add notes to easily track important details."} show={showModal} onClose={handleclose} className="linkContacts-modal" width="400px" zIndex="1050">
      <form>
        <div>
          <label className="dark-H head-4 mb-2">
            Note Title<span className="red-D">*</span>
          </label>
          <input
            className="body-N"
            name="date"
            type="text"
            placeholder="Write note title here "
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
            }}
          />
        </div>
        <div className="mt-6">
          <p className="head-4 dark-H">
            Comments <span className="body-S dark-M">(optional)</span>
          </p>
          <textarea rows={4} placeholder="Write comments here.. " className="mt-2 w-full body-N" value={comment} onChange={(e) => setComment(e.target.value)} />
        </div>

        <div className="mt-6">
          <button type="button" onClick={handleAddNote} className="save-button light-L head-5 green-bg-H">
            Add Note
          </button>

          <button type="button" onClick={handleclose} className="green-H ml-5">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddNoteModal;
