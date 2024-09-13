import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";
import Plus from "../../assets/svgs/Plus.svg";
import { BASE_URL } from "../../utils/Element";
import BaseLayout from "../../layouts/BaseLayout";
import { getDiffInDays } from "../../utils/utils";
import AddExclusiveModal from "./AddExclusiveModal";
import contact from "../../assets/images/contact.png";
import EditExclusiveModal from "./EditExclusiveModal";
import ActionsMenu from "../../components/ActionsMenu";
import swap from "../../assets/svgs/swap-vertical.svg";
import sortAsce from "../../assets/svgs/sort-ascending.svg";
import sortDesc from "../../assets/svgs/sort-descending.svg";
import ContactPagination from "../../components/Pagination/ContactPagination";
import DeleteConfirmationModal from "../../components/ConfirmationModals/DeleteConfirmationModal";

const Exclusives = () => {
  const [config] = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [exclusiveData, setExclusiveData] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const isSidebarCollapsed = useSelector((state) => state.isSidebarCollapsed);
  const [paginationData, setPaginationData] = useState({ totalItems: 0, from: 0, to: 0, totalPages: 0 });

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

  useEffect(() => {
    fetchExclusive();
  }, [sortDirection, sortBy]);

  useEffect(() => {
    onSuccess();
  }, [search, currentPage, itemPerPage]);

  const fetchExclusive = () => {
    axios
      .get(`${BASE_URL}/exclusive-listing?page=${currentPage}&per_page=${itemPerPage}&search=${search}&sort_direction=${sortDirection}&sort_by=${sortBy}`, config)
      .then((res) => {
        const value = res?.data?.exclusives;
        setExclusiveData(value?.data || []);
        setPaginationData({
          totalItems: value?.total ?? 0,
          from: value?.from ?? 0,
          to: value?.to ?? 0,
          totalPages: value?.last_page ?? 0,
        });
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => setLoading(false));
  };

  const onSuccess = () => {
    setLoading(true);
    fetchExclusive();
  };

  const handleDelete = () => {
    axios
      .delete(`${BASE_URL}/delete-exclusive/${selectedId}`, config)
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
        <p className="head-1 dark-H">Exclusives</p>
        <div className="md:flex block gap-4 items-center">
          <div className="flex gap-4 justify-between items-center">
            <div className="search-box contacts">
              <input
                type="text"
                className="body-S"
                placeholder="Search name, address, city, State ...."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                style={{ border: "1px solid #D8D8D8", marginTop: "0px" }}
              />
              <span className="icon-search"></span>
            </div>
            <button className="add-contact-button green-bg-H light-L body-S" onClick={() => setShowAddModal(true)}>
              <img className="mr-2" src={Plus} alt="plus" /> Add
            </button>
          </div>
        </div>
      </div>

      <div className="light-bg-L pb-3 table-container">
        <div className={`${isSidebarCollapsed ? "collapsed-width" : "width"} table-info light-bg-L`}>
          {loading ? (
            <Loader />
          ) : exclusiveData?.length === 0 ? (
            <p className="body-N text-center mt-6 p-10">No Data Available</p>
          ) : (
            <table className="contact-table light-bg-L">
              <thead>
                <tr className="uppercase body-N dark-M">
                  <th className="green-H ">
                    <div className="table-header">
                      Property Name
                      <img
                        role="button"
                        src={sortBy !== "property_name" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("property_name");
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
                      Address
                      <img
                        role="button"
                        src={sortBy !== "street_address" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("street_address");
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
                      City
                      <img
                        role="button"
                        src={sortBy !== "city" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("city");
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
                  <th>
                    <div className="table-header">
                      Client
                      <img
                        role="button"
                        src={sortBy !== "client" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("client");
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
                      Deal Type
                      <img
                        role="button"
                        src={sortBy !== "lead_type" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("lead_type");
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
                      Initial List date
                      <img
                        role="button"
                        src={sortBy !== "initial_list_date" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("initial_list_date");
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
                      Days On Market
                      <img
                        role="button"
                        src={sortBy !== "total_days_on_market" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("total_days_on_market");
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
                      Current List
                      <img
                        role="button"
                        src={sortBy !== "current_list_date" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("current_list_date");
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
                      Listing Expiration <br /> Date
                      <img
                        role="button"
                        src={sortBy !== "expiration_date" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("expiration_date");
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
                      Days Until <br /> Listing Expires
                      <img
                        role="button"
                        src={sortBy !== "days_until_listing_expiration" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("days_until_listing_expiration");
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
                      NOI
                      <img
                        role="button"
                        src={sortBy !== "anual_rent" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("anual_rent");
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
                      Asking Cap Rate
                      <img
                        role="button"
                        src={sortBy !== "asking_cap_rate" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("asking_cap_rate");
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
                      Asking Price
                      <img
                        role="button"
                        src={sortBy !== "asking_price" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("asking_price");
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
                      Gross Comission <br />
                      To Company
                      <img
                        role="button"
                        src={sortBy !== "gross_commission_company" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("gross_commission_company");
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
                    <div className="table-header">More</div>
                  </th>
                </tr>
              </thead>

              <tbody>
                {exclusiveData.map((el, idx) => (
                  <tr key={idx} className="dark-H body-N">
                    <td className="head-5 capitalize" role="button" onClick={() => navigate(`/property/${el?.property?.id}`)}>
                      {el?.property?.property_name}
                    </td>
                    <td className="dark-M capitalize">{el?.property?.street_address}</td>
                    <td>{el?.property.city}</td>
                    <td>{el?.property.state}</td>
                    <td
                      className="flex items-center head-5 green-H gap-2 capitalize"
                      role="button"
                      onClick={() => {
                        if (el?.contact_id) {
                          navigate(`/contact/${el?.contact_id}`);
                        } else {
                          navigate(`/company/${el?.company_id}`);
                        }
                      }}
                    >
                      <img src={contact} alt="contact icon" className="icon-class w-4 h-4 " />
                      {el?.contact_id ? `${el?.contact?.first_name} ${el?.contact?.last_name}` : el?.company?.company_name}
                    </td>
                    <td>{el?.deal_type === 0 ? "Disposition" : "Acquisition"}</td>
                    <td>{el?.initial_list_date ? moment(el?.initial_list_date).format("MM/DD/YYYY") : ""}</td>
                    <td className="flex items-center gap-2">
                      <p className="tags green-H body-S">
                        {/* {el?.total_days_on_market} {el?.total_days_on_market > 1 ? "days" : "day"} */}
                        {getDiffInDays(el?.initial_list_date, new Date())}
                      </p>
                    </td>
                    <td> {el?.current_list_date ? moment(el?.current_list_date).format("MM/DD/YYYY") : ""}</td>
                    <td>{el?.expiration_date ? moment(el?.expiration_date).format("MM/DD/YYYY") : ""}</td>
                    <td className="flex items-center">
                      <p className="tags green-H body-S">
                        {/* {el?.days_until_listing_expiration} {el?.days_until_listing_expiration > 1 ? "days" : "day"} */}
                        {getDiffInDays(new Date(), el?.expiration_date)}
                      </p>
                    </td>
                    <td className="text-center">{el?.property?.anual_rent ? `$ ${el?.property?.anual_rent?.toLocaleString()}` : ""}</td>
                    <td className="text-center">{el?.property?.asking_cap_rate ? `${el?.property?.asking_cap_rate?.toLocaleString()} %` : ""}</td>
                    <td className="text-center">{el?.property?.asking_price ? `$ ${el?.property?.asking_price?.toLocaleString()}` : ""}</td>
                    <td className="text-center">{el?.gross_commission_company ? `$ ${el?.gross_commission_company?.toLocaleString()}` : ""}</td>
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

      <AddExclusiveModal showModal={showAddModal} onClose={() => setShowAddModal(false)} onCallApi={onSuccess} />

      <EditExclusiveModal
        showModal={showEditModal}
        onClose={() => setShowEditModal(false)}
        id={selectedId}
        onCallApi={() => {
          setSelectedId("");
          onSuccess();
        }}
      />

      <DeleteConfirmationModal showModal={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleDelete={handleDelete} />
    </BaseLayout>
  );
};

export default Exclusives;
