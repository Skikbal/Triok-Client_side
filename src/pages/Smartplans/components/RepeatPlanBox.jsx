import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { BASE_URL } from "../../../utils/Element";
import AddDelayModal from "../modals/AddDelayModal";
import { handleScrollToTop } from "../../../utils/utils";
import { CreateSmartPlanContext } from "../../../context/CreateSmartPlanContext";
import DeleteConfirmationModal from "../../../components/ConfirmationModals/DeleteConfirmationModal";
import { DeleteIcon, DotIcon, EditIcon, PolygonIcon, RepeatIcon, WaitIcon } from "../../../utils/icons";

const RepeatPlanBox = () => {
  const { id } = useParams();
  const [config] = useAuth();
  const [showDelayModal, setShowDelayModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { setActive, onSuccess, setIsAddStep, smartPlanInfo, data } = useContext(CreateSmartPlanContext);

  const lastDay = data?.[data?.length - 1]?.day;
  const repeatDay = Number(smartPlanInfo?.repeat?.delay) + Number(lastDay);

  const handleRepeatSelect = () => {
    setActive("repeat");
    setIsAddStep("");
    handleScrollToTop();
  };

  const handleActiveDay = (e) => {
    if (e.target === e.currentTarget) {
      handleRepeatSelect();
    }
  };

  const handleDelete = () => {
    axios
      .delete(`${BASE_URL}/delete-repeat/${id}`, config)
      .then(() => {
        setShowDeleteModal(false);
        onSuccess();
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  return (
    <div className="mt-8 relative">
      <div className="absolute top-[8px] -left-[30px]">
        <DotIcon />
      </div>
      <div className="flex items-center" style={{ marginLeft: "-12px" }}>
        <PolygonIcon />
        <p className="date dark-bg-M light-L body-S">Day {repeatDay}</p>
      </div>
      <div className="updates-message mt-6" onClick={handleActiveDay}>
        <div className="flex">
          <div className="flex-1 items-center gap-1 p-4 border-r-[1px]">
            <div className="flex justify-between items-center">
              <div
                role="button"
                onClick={() => {
                  setShowDelayModal(true);
                  setIsAddStep("");
                }}
                className="flex items-center gap-1"
              >
                <WaitIcon />
                <p className="green-H head-6">
                  Wait {smartPlanInfo?.repeat?.delay} {smartPlanInfo?.repeat?.delay > 1 ? "days" : "day"}
                </p>
              </div>

              <div className="flex gap-1">
                <div role="button" onClick={handleRepeatSelect}>
                  <EditIcon />
                </div>

                <div
                  role="button"
                  onClick={() => {
                    setShowDeleteModal(true);
                    setIsAddStep("");
                  }}
                >
                  <DeleteIcon />
                </div>
              </div>
            </div>

            <div>
              <div style={{ border: "1px solid #F4F4F4", boxShadow: "0px 0px 20px 0px #007D880D" }} className={`item flex gap-4 items-center justify-between w-[60%] rounded-[8px] p-3 mt-4 `}>
                <div role="button" onClick={handleRepeatSelect} className="green-bg-L rounded-full p-2">
                  <RepeatIcon />
                </div>
                <div
                  role="button"
                  onClick={() => {
                    setActive("repeat");
                    setIsAddStep("");
                    handleScrollToTop();
                  }}
                  className="flex-1"
                >
                  <p className="body-L dark-H capitalize">Repeat Plan</p>
                  <p className="body-N dark-M capitalize">
                    Repeat time {smartPlanInfo?.repeat?.number_of_repeat}, starting on Day {repeatDay}
                  </p>
                </div>
              </div>

              <p className="dark-M body-S mt-4">End of TouchPlan</p>
            </div>
          </div>
        </div>
      </div>

      <AddDelayModal showModal={showDelayModal} onClose={() => setShowDelayModal(false)} />

      <DeleteConfirmationModal showModal={showDeleteModal} handleDelete={handleDelete} onClose={() => setShowDeleteModal(false)} />
    </div>
  );
};

export default RepeatPlanBox;
