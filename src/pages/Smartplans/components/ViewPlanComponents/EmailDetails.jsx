import React, { useContext, useState } from "react";
import { DeleteIcon, EditIcon } from "../../../../utils/icons";
import { CreateSmartPlanContext } from "../../../../context/CreateSmartPlanContext";
import DeleteConfirmationModal from "../../../../components/ConfirmationModals/DeleteConfirmationModal";
import AssignToDetails from "../AssignToDetails";

const EmailDetails = () => {
  const { setActive, activeTask, handleDeleteStep } = useContext(CreateSmartPlanContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="head-2 dark-H">Email Details</p>
        <div className="flex gap-2">
          <div role="button" onClick={() => setActive("email")}>
            <EditIcon />
          </div>
          <div role="button" onClick={() => setShowDeleteModal(true)}>
            <DeleteIcon />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="head-6 dark-M">Subject</p>
        <p className="body-N dark-H capitalize">{activeTask?.title}</p>
      </div>

      <div className="mt-6">
        <p className="head-6 dark-M">Email Content</p>
        <p className="body-N dark-H">{activeTask?.description}</p>
      </div>

      <AssignToDetails type="email" />

      <DeleteConfirmationModal showModal={showDeleteModal} handleDelete={handleDeleteStep} onClose={() => setShowDeleteModal(false)} />
    </div>
  );
};

export default EmailDetails;
