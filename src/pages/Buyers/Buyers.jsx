import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Buyers.css";
import axios from "axios";
import moment from "moment";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";
import { BASE_URL } from "../../utils/Element";
import EditBuyersModal from "./EditBuyersModal";
import BuyerDetailModal from "./BuyerDetailModal";
import BaseLayout from "../../layouts/BaseLayout";
import swap from "../../assets/svgs/swap-vertical.svg";
import ActionsMenu from "../../components/ActionsMenu";
import ImportExport from "../../components/ImportExport";
import sortAsce from "../../assets/svgs/sort-ascending.svg";
import sortDesc from "../../assets/svgs/sort-descending.svg";
import { initialBuyerFilterData } from "../../utils/initialData";
import BuyerFilter from "../../components/FilterComponents/BuyerFilter";
import ContactPagination from "../../components/Pagination/ContactPagination";
import DeleteConfirmationModal from "../../components/ConfirmationModals/DeleteConfirmationModal";

const Buyers = () => {
  const [config] = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [selectedItem, setSelectedItem] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showEditModal, setShowEditModal] = useState(false);
  const [acquisitionsData, setAcquisitionsData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filterData, setFilterData] = useState(initialBuyerFilterData);
  const isSidebarCollapsed = useSelector((state) => state.isSidebarCollapsed);
  const [paginationData, setPaginationData] = useState({ totalItems: 0, from: 0, to: 0, totalPages: 0 });

  const buyerAllIds = acquisitionsData?.map((el) => el.id);

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

  useEffect(() => {
    if (selectedItem.length === buyerAllIds?.length) {
      setIsSelectAll(true);
    } else {
      setIsSelectAll(false);
    }
  }, [selectedItem, buyerAllIds]);

  const buildQueryParams = (filters) => {
    let params = `page=${currentPage}&per_page=${itemPerPage}&search=${search}`;

    const { availability_status, buyer_status, state, tenant_name, min_asking_cap_rate, min_price, max_price, landlord_responsibilities, property_type, min_lease_term_reamaining, lease_date, lease_start_date, lease_end_date, lease_date_category, lease_within_last_day, lease_longer_than_day, last_update, last_update_date, last_update_start_date, last_update_end_date, date_category, within_last_day, longer_than_day } = filters;

    if (availability_status) {
      params += `&availability_status=${encodeURIComponent(availability_status === "Off Market" ? 0 : 1)}`;
    }
    // if (buyer_status) {
    //   params += `&buyer_status=${encodeURIComponent(buyer_status === "Pipeline" ? 0 : buyer_status)}`;
    // }
    if (buyer_status?.length > 0) {
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
      .get(`${BASE_URL}/acquisition-list?${queryParams}`, config)
      .then((res) => {
        const value = res?.data?.data?.acquisitions;
        setAcquisitionsData(value?.data || []);
        setPaginationData({
          totalItems: value?.total ?? 0,
          from: value?.from ?? 0,
          to: value?.to ?? 0,
          totalPages: value?.last_page ?? 0,
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
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAcquisitions(filterData);
  }, [sortDirection, sortBy]);

  useEffect(() => {
    onSuccess();
  }, [currentPage, itemPerPage, search]);

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

  const onSuccess = (filters) => {
    setLoading(true);
    if (filters) {
      fetchAcquisitions(filters);
    } else {
      fetchAcquisitions(filterData);
    }
  };

  return (
    <BaseLayout>
      <div className="contact-header">
        <p className="head-1 dark-H">Buyers</p>
        <div className="md:flex block gap-4 items-center">
          <div className="flex gap-4 items-center">
            <BuyerFilter
              filterData={filterData}
              onSetFilterData={(value) => {
                setFilterData(value);
              }}
              onCallApiAgain={(filters) => onSuccess(filters)}
            />
            <ImportExport from="buyer" onCallApi={onSuccess} />
          </div>

          <div className="flex gap-4 justify-between items-center">
            <div className="search-box contacts">
              <input
                type="text"
                className="body-S"
                placeholder="Search contact, property type, city, state"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                style={{ border: "1px solid #D8D8D8", marginTop: "0px" }}
              />
              <span className="icon-search"></span>
            </div>
          </div>
        </div>
      </div>

      <div className="light-bg-L pb-3 table-container">
        <div className={`${isSidebarCollapsed ? "collapsed-width" : "width"} table-info light-bg-L`}>
          {loading ? (
            <Loader />
          ) : acquisitionsData?.length === 0 ? (
            <p className="body-N text-center mt-6 p-10">No Buyers Available</p>
          ) : (
            <table className="contact-table  light-bg-L">
              <thead>
                <tr className="uppercase body-N dark-M">
                  {/* <th>
                    <label className="container">
                      <input
                        type="checkbox"
                        checked={acquisitionsData?.length === 0 ? false : isSelectAll}
                        onChange={(e) => {
                          setIsSelectAll(e.target.checked);
                          if (e.target.checked) {
                            setSelectedItem(buyerAllIds);
                          } else {
                            setSelectedItem([]);
                          }
                        }}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </th> */}
                  <th className="green-H">
                    <div className="table-header">
                      Buyer Name
                      <img
                        role="button"
                        src={sortBy !== "contact_id" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("contact_id");
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
                      Min.Asking Price
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
                      Max Asking Price
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
                      Min. asking cap rate
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
                      Min.Lease Term Remaining
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
                    <div className="table-header">
                      State
                      <img
                        role="button"
                        src={sortBy !== "state" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("state");
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
                  {/* <th>
                    <div className="table-header">
                      Tags
                      <img
                        role="button"
                        src={sortBy !== "contact_id" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("contact_id");
                          if (sortDirection === "desc") {
                            setSortDirection("asc");
                          } else {
                            setSortDirection("desc");
                          }
                        }}
                        alt="icon"
                      />
                    </div>
                  </th> */}
                  <th>
                    <div className="table-header">Actions</div>
                  </th>
                </tr>
              </thead>

              <tbody>
                {acquisitionsData.flatMap((el, idx) => (
                  <tr key={idx} className="dark-H body-N">
                    {/* <td className="">
                      <label className="container">
                        <input type="checkbox" checked={selectedItem?.includes(el.id)} onChange={() => handleSelectCheck(el.id)} />
                        <span className="checkmark"></span>
                      </label>
                    </td> */}
                    {el?.company_id !== null ? (
                      <td
                        className="head-5 capitalize"
                        role="button"
                        onClick={() => {
                          setShowDetailModal(true);
                          // navigate(`/company/${el?.company_id}`);
                        }}
                      >
                        {el.company?.company_name}
                      </td>
                    ) : (
                      <td
                        className="head-5 capitalize"
                        role="button"
                        onClick={() => {
                          setShowDetailModal(true);
                          // navigate(`/contact/${el?.contact_id}`);
                        }}
                      >
                        {el?.contact?.first_name} {el.contact?.last_name}
                      </td>
                    )}
                    <td className="dark-M capitalize">{el?.property_type?.[0]?.type}</td>
                    <td className="text-center">{el?.min_price ? `$ ${el?.min_price?.toLocaleString()}` : ""} </td>
                    <td className="text-center">{el?.max_price ? `$ ${el?.max_price?.toLocaleString()}` : ""} </td>
                    <td className="text-center">{el?.min_asking_cap_rate ? `${el?.min_asking_cap_rate} %` : ""} </td>
                    <td className="text-center">{el?.min_lease_term_reamaining}</td>
                    <td className="flex flex-wrap gap-1" style={{ maxWidth: "250px" }}>
                      {el?.state?.map((state, i) => (
                        <p key={i}>
                          {state}
                          {el?.state?.length - 1 === i ? "" : ","}
                        </p>
                      ))}
                    </td>
                    {/* <td>
                      <div className="flex gap-2">
                        {el?.contact_tag?.map((tag, i) => (
                          <p key={i} className="tags green-H body-S">
                            {tag?.tag_name}
                          </p>
                        ))}
                      </div>
                    </td> */}
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

        <ContactPagination setSelectedItem={setSelectedItem} selectedItem={selectedItem} paginationData={paginationData} handleNext={handleNext} handlePrev={handlePrev} onSuccess={onSuccess} />
      </div>

      <BuyerDetailModal showModal={showDetailModal} onClose={() => setShowDetailModal(false)} id={selectedId} />

      <EditBuyersModal showModal={showEditModal} onClose={() => setShowEditModal(false)} onCallApi={onSuccess} id={selectedId} />

      <DeleteConfirmationModal showModal={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleDelete={handleDelete} />
    </BaseLayout>
  );
};

export default Buyers;
