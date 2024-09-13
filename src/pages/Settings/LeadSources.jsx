import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";
import Plus from "../../assets/svgs/Plus.svg";
import { BASE_URL } from "../../utils/Element";
import BaseLayout from "../../layouts/BaseLayout";
import swap from "../../assets/svgs/swap-vertical.svg";
import sortAsce from "../../assets/svgs/sort-ascending.svg";
import sortDesc from "../../assets/svgs/sort-descending.svg";
import ContactPagination from "../../components/Pagination/ContactPagination";
import AddLeadSourceModal from "./modals/LeadSourceModals/AddLeadSourceModal";
import EditLeadSourceModal from "./modals/LeadSourceModals/EditLeadSourceModal";
import DeleteConfirmationModal from "../../components/ConfirmationModals/DeleteConfirmationModal";
import { NotificationManager } from "react-notifications";
import ActionsMenu from "../../components/ActionsMenu";

const LeadSources = () => {
  const isSidebarCollapsed = useSelector((state) => state.isSidebarCollapsed);
  const [config] = useAuth();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [leadsData, setLeadsData] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [showmodal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [selectedItem, setSelectedItem] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paginationData, setPaginationData] = useState({ totalItems: 0, from: 0, to: 0, totalPages: 0 });
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  const listIds = leadsData?.map((el) => el.id);

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
      .get(`${BASE_URL}/lead-source-list?page=${currentPage}&per_page=${itemPerPage}&search=${search}&sort_direction=${sortDirection}&sort_by=${sortBy}`, config)
      .then((res) => {
        const value = res?.data?.data?.leadsource_list;
        setLeadsData(value?.data || []);
        setPaginationData({
          totalItems: value?.total ?? 0,
          from: value?.from ?? 0,
          to: value?.to ?? 0,
          totalPages: value?.last_page ?? 0,
        });
        setSelectedItem([]);
        setIsSelectAll(false);
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
        setSelectedId("");
      });
  };

  useEffect(() => {
    fetchData();
  }, [sortBy, sortDirection]);

  useEffect(() => {
    onSuccess();
  }, [currentPage, itemPerPage, search]);

  const onSuccess = () => {
    setLoading(true);
    fetchData();
  };

  const handleDelete = () => {
    axios
      .delete(`${BASE_URL}/delete-lead-source/${selectedId}`, config)
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
        <p className="head-1 dark-H">
          Lead Source
          {selectedItem?.length > 0 && (
            <span className="body-L ml-2">
              ({selectedItem?.length} <span className="dark-H">{selectedItem?.length === 1 ? "item" : "items"} selected</span>)
            </span>
          )}
        </p>
        <div className="md:flex block gap-6 items-center">
          <div className="flex gap-6 justify-between items-center">
            <div className="search-box contacts">
              <input
                type="text"
                className="body-S"
                placeholder="search name and category ..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                style={{ border: "1px solid #D8D8D8" }}
              />
            </div>
            <button
              className="add-contact-button green-bg-H light-L body-S"
              onClick={() => {
                setShowModal(true);
              }}
            >
              <img className="mr-2 sidebar-icons" src={Plus} alt="plus" /> Add
            </button>
          </div>
        </div>
      </div>

      <div className="light-bg-L pb-3 table-container">
        <div className={`${isSidebarCollapsed ? "collapsed-width" : "width"} table-info light-bg-L`}>
          {loading ? (
            <Loader />
          ) : leadsData?.length === 0 ? (
            <p className="text-center mt-6 light-bg-L p-10">No Data Found</p>
          ) : (
            <table className="contact-table two-rows-static light-bg-L">
              <thead>
                <tr className="uppercase body-N dark-M">
                  <th>
                    <label className="container">
                      <input
                        type="checkbox"
                        checked={leadsData?.length === 0 ? false : isSelectAll}
                        onChange={(e) => {
                          setIsSelectAll(e.target.checked);
                          if (e.target.checked) {
                            setSelectedItem(listIds);
                          } else {
                            setSelectedItem([]);
                          }
                        }}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </th>
                  <th className="green-H">
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
                  {/* <th className="green-H">
                    <div className="table-header">
                      Category <img src={sortDesc} alt="icon" />
                    </div>
                  </th> */}
                  <th>
                    <div className="table-header">
                      Crated BY
                      <img
                        role="button"
                        src={sortBy !== "user_id" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("user_id");
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
                      Crated On
                      <img
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
                    <div className="table-header">Actions</div>
                  </th>
                </tr>
              </thead>

              <tbody>
                {leadsData?.map((el, idx) => (
                  <tr key={idx} className="dark-H body-N">
                    <td className="">
                      <label className="container">
                        <input
                          type="checkbox"
                          checked={selectedItem?.includes(el.id)}
                          onChange={() => {
                            handleSelectCheck(el.id);
                          }}
                        />
                        <span className="checkmark"></span>
                      </label>
                    </td>
                    <td className="capitalize">{el?.name}</td>
                    {/* <td className="flex items-center gap-2">{el?.category && <p className="tags green-H body-S">{el?.category}</p>}</td> */}
                    <td className="capitalize">
                      {el?.created_by?.first_name} {el?.created_by?.last_name}
                    </td>
                    <td>
                      {moment(el?.created_at).format("MM/DD/YY")} <span className="dark-M body-S">{moment(el?.created_at).format("hh:mm A")}</span>
                    </td>
                    <td className="flex gap-3 items-center">
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

        <AddLeadSourceModal showModal={showmodal} onClose={() => setShowModal(false)} onCallApi={onSuccess} />

        <EditLeadSourceModal
          showModal={showEditModal}
          onClose={() => setShowEditModal(false)}
          id={selectedId}
          onCallApi={() => {
            setSelectedId("");
            onSuccess();
          }}
        />

        <DeleteConfirmationModal showModal={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleDelete={handleDelete} />

        <ContactPagination from={"archive"} setSelectedItem={setSelectedItem} selectedItem={selectedItem} paginationData={paginationData} handleNext={handleNext} handlePrev={handlePrev} onSuccess={onSuccess} />
      </div>
    </BaseLayout>
  );
};

export default LeadSources;
