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
import BaseLayout from "../../layouts/BaseLayout";
import contact from "../../assets/images/contact.png";
import swap from "../../assets/svgs/swap-vertical.svg";
import ActionsMenu from "../../components/ActionsMenu";
import AddUnderContractModal from "./AddUnderContractModal";
import sortAsce from "../../assets/svgs/sort-ascending.svg";
import sortDesc from "../../assets/svgs/sort-descending.svg";
import EditUnderContractData from "./EditUnderContractModal";
import ContactPagination from "../../components/Pagination/ContactPagination";
import ConfirmationModal from "../../components/ConfirmationModals/ConfirmationModal";
import DeleteConfirmationModal from "../../components/ConfirmationModals/DeleteConfirmationModal";

const UnderContract = () => {
  const [config] = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const isSidebarCollapsed = useSelector((state) => state.isSidebarCollapsed);
  const [paginationData, setPaginationData] = useState({ totalItems: 0, from: 0, to: 0, totalPages: 0 });
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

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

  const fetchData = () => {
    axios
      .get(`${BASE_URL}/contract-listing?page=${currentPage}&per_page=${itemPerPage}&search=${search}&sort_direction=${sortDirection}&sort_by=${sortBy}`, config)
      .then((res) => {
        const value = res?.data?.contract;
        setListData(value?.data || []);
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

  useEffect(() => {
    fetchData();
  }, [sortDirection, sortBy]);

  useEffect(() => {
    onSuccess();
  }, [search, currentPage, itemPerPage]);

  const onSuccess = () => {
    setLoading(true);
    fetchData();
  };

  const handleDelete = () => {
    axios
      .delete(`${BASE_URL}/delete-contract/${selectedId}`, config)
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

  const handleConfirm = () => {
    axios
      .post(`${BASE_URL}/mark-contract/${selectedId}`, { mark_contract: true }, config)
      .then((res) => {
        setSelectedId("");
        onSuccess();
        setShowConfirmModal(false);
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
        <p className="head-1 dark-H">Under Contract</p>
        <div className="md:flex block gap-6 items-center">
          <div className="flex gap-6 justify-between items-center">
            <div className="search-box contacts">
              <input
                type="text"
                className="body-N"
                placeholder="Search name, address, city, State ...."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                style={{ border: "1px solid #D8D8D8" }}
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
          ) : listData?.length === 0 ? (
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
                      Contract Date
                      <img
                        role="button"
                        src={sortBy !== "created_at" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("created_at");
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
                      Noi
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
                      Contract cap rate
                      <img
                        role="button"
                        src={sortBy !== "contract_cap_rate" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("contract_cap_rate");
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
                      Contract Price
                      <img
                        role="button"
                        src={sortBy !== "contract_price" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("contract_price");
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
                      % Of Asking Price
                      <img
                        role="button"
                        src={sortBy !== "percent_of_asking_price" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("percent_of_asking_price");
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
                      Gross Commission <br /> To Company
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
                    <div className="table-header">
                      Gross Commission <br /> To Agent
                      <img
                        role="button"
                        src={sortBy !== "gross_commission_agent" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("gross_commission_agent");
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
                      Gross Comission <br /> To Tri-Oak
                      <img
                        role="button"
                        src={sortBy !== "gross_commission_trioak" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("gross_commission_trioak");
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
                {listData?.map((el, idx) => (
                  <tr key={idx} className="dark-H body-N">
                    <td className="head-5 capitalize" role="button" onClick={() => navigate(`/property/${el?.offer?.lead?.link?.id}`)}>
                      {el?.offer?.lead?.link?.property_name}
                    </td>
                    <td className="dark-M capitalize">{el?.offer?.lead?.link?.street_address}</td>
                    <td>{el?.offer?.lead?.link?.city}</td>
                    <td>{el?.offer?.lead?.link?.state}</td>
                    <td
                      className="flex items-center head-5 green-H gap-2 capitalize"
                      role="button"
                      onClick={() => {
                        navigate(`/contact/${el?.offer?.lead?.link?.contact?.id}`);
                      }}
                    >
                      <img src={contact} alt="contact icon" className="icon-class w-4 h-4 " /> {el?.offer?.lead?.link?.contact?.first_name} {el?.offer?.lead?.link?.contact?.last_name}
                    </td>
                    <td>{el?.offer?.lead?.lead_type === 0 ? "Disposition" : "Acquisition"}</td>
                    <td>{moment(el?.created_at).format("MM/DD/YY")}</td>
                    <td className="text-center">{el?.offer?.lead?.link?.anual_rent ? `$${el?.offer?.lead?.link?.anual_rent?.toLocaleString()}` : ""}</td>
                    <td className="text-center">{el?.offer?.lead?.link?.asking_cap_rate ? `${el?.offer?.lead?.link?.asking_cap_rate?.toLocaleString()}%` : ""}</td>
                    <td className="text-center">{el?.offer?.lead?.link?.asking_price ? `$${el?.offer?.lead?.link?.asking_price?.toLocaleString()}` : ""}</td>
                    <td className="text-center">{el?.contract_cap_rate ? `${el?.contract_cap_rate?.toLocaleString()}%` : ""}</td>
                    <td className="text-center">{el?.contract_price ? `$${el?.contract_price?.toLocaleString()}` : ""}</td>
                    <td className="text-center">{el?.percent_of_asking_price ? `${el?.percent_of_asking_price?.toLocaleString()}%` : ""}</td>
                    <td className="text-center">{el?.gross_commission_company ? `$${el?.gross_commission_company?.toLocaleString()}` : ""}</td>
                    <td className="text-center">{el?.gross_commission_agent ? `$${el?.gross_commission_agent?.toLocaleString()}` : ""}</td>
                    <td className="text-center">{el?.gross_commission_trioak ? `$${el?.gross_commission_trioak?.toLocaleString()}` : ""}</td>
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
                        otherOptionTitle={"Close Contract"}
                        handleOtherOption={() => {
                          setShowConfirmModal(true);
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

        <ContactPagination paginationData={paginationData} handleNext={handleNext} handlePrev={handlePrev} onSuccess={onSuccess} />
      </div>

      <AddUnderContractModal showModal={showAddModal} onClose={() => setShowAddModal(false)} onCallApi={onSuccess} />

      <EditUnderContractData
        showModal={showEditModal}
        onClose={() => setShowEditModal(false)}
        id={selectedId}
        onCallApi={() => {
          setSelectedId("");
          onSuccess();
        }}
      />

      <ConfirmationModal showModal={showConfirmModal} onClose={() => setShowConfirmModal(false)} handleConfirm={handleConfirm} />

      <DeleteConfirmationModal showModal={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleDelete={handleDelete} />
    </BaseLayout>
  );
};

export default UnderContract;
