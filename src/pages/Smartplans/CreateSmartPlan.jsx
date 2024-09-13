import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tooltip } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";
import { BASE_URL } from "../../utils/Element";
import BaseLayout from "../../layouts/BaseLayout";
import { FiPlus as PlusIcon } from "react-icons/fi";
import SmartPlanBox from "./components/SmartPlanBox";
import { handleScrollToTop } from "../../utils/utils";
import RepeatPlanBox from "./components/RepeatPlanBox";
import DayInfo from "./components/ViewPlanComponents/DayInfo";
import TaskForm from "./components/CreatePlanComponents/TaskForm";
import { DotIcon, PolygonIcon, RepeatIcon } from "../../utils/icons";
import CallDetails from "./components/ViewPlanComponents/CallDetails";
import TaskDetails from "./components/ViewPlanComponents/TaskDetails";
import RepeatForm from "./components/CreatePlanComponents/RepeatForm";
import { setIsSidebarCollapsed } from "../../redux/Action/AuthActions";
import EmailDetails from "./components/ViewPlanComponents/EmailDetails";
import MessageDetails from "./components/ViewPlanComponents/MessageDetails";
import PhoneCallForm from "./components/CreatePlanComponents/PhoneCallForm";
import SendEmailForm from "./components/CreatePlanComponents/SendEmailForm";
import SmartPlanForm from "./components/CreatePlanComponents/SmartPlanForm";
import PlanBaseDetails from "./components/ViewPlanComponents/PlanBaseDetails";
import { CreateSmartPlanContext } from "../../context/CreateSmartPlanContext";
import SendMessageForm from "./components/CreatePlanComponents/SendMessageForm";
import SmartPlanViewDetails from "./components/ViewPlanComponents/SmartPlanViewDetails";
import { NotificationManager } from "react-notifications";

const initialData = [
  {
    day: "1",
    day_id: "1",
    position: "1",
    steps: [],
    wait_time: "0",
  },
];

const initialDesignatedData = {
  task_agent: "",
  email_agent: "",
  message_agent: "",
  rainmaker_agent: "",
};

const CreateSmartPlan = () => {
  const { id } = useParams();
  const [config] = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState();
  const [isAddStep, setIsAddStep] = useState("");
  const [activeTask, setActiveTask] = useState();
  const [active, setActive] = useState("details");
  const [userOptions, setUserOptions] = useState([]);
  const [smartPlanInfo, setSmartPlanInfo] = useState();
  const [isRepeatAdd, setIsRepeatAdd] = useState(false);
  const [isStepAdded, setIsStepAdded] = useState(false);
  const [draggingItem, setDraggingItem] = useState(null);
  const [designatedData, setDesignatedData] = useState(initialDesignatedData);

  useEffect(() => {
    dispatch(setIsSidebarCollapsed(true));
  }, []);

  const handleDragStart = (e, item) => {
    setDraggingItem(item);
    e.dataTransfer.setData("text/plain", "");
  };

  const handleDragEnd = () => {
    setDraggingItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpdateDays = (newData) => {
    const dataToSend = newData ? newData : data;
    axios
      .put(`${BASE_URL}/update-day/${id}`, dataToSend, config)
      .then((res) => {
        // fetchSmartPlanDetails();
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleDrop = (e, targetItem) => {
    if (!draggingItem) return;
    setActive("details");
    const currentIndex = data.indexOf(draggingItem);
    const targetIndex = data.indexOf(targetItem);

    if (currentIndex !== -1 && targetIndex !== -1) {
      data.splice(currentIndex, 1);
      data.splice(targetIndex, 0, draggingItem);

      for (let i = 0; i < data?.length; i++) {
        if (i === 0) {
          data[i].day = 1 + Number(data[i]?.wait_time);
        } else {
          const updatedWaitTime = Number(data[i]?.wait_time) === 0 ? Number(data[i]?.wait_time) + 1 : Number(data[i]?.wait_time);
          data[i].day = Number(data[i - 1]?.day) + updatedWaitTime;
          data[i].wait_time = updatedWaitTime;
        }
      }

      const newData = data.map((obj, i) => ({ ...obj, position: i + 1 }));
      setData(newData);
      handleUpdateDays(newData);
    }
  };

  const handleAddDay = (el, currentIndex) => {
    setActive("details");
    const newItemId = Math.max(...data.map((item) => Number(item.day_id))) + 1;
    const waitTime = 1;
    const newItem = {
      day_id: newItemId,
      day: Number(el?.day) + waitTime,
      wait_time: waitTime,
      steps: [],
      position: currentIndex + 1 + 1,
    };

    const newData = [...data]; // Create a copy of the original data
    if (currentIndex === data?.length - 1) {
      newData.splice(currentIndex + 1, 0, newItem); // Insert newItem at currentIndex + 1
      setData(newData); // Update state with the new array
      handleUpdateDays(newData);
    } else {
      for (let i = currentIndex + 1; i < newData.length; i++) {
        if (i === currentIndex + 1) {
          newData[i].day = Number(newData[i - 1].day) + Number(newData[i].wait_time) + waitTime;
        } else {
          newData[i].day = Number(newData[i - 1]?.day) + Number(newData[i].wait_time);
        }
        newData[i].position = Number(newData[i].position) + 1;
      }
      newData.splice(currentIndex + 1, 0, newItem);
      setData(newData);
      handleUpdateDays(newData);
    }
  };

  const handleShowPlanDetails = (e) => {
    if (e.target === e.currentTarget) {
      setActive("details");
      setIsAddStep("");
    }
  };

  const fetchUsers = () => {
    axios
      .get(`${BASE_URL}/get-datalisting?list=users`, config)
      .then((res) => {
        const data = res?.data?.data;
        const options = data?.map((el) => ({ value: el?.id, label: `${el?.first_name} ${el?.last_name}`, role: el?.role_id }));
        setUserOptions(options);
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const fetchDesignatedData = () => {
    axios
      .get(`${BASE_URL}/designated-listing`, config)
      .then((res) => {
        const data = res?.data?.designatedlisting;
        setDesignatedData({
          task_agent: data?.task_agent,
          email_agent: data?.email_agent,
          message_agent: data?.message_agent,
          rainmaker_agent: data?.rainmaker_agent,
        });
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const fetchSmartPlanDetails = () => {
    axios
      .get(`${BASE_URL}/smartplan-getbyid/${id}`, config)
      .then((res) => {
        setSmartPlanInfo(res?.data?.smart_plan);
        setData(res?.data?.smart_plan?.days);
        setIsAddStep("");
        setIsRepeatAdd(res?.data?.smart_plan?.repeat === null ? false : true);
      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
    fetchDesignatedData();
    fetchSmartPlanDetails();
  }, [id]);

  const onSuccess = () => {
    setLoading(true);
    fetchSmartPlanDetails();
  };

  const handleDeleteStep = () => {
    setActive("details");
    axios
      .delete(`${BASE_URL}/deleteStepIn-Day?smart_plan_id=${id}&day_id=${activeTask?.day_id}&step_id=${activeTask?.step_id}`, config)
      .then((res) => {
        setActive("details");
        onSuccess();
      })
      .catch((err) => console.log("err", err));
  };

  useEffect(() => {
    const steps = data.map((el) => el.steps?.length)?.reduce((a, b) => a + b, 0);
    if (steps === 0) {
      setIsStepAdded(true);
    } else {
      setIsStepAdded(false);
    }
  }, [data]);

  return (
    <BaseLayout isPadding={false}>
      <CreateSmartPlanContext.Provider value={{ smartPlanInfo, active, setActive, isAddStep, setIsAddStep, isRepeatAdd, setIsRepeatAdd, data, setData, activeDay, setActiveDay, activeTask, setActiveTask, userOptions, designatedData, handleUpdateDays, fetchSmartPlanDetails, handleDeleteStep, onSuccess }}>
        {loading ? (
          <Loader />
        ) : (
          <div>
            {/* <div className="header light-bg-L" style={{ boxShadow: "0px 4px 20px 0px #0000000D" }}>
              <div className="left-section">
                <p className="head-1 dark-H capitalize">{smartPlanInfo?.name}</p>
              </div>

              <div className="right-section">
                <button
                  className="add-contact-button green-bg-H light-L body-S mr-4"
                  onClick={() => {
                    handleUpdateDays();
                    navigate("/touch-plans");
                  }}
                >
                  Save Task
                </button>

                <img role="button" src={Close} alt="close" onClick={() => navigate("/touch-plans")} />
              </div>
            </div> */}

            <div className="flex w-[100%]">
              <div className="light-bg-L w-[30%] p-6 pt-3">
                <p
                  role="button"
                  className="green-H head-5 underline"
                  onClick={() => {
                    navigate("/touch-plans");
                    dispatch(setIsSidebarCollapsed(false));
                  }}
                >
                  Back to TouchPlans
                </p>
                <div className="mt-6">{active === "phone" ? <PhoneCallForm /> : active === "email" ? <SendEmailForm /> : active === "task" ? <TaskForm /> : active === "message" ? <SendMessageForm /> : active === "smartPlan" ? <SmartPlanForm /> : active === "repeat" ? <RepeatForm /> : active === "dayInfo" ? <DayInfo /> : active === "phone-details" ? <CallDetails /> : active === "message-details" ? <MessageDetails /> : active === "email-details" ? <EmailDetails /> : active === "task-details" ? <TaskDetails /> : active === "smartPlan-details" ? <SmartPlanViewDetails /> : <PlanBaseDetails />}</div>{" "}
              </div>

              <div className="w-[70%] min-h-[91vh] overflow-y-auto p-10" onClick={handleShowPlanDetails} style={{ backgroundColor: "#f4f4f4" }}>
                {data?.length !== 0 ? (
                  <div className="px-6 updates-date-info" style={{ borderLeft: "2px dashed #6F6F6F" }}>
                    {data?.flatMap((el, idx) => (
                      <div
                        key={idx}
                        className={`smartPlan relative ${el === draggingItem ? "dragging cursor-grabbing" : ""}`}
                        draggable="true"
                        onDragStart={(e) => {
                          handleDragStart(e, el);
                        }}
                        onDragEnd={handleDragEnd}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, el)}
                      >
                        <div className="absolute top-[8px] -left-[30px]">
                          <DotIcon />
                        </div>

                        <div className="flex items-center" style={{ marginLeft: "-12px" }}>
                          <PolygonIcon />
                          <p className="date dark-bg-M light-L body-S">Day {el?.day}</p>
                        </div>

                        <SmartPlanBox element={el} idx={idx} />

                        <button onClick={() => handleAddDay(el, idx)} className="body-N green-H flex gap-1 mt-8 tags mx-auto">
                          <PlusIcon size={20} />
                          <p>Add Day</p>
                        </button>
                      </div>
                    ))}

                    {isRepeatAdd ? (
                      <RepeatPlanBox />
                    ) : (
                      <div>
                        {active !== "repeat" && JSON.stringify(data) !== JSON.stringify(initialData) && (
                          <Tooltip isDisabled={isStepAdded === false} label="To enable this action, add a step to the TouchPlan">
                            <button
                              onClick={() => {
                                setActive("repeat");
                                handleScrollToTop();
                              }}
                              disabled={isStepAdded}
                              className={`body-N green-H flex gap-1 mt-4 mx-auto tags ${isStepAdded ? "opacity-50" : ""}`}
                            >
                              <RepeatIcon />
                              <p>Add Repeat</p>
                            </button>
                          </Tooltip>
                        )}
                        <div className="mt-8 relative">
                          <div className="absolute top-2.5 -left-[30px]">
                            <DotIcon />
                          </div>

                          <p className="text-center dark-M  body-S">End of TouchPlan</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-center mt-5">No data available</p>
                )}
              </div>
            </div>
          </div>
        )}
      </CreateSmartPlanContext.Provider>
    </BaseLayout>
  );
};

export default CreateSmartPlan;
