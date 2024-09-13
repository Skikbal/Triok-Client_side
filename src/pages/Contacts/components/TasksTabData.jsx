import React from "react";
import TaskTab from "../../../components/DetailTabsData/TaskTab";

const TasksTabData = ({ data, commingFrom }) => {
  return (
    <div>
      <TaskTab from="contact" data={data} />
    </div>
  );
};

export default TasksTabData;
