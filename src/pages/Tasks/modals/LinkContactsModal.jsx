import React, { useState, useEffect } from "react";
import Modal from "../../../components/Modal/Modal";
import axios from "axios";
import { BASE_URL } from "../../../utils/Element";
import useAuth from "../../../hooks/useAuth";
import { useParams } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import Loader from "../../../components/Loader";

const LinkContactsModal = ({ showModal, onClose, onLink, from, selectedIds, isWidth = false }) => {
  const { id } = useParams();
  const [config] = useAuth();
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);

  useEffect(() => {
    if (selectedIds) {
      setSelectedContacts(selectedIds);
    }
  }, [selectedIds]);

  const fetchSearchResults = () => {
    if (search.trim() !== "") {
      const endpoint = from === "company" ? `${BASE_URL}/get-datalisting?list=contacts&search=${search}&company_id=${id}` : `${BASE_URL}/get-datalisting?list=contacts&search=${search}`;
      setLoading(true);
      axios
        .get(endpoint, config)
        .then((res) => {
          setSearchResults(res?.data?.data?.contact_list || []);
        })
        .catch((err) => {
          setSearchResults([]);
          setError("Error fetching search results. Please try again.");
          if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
            NotificationManager.error(err.response?.data?.message);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    if (search !== "") {
      fetchSearchResults();
    }
  }, [search]);

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleContactCheckboxChange = (contact) => {
    const { id, first_name, last_name } = contact;
    const contactName = `${first_name} ${last_name}`;

    setSelectedContacts((prevSelectedContacts) => {
      const index = prevSelectedContacts?.findIndex((el) => el.id === id);
      const newSelectedContacts = index !== -1 ? prevSelectedContacts.filter((el) => el.id !== id) : [...prevSelectedContacts, { id: id, name: contactName }];

      return newSelectedContacts;
    });
  };

  const handleClose = () => {
    onClose();
    // setSelectedContacts([]);
    setSearchResults([]);
    setSearch("");
  };

  const handleLinkButtonClick = () => {
    onLink(selectedContacts);
    handleClose();
  };

  return (
    <Modal title={"Link Contacts"} desc={"Select contacts to link to this task."} show={showModal} onClose={handleClose} className="linkContacts-modal" height={isWidth ? "500px" : "400px"} width={isWidth ? "500px" : "400px"} zIndex="1050">
      <form onClick={handleModalClick}>
        <div>
          <input
            className="body-N"
            type="text"
            placeholder="Search contact name here"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setError(null);
            }}
          />
        </div>
        {error && <p className="red-D">{error}</p>}

        <div className="link-contact-list mt-6" style={{ height: `${isWidth ? "250px" : "150px"}` }}>
          {loading ? (
            <Loader />
          ) : (
            searchResults.map((contact) => (
              <label key={contact.id} className="container flex flex-col items-start mb-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedContacts?.map((el) => el.id)?.includes(contact.id)}
                    onChange={() => {
                      handleContactCheckboxChange(contact);
                    }}
                  />
                  <span className="checkmark mr-2"></span>
                  <p className="head-6">{`${contact.first_name} ${contact.last_name}`}</p>
                </div>
                {contact.email && contact.email.length > 0 && <p className="body-ES">{contact.email[0].email_id}</p>}
              </label>
            ))
          )}
        </div>

        <div className="mt-6">
          <button type="button" onClick={handleLinkButtonClick} className="save-button light-L head-5 green-bg-H">
            Link
          </button>
          <button type="button" onClick={handleClose} className="green-H ml-5">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default LinkContactsModal;
