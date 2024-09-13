import React, { useContext } from "react";
import { CreateSmartPlanContext } from "../../../context/CreateSmartPlanContext";
import { useNavigate } from "react-router-dom";

const AssignToDetails = ({ type }) => {
  const navigate = useNavigate();
  const { activeTask, designatedData, userOptions } = useContext(CreateSmartPlanContext);

  const designatedAgent = type === "task" ? designatedData?.task_agent : type === "email" ? designatedData?.email_agent : type === "message" ? designatedData?.message_agent : "";

  const designatedAgentName = userOptions?.find((el) => Number(el.value) === Number(designatedAgent))?.label;

  const selectedAgent = userOptions?.find((el) => Number(el.value) === Number(activeTask?.assign_to))?.label;

  return (
    <div className="flex justify-between mt-6">
      <div>
        <div>
          <p className="head-6 dark-M">Assign To</p>
          <p
            role="button"
            className={`${activeTask?.assign_to === "designated" ? "body-N dark-H" : "head-5 green-H"} mt-1 capitalize`}
            onClick={() => {
              if (activeTask?.assign_to === "designated") {
                return;
              } else {
                navigate(`/user/${activeTask?.assign_to}`);
              }
            }}
          >
            {activeTask?.assign_to === "designated" ? designatedAgentName : selectedAgent}
          </p>
        </div>
        <div className="mt-6">
          <p className="head-6 dark-M">Day</p>
          <p className="body-N dark-H mt-1">{activeTask?.day}</p>
        </div>
      </div>
      <div>
        <div>
          <p className="head-6 dark-M">Due Date</p>
          <p className="body-N dark-H mt-1">
            Due {activeTask?.due_date?.date} at {activeTask?.due_date?.hours ? activeTask?.due_date?.hours : "00"}:{activeTask?.due_date?.mins ? activeTask?.due_date?.mins : "00"} {activeTask?.due_date?.period === "all_day" ? "PM" : activeTask?.due_date?.period}
          </p>
        </div>

        <div className="mt-6">
          <p className="head-6 dark-M">Time of Day</p>
          <p className="body-N dark-H mt-1">{activeTask?.day === 1 ? "Immediately" : activeTask?.time_of_day}</p>
        </div>
      </div>
    </div>
  );
};

export default AssignToDetails;
