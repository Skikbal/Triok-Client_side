import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";
import Plus from "../../assets/svgs/Plus.svg";
import { BASE_URL } from "../../utils/Element";
import AddLeadModal from "../Leads/AddLeadModal";
import BaseLayout from "../../layouts/BaseLayout";
import EditLeadModal from "../Leads/EditLeadModal";
import contact from "../../assets/images/contact.png";
import swap from "../../assets/svgs/swap-vertical.svg";
import ActionsMenu from "../../components/ActionsMenu";
import sortAsce from "../../assets/svgs/sort-ascending.svg";
import sortDesc from "../../assets/svgs/sort-descending.svg";
import ChangeProposalStatusModal from "./modals/ChangeProposalStatusModal";
import ContactPagination from "../../components/Pagination/ContactPagination";
import DeleteConfirmationModal from "../../components/ConfirmationModals/DeleteConfirmationModal";
import LeadsFilter from "../Leads/components/LeadsFilter";
import { initialProposalFilterData } from "../../utils/initialData";

const Proposals = () => {
  const [config] = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [proposalData, setProposalData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const isSidebarCollapsed = useSelector((state) => state.isSidebarCollapsed);
  const [paginationData, setPaginationData] = useState({ totalItems: 0, from: 0, to: 0, totalPages: 0 });
  const [filterData, setFilterData] = useState(initialProposalFilterData);

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

  const buildQueryParams = (isInitialFilter) => {
    let params = `page=${currentPage}&per_page=${itemPerPage}&type=proposal&search=${search}`;

    const filters = isInitialFilter ? initialProposalFilterData : filterData;

    const { bds, broker, status, created_at, created_end_date, created_start_date, contact, lead_type, link_id, property, buyer_id } = filters;

    if (bds) {
      params += `&bds=${encodeURIComponent(bds)}`;
    }
    if (broker) {
      params += `&broker=${encodeURIComponent(broker)}`;
    }
    if (status) {
      params += `&status=${encodeURIComponent(status === "followup" ? 0 : status === "won" ? 1 : 2)}`;
    }
    if (created_at) {
      params += `&created_at=${encodeURIComponent(created_at)}`;
    }
    if (created_start_date) {
      params += `&created_start_date=${encodeURIComponent(created_start_date)}`;
    }
    if (created_end_date) {
      params += `&created_end_date=${encodeURIComponent(created_end_date)}`;
    }
    if (contact.id) {
      params += `&contact=${encodeURIComponent(contact.id)}`;
    }
    if (lead_type) {
      params += `&lead_type=${encodeURIComponent(lead_type === "acquisition" ? 1 : 0)}`;
    }
    if (link_id) {
      params += `&link_id=${encodeURIComponent(link_id)}`;
    }
    if (property.id) {
      params += `&property_id=${encodeURIComponent(property.id)}`;
    }
    if (buyer_id) {
      params += `&buyer_id=${encodeURIComponent(buyer_id)}`;
    }
    if (sortDirection && sortBy !== "id") {
      params += `&sort_direction=${sortDirection}`;
    }
    if (sortBy !== "id") {
      params += `&sort_by=${sortBy}`;
    }

    return params;
  };

  const fetchProposals = (isInitialFilter) => {
    const queryParams = buildQueryParams(isInitialFilter);
    axios
      .get(`${BASE_URL}/list-leads?${queryParams}`, config)
      .then((res) => {
        const value = res?.data?.leadsList;
        setProposalData(value?.data || []);
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
    fetchProposals();
  }, [sortDirection, sortBy]);

  useEffect(() => {
    onSuccess();
  }, [search, currentPage, itemPerPage]);

  const onSuccess = (isInitialFilter) => {
    setLoading(true);
    if (isInitialFilter) {
      fetchProposals(isInitialFilter);
    } else {
      fetchProposals();
    }
  };

  const handleDelete = () => {
    axios
      .delete(`${BASE_URL}/delete-lead/${selectedId}`, config)
      .then((res) => {
        setSelectedId("");
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

  return (
    <BaseLayout>
      <div className="contact-header">
        <p className="head-1 dark-H">Proposals</p>
        <div className="md:flex block gap-6 items-center">
          <div className="flex gap-6 justify-between items-center">
            <LeadsFilter
              filterData={filterData}
              onSetFilterData={(value) => {
                setFilterData(value);
              }}
              from="proposal"
              onCallApiAgain={(isInitialFilter) => onSuccess(isInitialFilter)}
            />
            <div className="search-box contacts">
              <input
                type="text"
                className="body-S"
                placeholder="Search contact name"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                style={{ border: "1px solid #D8D8D8" }}
              />
              <span className="icon-search"></span>
            </div>
            <button onClick={() => setShowAddModal(true)} className="add-contact-button green-bg-H light-L body-S">
              <img className="mr-2" src={Plus} alt="plus" /> Add
            </button>
          </div>
        </div>
      </div>

      <div className="light-bg-L pb-3 table-container">
        <div className={`${isSidebarCollapsed ? "collapsed-width" : "width"} table-info light-bg-L`}>
          {loading ? (
            <Loader />
          ) : proposalData?.length === 0 ? (
            <p className="body-N text-center mt-6 p-10">No Proposal Available</p>
          ) : (
            <table className="contact-table light-bg-L">
              <thead>
                <tr className="uppercase body-N dark-M">
                  <th className="green-H ">
                    <div className="table-header">
                      Bds
                      <img
                        role="button"
                        src={sortBy !== "bds" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("bds");
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
                      Broker
                      <img
                        role="button"
                        src={sortBy !== "broker" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        alt="icon"
                        onClick={() => {
                          setSortBy("broker");
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
                      Proposal Date
                      <img
                        role="button"
                        src={sortBy !== "proposal_date" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        alt="icon"
                        onClick={() => {
                          setSortBy("proposal_date");
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
                      Contact Name
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
                      Lead Type
                      <img
                        role="button"
                        src={sortBy !== "type" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        alt="icon"
                        onClick={() => {
                          setSortBy("type");
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
                      Property /
                      <br />
                      Acquisition Criteria
                      <img
                        role="button"
                        src={sortBy !== "link_id" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        alt="icon"
                        onClick={() => {
                          setSortBy("link_id");
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
                      Won/Lost
                      <img
                        role="button"
                        src={sortBy !== "status" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        alt="icon"
                        onClick={() => {
                          setSortBy("status");
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
                    <div className="table-header">Actions</div>
                  </th>
                </tr>
              </thead>

              <tbody>
                {proposalData.map((el, idx) => (
                  <tr key={idx} className="dark-H body-N">
                    <td
                      className="capitalize"
                      role="button"
                      onClick={() => {
                        navigate(`/user/${el?.bds?.id}`);
                      }}
                    >
                      {el?.bds?.first_name} {el?.bds?.last_name}
                    </td>
                    <td
                      className="capitalize"
                      role="button"
                      onClick={() => {
                        navigate(`/user/${el?.broker?.id}`);
                      }}
                    >
                      {el?.broker?.first_name} {el?.broker?.last_name}
                    </td>
                    <td className="dark-M">{moment(el?.proposal_date).format("MM/DD/YYYY")}</td>
                    <td
                      className="flex items-center head-5 green-H gap-2 capitalize"
                      role="button"
                      onClick={() => {
                        if (el?.contact?.id) {
                          navigate(`/contact/${el?.contact?.id}`);
                        }
                      }}
                    >
                      <img src={contact} alt="contact icon" className="icon-class" /> {el?.contact?.first_name} {el?.contact?.last_name}
                    </td>
                    <td>{el?.lead_type === 0 ? "Disposition" : "Acquisition"}</td>
                    <td
                      role="button"
                      className="head-5 capitalize"
                      onClick={() => {
                        if (el?.lead_type === 0) {
                          navigate(`/property/${el?.link?.id}`);
                        } else {
                          navigate(`/buyer/${el?.link?.id}`);
                        }
                      }}
                    >
                      {el?.lead_type === 0 ? el?.link?.property_name : el?.link?.property_type?.[0]?.type ?? "Link"}
                    </td>
                    <td>
                      <div className="flex items-center gap-3 dark-M">
                        <p>{el.final_status_date !== null ? moment(el.final_status_date).format("MM/DD/YYYY") : "N/A"}</p>
                        <p className={`py-[5px] px-[10px] rounded-full text-center justify-center capitalize body-S ${el.status === 0 ? "orange-D orange-bg-L" : el.status === 1 ? "green-D green-bg-L" : "red-D red-bg-L"}`}>{el.status_name}</p>
                      </div>
                    </td>
                    <td className="flex gap-3 items-center w-full justify-center">
                      <ActionsMenu
                        handleEdit={() => {
                          setShowEditModal(true);
                          setSelectedId(el?.id);
                        }}
                        handleDelete={() => {
                          setSelectedId(el?.id);
                          setShowDeleteModal(true);
                        }}
                        showOtherOption={true}
                        otherOptionTitle={"Update Status"}
                        handleOtherOption={() => {
                          setShowStatusModal(true);
                          setSelectedId(el?.id);
                          setSelectedStatus(el?.status);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <ContactPagination paginationData={paginationData} handleNext={handleNext} handlePrev={handlePrev} onSuccess={onSuccess} />
      </div>

      <AddLeadModal from="proposal" showModal={showAddModal} onClose={() => setShowAddModal(false)} onCallApi={onSuccess} />

      <EditLeadModal
        showModal={showEditModal}
        onClose={() => setShowEditModal(false)}
        id={selectedId}
        onCallApi={() => {
          setSelectedId("");
          onSuccess();
        }}
        from="proposal"
      />

      <ChangeProposalStatusModal
        showModal={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        id={selectedId}
        status={selectedStatus}
        onCallApi={() => {
          setSelectedId("");
          onSuccess();
        }}
      />

      <DeleteConfirmationModal showModal={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleDelete={handleDelete} />
    </BaseLayout>
  );
};

export default Proposals;
