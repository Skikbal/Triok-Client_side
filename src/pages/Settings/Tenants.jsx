import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";
import Plus from "../../assets/svgs/Plus.svg";
import { BASE_URL } from "../../utils/Element";
import BaseLayout from "../../layouts/BaseLayout";
import ActionsMenu from "../../components/ActionsMenu";
import swap from "../../assets/svgs/swap-vertical.svg";
import sortAsce from "../../assets/svgs/sort-ascending.svg";
import sortDesc from "../../assets/svgs/sort-descending.svg";
import AddTenantModal from "./modals/TenantModals/AddTenantModal";
import EditTenantModal from "./modals/TenantModals/EditTenantModal";
import ContactPagination from "../../components/Pagination/ContactPagination";
import DeleteConfirmationModal from "../../components/ConfirmationModals/DeleteConfirmationModal";

const Tenants = () => {
  const [config] = useAuth();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [listData, setListData] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [selectedItem, setSelectedItem] = useState([]);
  const [selectedName, setSelectedName] = useState("");
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const isSidebarCollapsed = useSelector((state) => state.isSidebarCollapsed);
  const [paginationData, setPaginationData] = useState({ totalItems: 0, from: 0, to: 0, totalPages: 0 });
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortBy, setSortBy] = useState("id");

  const listIds = listData?.map((el) => el.id);

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

  const fetchListData = () => {
    axios
      .get(`${BASE_URL}/Tenant-listing?page=${currentPage}&per_page=${itemPerPage}&search=${search}&sort_direction=${sortDirection}&sort_by=${sortBy}`, config)
      .then((res) => {
        const value = res?.data?.tenant;
        setListData(value?.data || []);
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
    fetchListData();
  }, [sortBy, sortDirection]);

  useEffect(() => {
    onSuccess();
  }, [currentPage, itemPerPage, search]);

  const onSuccess = () => {
    setLoading(true);
    fetchListData();
  };

  const handleDelete = () => {
    axios
      .delete(`${BASE_URL}/delete-Tenant/${selectedId}`, config)
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
          Tenants
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
                placeholder="search property type..."
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
          ) : listData?.length === 0 ? (
            <p className="text-center mt-6 light-bg-L p-10">No Data Found</p>
          ) : (
            <table className="contact-table two-rows-static light-bg-L">
              <thead>
                <tr className="uppercase body-N dark-M">
                  <th>
                    <label className="container">
                      <input
                        type="checkbox"
                        checked={listData?.length === 0 ? false : isSelectAll}
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
                      Tenant Name
                      <img
                        role="button"
                        src={sortBy !== "tenant_name" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("tenant_name");
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
                      Created BY
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
                      Created On
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
                {listData?.map((el, idx) => (
                  <tr key={idx} className="dark-H body-N">
                    <td className="">
                      <label className="container">
                        <input type="checkbox" checked={selectedItem?.includes(el.id)} onChange={() => handleSelectCheck(el.id)} />
                        <span className="checkmark"></span>
                      </label>
                    </td>
                    <td className="capitalize">{el?.tenant_name} </td>
                    <td className="capitalize">
                      {el?.user?.first_name} {el?.user?.last_name}
                    </td>
                    <td>
                      {moment(el?.created_at).format("MM/DD/YY")} <span className="dark-M body-S">{moment(el?.created_at).format("hh:mm A")}</span>
                    </td>
                    <td className="flex gap-3 items-center">
                      <ActionsMenu
                        handleEdit={() => {
                          setShowEditModal(true);
                          setSelectedId(el?.id);
                          setSelectedName(el?.tenant_name);
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

        <AddTenantModal showModal={showModal} onClose={() => setShowModal(false)} onCallApi={onSuccess} />

        <EditTenantModal
          showModal={showEditModal}
          onClose={() => setShowEditModal(false)}
          id={selectedId}
          name={selectedName}
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

export default Tenants;
