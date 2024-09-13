import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../../Modal/Modal";
import AddNoteData from "./AddNoteData";
import useAuth from "../../../hooks/useAuth";
import { BASE_URL } from "../../../utils/Element";
import { NotificationManager } from "react-notifications";

const initialData = {
  type: "contact",
  linked_to: "",
  linked_name: "",
  description: "",
};

const EditNoteModal = ({ showModal, onClose, selectedNote, onCallApi }) => {
  const [config] = useAuth();
  const [error, setError] = useState();
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    if (selectedNote) {
      setFormData({
        type: selectedNote?.type,
        linked_to: selectedNote?.linked_to_name?.id?.toString(),
        linked_name: selectedNote?.linked_to_name?.name,
        description: selectedNote?.description,
      });
    }
  }, [selectedNote]);

  const handleEditNote = () => {
    const dataToSend = {
      type: formData?.type,
      linked_to: formData?.linked_to,
      description: formData?.description,
    };

    axios
      .post(`${BASE_URL}/update-notes/${selectedNote?.id}`, dataToSend, config)
      .then((res) => {
        onClose();
        onCallApi();
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

  return (
    <Modal title={"Edit Note"} show={showModal} onClose={onClose}>
      <div className="min-h-[150px]">
        <AddNoteData
          type="edit"
          handleSubmit={handleEditNote}
          formData={formData}
          error={error}
          onSetFormData={(value) => {
            setFormData(value);
          }}
          onSetError={(err) => setError(err)}
        />{" "}
      </div>
    </Modal>
  );
};

export default EditNoteModal;
