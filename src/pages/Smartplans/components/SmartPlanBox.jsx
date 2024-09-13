import React, { useContext, useState } from "react";
import { FiPlus as PlusIcon } from "react-icons/fi";
import AddDelayModal from "../modals/AddDelayModal";
import { handleScrollToTop } from "../../../utils/utils";
import { smartPlanOptions } from "../../../utils/options";
import SmartPlanStepDropdown from "./SmartPlanStepDropdown";
import { DeleteIcon, DragIcon, EditIcon, WaitIcon } from "../../../utils/icons";
import { CreateSmartPlanContext } from "../../../context/CreateSmartPlanContext";
import DeleteConfirmationModal from "../../../components/ConfirmationModals/DeleteConfirmationModal";

const SmartPlanBox = ({ element, idx }) => {
  const [draggingItem, setDraggingItem] = useState(null);
  const [showDelayModal, setShowDelayModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { setActive, isRepeatAdd, data, setData, setActiveDay, handleUpdateDays, setActiveTask, isAddStep, setIsAddStep } = useContext(CreateSmartPlanContext);

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

  const handleStepDrop = async (e, targetItem) => {
    if (!draggingItem || !data) return; // Ensure draggingItem and data are available

    const updatedData = await data.map((day) => {
      // Find the day that matches the current element's day_id
      if (day.day_id === element?.day_id) {
        const steps = [...day.steps]; // Create a copy of steps array
        const currentIndex = steps.indexOf(draggingItem);
        const targetIndex = steps.indexOf(targetItem);

        if (currentIndex !== -1 && targetIndex !== -1) {
          // Rearrange steps array
          const [draggedStep] = steps.splice(currentIndex, 1);
          steps.splice(targetIndex, 0, draggedStep);

          // Update step_number for each step
          const newStepData = steps.map((step, i) => ({ ...step, step_number: i + 1 }));

          // Return updated day object
          return { ...day, steps: newStepData };
        }
      }
      return day; // Return unchanged day object if not the one being updated
    });

    if (updatedData) {
      setData([...updatedData]); // Update state with the modified data
      handleUpdateDays([...updatedData]);
    }
  };

  const handleDeleteDay = () => {
    const deleteItemIdx = idx;
    if (deleteItemIdx === data.length - 1) {
      const filerData = data.filter((el) => Number(el.day_id) !== Number(element?.day_id));
      setData(filerData);
      handleUpdateDays(filerData);
    } else {
      for (let i = deleteItemIdx + 1; i < data.length; i++) {
        if (deleteItemIdx === 0) {
          if (i === 1) {
            data[i].day = Number(data[i].wait_time) + 1;
          } else {
            data[i].day = Number(data[i].wait_time) + Number(data[i - 1].day);
          }
        } else if (i === deleteItemIdx + 1) {
          data[i].day = Number(data[deleteItemIdx - 1].day) + Number(data[i].wait_time);
        } else {
          data[i].day = Number(data[i - 1].day) + Number(data[i].wait_time);
        }
        data[i].position = Number(data[i].position) - 1;
      }
      const filerData = data.filter((el) => Number(el.day_id) !== Number(element?.day_id));
      setData(filerData);
      handleUpdateDays(filerData);
    }
    setActive("details");
    setShowDeleteModal(false);
  };

  const handleEditDay = () => {
    setActive("dayInfo");
    setActiveDay(element);
    setIsAddStep("");
    handleScrollToTop();
  };

  const handleActiveDay = (e) => {
    if (e.target === e.currentTarget) {
      handleEditDay();
    }
  };

  const handleSelectStep = (el) => {
    setActive(`${el.category}-details`);
    setActiveTask(el);
    setIsAddStep("");
    setActiveDay(element);
    handleScrollToTop();
  };

  return (
    <div id="day-div" className="updates-message mt-6" onClick={handleActiveDay}>
      <div className="flex">
        <div className="flex-1 items-center gap-1 p-4 border-r-[1px]">
          <div className="flex justify-between items-center">
            <div
              role="button"
              onClick={() => {
                setShowDelayModal(true);
                setActiveDay(element);
                setIsAddStep("");
              }}
              className="flex items-center gap-1"
            >
              <WaitIcon />
              <p className="green-H head-6">
                Wait {element?.wait_time} {element?.wait_time > 1 ? "days" : "day"}
              </p>
            </div>

            <div className="flex gap-1">
              <div role="button" onClick={handleEditDay}>
                <EditIcon />
              </div>

              {idx !== 0 && (
                <div
                  role="button"
                  onClick={() => {
                    setShowDeleteModal(true);
                    setIsAddStep("");
                  }}
                >
                  <DeleteIcon />
                </div>
              )}
            </div>
          </div>

          {isRepeatAdd ? null : (
            <p className="head-4 dark-H mt-4">
              Choose Step
              {element?.day === 1 && <span className="body-S dark-M ml-1">Steps on Day 1 will occur immediately after a contact is added to the TouchPlan.</span>}
            </p>
          )}

          {element?.steps?.length === 0 ? (
            <SmartPlanStepDropdown element={element} />
          ) : (
            <div>
              {element?.steps
                ?.sort((a, b) => a?.step_number - b?.step_number)
                ?.flatMap((el, idx) => (
                  <div
                    key={idx}
                    style={{ border: "1px solid #F4F4F4", boxShadow: "0px 0px 20px 0px #007D880D" }}
                    className={`item flex gap-4 items-center justify-between w-[60%] rounded-[8px] p-3 mt-4 ${el === draggingItem ? "dragging cursor-grabbing" : ""}`}
                    draggable="true"
                    onDragStart={(e) => {
                      handleDragStart(e, el);
                    }}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleStepDrop(e, el)}
                  >
                    <div
                      role="button"
                      onClick={() => {
                        handleSelectStep(el.category);
                      }}
                      className="green-bg-L rounded-full p-2"
                    >
                      <img src={smartPlanOptions.find((e) => el?.category === e.value)?.icon} alt="" className="w-[20px]" />
                    </div>
                    <div
                      role="button"
                      onClick={() => {
                        handleSelectStep(el);
                      }}
                      className="flex-1"
                    >
                      <p className="body-L dark-H capitalize">{smartPlanOptions.find((e) => el?.category === e.value)?.label} </p>
                      <p className="body-N dark-M capitalize">{el?.category === "smartPlan" ? el?.add_name?.name : el.title}</p>
                    </div>
                    <div>
                      <p className="body-S dark-M">Step {el?.step_number}</p>
                      <div className="cursor-move">
                        <DragIcon size={27} />
                      </div>
                    </div>
                  </div>
                ))}

              {isAddStep === element?.day_id?.toString() ? (
                <SmartPlanStepDropdown element={element} />
              ) : (
                <button
                  onClick={() => {
                    setIsAddStep(element?.day_id?.toString());
                  }}
                  className="body-N green-H flex gap-1 mt-4"
                >
                  <PlusIcon size={20} />
                  <p>Add Step</p>
                </button>
              )}
            </div>
          )}
        </div>

        <div className="px-6 cursor-move flex items-center">
          <DragIcon />
        </div>
      </div>

      <AddDelayModal showModal={showDelayModal} onClose={() => setShowDelayModal(false)} />

      <DeleteConfirmationModal showModal={showDeleteModal} handleDelete={handleDeleteDay} onClose={() => setShowDeleteModal(false)} />
    </div>
  );
};

export default SmartPlanBox;
