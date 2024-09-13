import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import "./Smartplan.css";
import useAuth from "../../hooks/useAuth";
import Eye from "../../assets/svgs/eye.svg";
import Loader from "../../components/Loader";
import Plus from "../../assets/svgs/Plus.svg";
import { BASE_URL } from "../../utils/Element";
import BaseLayout from "../../layouts/BaseLayout";
import ActionsMenu from "../../components/ActionsMenu";
import swap from "../../assets/svgs/swap-vertical.svg";
import sortAsce from "../../assets/svgs/sort-ascending.svg";
import sortDesc from "../../assets/svgs/sort-descending.svg";
import CreateSmartPlanModal from "./modals/CreateSmartPlanModal";
import { initialSmartPlanFilterData } from "../../utils/initialData";
import ContactPagination from "../../components/Pagination/ContactPagination";
import SmartPlanFilter from "../../components/FilterComponents/SmartPlanFilter";
import DeleteConfirmationModal from "../../components/ConfirmationModals/DeleteConfirmationModal";
import LinkContactInfoModal from "./modals/LinkContactInfoModal";

const Smartplan = () => {
  const [config] = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedId, setSelectedId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [smartPlanData, setSmartPlanData] = useState([]);
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedContacts, setSelectedContact] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filterData, setFilterData] = useState(initialSmartPlanFilterData);
  const isSidebarCollapsed = useSelector((state) => state.isSidebarCollapsed);
  const [paginationData, setPaginationData] = useState({ totalItems: 0, from: 0, to: 0, totalPages: 0 });

  const handleNext = () => {
    if (pageNumber !== paginationData.totalPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const handlePrev = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const buildQueryParams = (filters) => {
    let params = `page=${pageNumber}&search=${search}`;

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
    if (sortDirection && sortBy !== "id") {
      params += `&sort_direction=${sortDirection}`;
    }
    if (sortBy !== "id") {
      params += `&sort_by=${sortBy}`;
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
    fetchSmartPlans(filterData);
  }, [sortBy, sortDirection]);

  useEffect(() => {
    onSuccess();
  }, [search, pageNumber]);

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
    <BaseLayout>
      <div className="contact-header">
        <p className="head-1 dark-H">TouchPlans</p>
        <div className="md:flex block gap-4 items-center">
          <div className="flex gap-4 items-center">
            <SmartPlanFilter
              filterData={filterData}
              onSetFilterData={(value) => {
                setFilterData(value);
              }}
              onCallApiAgain={(filters) => onSuccess(filters)}
            />
          </div>
          <div className="flex gap-4 justify-between items-center">
            <div className="search-box contacts">
              <input
                type="text"
                className="body-S"
                placeholder="Search name, contact count, duration, touches..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                style={{ border: "1px solid #D8D8D8", marginTop: "0px" }}
              />
              <span className="icon-search"></span>
            </div>

            <button className="add-contact-button green-bg-H light-L body-S" onClick={() => setShowModal(true)}>
              <img className="mr-2 sidebar-icons" src={Plus} alt="plus" /> Create
            </button>
          </div>
        </div>
      </div>

      <div className="light-bg-L pb-3 table-container">
        <div className={`${isSidebarCollapsed ? "collapsed-width" : "width"} table-info light-bg-L`}>
          {loading ? (
            <Loader />
          ) : smartPlanData.length === 0 ? (
            <p className="text-center mt-6 light-bg-L p-10">No Data Found</p>
          ) : (
            <table className="contact-table light-bg-L">
              <thead>
                <tr className="uppercase body-N dark-M">
                  <th className="green-H ">
                    <div className="table-header">
                      Name
                      <img
                        role="button"
                        src={sortBy !== "name" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("name");
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
                      Contacts
                      <img
                        role="button"
                        src={sortBy !== "contact" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        alt="icon"
                        onClick={() => {
                          setSortBy("contact");
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
                      Created
                      <img
                        role="button"
                        src={sortBy !== "created_at" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        alt="icon"
                        onClick={() => {
                          setSortBy("created_at");
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
                      Duration
                      <img
                        role="button"
                        src={sortBy !== "duration" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        alt="icon"
                        onClick={() => {
                          setSortBy("duration");
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
                      Total Touches
                      <img
                        role="button"
                        src={sortBy !== "touches_count" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        alt="icon"
                        onClick={() => {
                          setSortBy("touches_count");
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
                    <div className="table-header">More</div>
                  </th>
                </tr>
              </thead>

              <tbody>
                {smartPlanData.flatMap((el, idx) => (
                  <tr key={idx} className="dark-H body-N">
                    <td className="head-5 capitalize" role="button" onClick={() => navigate(`/touch-plan/${el?.id}`)}>
                      {el?.name}
                    </td>
                    <td className="dark-M head-5">
                      <div className="flex items-center pl-8">
                        <p>{el?.contact ? el?.contact?.length : 0}</p>
                        <img
                          role="button"
                          src={Eye}
                          className="ml-2"
                          alt="eye icon"
                          onClick={() => {
                            setShowLinkModal(true);
                            setSelectedId(el?.id);
                            setSelectedContact(el?.contact_details);
                          }}
                        />
                      </div>
                    </td>

                    <td>{moment(el?.created_at).format("MM/DD/YY")}</td>
                    <td className="flex items-center gap-2">
                      <p className="tags green-H body-S capitalize">
                        {el.duration} {el.duration > 1 ? "Days" : "Day"}
                      </p>
                    </td>
                    <td className="pl-20"> {el?.touches_count}</td>
                    <td className="flex gap-3 items-center">
                      <ActionsMenu
                        handleEdit={() => {
                          navigate(`/touch-plan/${el?.id}`);
                          setSelectedId(el?.id);
                        }}
                        handleDelete={() => {
                          setSelectedId(el?.id);
                          setShowDeleteModal(true);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {smartPlanData.length !== 0 && <ContactPagination paginationData={paginationData} handlePrev={handlePrev} handleNext={handleNext} onSuccess={onSuccess} />}

        <CreateSmartPlanModal showModal={showModal} onClose={() => setShowModal(false)} />

        <DeleteConfirmationModal showModal={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleDelete={handleDelete} />

        <LinkContactInfoModal linkContacts={selectedContacts} id={selectedId} showModal={showLinkModal} onClose={() => setShowLinkModal(false)} onSuccess={onSuccess} />
      </div>
    </BaseLayout>
  );
};

export default Smartplan;
