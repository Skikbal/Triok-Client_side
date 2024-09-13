import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";
import Toggle from "../../components/Toggle";
import Plus from "../../assets/svgs/Plus.svg";
import { BASE_URL } from "../../utils/Element";
import Edit from "../../assets/svgs/Pencil.svg";
import AddUserModal from "./modals/AddUserModal";
import BaseLayout from "../../layouts/BaseLayout";
import EditUserModal from "./modals/EditUserModal";
import swap from "../../assets/svgs/swap-vertical.svg";
import sortAsce from "../../assets/svgs/sort-ascending.svg";
import sortDesc from "../../assets/svgs/sort-descending.svg";
import ContactPagination from "../../components/Pagination/ContactPagination";
import ActivationConfirmationModal from "../../components/ConfirmationModals/ActivationConfirmationModal";

const Users = () => {
  const isSidebarCollapsed = useSelector((state) => state.isSidebarCollapsed);
  const [config] = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [usersData, setUsersData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [selectedItem, setSelectedItem] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [profileStatus, setProfileStatus] = useState(false);
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [paginationData, setPaginationData] = useState({ totalItems: 0, from: 0, to: 0, totalPages: 0 });

  const userIds = usersData?.map((el) => el.id);

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

  useEffect(() => {
    if (selectedItem.length === userIds.length) {
      setIsSelectAll(true);
    } else {
      setIsSelectAll(false);
    }
  }, [selectedItem, userIds]);

  const fetchUsers = () => {
    axios
      .get(`${BASE_URL}/users-list?page=${currentPage}&per_page=${itemPerPage}&search=${search}&type=${activeTab}&sort_direction=${sortDirection}&sort_by=${sortBy}`, config)
      .then((res) => {
        const value = res?.data?.users;
        setUsersData(value?.data || []);
        setPaginationData({
          totalItems: value?.total,
          from: value?.from,
          to: value?.to,
          totalPages: value?.last_page,
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
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [sortBy, sortDirection]);

  useEffect(() => {
    setLoading(true);
    fetchUsers();
  }, [currentPage, itemPerPage, search, activeTab]);

  const onSuccess = () => {
    setLoading(true);
    fetchUsers();
  };

  const handleStatusConfirm = () => {
    const dataToSend = { status: profileStatus === 1 ? 0 : 1 };
    axios
      .post(`${BASE_URL}/update-user-status/${selectedId}`, dataToSend, config)
      .then((res) => {
        onSuccess();
        setShowActivationModal(false);
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
          Users
          {selectedItem?.length > 0 && (
            <span className="body-L ml-2">
              ({selectedItem?.length} <span className="dark-H">{selectedItem?.length === 1 ? "item" : "items"} selected</span>)
            </span>
          )}
        </p>

        <div className="flex gap-6 items-center">
          <div className="search-box contacts">
            <input type="text" className="body-S" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Name, Email..." style={{ border: "1px solid #D8D8D8" }} />
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

      <div className="task-tabs mx-1 mt-1.5 body-L dark-M">
        <div className="flex gap-4">
          <p
            role="button"
            className={`${activeTab === "all" ? "head-4 dark-H active" : ""} pb-3`}
            onClick={() => {
              setActiveTab("all");
              setCurrentPage(1);
            }}
          >
            All
          </p>
          <p
            role="button"
            className={`${activeTab === "active" ? "head-4 dark-H active" : ""} pb-3`}
            onClick={() => {
              setActiveTab("active");
              setCurrentPage(1);
            }}
          >
            Active
          </p>
          <p
            role="button"
            className={`${activeTab === "inactive" ? "head-4 dark-H active" : ""} pb-3`}
            onClick={() => {
              setActiveTab("inactive");
              setCurrentPage(1);
            }}
          >
            Inactive
          </p>
        </div>
      </div>

      <div className="light-bg-L pb-3 table-container" style={{ marginTop: "0px" }}>
        <div className={`${isSidebarCollapsed ? "collapsed-width" : "width"} table-info light-bg-L`}>
          {isLoading ? (
            <Loader />
          ) : usersData.length === 0 ? (
            <p className="text-center mt-6 light-bg-L p-10">No Data Found</p>
          ) : (
            <table className="contact-table two-rows-static light-bg-L">
              <thead>
                <tr className="uppercase body-N dark-M">
                  <th>
                    <label className="container">
                      <input
                        type="checkbox"
                        checked={usersData.length === 0 ? false : isSelectAll}
                        onChange={(e) => {
                          setIsSelectAll(e.target.checked);
                          if (e.target.checked) {
                            setSelectedItem(userIds);
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
                        src={sortBy !== "first_name" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("first_name");
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
                      Account Type
                      <img
                        role="button"
                        src={sortBy !== "role_id" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("role_id");
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
                      Email
                      <img
                        src={sortBy !== "email" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        alt="icon"
                        onClick={() => {
                          setSortBy("email");
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
                      Status
                      <img
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
                    <div className="table-header">Action</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {usersData.flatMap((el, idx) => (
                  <tr key={idx} className="dark-H body-N">
                    <td className="">
                      <label className="container">
                        <input type="checkbox" checked={selectedItem?.includes(el.id)} onChange={() => handleSelectCheck(el.id)} />
                        <span className="checkmark"></span>
                      </label>
                    </td>
                    <td
                      className="head-5 flex items-center gap-2 capitalize"
                      role="button"
                      onClick={() => {
                        navigate(`/user/${el.id}`);
                      }}
                    >
                      {el.first_name} {el.last_name}
                    </td>
                    <td>
                      <p className="tags green-H body-S">{el?.roles?.name}</p>
                    </td>

                    <td>{el.email}</td>
                    <td className="dark-M body-XS">
                      <div
                        onClick={() => {
                          setShowActivationModal(true);
                          setProfileStatus(el.status);
                          setSelectedId(el.id);
                        }}
                      >
                        <Toggle isActive={el.status === 1 ? true : false} />
                      </div>
                    </td>

                    <td className="flex gap-3 items-center">
                      <img
                        role="button"
                        src={Edit}
                        alt=""
                        className="sidebar-icons"
                        onClick={() => {
                          setSelectedId(el.id);
                          setShowEditModal(true);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {usersData?.length !== 0 && <ContactPagination from="user" selectedItem={selectedItem} paginationData={paginationData} handleNext={handleNext} handlePrev={handlePrev} onSuccess={onSuccess} />}

        <ActivationConfirmationModal showModal={showActivationModal} type={profileStatus ? "inactive" : "active"} onClose={() => setShowActivationModal(false)} handleConfirm={handleStatusConfirm} />

        <AddUserModal fetchUsers={onSuccess} showModal={showModal} onClose={() => setShowModal(false)} />

        <EditUserModal fetchUsers={onSuccess} showModal={showEditModal} selectedId={selectedId} onClose={() => setShowEditModal(false)} />
      </div>
    </BaseLayout>
  );
};

export default Users;
