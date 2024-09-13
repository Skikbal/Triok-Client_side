import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import Select from "react-select";
import moment from "moment";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../components/Loader";
import { BASE_URL } from "../../../utils/Element";
import { Radio, RadioGroup, Stack } from "@chakra-ui/react";
import LinkField from "../../../components/AddDataComponents/LinkField";
import PhoneField from "../../../components/AddDataComponents/PhoneField";
import EmailField from "../../../components/AddDataComponents/EmailField";
import SearchDropdown from "../../../components/Dropdowns/SearchDropdown";
import AddressField from "../../../components/AddDataComponents/AddressField";
import { IoIosArrowDown as DownArrow, IoIosArrowUp as UpArrow } from "react-icons/io";
import RelationshipField from "../../../components/AddDataComponents/RelationshipField";

const AddContactData = ({ showModal, onClose, onSetError, handleSubmit, addContactData, onSetAddContactData, phones, onSetPhones, emails, onSetEmails, addresses, onSetAddresses, onSetRelations, relations, links, onSetLinks, error, disable }) => {
  const [config] = useAuth();
  const [loading, setLoading] = useState(true);
  const [showAboutData, setShowAboutData] = useState(true);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [contactOptions, setContactOptions] = useState([]);
  const [leadTypeOptions, setLeadTypeOptions] = useState([]);
  const [contactTagOptions, setContactTagOptions] = useState([]);
  const [leadSourcesOptions, setLeadSourcesOptions] = useState([]);
  const [showAdditionalData, setShowAdditionalData] = useState(true);

  const fetchContactTags = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/get-datalisting?list=contact_tags`, config)
      .then((res) => {
        const value = res?.data?.data?.contact_tags;
        setContactTagOptions(value?.map((el) => ({ value: el?.id, label: el?.tag_name })));
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => setLoading(false));
  };

  const fetchLeadSources = () => {
    axios
      .get(`${BASE_URL}/get-datalisting?list=lead_sources`, config)
      .then((res) => {
        const value = res?.data?.data?.lead_sources;
        setLeadSourcesOptions(value?.map((el) => ({ value: el?.id, label: el?.name, category: el?.category })));
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  useEffect(() => {
    if (addContactData?.leadSourceType === "list") {
      setLeadTypeOptions(leadSourcesOptions);
    } else {
      setLeadTypeOptions(contactOptions);
    }
  }, [addContactData?.leadSourceType, contactOptions, leadSourcesOptions]);

  const fetchContactSuggestions = (inputValue) => {
    if (inputValue !== "") {
      axios
        .get(`${BASE_URL}/get-datalisting?list=contacts&search=${inputValue}`, config)
        .then((res) => {
          const value = res?.data?.data?.contact_list;
          setContactOptions(
            value?.map((data) => ({
              value: data?.id,
              label: `${data?.first_name} ${data?.last_name}`,
            }))
          );
        })
        .catch((err) => {
          if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
            NotificationManager.error(err.response?.data?.message);
          }
        });
    } else {
      setContactOptions([]);
    }
  };

  const fetchSuggestions = (inputValue) => {
    if (inputValue !== "") {
      axios
        .get(`${BASE_URL}/get-datalisting?list=companies&search=${inputValue}`, config)
        .then((res) => {
          const value = res?.data?.data?.company_list;
          setCompanyOptions(
            value?.map((data) => ({
              value: data.id,
              label: data.company_name,
            }))
          );
        })
        .catch((err) => {
          if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
            NotificationManager.error(err.response?.data?.message);
          }
        });
    } else {
      setCompanyOptions([]);
    }
  };

  useEffect(() => {
    if (showModal) {
      fetchContactTags();
      fetchLeadSources();
    }
  }, [showModal]);

  const handleChange = (value, name) => {
    if (name === "firstName" || name === "lastName" || name === "title") {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        return;
      }
    }
    onSetAddContactData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <label className="container head-5 dark-M">
            <p>Mark as Lead</p>
            <input
              type="checkbox"
              checked={addContactData?.isLead}
              onChange={(e) => {
                handleChange(e.target.checked, "isLead");
              }}
            />
            <span className="checkmark"></span>
          </label>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="flex gap-5 mt-6">
              <div>
                <label className="dark-H head-4 mb-2 required:*:">
                  First Name<span className="red-D">*</span>
                </label>
                <input
                  className="body-N capitalize"
                  name="firstName"
                  type="text"
                  placeholder="write first name here"
                  value={addContactData.firstName}
                  onChange={(e) => {
                    onSetError({ ...error, first_name: "" });
                    handleChange(e.target.value, "firstName");
                  }}
                />
                {error?.first_name && <span className="body-S red-D">{error?.first_name}</span>}
              </div>

              <div>
                <label className="dark-H head-4 mb-2 ">
                  Last Name<span className="red-D">*</span>
                </label>
                <input
                  className="body-N capitalize"
                  name="lastName"
                  type="text"
                  placeholder="write last name here"
                  value={addContactData.lastName}
                  onChange={(e) => {
                    onSetError({ ...error, last_name: "" });
                    handleChange(e.target.value, "lastName");
                  }}
                />
                {error?.last_name && <span className="body-S red-D">{error?.last_name}</span>}
              </div>
            </div>

            <div className="flex gap-5 mt-6">
              <div style={{ width: "50%" }}>
                <label className="dark-H head-4 ">Company Name</label>
                <div className="mt-1.5 flex-1">
                  <SearchDropdown
                    isTop={false}
                    placeholder="Search company here"
                    text={addContactData?.company_name}
                    options={companyOptions}
                    fetchSuggestions={fetchSuggestions}
                    onSetOptions={(value) => setCompanyOptions(value)}
                    handleSelect={(option) => {
                      onSetError({ ...error, company: "" });
                      onSetAddContactData({ ...addContactData, company_name: option?.label, company: option?.value });
                      setCompanyOptions([]);
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="dark-H head-4 mb-2">Title</label>
                <input
                  className="body-N capitalize"
                  name="title"
                  type="text"
                  placeholder="write title here"
                  value={addContactData.title}
                  onChange={(e) => {
                    handleChange(e.target.value, "title");
                  }}
                />
              </div>
            </div>

            <PhoneField phones={phones} onSetPhones={onSetPhones} />

            <EmailField emails={emails} onSetEmails={onSetEmails} />

            <hr className="mt-6" />

            <div className="flex items-center gap-2 mt-6" role="button" onClick={() => setShowAdditionalData(!showAdditionalData)}>
              <p className="head-4 dark-H">Additional Contact Information</p> {showAdditionalData ? <UpArrow /> : <DownArrow />}
            </div>

            {showAdditionalData && (
              <>
                <AddressField isApt={false} addresses={addresses} onSetAddresses={onSetAddresses} />

                <div className="mt-6">
                  <label className="dark-H head-4">Tags</label>
                  <div className="mt-2">
                    <Select
                      isMulti
                      className="service-area"
                      placeholder="add tag here"
                      options={contactTagOptions}
                      value={contactTagOptions?.filter((el) => addContactData?.tags?.includes(el?.value))}
                      onChange={(options) => {
                        const values = options?.map((el) => el.value);
                        handleChange(values, "tags");
                      }}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <p className="head-4 dark-H mb-3">Lead Source Type</p>

                  <RadioGroup
                    onChange={(value) => {
                      setLeadTypeOptions(contactOptions);
                      onSetAddContactData({ ...addContactData, leadSourceType: value, selectedLeadData: "" });
                    }}
                    value={addContactData?.leadSourceType}
                  >
                    <Stack direction="row" gap={5}>
                      <Radio value="list">Select From List</Radio>
                      <Radio value="contact">Select From Contacts</Radio>
                    </Stack>
                  </RadioGroup>
                </div>

                {addContactData?.leadSourceType !== "" && (
                  <div className="mt-6">
                    {addContactData?.leadSourceType === "list" ? (
                      <Select
                        name="selectedLeadData"
                        options={leadTypeOptions}
                        placeholder={`${addContactData?.leadSourceType === "list" ? "Select Lead" : "Select Contact"}`}
                        value={leadTypeOptions?.find((el) => el?.value === addContactData?.selectedLeadData)}
                        onChange={(option) => {
                          handleChange(option.value, "selectedLeadData");
                        }}
                      />
                    ) : (
                      <div className="flex-1">
                        <SearchDropdown
                          isTop={false}
                          placeholder="search contact here"
                          text={addContactData?.contact_name}
                          options={contactOptions}
                          fetchSuggestions={fetchContactSuggestions}
                          onSetOptions={(value) => setContactOptions(value)}
                          handleSelect={(option) => {
                            onSetAddContactData({ ...addContactData, contact_name: option?.label, selectedLeadData: option?.value });
                            setContactOptions([]);
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            <hr className="mt-6" />

            <div className="flex items-center gap-2 mt-6" role="button" onClick={() => setShowAboutData(!showAboutData)}>
              <p className="head-4 dark-H">About</p> {showAboutData ? <UpArrow /> : <DownArrow />}
            </div>

            {showAboutData && (
              <>
                <RelationshipField relations={relations} onSetRelations={onSetRelations} />

                <LinkField links={links} onSetLinks={onSetLinks} />

                <div className="flex gap-2 mt-6">
                  <div>
                    <label className="dark-H head-4">First Deal Anniversary</label>
                    <input
                      className="body-N mt-2"
                      name="first_deal_anniversary"
                      type="date"
                      max={moment().format("YYYY-MM-DD")}
                      placeholder="MM/DD/YYYY"
                      value={addContactData.first_deal_anniversary}
                      onChange={(e) => {
                        onSetError({ ...error, first_deal_anniversary: "" });
                        handleChange(e.target.value, "first_deal_anniversary");
                      }}
                    />
                    {error?.first_deal_anniversary && <span className="body-S red-D">{error?.first_deal_anniversary}</span>}
                  </div>

                  <div>
                    <label className="dark-H head-4">Birthday</label>
                    <input
                      className="body-N mt-2"
                      name="birthday"
                      type="date"
                      max={moment().format("YYYY-MM-DD")}
                      placeholder="MM/DD/YYYY"
                      value={addContactData.birthday}
                      onChange={(e) => {
                        onSetError({ ...error, birthday: "" });
                        handleChange(e.target.value, "birthday");
                      }}
                    />
                    {error?.birthday && <span className="body-S red-D">{error?.birthday}</span>}
                  </div>

                  <div>
                    <label className="dark-H head-4">Tax Record Letter Sent</label>
                    <input
                      className="body-N mt-2"
                      name="tax_record_sent"
                      type="date"
                      placeholder="MM/DD/YYYY"
                      value={addContactData.tax_record_sent}
                      onChange={(e) => {
                        onSetError({ ...error, tax_record_sent: "" });
                        handleChange(e.target.value, "tax_record_sent");
                      }}
                    />
                    {error?.tax_record_sent && <span className="body-S red-D">{error?.tax_record_sent}</span>}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="dark-H head-4 mb-2">Comments</label>
                  <textarea
                    rows={3}
                    className="body-N"
                    name="title"
                    type="text"
                    placeholder="write here..."
                    value={addContactData.description}
                    onChange={(e) => {
                      handleChange(e.target.value, "description");
                    }}
                  />
                </div>
              </>
            )}

            <hr className="mt-6" />

            <div className="mt-6">
              <button type="submit" disabled={disable} className="save-button light-L head-5 green-bg-H">
                Save
              </button>
              <button type="button" onClick={onClose} className="green-H ml-5">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AddContactData;
