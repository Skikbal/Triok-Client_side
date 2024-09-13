import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import axios from "axios";
import "./Tasks.css";
import useAuth from "../../hooks/useAuth";
import low from "../../assets/svgs/low.svg";
import Loader from "../../components/Loader";
import Plus from "../../assets/svgs/Plus.svg";
import high from "../../assets/svgs/high.svg";
import none from "../../assets/svgs/None.svg";
import text from "../../assets/svgs/chat.svg";
import { BASE_URL } from "../../utils/Element";
import call from "../../assets/svgs/call 2.svg";
import AddtaskModal from "./modals/AddTaskModal";
import BaseLayout from "../../layouts/BaseLayout";
import TaskDetailsModal from "./TaskDetailsModal";
import medium from "../../assets/svgs/medium.svg";
import EditTaskModal from "./modals/EditTaskModal";
import account from "../../assets/svgs/account.svg";
import Complete from "../../assets/svgs/Complete.svg";
import swap from "../../assets/svgs/swap-vertical.svg";
import { FaRegCheckCircle as Check } from "react-icons/fa";
import sortAsce from "../../assets/svgs/sort-ascending.svg";
import sortDesc from "../../assets/svgs/sort-descending.svg";
import { initialTaskFilterData } from "../../utils/initialData";
import TaskFilter from "../../components/FilterComponents/TaskFilter";
import TaskPagination from "../../components/Pagination/TaskPagination";
import AddNoteModal from "../../components/DetailTabsData/Modals/AddNoteModal";
import CompleteTaskModal from "../../components/DetailTabsData/Modals/CompleteTaskModal";
import ResheduleTaskModal from "../../components/DetailTabsData/Modals/ResheduleTaskModal";
import DeleteConfirmationModal from "../../components/ConfirmationModals/DeleteConfirmationModal";
import ArchiveConfirmationModal from "../../components/ConfirmationModals/ArchiveConfirmationModal";
import UnarchiveConfirmationModal from "../../components/ConfirmationModals/UnarchieveConfirmationModal";
import { NotificationManager } from "react-notifications";
import TaskActionMenu from "./components/TaskActionMenu";

const archiveMenuOption = ["Unarchive", "Delete"];
const todoMenuOption = ["Edit", "Reschedule", "Add Note", "Archive"];

const Tasks = () => {
  const userType = useSelector((state) => state.userType);
  const isSidebarCollapsed = useSelector((state) => state.isSidebarCollapsed);
  const [config] = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState();
  const [search, setSearch] = useState("");
  const [taskData, setTaskData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedId, setSelectedId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [taskType, setTaskType] = useState("myTask");
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedItem, setSelectedItem] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showCtaskModal, setShowCtaskModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [showUnarchiveModal, setShowUnarchiveModal] = useState(false);
  const [filterData, setFilterData] = useState(initialTaskFilterData);
  const [showCompleteTaskModal, setShowCompleteTaskModal] = useState(false);
  const [showResheduleTaskModal, setShowResheduleTaskModal] = useState(false);
  const [paginationData, setPaginationData] = useState({ totalItems: 0, from: 0, to: 0, totalPages: 0 });

  const taskIds = taskData.map((el) => el.id);

  const buildQueryParams = (filters) => {
    let params = `status=${activeTab}&page=${pageNumber}&search=${search}&type=${taskType === "teamTask" ? "team_task" : "my_task"}`;

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

  const fetchTasks = (filters) => {
    const queryParams = buildQueryParams(filters);
    axios
      .get(`${BASE_URL}/task-list?${queryParams}`, config)
      .then((res) => {
        const value = res?.data?.tasks;
        setTaskData(value?.data);
        setPaginationData({
          totalItems: value?.total ?? 0,
          from: value?.from ?? 0,
          to: value?.to ?? 0,
          totalPages: value?.last_page ?? 0,
        });
        setSelectedItem([]);
        setIsSelectAll(false);
        // if (res?.data?.message) {
        //   NotificationManager.success(res?.data?.message);
        // }
      })
      .catch((err) => {
        setTaskData([]);
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchTasks(filterData);
  }, [sortDirection, sortBy]);

  useEffect(() => {
    onSuccess();
  }, [activeTab, pageNumber, search, taskType]);

  const onSuccess = (filters) => {
    setIsLoading(true);
    if (filters) {
      fetchTasks(filters);
    } else {
      fetchTasks(filterData);
    }
  };

  const handleSelectCheck = (id) => {
    if (selectedItem.length === 0) {
      setSelectedItem([id]);
    } else {
      const index = selectedItem?.indexOf(id);
      if (index === -1) {
        setSelectedItem([...selectedItem, id]);
      } else {
        const filterData = selectedItem?.filter((el) => el !== id);
        setSelectedItem(filterData);
      }
    }
  };

  useEffect(() => {
    if (selectedItem.length === taskIds.length) {
      setIsSelectAll(true);
    } else {
      setIsSelectAll(false);
    }
  }, [selectedItem, taskIds]);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  useEffect(() => {
    setPageNumber(1);
  }, [activeTab]);

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

  const handleResheduleTask = () => {
    axios
      .post(`${BASE_URL}/perform-Action?action=reschedule&task_id=${selectedTask?.id}`, { due_date: date }, config)
      .then((res) => {
        onSuccess();
        setShowResheduleTaskModal(false);
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

  const handleNext = () => {
    if (pageNumber !== paginationData.totalPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const handlePrev = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  return (
    <BaseLayout>
      <div className="contact-header">
        <p className="head-1 dark-H">
          Tasks
          {selectedItem?.length > 0 && (
            <span className="body-L ml-2">
              ({selectedItem?.length} <span className="dark-H">{selectedItem?.length === 1 ? "item" : "items"} selected</span>)
            </span>
          )}
        </p>
        <div className="flex gap-4 items-center">
          <TaskFilter
            filterData={filterData}
            onSetFilterData={(value) => {
              setFilterData(value);
            }}
            onCallApiAgain={(filters) => onSuccess(filters)}
          />

          <div className="search-box contacts">
            <input type="text" className="body-S" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Task Name" style={{ border: "1px solid #D8D8D8", marginTop: "0px" }} />
            <span className="icon-search"></span>
          </div>
          <button
            className="add-contact-button green-bg-H light-L body-S"
            onClick={() => {
              setShowCtaskModal(true);
            }}
          >
            <img className="mr-2 sidebar-icons" src={Plus} alt="plus" /> Create
          </button>
        </div>
      </div>

      <div className="task-tabs mx-1 mt-2 flex justify-between body-L dark-M">
        <div className="flex gap-4">
          <p
            role="button"
            className={`${activeTab === 0 ? "head-4 dark-H active" : ""} pb-3`}
            onClick={() => {
              setActiveTab(0);
              setPageNumber(1);
              setIsLoading(true);
            }}
          >
            To Do
          </p>
          <p
            role="button"
            className={`${activeTab === 1 ? "head-4 dark-H active" : ""} pb-3`}
            onClick={() => {
              setActiveTab(1);
              setPageNumber(1);
              setIsLoading(true);
            }}
          >
            Completed
          </p>
          <p
            role="button"
            className={`${activeTab === 2 ? "head-4 dark-H active" : ""} pb-3`}
            onClick={() => {
              setActiveTab(2);
              setPageNumber(1);
              setIsLoading(true);
            }}
          >
            Archived
          </p>
        </div>

        {userType !== 3 && (
          <div className="flex gap-4">
            <p
              role="button"
              className={`${taskType === "myTask" ? "head-4 dark-H active" : ""} pb-3`}
              onClick={() => {
                setTaskType("myTask");
                setPageNumber(1);
                setIsLoading(true);
              }}
            >
              My Tasks
            </p>
            <p
              role="button"
              className={`${taskType === "teamTask" ? "head-4 dark-H active" : ""} pb-3`}
              onClick={() => {
                setTaskType("teamTask");
                setPageNumber(1);
                setIsLoading(true);
              }}
            >
              Team Tasks
            </p>
          </div>
        )}
      </div>

      <div className="light-bg-L pb-3 table-container" style={{ marginTop: "0px" }}>
        <div className={`${isSidebarCollapsed ? "collapsed-width" : "width"} table-info light-bg-L`}>
          {isLoading ? (
            <Loader />
          ) : taskData.length === 0 ? (
            <p className="body-N text-center mt-6 p-10">No Tasks Available</p>
          ) : (
            <table className="contact-table two-rows-static light-bg-L">
              <thead>
                <tr className="uppercase body-N dark-M">
                  <th>
                    <label className="container">
                      <input
                        type="checkbox"
                        checked={taskData.length === 0 ? false : isSelectAll}
                        onChange={(e) => {
                          setIsSelectAll(e.target.checked);
                          if (e.target.checked) {
                            setSelectedItem(taskIds);
                          } else {
                            setSelectedItem([]);
                          }
                        }}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </th>
                  <th className="green-H">
                    <div className="table-header">
                      Task Name
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
                      Linked To
                      <img
                        role="button"
                        src={sortBy !== "contact_id" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        alt="icon"
                        onClick={() => {
                          setSortBy("contact_id");
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
                  {activeTab === 1 && (
                    <th>
                      <div className="table-header">
                        Completed
                        <img
                          role="button"
                          src={sortBy !== "completed" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                          alt="icon"
                          onClick={() => {
                            setSortBy("completed");
                            if (sortDirection === "desc") {
                              setSortDirection("asc");
                            } else {
                              setSortDirection("desc");
                            }
                          }}
                        />
                      </div>
                    </th>
                  )}
                  {activeTab === 2 && (
                    <th>
                      <div className="table-header">
                        Archived
                        <img
                          role="button"
                          src={sortBy !== "archived" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                          alt="icon"
                          onClick={() => {
                            setSortBy("archived");
                            if (sortDirection === "desc") {
                              setSortDirection("asc");
                            } else {
                              setSortDirection("desc");
                            }
                          }}
                        />
                      </div>
                    </th>
                  )}
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
                {taskData.flatMap((el, idx) => (
                  <tr key={idx} className="dark-H body-N">
                    <td className="">
                      <label className="container">
                        <input type="checkbox" checked={selectedItem?.includes(el.id)} onChange={() => handleSelectCheck(el.id)} />
                        <span className="checkmark"></span>
                      </label>
                    </td>

                    <td className="head-5 flex items-center capitalize gap-2" role="button" onClick={() => handleTaskClick(el)}>
                      {el.task_name} {el.task_name === "Call" ? <img src={call} alt="" /> : el.task_name === "Text" ? <img src={text} alt="" /> : null}
                    </td>

                    <td className="head-5 green-H">
                      {el?.contact ? (
                        <div className="flex items-center gap-2" role="button" onClick={() => navigate(`/contact/${el?.contact?.id}`)}>
                          <img src={account} alt="" /> {`${el.contact.first_name} ${el.contact.last_name}`}
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </td>

                    <td className="capitalize">{`${el?.user?.first_name} ${el?.user?.last_name}`}</td>

                    <td className="dark-M body-S">
                      <div className="priority flex items-center gap-2 capitalize">
                        {el.priority === "medium" ? <img src={medium} alt="" /> : el.priority === "low" ? <img src={low} alt="" /> : el.priority === "high" ? <img src={high} alt="" /> : <img src={none} alt="" />}
                        {el.priority}
                      </div>
                    </td>

                    {activeTab === 1 && <td className="dark-M">{moment(el.updated_at).format("MM/DD/YYYY")}</td>}

                    {activeTab === 2 && <td className="dark-M">{moment(el.updated_at).format("MM/DD/YYYY")}</td>}

                    <td>
                      {moment(el.due_date).format("MM/DD/YYYY")}
                      {activeTab === 0 && <span className={`due-date body-S ml-2 ${moment(el.due_date).add(1, "day").fromNow().includes("ago") ? "red-D red-bg-L" : "dark-bg-L dark-M"}`}>{moment(el.due_date).add(1, "day").fromNow().includes("ago") ? "Past Due" : `Due ${moment(el.due_date).add(1, "day").fromNow()}`}</span>}
                    </td>

                    <td className="flex gap-3 items-center">
                      {activeTab === 1 && <img src={Complete} alt="" />}

                      {activeTab === 0 && (
                        <div className="flex gap-2">
                          <Check
                            className="dark-M"
                            size={20}
                            role="button"
                            onClick={() => {
                              setShowCompleteTaskModal(true);
                              setSelectedId(el.id);
                              setSelectedTask(el);
                            }}
                          />

                          <TaskActionMenu
                            options={todoMenuOption}
                            handleSelect={(item) => {
                              if (item === "Edit") {
                                setShowEditTaskModal(true);
                              } else if (item === "Reschedule") {
                                setShowResheduleTaskModal(true);
                              } else if (item === "Add Note") {
                                setShowNotesModal(true);
                              } else {
                                setShowArchiveModal(true);
                              }
                              setSelectedTask(el);
                              setSelectedTask(el);
                            }}
                          />
                        </div>
                      )}

                      {activeTab === 2 && (
                        <TaskActionMenu
                          options={archiveMenuOption}
                          handleSelect={(item) => {
                            if (item === "Delete") {
                              setShowDeleteModal(true);
                            } else {
                              setShowUnarchiveModal(true);
                            }
                            setSelectedTask(el);
                          }}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {taskData?.length !== 0 && <TaskPagination activeTab={activeTab} selectedItem={selectedItem} paginationData={paginationData} handlePrev={handlePrev} handleNext={handleNext} handleUpdated={onSuccess} />}
      </div>

      <AddtaskModal showModal={showCtaskModal} onClose={() => setShowCtaskModal(false)} onTaskAdded={onSuccess} />

      <TaskDetailsModal showModal={showModal} onClose={() => setShowModal(false)} id={selectedTask?.id} onCallApiAgain={onSuccess} />

      <CompleteTaskModal showModal={showCompleteTaskModal} onClose={() => setShowCompleteTaskModal(false)} onTaskCompleted={onSuccess} taskData={selectedTask} />

      <EditTaskModal showModal={showEditTaskModal} onClose={() => setShowEditTaskModal(false)} taskInitialData={selectedTask} onTaskEdited={onSuccess} />

      <ResheduleTaskModal
        showModal={showResheduleTaskModal}
        onClose={() => setShowResheduleTaskModal(false)}
        onDateChange={(date) => {
          setDate(date);
        }}
        handleResheduleTask={handleResheduleTask}
      />

      <AddNoteModal showModal={showNotesModal} onClose={() => setShowNotesModal(false)} taskData={selectedTask} onnotesAdded={onSuccess} />

      <ArchiveConfirmationModal showModal={showArchiveModal} onClose={() => setShowArchiveModal(false)} handleAction={handleArchieve} />

      <UnarchiveConfirmationModal showModal={showUnarchiveModal} onClose={() => setShowUnarchiveModal(false)} handleAction={handleUnarchieve} />

      <DeleteConfirmationModal showModal={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleDelete={handleDelete} />
    </BaseLayout>
  );
};

export default Tasks;
