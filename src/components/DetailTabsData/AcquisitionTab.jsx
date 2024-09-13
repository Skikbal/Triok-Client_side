import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import moment from "moment";
import axios from "axios";
import Loader from "../Loader";
import { useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth";
import { BASE_URL } from "../../utils/Element";
import { FiPlus as Plus } from "react-icons/fi";
import swap from "../../assets/svgs/swap-vertical.svg";
import BuyerFilter from "../FilterComponents/BuyerFilter";
import sortAsce from "../../assets/svgs/sort-ascending.svg";
import sortDesc from "../../assets/svgs/sort-descending.svg";
import AddAcquisitionModal from "./Modals/AddAcquisitionModal";
import ContactPagination from "../Pagination/ContactPagination";
import { initialBuyerFilterData } from "../../utils/initialData";
import ActionsMenu from "../ActionsMenu";
import BuyerDetailModal from "../../pages/Buyers/BuyerDetailModal";
import EditBuyersModal from "../../pages/Buyers/EditBuyersModal";
import DeleteConfirmationModal from "../ConfirmationModals/DeleteConfirmationModal";

const AcquisitionTab = ({ from }) => {
  const { id } = useParams();
  const [config] = useAuth();
  const navigate = useNavigate();
  const isSidebarCollapsed = useSelector((state) => state.isSidebarCollapsed);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [selectedId, setSelectedId] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [acquisitionsData, setAcquisitionsData] = useState([]);
  const [filterData, setFilterData] = useState(initialBuyerFilterData);
  const [paginationData, setPaginationData] = useState({ totalItems: 0, from: 0, to: 0, totalPages: 0 });

  const buildQueryParams = (filters) => {
    let params = `page=${currentPage}&per_page=${itemPerPage}&list_type=${from}&id=${id}`;

    const { availability_status, buyer_status, state, tenant_name, min_asking_cap_rate, min_price, max_price, landlord_responsibilities, property_type, min_lease_term_reamaining, lease_date, lease_start_date, lease_end_date, lease_date_category, lease_within_last_day, lease_longer_than_day, last_update, last_update_date, last_update_start_date, last_update_end_date, date_category, within_last_day, longer_than_day } = filters;

    if (availability_status) {
      params += `&availability_status=${encodeURIComponent(availability_status === "Off Market" ? 0 : 1)}`;
    }
    // if (buyer_status) {
    //   params += `&buyer_status=${encodeURIComponent(buyer_status === "Pipeline" ? 0 : buyer_status)}`;
    // }
    if (buyer_status) {
      params += `&buyer_status=${encodeURIComponent(buyer_status)}`;
    }
    if (state?.length > 0) {
      params += `&state=${encodeURIComponent(state)}`;
    }
    if (tenant_name) {
      params += `&tenant_name=${encodeURIComponent(tenant_name)}`;
    }
    if (min_asking_cap_rate) {
      params += `&min_asking_cap_rate=${encodeURIComponent(min_asking_cap_rate)}`;
    }
    if (min_price) {
      params += `&min_price=${encodeURIComponent(min_price)}`;
    }
    if (max_price) {
      params += `&max_price=${encodeURIComponent(max_price)}`;
    }
    if ((min_lease_term_reamaining && lease_date) || (min_lease_term_reamaining && lease_start_date && lease_end_date)) {
      params += `&min_lease_term_reamaining=${encodeURIComponent(min_lease_term_reamaining)}`;
    }
    if (lease_date) {
      params += `&lease_date=${encodeURIComponent(lease_date)}`;
    }
    if (lease_start_date) {
      params += `&lease_start_date=${encodeURIComponent(lease_start_date)}`;
    }
    if (lease_end_date) {
      params += `&lease_end_date=${encodeURIComponent(lease_end_date)}`;
    }
    if (lease_date_category) {
      params += `&lease_date_category=${encodeURIComponent(lease_date_category)}`;
    }
    if (lease_within_last_day) {
      params += `&lease_within_last_day=${encodeURIComponent(lease_within_last_day)}`;
    }
    if (lease_longer_than_day) {
      params += `&lease_longer_than_day=${encodeURIComponent(lease_longer_than_day)}`;
    }
    if ((last_update && last_update_date) || (last_update && last_update_start_date && last_update_end_date)) {
      params += `&last_update=${encodeURIComponent(last_update)}`;
    }
    if (last_update_date) {
      params += `&last_update_date=${encodeURIComponent(last_update_date)}`;
    }
    if (last_update_start_date) {
      params += `&last_update_start_date=${encodeURIComponent(last_update_start_date)}`;
    }
    if (last_update_end_date) {
      params += `&last_update_end_date=${encodeURIComponent(last_update_end_date)}`;
    }
    if (date_category) {
      params += `&date_category=${encodeURIComponent(date_category)}`;
    }
    if (within_last_day) {
      params += `&within_last_day=${encodeURIComponent(within_last_day)}`;
    }
    if (longer_than_day) {
      params += `&longer_than_day=${encodeURIComponent(longer_than_day)}`;
    }
    if (landlord_responsibilities.length > 0) {
      params += `&landlord_responsibilities=${encodeURIComponent(landlord_responsibilities.join(","))}`;
    }
    if (property_type.length > 0) {
      params += `&property_type=${encodeURIComponent(property_type.join(","))}`;
    }
    if (sortDirection && sortBy !== "id") {
      params += `&sort_direction=${sortDirection}`;
    }
    if (sortBy !== "id") {
      params += `&sort_by=${sortBy}`;
    }

    return params;
  };

  const fetchAcquisitions = (filters) => {
    const queryParams = buildQueryParams(filters);

    axios
      .get(`${BASE_URL}/acquisition-list/?${queryParams}`, config)
      .then((res) => {
        const value = res?.data?.data?.acquisitions;
        setAcquisitionsData(value?.data || []);
        setPaginationData({
          totalItems: value?.total,
          from: value?.from,
          to: value?.to,
          totalPages: value?.last_page,
        });
        // if (res?.data?.message) {
        //   NotificationManager.success(res?.data?.message);
        // }
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAcquisitions(filterData);
  }, [sortDirection, sortBy]);

  useEffect(() => {
    onSuccess();
  }, [currentPage, itemPerPage, id, from]);

  const onSuccess = (filters) => {
    setLoading(true);
    if (filters) {
      fetchAcquisitions(filters);
    } else {
      fetchAcquisitions(filterData);
    }
  };

  const handleDelete = () => {
    axios
      .delete(`${BASE_URL}/delete-acquisition/${selectedId}`, config)
      .then((res) => {
        onSuccess();
        setSelectedId("");
        setShowDeleteModal(false);
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

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

  return (
    <div>
      <div className="flex justify-between items-start head-5 green-H">
        <BuyerFilter
          filterData={filterData}
          onSetFilterData={(value) => {
            setFilterData(value);
          }}
          onCallApiAgain={(filters) => onSuccess(filters)}
        />

        <p className="head-5 green-H flex items-center gap-1" role="button" onClick={() => setShowModal(true)}>
          <Plus /> Add Acquisition Criteria
        </p>
      </div>

      <div className="light-bg-L pb-3 table-container">
        <div className={`${isSidebarCollapsed ? "tab-collapsed-width" : "tab-width"} table-info light-bg-L`}>
          {loading ? (
            <Loader />
          ) : acquisitionsData?.length === 0 ? (
            <p className="body-N text-center">No Acquisition Criteria Available</p>
          ) : (
            <table className="contact-table light-bg-L">
              <thead>
                <tr className="uppercase body-N dark-M">
                  <th className="green-H">
                    <div className="table-header">
                      Property Type
                      <img
                        role="button"
                        src={sortBy !== "property_type" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        alt="icon"
                        onClick={() => {
                          setSortBy("property_type");
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
                      MIN. ASKING PRICE
                      <img
                        role="button"
                        src={sortBy !== "min_price" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("min_price");
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
                      Max ASKING PRICE
                      <img
                        role="button"
                        src={sortBy !== "max_price" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("max_price");
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
                      MIN. ASKING Cap Rate
                      <img
                        role="button"
                        src={sortBy !== "min_asking_cap_rate" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("min_asking_cap_rate");
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
                      MIN. Lease term remaining
                      <img
                        role="button"
                        src={sortBy !== "min_lease_term_reamaining" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("min_lease_term_reamaining");
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
                    <div className="table-header">Actions</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {acquisitionsData.flatMap((el, idx) => (
                  <tr
                    key={idx}
                    className="body-N dark-H"
                    // role="button"
                    // onClick={() => {
                    //   navigate(`/buyer/${el?.id}`);
                    // }}
                  >
                    <td className="flex flex-wrap items-center gap-2" style={{ maxWidth: "250px" }}>
                      {el?.property_type?.map((tag, i) => (
                        <p key={i} className="tags green-H body-S">
                          {tag?.type}
                        </p>
                      ))}
                    </td>
                    <td className="text-center">{el?.min_price ? `$ ${el?.min_price?.toLocaleString()}` : ""}</td>
                    <td className="text-center">{el?.max_price ? `$ ${el?.max_price?.toLocaleString()}` : ""}</td>
                    <td className="text-center">{el?.min_asking_cap_rate ? `${el?.min_asking_cap_rate} %` : ""}</td>
                    <td className="text-center">
                      {el?.min_lease_term_reamaining}
                      {/* {el?.min_lease_term_reamaining !== null && <span className="tags green-H body-S">{moment(el?.min_lease_term_reamaining).fromNow()}</span>} */}
                    </td>
                    <td>
                      <ActionsMenu
                        handleEdit={() => {
                          setShowEditModal(true);
                          setSelectedId(el?.id);
                        }}
                        handleDelete={() => {
                          setShowDeleteModal(true);
                          setSelectedId(el?.id);
                        }}
                        showOtherOption={true}
                        otherOptionTitle={"View"}
                        handleOtherOption={() => {
                          setShowDetailModal(true);
                          setSelectedId(el?.id);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {acquisitionsData?.length !== 0 && <ContactPagination paginationData={paginationData} handleNext={handleNext} handlePrev={handlePrev} onSuccess={onSuccess} />}
      </div>

      <AddAcquisitionModal showModal={showModal} onClose={() => setShowModal(false)} from={from} fetchAcquisitions={onSuccess} />

      <BuyerDetailModal showModal={showDetailModal} onClose={() => setShowDetailModal(false)} id={selectedId} />

      <EditBuyersModal showModal={showEditModal} onClose={() => setShowEditModal(false)} onCallApi={onSuccess} id={selectedId} />

      <DeleteConfirmationModal showModal={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleDelete={handleDelete} />
    </div>
  );
};

export default AcquisitionTab;
