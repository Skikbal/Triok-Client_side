import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader";
import Modal from "../Modal/Modal";
import useAuth from "../../hooks/useAuth";
import { BASE_URL } from "../../utils/Element";
import { NotificationManager } from "react-notifications";
import { AiOutlineClose as CrossIcon } from "react-icons/ai";

const SaveSearchModal = ({ showModal, onClose, from, saveSearchFilterData, onSetSelectedSaveFilterId }) => {
  const [config] = useAuth();
  const [name, setName] = useState("");
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState([]);

  const handleClose = () => {
    onClose();
    setName("");
    setError();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      name: name,
      type: from,
      filters: saveSearchFilterData,
    };

    axios
      .post(`${BASE_URL}/save-search`, dataToSend, config)
      .then((res) => {
        setName("");
        setError();
        fetchSavedSearch();
        onSetSelectedSaveFilterId(res?.data?.search?.id);
        handleClose();
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        setError(err?.response?.data?.errors);
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const handleReplace = (e) => {
    e.preventDefault();
    const dataToSend = {
      name: name,
      type: from,
      is_replace: true,
      filters: saveSearchFilterData,
    };

    axios
      .put(`${BASE_URL}/replace-save-search`, dataToSend, config)
      .then((res) => {
        setName("");
        setError();
        fetchSavedSearch();
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        setError(err?.response?.data?.errors);
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const fetchSavedSearch = () => {
    setLoading(true);
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
      .finally(() => setLoading(false));
  };

  // useEffect(() => {
  //   if (showModal) {
  //     fetchSavedSearch();
  //   }
  // }, [showModal]);

  const handleDelete = (id) => {
    axios
      .delete(`${BASE_URL}/delete-search/${id}`, config)
      .then((res) => {
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
        fetchSavedSearch();
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  return (
    <Modal show={showModal} onClose={handleClose} title="Save Search as" desc="Save your search criteria to quickly access and reuse them in the future.">
      <div className="min-h-[80px]">
        {loading ? (
          <Loader />
        ) : (
          <div>
            <form>
              <div>
                <input
                  className="body-N capitalize"
                  name="name"
                  type="text"
                  placeholder="write name here..."
                  value={name}
                  onChange={(e) => {
                    setError({ ...error, name: "" });
                    setName(e.target.value);
                  }}
                />
                {error?.name && <span className="body-S red-D">{error?.name === "The name has already been taken." ? "This saved search is already exist, did you want to replace it?" : error.name}</span>}
              </div>

              {error?.name === "The name has already been taken." ? (
                <button type="button" onClick={handleReplace} className="head-5 light-L green-bg-H save-button mt-4 w-full">
                  Replace this saved search
                </button>
              ) : (
                <button type="button" onClick={handleSubmit} className="head-5 light-L green-bg-H save-button mt-4 w-full">
                  Save Search
                </button>
              )}
            </form>

            {/* <div className="mt-8">
              <p className="body-L dark-M">Your saved searches</p>

              <div className="flex flex-wrap gap-3 mt-2">
                {searchData === null || searchData?.length === 0 ? (
                  <p className="body-N dark-M">No Data Found</p>
                ) : (
                  searchData?.flatMap((el, idx) => (
                    <div key={idx} className="green-H body-S tags flex items-center gap-2">
                      <p
                        role="button"
                        onClick={() => {
                          onSetSelectedSaveFilterId(el.id);
                          handleClose();
                        }}
                      >
                        {el?.name}
                      </p>
                      <CrossIcon role="button" onClick={() => handleDelete(el.id)} />
                    </div>
                  ))
                )}
              </div>
            </div> */}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SaveSearchModal;
