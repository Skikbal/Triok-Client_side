import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { BASE_URL } from "../../../utils/Element";
import Modal from "../../../components/Modal/Modal";
import account from "../../../assets/svgs/account.svg";
import { AiOutlineClose as CrossIcon } from "react-icons/ai";
import LinkContactsModal from "../../Tasks/modals/LinkContactsModal";

const LinkContactInfoModal = ({ id, linkContacts, showModal, onClose, onSuccess }) => {
  const [config] = useAuth();
  const [disable, setDisable] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    if (linkContacts) {
      setSelectedContacts(linkContacts?.map((el) => ({ id: el.id, name: `${el?.first_name} ${el?.last_name}` })));
    }
  }, [linkContacts]);

  const handleRemove = (id) => {
    const filteredData = selectedContacts?.filter((el) => el.id !== id);
    setSelectedContacts(filteredData);
    handleLinkContacts(filteredData);
  };

  const handleLinkContacts = (value) => {
    setDisable(true);
    const dataToSend = { contact: value.map((el) => el.id) };
    axios
      .put(`${BASE_URL}/update-smartplan/${id}`, dataToSend, config)
      .then((res) => {
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
        onClose();
        onSuccess();
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => setDisable(false));
  };

  return (
    <Modal title={"Link Contacts"} desc={"Information of linked contact to the touchplan"} show={showModal} onClose={onClose}>
      <div>
        {selectedContacts?.length === 0 ? (
          <p className="body-N">No contact linked</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedContacts?.map((el, index) => (
              <div key={index} className="head-5 green-H flex items-center gap-2 tags p-2 rounded-full bg-light-bg-L dark:bg-dark-bg-D">
                <img src={account} alt="" /> {el?.name} <CrossIcon role="button" onClick={() => handleRemove(el.id)} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-6">
          <button disabled={disable} className="save-button light-L head-5 green-bg-H" onClick={() => setShowContactModal(true)}>
            Link Contact
          </button>
          <button type="button" onClick={onClose} className="green-H ml-5">
            Cancel
          </button>
        </div>
      </div>

      <LinkContactsModal
        showModal={showContactModal}
        onClose={() => setShowContactModal(false)}
        onLink={(value) => {
          setSelectedContacts(value);
          handleLinkContacts(value);
        }}
        selectedIds={selectedContacts}
      />
    </Modal>
  );
};

export default LinkContactInfoModal;
