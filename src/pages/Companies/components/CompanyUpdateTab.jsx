import React, { useEffect, useRef, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useParams } from "react-router-dom";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { FiPlus as Plus } from "react-icons/fi";
import { BASE_URL } from "../../../utils/Element";
import AddActivityModal from "../Modals/AddActivityModal";
import UpdateTab from "../../../components/DetailTabsData/UpdateTab";
import { useSelectedOptions } from "../../../context/selectedOptionsContext";
import ActivityFilter from "../../../components/FilterComponents/ActivityFilter";
import moment from "moment";

const CompanyUpdateTab = () => {
  const [config] = useAuth();
  const { id } = useParams();
  const containerRef = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [filterData, setFilterData] = useState({ type: "alltime", startDate: "", endDate: "" });
  const { isactivityDataSentSuccessfully, setIsactivityDataSentSuccessfully } = useSelectedOptions();
  const { isDeletedactivity, isEditedactivity, setIsEditedactivity, setIsDeletedactivity } = useSelectedOptions();

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

  const buildQueryParams = () => {
    let params = `id=${id}&list_type=company&date=${filterData?.type}&activity=${selectedActivities}`;
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
          setData((prevItems) => [...prevItems, ...data?.activities]);
          setIsDeletedactivity(false);
          setIsEditedactivity(false);
          setIsactivityDataSentSuccessfully(false);
        }
      })
      .catch((err) => {
        setData([]);
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
  }, [filterData, isactivityDataSentSuccessfully, isDeletedactivity, isEditedactivity, selectedActivities]);

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
        <p className="head-5 green-H flex items-center gap-2" role="button" onClick={() => setShowModal(true)}>
          <Plus /> Add Activity
        </p>
      </div>

      <div ref={containerRef} className="mt-4 md:px-16 overflow-x-hidden h-64">
        <UpdateTab activitydata={data} loading={loading} hasMore={hasMore} />
      </div>

      <AddActivityModal from="company" showModal={showModal} onClose={() => setShowModal(false)} onSuccess={onSuccess} />
    </div>
  );
};

export default CompanyUpdateTab;
