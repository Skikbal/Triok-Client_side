import React, { useEffect, useRef, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useParams } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import Plus from "../../../assets/svgs/Plus.svg";
import { BASE_URL } from "../../../utils/Element";
import { FiPlus as PlusIcon } from "react-icons/fi";
import { activityOptions } from "../../../utils/options";
import { handleDropdownClose } from "../../../utils/utils";
import { IoIosArrowDown as ArrowDown } from "react-icons/io";
import UpdateTab from "../../../components/DetailTabsData/UpdateTab";
import AddActivityModal from "../../Companies/Modals/AddActivityModal";
import { useSelectedOptions } from "../../../context/selectedOptionsContext";
import ActivityFilter from "../../../components/FilterComponents/ActivityFilter";

const today = moment(new Date()).format("YYYY-MM-DD");

const initialFormData = {
  date: today,
  description: "",
  interaction_type: "",
};

const UpdateTabData = () => {
  const { id } = useParams();
  const [config] = useAuth();
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);
  const [error, setError] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [activityData, setActivityData] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [filterData, setFilterData] = useState({ type: "alltime", startDate: "", endDate: "" });
  const { isactivityDataSentSuccessfully, setIsactivityDataSentSuccessfully } = useSelectedOptions();
  const { isDeletedactivity, isEditedactivity, setIsDeletedactivity, setIsEditedactivity } = useSelectedOptions();

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const { scrollTop, scrollHeight, clientHeight } = container;

      if (scrollTop + clientHeight >= scrollHeight - 10) {
        if (loading || !hasMore) return;
        setPageNumber(pageNumber + 1);
        fetchActivityList(pageNumber + 1);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [loading, hasMore]);

  const handleChange = (value, name) => {
    setError({ ...error, [name]: "" });
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    const handleClose = () => {
      setIsOpen(false);
    };
    handleDropdownClose(dropdownRef, handleClose);
  }, []);

  const handleActivitySubmit = () => {
    const dataToSend = {
      description: formData.description,
      contact_id: id,
      interaction_type: formData?.interaction_type,
      date: formData.date,
    };

    axios
      .post(`${BASE_URL}/add-activity`, dataToSend, config)
      .then((res) => {
        setIsactivityDataSentSuccessfully(true);
        setFormData(initialFormData);
        setError();
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        setError(err?.response?.data?.errors);
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const buildQueryParams = () => {
    let params = `id=${id}&list_type=contact&date=${filterData?.type}&activity=${selectedActivities}`;
    if (filterData?.type === "custom") {
      params += `&from_date=${moment(filterData.startDate).format("DD/MM/YYYY")}&to_date=${moment(filterData.endDate).format("DD/MM/YYYY")}`;
    }
    return params;
  };

  const fetchActivityList = (page) => {
    setLoading(true);
    const queryParams = buildQueryParams();
    axios
      .get(`${BASE_URL}/activity-list/?page=${page}&per_page=${itemPerPage}&${queryParams}`, config)
      .then((res) => {
        const data = res?.data?.data;
        if (data?.length === 0) {
          setHasMore(false);
        } else {
          setHasMore(data?.has_more);
          setActivityData((prevItems) => [...prevItems, ...data?.activities]);
          setIsDeletedactivity(false);
          setIsEditedactivity(false);
          setIsactivityDataSentSuccessfully(false);
        }
      })
      .catch((err) => {
        setActivityData([]);
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => setLoading(false));
  };

  const onSuccess = () => {
    fetchActivityList(1);
  };

  useEffect(() => {
    if (filterData?.type !== "custom") {
      onSuccess();
    }
  }, [isactivityDataSentSuccessfully, isDeletedactivity, isEditedactivity, selectedActivities, filterData]);

  return (
    <div>
      <div className="flex justify-between items-start head-5 green-H">
        <ActivityFilter
          filterData={filterData}
          onSuccess={onSuccess}
          onSetFilterData={(value) => {
            setFilterData(value);
          }}
          selectedActivities={selectedActivities}
          onSetSelectedActivities={(value) => setSelectedActivities(value)}
        />

        <p className="head-5 green-H flex items-center gap-1" role="button" onClick={() => setShowModal(true)}>
          <PlusIcon /> Add Activity
        </p>
      </div>

      <div ref={containerRef} className="mt-6 md:px-16 overflow-x-hidden h-64">
        {/* <div className="md:flex justify-between gap-6">
          <div className="flex-1">
            <p className="head-4 dark-H">
              Description <span className="body-S dark-M">(optional)</span>
            </p>
            <textarea
              rows={4}
              className="mt-2 w-full body-N"
              value={formData?.description}
              onChange={(e) => {
                handleChange(e.target.value, "description");
              }}
            />
            {error?.description && <p className="body-S red-D pt-1">{error?.description}</p>}
          </div>

          <div className="mt-5 md:mt-0">
            <p className="head-4 dark-H">
              Interaction Type
              <span className="text-red-600">*</span>
            </p>

            <div ref={dropdownRef} className="custom-dropdown mt-2">
              <div role="button" className="select-header-input capitalize light-bg-L body-N dark-M flex justify-between items-center" onClick={() => setIsOpen(!isOpen)}>
                {formData.interaction_type === "" ? "Select" : formData.interaction_type} <ArrowDown />
              </div>

              {isOpen && (
                <div className="dropdown-list-container light-bg-L dark-M body-N shadow rounded-box w-52">
                  <ul className="dropdown-list">
                    {activityOptions.flatMap((el, i) => (
                      <li
                        key={i}
                        role="button"
                        onClick={() => {
                          handleChange(el.value, "interaction_type");
                          setIsOpen(false);
                        }}
                        className={`${formData.interaction_type === el.value ? "active" : ""}`}
                      >
                        {el.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {error?.interaction_type && <p className="body-S red-D pt-1">{error?.interaction_type}</p>}
            </div>

            <button className="add-contact-button green-bg-H light-L mt-6" onClick={handleActivitySubmit}>
              <img className="mr-2 sidebar-icons" src={Plus} alt="plus" /> Add Activity
            </button>
          </div>

          <div className="mt-5 md:mt-0">
            <p className="head-4 dark-H">
              Date
              <span className="text-red-600">*</span>
            </p>
            <div className="">
              <input
                type="date"
                className="body-N"
                value={formData.date}
                onChange={(e) => {
                  handleChange(e.target.value, "date");
                }}
              />
            </div>
            {error?.date && <p className="body-S red-D pt-1">{error?.date}</p>}
          </div>
        </div> */}

        <UpdateTab activitydata={activityData} loading={loading} hasMore={hasMore} />
      </div>

      <AddActivityModal from="contact" showContact={false} showModal={showModal} onClose={() => setShowModal(false)} onSuccess={onSuccess} />
    </div>
  );
};

export default UpdateTabData;
