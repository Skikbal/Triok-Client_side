import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import useAuth from "../../hooks/useAuth";
import low from "../../assets/svgs/low.svg";
import Loader from "../../components/Loader";
import high from "../../assets/svgs/high.svg";
import none from "../../assets/svgs/None.svg";
import { BASE_URL } from "../../utils/Element";
import Modal from "../../components/Modal/Modal";
import medium from "../../assets/svgs/medium.svg";
import EditTaskModal from "./modals/EditTaskModal";
import Hide from "../../assets/svgs/left arrow2.svg";
import { NotificationManager } from "react-notifications";

const TaskDetailsModal = ({ from, showModal, onClose, id, onCallApiAgain }) => {
  const [config] = useAuth();
  const [taskData, setTaskData] = useState();
  const [loading, setLoading] = useState(true);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);

  const fetchDetails = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/task-getbyId/${id}`, config)
      .then((res) => {
        setTaskData(res?.data?.task);
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (showModal && id) {
      fetchDetails();
    }
  }, [showModal, id]);

  const handleCompleteTask = () => {
    axios
      .post(`${BASE_URL}/perform-Action?action=is_complete&task_id=${taskData?.id}`, {}, config)
      .then((res) => {
        onClose();
        onCallApiAgain();
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

  const email = taskData?.contact?.email?.length > 0 ? taskData?.contact?.email?.[0]?.email_id : "No email available";

  const phone = taskData?.contact?.phone?.length > 0 ? taskData?.contact?.phone?.[0]?.phone_number : "No phone available";

  const handletaskEdited = () => {
    setShowEditTaskModal(false);
    onCallApiAgain();
  };

  return (
    <Modal title={"Task Details"} width="800px" desc={"Get task details and track progress."} show={showModal} onClose={onClose}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="flex">
            <div className="w-1/2 pr-6">
              <p className="head-2 dark-H">Task Information</p>

              <div className="mt-6 flex gap-3">
                <div>
                  <p className="body-S dask-M uppercase">Task Name</p>
                  <p className="head-4 dark-H capitalize">{taskData?.task_name}</p>
                </div>
                <div
                  className="priority flex items-center gap-2 capitalize body-N h-[35px]"
                  // style={{ color: priorityOptions.find((el) => el.value === taskData?.priority)?.color }}
                >
                  {taskData?.priority === "medium" ? <img src={medium} alt="" /> : taskData?.priority === "low" ? <img src={low} alt="" /> : taskData?.priority === "high" ? <img src={high} alt="" /> : <img src={none} alt="" />}
                  {taskData?.priority}
                </div>
              </div>

              <div className="mt-6">
                <p className="body-S dask-M uppercase">DUE DATE</p>
                <div className="flex gap-3 items-center">
                  <p className="head-4 dark-H">{taskData?.due_date}</p>
                  <span className={`due-date body-S ${moment(taskData?.due_date).add(1, "day").fromNow().includes("ago") ? "red-D red-bg-L" : "dark-bg-L dark-M"}`}>{moment(taskData?.due_date).add(1, "day").fromNow().includes("ago") ? "Past Due" : `Due ${moment(taskData?.due_date).add(1, "day").fromNow()}`}</span>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <div>
                  <p className="body-S dask-M uppercase">TASK TYPE</p>
                  <p className="head-4 dark-H capitalize">{taskData?.task_type}</p>
                </div>
                <div>
                  <p className="body-S dask-M uppercase">HYPERLINK</p>
                  <p className="head-4 dark-H">{taskData?.hyperlink}</p>
                </div>
              </div>

              <div className="mt-6">
                <p className="body-S dark-M uppercase">DESCRIPTION</p>
                <p className="body-N dark-H">{taskData?.description}</p>
              </div>

              <div className="mt-6">
                <p className="body-S dask-M uppercase">CREATED BY</p>
                <p className="head-4 dark-H pt-0.5 capitalize">{`${taskData?.user?.first_name} ${taskData?.user?.last_name}`}</p>
                <p className="body-S dark-H pt-1">{moment(taskData?.created_at).format("MMMM DD, YYYY [at] hh:mm A")}</p>
              </div>
            </div>

            <div className="w-1/2 pl-6 border-l border-gray-500">
              <div className="flex justify-between items-center">
                <p className="head-2 dark-H">Contact Information</p>
                {/* <img src={Hide} alt="Hide" className="w-5 h-5 cursor-pointer" /> */}
              </div>

              <div className="mt-6">
                <p className="body-S dask-M uppercase">CONTACT NAME</p>
                <p className="head-4 dark-H">{`${taskData?.contact?.first_name} ${taskData?.contact?.last_name}`}</p>
              </div>

              <div className="mt-6">
                <p className="body-S dask-M uppercase">EMAIL ADDRESS</p>
                <p className="head-4 dark-H">{email}</p>
              </div>

              <div className="mt-6 flex justify-between">
                <div>
                  <p className="body-S dask-M uppercase">PHONE NUMBER</p>
                  <p className="head-4 dark-H">{phone}</p>
                </div>
                <div>
                  <p className="body-S dask-M uppercase">LAST CONTACTED</p>
                  <p className="head-4 dark-H">{moment(taskData?.contact?.updated_at).format("MMM DD, YYYY")}</p>
                </div>
              </div>

              <div className="mt-6">
                <p className="body-S dask-M uppercase">TAGS</p>
                <div className="mt-2">
                  <div className="flex flex-wrap gap-2">
                    {taskData?.contact?.tags?.map((tag, i) => (
                      <div key={i} className="tags green-H body-S capitalize p-2 rounded-full bg-light-bg-L dark:bg-dark-bg-D">
                        {/* {tag?.tag_name} */}
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex justify-between items-center">
                <p className="head-2 dark-H">Contact Notes</p>
                {/* <img src={Hide} alt="Hide" className="w-5 h-5 cursor-pointer" /> */}
              </div>
              <p className="head-4 dark-H pt-0.5">{taskData?.note_title}</p>
              <p className="body-S dark-H pt-1 capitalize">
                Created by {`${taskData?.user?.first_name} ${taskData?.user?.last_name}`}, {moment(taskData?.created_at).format("MMMM DD, YYYY [at] hh:mm A")}
              </p>
              <p className="body-S dark-H">{taskData?.note_description}</p>
            </div>
          </div>

          {from !== "activity" && taskData?.status === "0" && (
            <div className="mt-12">
              <button type="button" onClick={handleCompleteTask} className="save-button light-L head-5 green-bg-H">
                Complete Task
              </button>

              <button
                onClick={() => {
                  setShowEditTaskModal(true);
                }}
                className="green-H ml-5"
              >
                Edit Task
              </button>
            </div>
          )}
        </>
      )}

      <EditTaskModal showModal={showEditTaskModal} onClose={() => setShowEditTaskModal(false)} taskInitialData={taskData} onTaskEdited={handletaskEdited} />
    </Modal>
  );
};

export default TaskDetailsModal;
