import React, { useEffect, useRef, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import Loader from "../Loader";
import useAuth from "../../hooks/useAuth";
import { BASE_URL } from "../../utils/Element";
import Edit from "../../assets/svgs/Pencil.svg";
import { FiPlus as Plus } from "react-icons/fi";
import { smartPlanOptions } from "../../utils/options";
import Delete from "../../assets/svgs/Recycle Bin.svg";
import { handleDropdownClose } from "../../utils/utils";
import SmartPlanFilter from "../FilterComponents/SmartPlanFilter";
import { initialSmartPlanFilterData } from "../../utils/initialData";
import DeleteConfirmationModal from "../ConfirmationModals/DeleteConfirmationModal";
import CreateSmartPlanModal from "../../pages/Smartplans/modals/CreateSmartPlanModal";

const SmartPlanTab = ({ from }) => {
  const { id } = useParams();
  const [config] = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedId, setSelectedId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [smartPlanData, setSmartPlanData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filterData, setFilterData] = useState(initialSmartPlanFilterData);

  useEffect(() => {
    const handleClose = () => {
      setIsOpen("");
    };
    handleDropdownClose(dropdownRef, handleClose);
  }, []);

  const buildQueryParams = (filters) => {
    let params = from === "contact" ? `page=${pageNumber}&contact_id=${id}` : from === "company" ? `page=${pageNumber}&company_id=${id}` : `page=${pageNumber}`;

    const { duration, touches, priority, contacts, task_type, repeat_number, link_other_smartplan } = filters;

    if (duration !== "") {
      params += `&duration=${duration}`;
    }
    if (touches !== "") {
      params += `&touches=${touches}`;
    }
    if (task_type !== "") {
      params += `&task_type=${task_type}`;
    }
    if (repeat_number !== "no") {
      params += `&repeat_number=${repeat_number}`;
    }
    if (link_other_smartplan.length > 0) {
      params += `&link_other_smartplan=${link_other_smartplan}`;
    }
    if (priority.length > 0) {
      params += `&priority=${encodeURIComponent(priority)}`;
    }
    if (contacts?.length > 0) {
      params += `&contact_id=${encodeURIComponent(contacts.map((el) => el?.id))}`;
    }

    return params;
  };

  const fetchSmartPlans = (filters) => {
    const queryParams = buildQueryParams(filters);
    axios
      .get(`${BASE_URL}/smartlisting?${queryParams}`, config)
      .then((res) => {
        const value = res?.data?.smartplans;
        setSmartPlanData(value?.data || []);
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    fetchSmartPlans(filterData);
  }, [pageNumber]);

  const onSuccess = (filters) => {
    setLoading(true);
    if (filters) {
      fetchSmartPlans(filters);
    } else {
      fetchSmartPlans(filterData);
    }
  };

  const handleDelete = () => {
    axios
      .delete(`${BASE_URL}/delete-smartplan/${selectedId}`, config)
      .then((res) => {
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
        setSelectedId("");
        setShowDeleteModal(false);
        onSuccess();
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  return (
    <div>
      <div className="flex justify-between items-start head-5 green-H">
        <SmartPlanFilter
          filterData={filterData}
          onSetFilterData={(value) => {
            setFilterData(value);
          }}
          onCallApiAgain={(filters) => onSuccess(filters)}
        />

        <p className="head-5 green-H flex items-center gap-1" role="button" onClick={() => setShowModal(true)}>
          <Plus /> Add to TouchPlan
        </p>
      </div>

      {loading ? (
        <Loader />
      ) : smartPlanData?.length === 0 ? (
        <p className="body-N text-center mt-5">No TouchPlan Available</p>
      ) : (
        <div className="flex flex-wrap gap-4 mt-6">
          {smartPlanData?.flatMap((el, idx) => (
            <div ref={dropdownRef} className="custom-dropdown md:w-[49%]">
              <div key={idx} className="light-bg-L flex items-center justify-between gap-3 smart-plan-card">
                {/* {isOpen === idx ? (
                  <img
                    role="button"
                    src={upArrowBox}
                    alt=""
                    onClick={() => {
                      setIsOpen("");
                    }}
                  />
                ) : (
                  <img
                    role="button"
                    src={downArrowBox}
                    alt=""
                    onClick={() => {
                      setIsOpen(idx);
                    }}
                  />
                )} */}

                <div role="button" onClick={() => navigate(`/touch-plan/${el?.id}`)} className="flex flex-1 justify-between gap-3">
                  <div>
                    <p className="head-3 dark-H capitalize">{el?.name}</p>
                    <p className="body-S dark-M">
                      {el.touches_count} {el.touches_count > 1 ? "touches" : "touch"} | {el.step_count} {el.step_count > 1 ? "steps" : "step"}
                    </p>
                  </div>

                  <div>
                    <p className="body-N dark-H">{moment(el?.created_at).format("MM/DD/YY")}</p>
                    <p className="head-6 dark-M">Date Added</p>
                  </div>

                  <div>
                    <p className="body-N dark-H">{moment(el?.updated_at).format("MM/DD/YY")}</p>
                    <p className="head-6 dark-M">Date Last Executed</p>
                  </div>
                </div>

                <img
                  role="button"
                  onClick={() => {
                    navigate(`/touch-plan/${el?.id}`);
                  }}
                  src={Edit}
                  alt="icon"
                />

                <img
                  role="button"
                  onClick={() => {
                    setSelectedId(el?.id);
                    setShowDeleteModal(true);
                  }}
                  src={Delete}
                  alt=""
                  height={22}
                  width={22}
                />
              </div>

              {isOpen === idx && (
                <ul className="dropdown-list-container light-bg-L dark-M body-N p-2 shadow rounded-box" style={{ width: "100%" }}>
                  {el?.days?.[0]?.steps?.length === 0 ? (
                    <li>No Step Added</li>
                  ) : (
                    el?.days?.[0]?.steps?.flatMap((info, i) => (
                      <li key={i} className="ml-8" style={{ borderLeft: "1px dashed" }}>
                        <div className={`body-L dark-H flex gap-6 ${i !== 0 ? "pt-8" : ""} -ml-5`}>
                          <div role="button" className="green-bg-L rounded-full p-2 h-fit">
                            <img src={smartPlanOptions.find((e) => info?.category === e.value)?.icon} alt="" className="w-[20px]" />
                          </div>
                          <div>
                            <p className="capitalize">{smartPlanOptions.find((e) => info?.category === e.value)?.label}</p>
                            <p className="head-5 dark-M capitalize">{info.title}</p>
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      <DeleteConfirmationModal showModal={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleDelete={handleDelete} />

      <CreateSmartPlanModal id={id} from={from} showModal={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default SmartPlanTab;
