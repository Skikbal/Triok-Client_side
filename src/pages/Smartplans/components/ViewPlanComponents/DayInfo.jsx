import React, { useState, useContext } from "react";
import AddDelayModal from "../../modals/AddDelayModal";
import { smartPlanOptions } from "../../../../utils/options";
import AddPositionModal from "../../modals/AddPositionModal";
import { DeleteIcon, EditIcon } from "../../../../utils/icons";
import { CreateSmartPlanContext } from "../../../../context/CreateSmartPlanContext";

const DayInfo = () => {
  const [showDelayModal, setShowDelayModal] = useState(false);
  const [showPositionModal, setShowPositionModal] = useState(false);
  const { setActive, activeDay, data } = useContext(CreateSmartPlanContext);

  const updatedActiveDay = data?.find((el) => el?.day_id === activeDay?.day_id);

  const dayIndex = data?.findIndex((el) => el?.day_id === activeDay?.day_id);

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="head-2 dark-H">Day {activeDay?.day}</p>
        {/* <div role="button">
          <DeleteIcon />
        </div> */}
      </div>

      <hr className="my-6" />

      <div>
        <div className="flex justify-between items-center">
          <div>
            <p className="head-6 dark-M">Delay</p>
            <p className="body-N dark-H">
              Wait {updatedActiveDay?.wait_time} {updatedActiveDay?.wait_time > 1 ? "Days" : "Day"}
            </p>
          </div>
          <div role="button" onClick={() => setShowDelayModal(true)} className="green-H body-S flex gap-1">
            <EditIcon size="15" color="#2D5B30" />
            Edit
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <div>
            <p className="head-6 dark-M">Position</p>
            <p className="body-N dark-H">{updatedActiveDay?.position}</p>
          </div>
          <div role="button" onClick={() => setShowPositionModal(true)} className="green-H body-S flex gap-1">
            <EditIcon size="15" color="#2D5B30" />
            Edit
          </div>
        </div>
      </div>

      <hr className="mt-6" />

      <div className="mt-6">
        <p className="head-4">Steps</p>
        {activeDay?.steps?.length === 0 ? (
          <p className="text-center mt-4 body-N">Steps have not been added to this day.</p>
        ) : (
          activeDay?.steps?.flatMap((el, i) => (
            <div key={i} className="flex justify-between items-center mt-6">
              <div className="flex items-center gap-3">
                <div className="green-bg-L rounded-full p-2">
                  <img src={smartPlanOptions.find((e) => el?.category === e.value)?.icon} alt="" className="w-[20px]" />
                </div>
                <div>
                  <p className="head-6 dark-M">Step {i + 1}</p>
                  <p className="body-L dark-H capitalize">{smartPlanOptions.find((e) => el?.category === e.value)?.label} </p>
                  {/* <p className="body-N dark-M capitalize">{el.title}</p> */}
                </div>
              </div>
              <button onClick={() => setActive(`${el.category}-details`)} className="body-S green-H">
                View Details
              </button>
            </div>
          ))
        )}
      </div>

      <AddDelayModal showModal={showDelayModal} onClose={() => setShowDelayModal(false)} />

      <AddPositionModal showModal={showPositionModal} onClose={() => setShowPositionModal(false)} />
    </div>
  );
};

export default DayInfo;
