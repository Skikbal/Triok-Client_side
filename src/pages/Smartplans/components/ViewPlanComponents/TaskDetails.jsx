import React, { useContext, useState } from "react";
import { priorityOptions } from "../../../../utils/options";
import { DeleteIcon, EditIcon } from "../../../../utils/icons";
import { CreateSmartPlanContext } from "../../../../context/CreateSmartPlanContext";
import DeleteConfirmationModal from "../../../../components/ConfirmationModals/DeleteConfirmationModal";
import AssignToDetails from "../AssignToDetails";

const TaskDetails = () => {
  const { setActive, activeTask, handleDeleteStep } = useContext(CreateSmartPlanContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="head-2 dark-H">Task Details</p>
        <div className="flex gap-2">
          <div role="button" onClick={() => setActive("task")}>
            <EditIcon />
          </div>
          <div role="button" onClick={() => setShowDeleteModal(true)}>
            <DeleteIcon />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="head-6 dark-M">Task Name</p>
        <p className="body-N dark-H capitalize">{activeTask?.title}</p>
      </div>

      <div className="mt-6">
        <p className="head-6 dark-M">Description</p>
        <p className="body-N dark-H">{activeTask?.description}</p>
      </div>

      <div className="mt-6">
        <p className="head-6 dark-M">Priority</p>
        <div className="tags flex items-center gap-2 capitalize mt-2">
          <img src={priorityOptions.find((e) => e?.value === "none")?.icon} alt="" /> None
        </div>
      </div>

      <AssignToDetails type="task" />

      <DeleteConfirmationModal showModal={showDeleteModal} handleDelete={handleDeleteStep} onClose={() => setShowDeleteModal(false)} />
    </div>
  );
};

export default TaskDetails;
