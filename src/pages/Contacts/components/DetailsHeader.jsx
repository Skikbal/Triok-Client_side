import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import axios from "axios";
import moment from "moment";
import useAuth from "../../../hooks/useAuth";
import Menu from "../../../assets/svgs/Menu.svg";
import { BASE_URL } from "../../../utils/Element";
import phone from "../../../assets/svgs/call.svg";
import Edit from "../../../assets/svgs/Pencil.svg";
import EditContactModal from "../EditContactModal";
import linkurl from "../../../assets/images/url.png";
import drive from "../../../assets/images/drive.png";
import UpArrow from "../../../assets/svgs/up-arrow.svg";
import Message from "../../../assets/svgs/message 2.svg";
import Delete from "../../../assets/svgs/Recycle Bin.svg";
import facebook from "../../../assets/icons/facebook.svg";
import linkedin from "../../../assets/icons/linkedin.svg";
import { handleDropdownClose } from "../../../utils/utils";
import DownArrow from "../../../assets/svgs/down-arrow.svg";
import DeleteConfirmationModal from "../../../components/ConfirmationModals/DeleteConfirmationModal";
import MarkAsLeadConfirmationModal from "../../../components/ConfirmationModals/MarkAsLeadConfirmationModal";

const DetailsHeader = ({ contactDetails, onSetCallApiAgain }) => {
  const { id } = useParams();
  const [config] = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showAllDetails, setShowAllDetails] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLead, setIsLead] = useState(contactDetails?.mark_as_lead == 0 ? false : true);

  useEffect(() => {
    setIsLead(contactDetails?.mark_as_lead == 0 ? false : true);
  }, [contactDetails?.mark_as_lead]);

  useEffect(() => {
    const handleClose = () => {
      setIsOpen(false);
    };
    handleDropdownClose(dropdownRef, handleClose);
  }, []);

  const handleLeadUpdate = () => {
    axios
      .post(`${BASE_URL}/markaslead-edit/${id}`, { mark_as_lead: isLead ? 1 : 0 }, config)
      .then((res) => {
        setShowLeadModal(false);
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        setIsLead(contactDetails?.mark_as_lead == 0 ? false : true);
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const handleDelete = () => {
    axios
      .get(`${BASE_URL}/delete-contact/${id}`, config)
      .then((res) => {
        if (res.data.success) {
          navigate("/contacts");
        }
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
    <div className="contact-details light-bg-L">
      <div className="md:flex items-start justify-between">
        <div>
          <p className="head-2 dark-H capitalize">
            {contactDetails?.first_name} {contactDetails?.last_name}
          </p>
          <p className="body-N dark-M">Last contact on {moment(contactDetails?.updated_at).fromNow()}</p>
        </div>

        <div className="mt-5 md:mt-0">
          {contactDetails?.tags?.length !== 0 && (
            <div className="flex flex-wrap justify-center items-center gap-2" style={{ width: "700px" }}>
              {contactDetails?.tags?.map((tag, i) => (
                <p key={i} className="tags green-H body-S capitalize">
                  {tag?.tag_name ? tag?.tag_name : tag}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mt-5 md:mt-0">
          <div ref={dropdownRef} className="custom-dropdown">
            <div role="button" className="light-bg-L body-N dark-M " onClick={() => setIsOpen(!isOpen)}>
              <img src={Menu} alt="icon" className="sidebar-icons" />
            </div>
            {isOpen && (
              <div className="dropdown-list-container dropdown-end light-bg-L dark-M body-N shadow rounded-box" style={{ width: "180px" }}>
                <ul className="dropdown-list">
                  <li>
                    <div className="flex items-center justify-center">
                      <div>
                        <label className="container" style={{ marginBottom: "0px" }}>
                          <p style={{ paddingLeft: "30px" }}>Mark as Lead</p>
                          <input
                            type="checkbox"
                            checked={isLead}
                            onChange={(e) => {
                              setIsLead(e.target.checked);
                              setShowLeadModal(true);
                              setIsOpen(false);
                            }}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                    </div>
                  </li>

                  <li
                    role="button"
                    onClick={() => {
                      setShowModal(true);
                      setIsOpen(false);
                    }}
                  >
                    <img src={Edit} alt="icon" className="sidebar-icons mr-3" /> Edit
                  </li>
                  <li
                    className="red-D"
                    role="button"
                    onClick={() => {
                      setShowDeleteModal(true);
                      setIsOpen(false);
                    }}
                  >
                    <img src={Delete} alt="icon" className="sidebar-icons mr-3" />
                    Delete
                  </li>
                </ul>
              </div>
            )}
          </div>

          <img role="button" src={showAllDetails ? UpArrow : DownArrow} alt="icon" className="sidebar-icons" onClick={() => setShowAllDetails(!showAllDetails)} />
        </div>
      </div>

      {/* <div className="flex items-center justify-center">
        <div>
          <label className="container head-5 dark-M">
            <p className="-ml-2">Mark as Lead</p>
            <input
              type="checkbox"
              checked={isLead}
              onChange={(e) => {
                setIsLead(e.target.checked);
                setShowLeadModal(true);
              }}
            />
            <span className="checkmark"></span>
          </label>
        </div>
      </div> */}

      <div className="mt-6 md:flex md:flex-wrap gap-4 justify-between">
        <div>
          <p className="body-N dark-M">Company</p>
          <p className="head-5 green-M underline capitalize" role="button" onClick={() => navigate(`/company/${contactDetails?.company_id}`)}>
            {contactDetails?.company?.company_name ?? "N/A"}
          </p>
        </div>

        <div className="mt-5 md:mt-0">
          <p className="body-N dark-M">Title</p>
          <p className="body-N dark-H capitalize">{contactDetails?.title ?? "N/A"}</p>
        </div>

        <div className="mt-5 md:mt-0">
          <p className="body-N dark-M">Home Address</p>
          {contactDetails?.address?.[0]?.street ? (
            <p className="body-N dark-H">
              {contactDetails?.address?.[0]?.street}, {contactDetails?.address?.[0]?.city}, {contactDetails?.address?.[0]?.state}, {contactDetails?.address?.[0]?.zip_code}
              {contactDetails?.address?.[0]?.address_category && <span className="body-XS green-H tag-data ml-1">{contactDetails?.address?.[0]?.address_category}</span>}
            </p>
          ) : (
            "N/A"
          )}
        </div>

        <div className="mt-5 md:mt-0">
          <div className="flex items-center gap-2">
            <img src={phone} alt="icon" />
            <p className="head-5 dark-H">
              {contactDetails?.phone?.[0]?.phone_number ? (
                <>
                  {contactDetails?.phone?.[0]?.phone_number}
                  <span className="body-S dark-M  mx-1">ext. {contactDetails?.phone?.[0]?.ext}</span>
                  <span className="body-XS green-H tag-data">{contactDetails?.phone?.[0]?.phone_category}</span>
                </>
              ) : null}
            </p>
          </div>

          <div className="flex items-center mt-3 gap-2">
            <img src={Message} alt="icon" />
            <p className="head-5 dark-H">
              {contactDetails?.email?.[0]?.email_id ? (
                <>
                  {contactDetails.email?.[0].email_id}
                  {contactDetails.email?.[0].email_category && <span className="body-XS green-H tag-data ml-1">{contactDetails?.email?.[0]?.email_category}</span>}
                </>
              ) : null}
            </p>
          </div>
        </div>
      </div>

      {showAllDetails && (
        <div>
          <hr className="mt-6" />

          <div className="md:flex items-start gap-2 justify-between mt-6 body-N">
            <div>
              <p className="dark-M uppercase">Additional Contact Information</p>

              <div className="mt-4">
                <p className="dark-M">Preferred Contact Method</p>
                <p className="dark-H">Phone</p>
              </div>

              <div className="mt-6 flex gap-5">
                <div>
                  <p className="dark-M">Phone (Additional)</p>
                  {contactDetails?.phone
                    ?.filter((_, idx) => idx !== 0)
                    ?.flatMap((el, i) =>
                      el.phone_number ? (
                        <p className="dark-H mt-2">
                          {el?.country_code} {el?.phone_number} <span className="dark-M">ext.{el?.ext}</span>
                        </p>
                      ) : null
                    )}
                </div>

                <div>
                  <p className="dark-M">Email (Additional)</p>
                  {contactDetails?.email
                    ?.filter((_, idx) => idx !== 0)
                    ?.flatMap((el, i) => (
                      <p className="dark-H mt-2">{el?.email_id}</p>
                    ))}
                </div>
              </div>
            </div>

            <div className="max-w-[390px]">
              <p className="dark-M uppercase">Comments</p>
              <p className="dark-H mt-4">{contactDetails?.description}</p>

              <div className="flex justify-between mt-6 gap-5">
                <div>
                  <div>
                    <p className="dark-M">Birthday</p>
                    <p className="dark-H">{contactDetails?.birthday}</p>
                  </div>

                  <div className="mt-6">
                    <p className="dark-M">Lead Source</p>
                    <p
                      className={contactDetails?.select_lead_type === "contact" ? "green-H head-5" : "dark-H"}
                      role="button"
                      onClick={() => {
                        if (contactDetails?.select_lead_type === "contact") {
                          navigate(`/contact/${contactDetails.lead_source_contact_id}`);
                        }
                      }}
                    >
                      {contactDetails?.select_lead_type === "contact" ? `${contactDetails.contact_source?.first_name} ${contactDetails.contact_source?.last_name}` : contactDetails?.lead_source?.name ?? "NA"}
                    </p>
                  </div>
                </div>

                <div className="">
                  <div>
                    <p className="dark-M">First Deal Anniversary</p>
                    <p className="dark-H">{contactDetails?.first_deal_anniversary}</p>
                  </div>

                  <div className="mt-6 capitalize">
                    <p className="dark-M">Account</p>
                    <p className="dark-H">
                      {contactDetails?.user?.first_name} {contactDetails?.user?.last_name}
                    </p>
                    <p className="dark-M body-XS">
                      Owner: {contactDetails?.user?.first_name} {contactDetails?.user?.last_name}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div>
                <p className="dark-M uppercase">Relationships</p>

                {contactDetails?.relationship?.flatMap((el, i) =>
                  el.relation_category && el.id ? (
                    <p className="head-5 green-H mt-4" role="button" onClick={() => navigate(`/contact/${el?.id}`)}>
                      {el?.name} <span className="dark-M body-XS capitalize">({el?.relation_category})</span>
                    </p>
                  ) : null
                )}
              </div>

              <div className="mt-10">
                <p className="dark-M uppercase">Links</p>
                <div className="flex justify-between gap-5 mt-6">
                  {/* {contactDetails?.links?.flatMap((el, i) => (
                    <p key={i} onClick={() => window.open(el?.link, "_blank")}>
                      <img role="button" src={el?.link_category === "facebook" ? facebook : el?.link_category === "google_drive" ? drive : el?.link_category === "linkedIn" ? linkedin : el?.link_category === "website" ? linkurl : null} alt="icon" />
                    </p>
                  ))} */}

                  {contactDetails?.links?.flatMap((el, i) =>
                    el.link && el.link_category ? (
                      <p key={i} onClick={() => window.open(el.link, "_blank")}>
                        {el.link_category === "facebook" && <img role="button" src={facebook} alt="Facebook icon" />}
                        {el.link_category === "google_drive" && <img role="button" src={drive} alt="Google Drive icon" />}
                        {el.link_category === "linkedIn" && <img role="button" src={linkedin} alt="LinkedIn icon" />}
                        {el.link_category === "website" && <img role="button" src={linkurl} alt="Website icon" />}
                      </p>
                    ) : null
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <EditContactModal
        showModal={showModal}
        onSetCallApiAgain={onSetCallApiAgain}
        onClose={() => {
          setShowModal(false);
        }}
      />

      <MarkAsLeadConfirmationModal
        showModal={showLeadModal}
        isLead={isLead}
        onClose={() => {
          setShowLeadModal(false);
          setIsLead(contactDetails?.mark_as_lead == 0 ? false : true);
        }}
        handleAction={handleLeadUpdate}
      />

      <DeleteConfirmationModal showModal={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleDelete={handleDelete} />
    </div>
  );
};

export default DetailsHeader;
