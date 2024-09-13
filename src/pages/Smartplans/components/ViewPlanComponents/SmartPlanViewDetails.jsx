import React, { useContext, useState } from "react";
import { DeleteIcon, EditIcon } from "../../../../utils/icons";
import { CreateSmartPlanContext } from "../../../../context/CreateSmartPlanContext";
import DeleteConfirmationModal from "../../../../components/ConfirmationModals/DeleteConfirmationModal";

const SmartPlanViewDetails = () => {
  const { setActive, activeTask, handleDeleteStep } = useContext(CreateSmartPlanContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="head-2 dark-H">SmartPlan Details</p>
        <div className="flex gap-2">
          <div role="button" onClick={() => setActive("smartPlan")}>
            <EditIcon />
          </div>
          <div role="button" onClick={() => setShowDeleteModal(true)}>
            <DeleteIcon />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="head-6 dark-M">Task Name</p>
        <p className="body-N dark-H capitalize">{activeTask?.add_name?.name}</p>
      </div>

      <div className="mt-6 flex justify-between">
        <div>
          <p className="head-6 dark-M">Day</p>
          <p className="body-N dark-H">{activeTask?.day}</p>
        </div>

        <div>
          <p className="head-6 dark-M">Time of Day</p>
          <p className="body-N dark-H">{activeTask?.day === 1 ? "Immediately" : activeTask?.time_of_day}</p>
        </div>
      </div>

      <DeleteConfirmationModal showModal={showDeleteModal} handleDelete={handleDeleteStep} onClose={() => setShowDeleteModal(false)} />
    </div>
  );
};

export default SmartPlanViewDetails;
