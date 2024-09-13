import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./Contact.css";
import axios from "axios";
import moment from "moment";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";
import Plus from "../../assets/svgs/Plus.svg";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/Element";
import AddContactModal from "./AddContactModal";
import BaseLayout from "../../layouts/BaseLayout";
import ContactFilter from "./components/ContactFilter";
import swap from "../../assets/svgs/swap-vertical.svg";
import ImportExport from "../../components/ImportExport";
import { NotificationManager } from "react-notifications";
import sortAsce from "../../assets/svgs/sort-ascending.svg";
import sortDesc from "../../assets/svgs/sort-descending.svg";
import { initialContactFilterData } from "../../utils/initialData";
import ContactPagination from "../../components/Pagination/ContactPagination";

const Contacts = () => {
  const [config] = useAuth();
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [contactsData, setContactsData] = useState([]);
  const [selectedItem, setSelectedItem] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [filterData, setFilterData] = useState(initialContactFilterData);
  const isSidebarCollapsed = useSelector((state) => state.isSidebarCollapsed);
  const [paginationData, setPaginationData] = useState({ totalItems: 0, from: 0, to: 0, totalPages: 0 });
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const contactAllIds = contactsData?.map((el) => el.id);

  const buildQueryParams = (filters) => {
    let params = `page=${currentPage}&per_page=${itemPerPage}&search=${search}`;

    const { company, first_name, last_name, email, phone, street_address, city, state, zip_code, leadsource_id, website, first_deal_anniversary, has_acquisition, tax_record_sent, tax_record_sent_date, tax_record_start_date, tax_record_end_date, tags, tag_category, last_contact, lastContactSentDate, lastContactSentEdate, lastContactSentSdate, date_category, within_last_day, longer_than_day } = filters;

    if (company?.id) {
      params += `&company=${encodeURIComponent(company?.id)}`;
    }
    if (first_name) {
      params += `&first_name=${encodeURIComponent(first_name)}`;
    }
    if (last_name) {
      params += `&last_name=${encodeURIComponent(last_name)}`;
    }
    if (email) {
      params += `&email=${encodeURIComponent(email)}`;
    }
    if (phone) {
      params += `&phone=${encodeURIComponent(phone)}`;
    }
    if (street_address) {
      params += `&street_address=${encodeURIComponent(street_address)}`;
    }
    if (city) {
      params += `&city=${encodeURIComponent(city)}`;
    }
    if (state) {
      params += `&state=${encodeURIComponent(state)}`;
    }
    if (zip_code) {
      params += `&zip_code=${encodeURIComponent(zip_code)}`;
    }
    if (leadsource_id) {
      params += `&leadsource_id=${encodeURIComponent(leadsource_id)}`;
    }
    if (website) {
      params += `&website=${encodeURIComponent(website)}`;
    }
    if (first_deal_anniversary) {
      params += `&first_deal_anniversary=${encodeURIComponent(first_deal_anniversary)}`;
    }
    if (has_acquisition) {
      params += `&has_acquisition=${encodeURIComponent(has_acquisition)}`;
    }
    if (tax_record_sent) {
      params += `&tax_record_sent=${encodeURIComponent(tax_record_sent)}`;
    }
    if (tax_record_sent_date) {
      params += `&tax_record_sent_date=${encodeURIComponent(tax_record_sent_date)}`;
    }
    if (tax_record_start_date) {
      params += `&tax_record_start_date=${encodeURIComponent(tax_record_start_date)}`;
    }
    if (tax_record_end_date) {
      params += `&tax_record_end_date=${encodeURIComponent(tax_record_end_date)}`;
    }
    if (tag_category && tags.length > 0) {
      params += `&tag_category=${encodeURIComponent(tag_category)}`;
    }
    if (tags.length > 0) {
      params += `&tags=${encodeURIComponent(tags.join(","))}`;
    }

    if ((last_contact && lastContactSentDate) || (last_contact && lastContactSentSdate && lastContactSentEdate)) {
      params += `&last_contact=${encodeURIComponent(last_contact)}`;
    }
    if (lastContactSentDate) {
      params += `&last_update_date=${encodeURIComponent(lastContactSentDate)}`;
    }
    if (lastContactSentSdate) {
      params += `&last_update_start_date=${encodeURIComponent(lastContactSentSdate)}`;
    }
    if (lastContactSentEdate) {
      params += `&last_update_end_date=${encodeURIComponent(lastContactSentEdate)}`;
    }
    if (date_category) {
      params += `&date_category=${encodeURIComponent(date_category)}`;
    }
    if (within_last_day) {
      params += `&within_last_day=${encodeURIComponent(within_last_day)}`;
    }
    if (longer_than_day) {
      params += `&longer_than_day=${encodeURIComponent(longer_than_day)}`;
    }

    if (sortDirection && sortBy !== "id") {
      params += `&sort_direction=${sortDirection}`;
    }
    if (sortBy !== "id") {
      params += `&sort_by=${sortBy}`;
    }

    return params;
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
    if (selectedItem.length === contactAllIds.length) {
      setIsSelectAll(true);
    } else {
      setIsSelectAll(false);
    }
  }, [selectedItem, contactAllIds]);

  const fetchContacts = (filters) => {
    const queryParams = buildQueryParams(filters);
    axios
      .get(`${BASE_URL}/contact-list?${queryParams}`, config)
      .then((res) => {
        const value = res?.data?.data?.contacts;
        setContactsData(value?.data || []);
        setPaginationData({
          totalItems: value?.total ?? 0,
          from: value?.from ?? 0,
          to: value?.to ?? 0,
          totalPages: value?.last_page ?? 0,
        });
        setSelectedItem([]);
        setIsSelectAll(false);
        // setFilterData(initialContactFilterData);
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
      });
  };

  useEffect(() => {
    fetchContacts(filterData);
  }, [sortBy, sortDirection]);

  useEffect(() => {
    onSuccess();
  }, [currentPage, itemPerPage, search]);

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

  const onSuccess = (filters) => {
    setLoading(true);
    if (filters) {
      fetchContacts(filters);
    } else {
      fetchContacts(filterData);
    }
  };

  // const selectedContacts = selectedItem?.length !== 0 ? contactsData?.filter((el) => selectedItem?.includes(el?.id)) : [];

  // const exportCsvData = [["ID", "Fisrt Name", "Last Name", "Birthday", "Anniversary", "Phone", "Email", "Address", "Company Name", "Title", "Lead Source", "LinkedIn Link", "Google Link", "Website", "Description", "Tags"], ...selectedContacts?.map((el) => [el.id, el?.first_name, el?.last_name, el?.birthday, el?.first_deal_anniversary, `${el.phone?.[0]?.country_code} ${el.phone?.[0]?.phone_number}`, el.email?.[0]?.email_id, `${el?.address?.[0]?.address} ${el?.address?.[0]?.apt_unit_suite}`, el?.company?.company_name ?? "N/A", el?.title, el?.lead_source_value, el?.links?.filter((e) => e?.link_category === "linkedIn")?.link ?? "N/A", el?.links?.filter((e) => e?.link_category === "google")?.link ?? "N/A", el?.website, el?.description, el?.tags?.map((el) => el?.tag_name)])];

  return (
    <BaseLayout>
      <div className="contracts_only">
        <div className="contact-header">
          <p className="head-1 dark-H">
            Contacts
            {selectedItem?.length > 0 && (
              <span className="body-L ml-2">
                ({selectedItem?.length} <span className="dark-H">{selectedItem?.length === 1 ? "item" : "items"} selected</span>)
              </span>
            )}
          </p>
          <div className="md:flex block gap-4 items-center">
            <div className="flex gap-4 items-center">
              <ContactFilter
                filterData={filterData}
                onSetFilterData={(value) => {
                  setFilterData(value);
                }}
                onCallApiAgain={(filters) => onSuccess(filters)}
              />

              <ImportExport
                onCallApi={() => {
                  onSuccess();
                  setSelectedItem([]);
                }}
                from="contact"
                // exportCsvData={exportCsvData}
                // selectedData={selectedContacts}
              />
            </div>

            <div className="flex gap-4 justify-between items-center">
              <div className="search-box contacts">
                <input
                  type="text"
                  className="body-S"
                  placeholder="search here..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  style={{ border: "1px solid #D8D8D8", marginTop: "0px" }}
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
            ) : contactsData?.length === 0 ? (
              <p className="text-center mt-6 light-bg-L p-10">No Data Found</p>
            ) : (
              <table className="contact-table two-rows-static light-bg-L">
                <thead>
                  <tr className="uppercase body-N dark-M">
                    <th>
                      <label className="container">
                        <input
                          type="checkbox"
                          checked={contactsData?.length === 0 ? false : isSelectAll}
                          onChange={(e) => {
                            setIsSelectAll(e.target.checked);
                            if (e.target.checked) {
                              setSelectedItem(contactAllIds);
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
                        Contact Name
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
                        Company Name
                        <img
                          role="button"
                          src={sortBy !== "company_name" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                          onClick={() => {
                            setSortBy("company_name");
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
                        Last Contacted
                        <img
                          role="button"
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
                        PRIMARY PHONE
                        <img
                          role="button"
                          src={sortBy !== "phone" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                          onClick={() => {
                            setSortBy("phone");
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
                        PRIMARY EMAIL
                        <img
                          role="button"
                          src={sortBy !== "email" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                          onClick={() => {
                            setSortBy("email");
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
                        Tags
                        <img
                          role="button"
                          src={sortBy !== "tags" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                          onClick={() => {
                            setSortBy("tags");
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
                  </tr>
                </thead>

                <tbody>
                  {Array.isArray(contactsData) &&
                    contactsData.map((el, idx) => (
                      <tr key={idx} className="dark-H body-N">
                        <td className="">
                          <label className="container">
                            <input type="checkbox" checked={selectedItem?.includes(el.id)} onChange={() => handleSelectCheck(el.id)} />
                            <span className="checkmark"></span>
                          </label>
                        </td>
                        <td className="capitalize head-5" role="button" onClick={() => navigate(`/contact/${el.id}`)}>
                          {el.first_name} {el.last_name}
                        </td>
                        <td
                          role="button"
                          className="green-H capitalize head-5"
                          onClick={() => {
                            if (el?.company_id) {
                              navigate(`/company/${el?.company_id}`);
                            }
                          }}
                        >
                          {el?.company?.company_name ?? "N/A"}
                        </td>
                        <td>
                          {moment(el?.updated_at).format("MM/DD/YY")} <span className="dark-M body-S">({moment(el?.updated_at).fromNow()})</span>
                        </td>
                        <td>
                          {el.phone?.[0]?.country_code} {el.phone?.[0]?.phone_number}
                        </td>
                        <td>{el.email?.[0]?.email_id}</td>
                        <td className="flex flex-wrap items-center gap-2" style={{ maxWidth: "450px" }}>
                          {el?.tags?.map((tag, i) => (
                            <p key={i} className="tags green-H body-S">
                              {tag?.tag_name ? tag?.tag_name : tag}
                            </p>
                          ))}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
          {contactsData.length !== 0 && <ContactPagination from="contact" setSelectedItem={setSelectedItem} selectedItem={selectedItem} paginationData={paginationData} handleNext={handleNext} handlePrev={handlePrev} tags={tags} setTags={setTags} onSuccess={onSuccess} />}
        </div>

        <AddContactModal
          showModal={showModal}
          onClose={() => {
            setShowModal(false);
          }}
          onCallApi={onSuccess}
        />
      </div>
    </BaseLayout>
  );
};

export default Contacts;
