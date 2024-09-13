import React, { useEffect, useRef, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import axios from "axios";
import Loader from "../Loader";
import useAuth from "../../hooks/useAuth";
import low from "../../assets/svgs/low.svg";
import high from "../../assets/svgs/high.svg";
import none from "../../assets/svgs/None.svg";
import text from "../../assets/svgs/chat.svg";
import { BASE_URL } from "../../utils/Element";
import { FiPlus as Plus } from "react-icons/fi";
import call from "../../assets/svgs/call 2.svg";
import medium from "../../assets/svgs/medium.svg";
import Complete from "../../assets/svgs/Complete.svg";
import swap from "../../assets/svgs/swap-vertical.svg";
import TaskFilter from "../FilterComponents/TaskFilter";
import { HiDotsVertical as Menu } from "react-icons/hi";
import { FaRegCheckCircle as Check } from "react-icons/fa";
import CompleteTaskModal from "./Modals/CompleteTaskModal";
import sortAsce from "../../assets/svgs/sort-ascending.svg";
import sortDesc from "../../assets/svgs/sort-descending.svg";
import { initialTaskFilterData } from "../../utils/initialData";
import ContactPagination from "../Pagination/ContactPagination";
import AddTaskModal from "../../pages/Tasks/modals/AddTaskModal";
import TaskDetailsModal from "../../pages/Tasks/TaskDetailsModal";
import EditTaskModal from "../../pages/Tasks/modals/EditTaskModal";
import AddNoteModal from "../../components/DetailTabsData/Modals/AddNoteModal";
import DeleteConfirmationModal from "../ConfirmationModals/DeleteConfirmationModal";
import ArchiveConfirmationModal from "../ConfirmationModals/ArchiveConfirmationModal";
import UnarchiveConfirmationModal from "../ConfirmationModals/UnarchieveConfirmationModal";
import ResheduleTaskModal from "../../components/DetailTabsData/Modals/ResheduleTaskModal";

const TaskTab = ({ from, data }) => {
  const [config] = useAuth();
  const { id } = useParams();
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState("");
  const [taskData, setTaskData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [selectedTask, setSelectedTask] = useState("");
  const [showtaskModal, setShowtaskModal] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [showUnarchiveModal, setShowUnarchiveModal] = useState(false);
  const [filterData, setFilterData] = useState(initialTaskFilterData);
  const [showCompleteTaskModal, setShowCompleteTaskModal] = useState(false);
  const [showResheduleTaskModal, setShowResheduleTaskModal] = useState(false);
  const isSidebarCollapsed = useSelector((state) => state.isSidebarCollapsed);
  const [paginationData, setPaginationData] = useState({ totalItems: 0, from: 0, to: 0, totalPages: 0 });

  const handleNext = () => {
    if (currentPage !== paginationData.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const buildQueryParams = (filters) => {
    let params = `page=${currentPage}&per_page=${itemPerPage}`;

    const { selectedPriorities, selectedTaskTypes, selectedLinkedOptions, isRepeatingTask, selectedDueDate } = filters;

    if (selectedPriorities.length > 0) {
      params += `&priority=${selectedPriorities.join(",")}`;
    }

    if (selectedTaskTypes.length > 0) {
      params += `&task_type=${selectedTaskTypes.join(",")}`;
    }

    if (selectedLinkedOptions.length > 0) {
      params += `&linked_to=${selectedLinkedOptions.join(",")}`;
    }

    if (isRepeatingTask !== "no") {
      params += `&repeating_tasks=${isRepeatingTask}`;
    }

    if (selectedDueDate) {
      params += `&due_date=${selectedDueDate}`;
    }

    if (sortDirection && sortBy !== "id") {
      params += `&sort_direction=${sortDirection}`;
    }

    if (sortBy !== "id") {
      params += `&sort_column=${sortBy}`;
    }

    return params;
  };

  const fetchTaskdata = (filters) => {
    const queryParams = buildQueryParams(filters);
    const type = from === "contact" ? `contact_id=${id}` : `company_id=${id}`;
    axios
      .get(`${BASE_URL}/task-list?${type}&${queryParams}`, config)
      .then((res) => {
        const value = res?.data?.tasks;
        setTaskData(value?.data);
        setPaginationData({
          totalItems: value?.total ?? 0,
          from: value?.from ?? 0,
          to: value?.to ?? 0,
          totalPages: value?.last_page ?? 0,
        });
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
        setTaskData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTaskdata(filterData);
  }, [sortDirection, sortBy]);

  useEffect(() => {
    onSuccess();
  }, [currentPage, itemPerPage]);

  const onSuccess = (filters) => {
    setLoading(true);
    if (filters) {
      fetchTaskdata(filters);
    } else {
      fetchTaskdata(filterData);
    }
  };

  const handleArchieve = () => {
    axios
      .post(`${BASE_URL}/perform-Action?action=archive&task_id=${selectedTask?.id}`, {}, config)
      .then((res) => {
        onSuccess();
        setShowArchiveModal(false);
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

  const handleUnarchieve = () => {
    axios
      .post(`${BASE_URL}/perform-Action?action=unarchive&task_id=${selectedTask?.id}`, {}, config)
      .then((res) => {
        onSuccess();
        setShowUnarchiveModal(false);
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

  const handleDelete = () => {
    axios
      .post(`${BASE_URL}/perform-Action?action=delete&task_id=${selectedTask?.id}`, {}, config)
      .then((res) => {
        onSuccess();
        setShowDeleteModal(false);
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

  const handleMenuClick = (idx) => {
    setIsOpen(isOpen === idx ? "" : idx);
  };

  const handleDropdownOptionClick = () => {
    setIsOpen("");
  };

  return (
    <div>
      <div className="flex justify-between items-start head-5 green-H">
        <TaskFilter
          filterData={filterData}
          onSetFilterData={(value) => {
            setFilterData(value);
          }}
          onCallApiAgain={(filters) => onSuccess(filters)}
        />

        <p className="head-5 green-H flex items-center gap-1" role="button" onClick={() => setShowModal(true)}>
          <Plus /> Add Task
        </p>
      </div>
      <div className="light-bg-L pb-3 table-container">
        <div className={`${isSidebarCollapsed ? "tab-collapsed-width" : "tab-width"} table-info light-bg-L`}>
          {loading ? (
            <Loader />
          ) : taskData.length === 0 ? (
            <p className="text-center dark-H body-N mt-5">No tasks available</p>
          ) : (
            <table className="contact-table light-bg-L">
              <thead>
                <tr className="uppercase body-N dark-M">
                  <th className="green-H">
                    <div className="table-header">
                      Task
                      <img
                        role="button"
                        src={sortBy !== "task_name" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("task_name");
                          if (sortDirection === "desc") {
                            setSortDirection("asc");
                          } else {
                            setSortDirection("desc");
                          }
                        }}
                        alt="icon"
                      />
                    </div>
                  </th>
                  <th>
                    <div className="table-header">
                      Assigned To
                      <img
                        role="button"
                        src={sortBy !== "user_id" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        alt="icon"
                        onClick={() => {
                          setSortBy("user_id");
                          if (sortDirection === "desc") {
                            setSortDirection("asc");
                          } else {
                            setSortDirection("desc");
                          }
                        }}
                      />
                    </div>
                  </th>
                  <th>
                    <div className="table-header">
                      Priority
                      <img
                        role="button"
                        src={sortBy !== "priority" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("priority");
                          if (sortDirection === "desc") {
                            setSortDirection("asc");
                          } else {
                            setSortDirection("desc");
                          }
                        }}
                        alt="icon"
                      />
                    </div>
                  </th>
                  <th>
                    <div className="table-header">
                      Due Date
                      <img
                        role="button"
                        src={sortBy !== "due_date" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        alt="icon"
                        onClick={() => {
                          setSortBy("due_date");
                          if (sortDirection === "desc") {
                            setSortDirection("asc");
                          } else {
                            setSortDirection("desc");
                          }
                        }}
                      />
                    </div>
                  </th>
                  <th>
                    <div className="table-header">More</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {taskData.map((el, idx) => (
                  <tr key={el.id} className="body-N dark-H">
                    <td
                      className="head-4 flex items-center gap-2"
                      role="button"
                      onClick={() => {
                        setShowtaskModal(true);
                        setSelectedTask(el);
                      }}
                    >
                      {el.task_name} {el.task_name === "Call" ? <img src={call} alt="" /> : el.task_name === "Text" ? <img src={text} alt="" /> : null}
                    </td>
                    <td className="capitalize">{`${el?.user?.first_name} ${el?.user?.last_name}`}</td>
                    <td className="dark-M body-S">
                      <div className="priority flex items-center gap-2 capitalize">
                        {el.priority === "medium" ? <img src={medium} alt="" /> : el.priority === "low" ? <img src={low} alt="" /> : el.priority === "high" ? <img src={high} alt="" /> : <img src={none} alt="" />}
                        {el.priority}
                      </div>
                    </td>
                    <td>
                      {el.due_date} <span className={`due-date body-S ml-2 ${moment(el.due_date).fromNow().includes("ago") ? "red-D red-bg-L" : "dark-bg-L dark-M"}`}>{moment(el.due_date).fromNow().includes("ago") ? "Past Due" : `Due ${moment(el.due_date).fromNow()}`}</span>
                    </td>
                    <td className="flex gap-3 items-center">
                      {el.status == 1 && <img src={Complete}></img>}
                      {el.status == 2 && (
                        <div className="flex gap-2">
                          <div ref={dropdownRef} className="custom-dropdown">
                            <div role="button" className="pt-0.5" onClick={() => handleMenuClick(idx)}>
                              <Menu />
                            </div>

                            {isOpen === idx && (
                              <ul className="dropdown-list-container dropdown-end light-bg-L dark-M body-N p-2 shadow rounded-box w-52" onClick={(e) => e.stopPropagation()}>
                                <li
                                  role="button"
                                  onClick={() => {
                                    setShowUnarchiveModal(true);
                                    setSelectedTask(el);
                                    handleDropdownOptionClick();
                                  }}
                                >
                                  Unarchive
                                </li>

                                <li
                                  role="button"
                                  className="mt-2 red-D"
                                  onClick={() => {
                                    setShowDeleteModal(true);
                                    setSelectedTask(el);
                                    handleDropdownOptionClick();
                                  }}
                                >
                                  Delete
                                </li>
                              </ul>
                            )}
                          </div>
                        </div>
                      )}
                      {el.status == 0 && (
                        <div className="flex gap-2">
                          <Check
                            className="dark-M"
                            size={20}
                            role="button"
                            onClick={() => {
                              setShowCompleteTaskModal(true);
                              setSelectedTask(el);
                            }}
                          />
                          <div ref={dropdownRef} className="custom-dropdown">
                            <div role="button" className="pt-0.5" onClick={() => handleMenuClick(idx)}>
                              <Menu />
                            </div>
                            {isOpen === idx && (
                              <ul className="dropdown-list-container dropdown-end light-bg-L dark-M body-N p-2 shadow rounded-box w-52" onClick={(e) => e.stopPropagation()}>
                                <li
                                  role="button"
                                  onClick={() => {
                                    setShowEditTaskModal(true);
                                    setSelectedTask(el);
                                    handleDropdownOptionClick();
                                  }}
                                >
                                  Edit
                                </li>
                                <li
                                  role="button"
                                  className="mt-2"
                                  onClick={() => {
                                    setShowResheduleTaskModal(true);
                                    setSelectedTask(el);
                                    handleDropdownOptionClick();
                                  }}
                                >
                                  Reschedule
                                </li>
                                <li
                                  role="button"
                                  className="mt-2"
                                  onClick={() => {
                                    setShowNotesModal(true);
                                    setSelectedTask(el);
                                    handleDropdownOptionClick();
                                  }}
                                >
                                  Add Note
                                </li>
                                <li
                                  role="button"
                                  className="mt-2 red-D"
                                  onClick={() => {
                                    setShowArchiveModal(true);
                                    setSelectedTask(el);
                                    handleDropdownOptionClick();
                                  }}
                                >
                                  Archive
                                </li>
                              </ul>
                            )}
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {taskData.length !== 0 && <ContactPagination paginationData={paginationData} handleNext={handleNext} handlePrev={handlePrev} onSuccess={onSuccess} />}
      </div>

      <AddTaskModal showModal={showModal} onClose={() => setShowModal(false)} from={from} data={data} onTaskAdded={onSuccess} />

      <TaskDetailsModal showModal={showtaskModal} onClose={() => setShowtaskModal(false)} id={selectedTask?.id} onCallApiAgain={onSuccess} />

      <CompleteTaskModal showModal={showCompleteTaskModal} onClose={() => setShowCompleteTaskModal(false)} onTaskCompleted={onSuccess} taskData={selectedTask} />

      <ArchiveConfirmationModal showModal={showArchiveModal} onClose={() => setShowArchiveModal(false)} handleAction={handleArchieve} />

      <UnarchiveConfirmationModal showModal={showUnarchiveModal} onClose={() => setShowUnarchiveModal(false)} handleAction={handleUnarchieve} />

      <DeleteConfirmationModal showModal={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleDelete={handleDelete} />

      <EditTaskModal showModal={showEditTaskModal} onClose={() => setShowEditTaskModal(false)} taskInitialData={selectedTask} onTaskEdited={onSuccess} />

      <ResheduleTaskModal showModal={showResheduleTaskModal} onClose={() => setShowResheduleTaskModal(false)} taskData={selectedTask} ontaskReshedule={onSuccess} />

      <AddNoteModal showModal={showNotesModal} onClose={() => setShowNotesModal(false)} taskData={selectedTask} onnotesAdded={onSuccess} />
    </div>
  );
};

export default TaskTab;
