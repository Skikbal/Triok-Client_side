import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import axios from "axios";
import Loader from "../Loader";
import Modal from "../Modal/Modal";
import useAuth from "../../hooks/useAuth";
import { BASE_URL } from "../../utils/Element";
import Edit from "../../assets/svgs/Pencil.svg";
import { LuCheck as CheckIcon } from "react-icons/lu";
import Delete from "../../assets/svgs/Recycle Bin.svg";
import { RxReload as ReloadIcon } from "react-icons/rx";
import { AiOutlineClose as CrossIcon } from "react-icons/ai";

const ManageSavedFiltersModal = ({ showModal, onClose, from }) => {
  const [config] = useAuth();
  const [name, setName] = useState("");
  const [error, setError] = useState();
  const [loading, setLoading] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [isLoading, setIsLodaing] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const handleCross = () => {
    setName("");
    setSelectedItem("");
    setSelectedType("");
    setError();
  };

  const fetchSavedSearch = () => {
    setIsLodaing(true);
    axios
      .get(`${BASE_URL}/list-search?type=${from}`, config)
      .then((res) => {
        setSearchData(res?.data?.search);
        setName("");
        setError();
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => setIsLodaing(false));
  };

  useEffect(() => {
    if (showModal) {
      fetchSavedSearch();
    }
  }, [showModal]);

  const handleDelete = () => {
    setLoading(selectedItem);
    axios
      .delete(`${BASE_URL}/delete-search/${selectedItem}`, config)
      .then((res) => {
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
        handleCross();
        fetchSavedSearch();
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => setLoading(""));
  };

  const handleEdit = () => {
    const dataToSend = {
      name: name,
    };
    setLoading(selectedItem);
    axios
      .put(`${BASE_URL}/update-search/${selectedItem}`, dataToSend, config)
      .then((res) => {
        fetchSavedSearch();
        handleCross();
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        setError(err?.response?.data?.errors);
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => setLoading(""));
  };

  return (
    <Modal show={showModal} onClose={onClose} title="Manage Saved Filters" desc="Update or remove your custom saved filters.">
      <div>
        {error?.name && <span className="body-S red-D">{error?.name}</span>}

        {isLoading ? (
          <Loader />
        ) : searchData === null || searchData?.lenght === 0 ? (
          <p className="body-N dark-M">No Data Found</p>
        ) : (
          searchData?.flatMap((el, idx) => (
            <div key={idx} className="body-S flex justify-between items-center gap-2 px-3 py-2.5  light-bg-H mb-2 rounded">
              {selectedItem === el?.id && selectedType === "edit" ? (
                <input
                  name="name"
                  type="text"
                  value={name}
                  className="body-S capitalize"
                  placeholder="write name here..."
                  style={{ width: "60%", height: "35px" }}
                  onChange={(e) => {
                    setError({ ...error, name: "" });
                    setName(e.target.value);
                  }}
                />
              ) : (
                <p>{el?.name}</p>
              )}

              <div>
                {loading === el?.id ? (
                  <ReloadIcon className="green-H rotate" size={18} />
                ) : selectedItem !== el?.id ? (
                  <div className="flex items-start gap-2">
                    <img
                      role="button"
                      src={Edit}
                      alt="icon"
                      className="sidebar-icons"
                      onClick={() => {
                        setName(el?.name);
                        setSelectedItem(el.id);
                        setSelectedType("edit");
                      }}
                    />
                    <img
                      role="button"
                      src={Delete}
                      alt="icon"
                      className="sidebar-icons"
                      onClick={() => {
                        setSelectedItem(el.id);
                        setSelectedType("delete");
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p>{selectedType === "edit" ? "Confirm Edit?" : "Delete Filter?"}</p>
                    <CheckIcon
                      role="button"
                      className="green-H"
                      size={18}
                      onClick={() => {
                        if (selectedType === "edit") {
                          handleEdit();
                        } else {
                          handleDelete();
                        }
                      }}
                    />
                    <CrossIcon role="button" className="red-D" size={18} onClick={handleCross} />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
};

export default ManageSavedFiltersModal;
