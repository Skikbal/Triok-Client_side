import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";
import { BASE_URL } from "../../utils/Element";
import BaseLayout from "../../layouts/BaseLayout";
import Delete from "../../assets/svgs/delete 2.svg";
import swap from "../../assets/svgs/swap-vertical.svg";
import sortAsce from "../../assets/svgs/sort-ascending.svg";
import sortDesc from "../../assets/svgs/sort-descending.svg";
import ContactPagination from "../../components/Pagination/ContactPagination";
import DeleteConfirmationModal from "../../components/ConfirmationModals/DeleteConfirmationModal";
import { NotificationManager } from "react-notifications";

const PropertyArchive = () => {
  const isSidebarCollapsed = useSelector((state) => state.isSidebarCollapsed);
  const [config] = useAuth();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [listData, setListData] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [selectedItem, setSelectedItem] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paginationData, setPaginationData] = useState({ totalItems: 0, from: 0, to: 0, totalPages: 0 });
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  const listIds = listData?.map((el) => el.id);

  const fetchData = () => {
    axios
      .get(`${BASE_URL}/archive-listing?search=${search}&type=property&sort_direction=${sortDirection}&sort_by=${sortBy}`, config)
      .then((res) => {
        const value = res?.data?.propertylist;
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
    fetchData();
  }, [sortBy, sortDirection]);

  useEffect(() => {
    onSuccess();
  }, [currentPage, itemPerPage, search]);

  const onSuccess = () => {
    setLoading(true);
    fetchData();
  };

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

  const handleDelete = () => {
    const dataToSend = {
      action: "delete",
      type: "contact",
      ids: [selectedId],
    };

    axios
      .post(`${BASE_URL}/handle-bulkaction`, dataToSend, config)
      .then((res) => {
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
          Property Archive
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
                placeholder="search name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                style={{ border: "1px solid #D8D8D8" }}
              />
            </div>
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
                      Property Type
                      <img
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
                      Date Archived
                      <img
                        src={sortBy !== "updated_at" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        alt="icon"
                        onClick={() => {
                          setSortBy("updated_at");
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
                      Owner
                      <img
                        role="button"
                        src={sortBy !== "owner_company_name" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("owner_company_name");
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
                {listData?.map((el, idx) => (
                  <tr key={idx} className="dark-H body-N">
                    <td className="">
                      <label className="container">
                        <input type="checkbox" checked={selectedItem?.includes(el.id)} onChange={() => handleSelectCheck(el?.id)} />
                        <span className="checkmark"></span>
                      </label>
                    </td>
                    <td className="capitalize">{el?.property_name} </td>
                    <td className="capitalize">{el.property_type?.type}</td>
                    <td>{moment(el?.updated_at).format("MM/DD/YYYY hh:mm A")}</td>
                    <td className="capitalize">{el?.owner?.name}</td>
                    <td className="flex content-center">
                      <img
                        className="mx-4"
                        src={Delete}
                        alt="delete"
                        role="button"
                        onClick={() => {
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

        <ContactPagination from="archive" setSelectedItem={setSelectedItem} selectedItem={selectedItem} paginationData={paginationData} handleNext={handleNext} handlePrev={handlePrev} onSuccess={onSuccess} />

        <DeleteConfirmationModal showModal={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleDelete={handleDelete} />
      </div>
    </BaseLayout>
  );
};

export default PropertyArchive;
