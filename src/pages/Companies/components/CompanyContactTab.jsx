import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../components/Loader";
import { BASE_URL } from "../../../utils/Element";
import swap from "../../../assets/svgs/swap-vertical.svg";
import sortAsce from "../../../assets/svgs/sort-ascending.svg";
import sortDesc from "../../../assets/svgs/sort-descending.svg";
import ContactFilter from "../../Contacts/components/ContactFilter";
import { initialContactFilterData } from "../../../utils/initialData";
import ContactPagination from "../../../components/Pagination/ContactPagination";
import { NotificationManager } from "react-notifications";

const CompanyContactTab = () => {
  const { id } = useParams();
  const [config] = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [contactData, setContactData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterData, setFilterData] = useState(initialContactFilterData);
  const isSidebarCollapsed = useSelector((state) => state.isSidebarCollapsed);
  const [paginationData, setPaginationData] = useState({ totalItems: 0, from: 0, to: 0, totalPages: 0 });

  const buildQueryParams = (filters) => {
    let params = `list_type=company&page=${currentPage}&per_page=${itemPerPage}&id=${id}`;

    const { company, first_name, last_name, email, phone, street_address, city, state, zip_code, leadsource_id, website, first_deal_anniversary, has_acquisition, tax_record_sent, tax_record_sent_date, tax_record_start_date, tax_record_end_date, tags, tag_category, last_contact, lastContactSentDate, lastContactSentEdate, lastContactSentSdate, date_category, within_last_day, longer_than_day } = filters;

    if (company?.id) {
      params += `&company=${encodeURIComponent(company.id)}`;
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

  const fetchContactData = (filters) => {
    const queryParams = buildQueryParams(filters);
    axios
      .get(`${BASE_URL}/contact-list?${queryParams}`, config)
      .then((res) => {
        const value = res?.data?.data?.contacts;
        setContactData(value?.data || []);
        setPaginationData({
          totalItems: value?.total ?? 0,
          from: value?.from ?? 0,
          to: value?.to ?? 0,
          totalPages: value?.last_page ?? 0,
        });
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
    fetchContactData(filterData);
  }, [sortBy, sortDirection]);

  useEffect(() => {
    onSuccess();
  }, [id, currentPage, itemPerPage]);

  const onSuccess = (filters) => {
    setLoading(true);
    if (filters) {
      fetchContactData(filters);
    } else {
      fetchContactData(filterData);
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

  return (
    <div>
      <div className="flex justify-between items-start head-5 green-H">
        <ContactFilter
          filterData={filterData}
          onSetFilterData={(value) => {
            setFilterData(value);
          }}
          onCallApiAgain={(filters) => onSuccess(filters)}
        />
      </div>
      <div className="light-bg-L pb-3 table-container">
        <div className={`${isSidebarCollapsed ? "tab-collapsed-width" : "tab-width"} table-info light-bg-L`}>
          {loading ? (
            <Loader />
          ) : contactData.length > 0 ? (
            <table className="contact-table light-bg-L mt-3" style={{ width: "100%" }}>
              <thead>
                <tr className="uppercase body-N dark-M">
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
                      Title
                      <img
                        src={sortBy !== "title" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        alt="icon"
                        onClick={() => {
                          setSortBy("title");
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
                {contactData?.map((el) => (
                  <tr key={el?.id} className="body-N dark-H">
                    <td className="head-5" role="button" onClick={() => navigate(`/contact/${el.id}`)}>
                      {el?.first_name} {el?.last_name}
                    </td>
                    <td>{el?.title}</td>
                    <td>
                      {el?.phone[0]?.country_code} {el?.phone[0]?.phone_number}
                    </td>
                    <td>{el?.email[0]?.email_id}</td>
                    <td className="flex flex-wrap items-center gap-2" style={{ maxWidth: "300px" }}>
                      {el?.tags?.map((tag, i) => (
                        <p key={i} className="tags green-H body-S">
                          {tag.tag_name}
                        </p>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center mt-3 dark-M">No contacts available</p>
          )}
        </div>
      </div>

      {contactData?.length !== 0 && <ContactPagination from="contact" paginationData={paginationData} handleNext={handleNext} handlePrev={handlePrev} onSuccess={onSuccess} />}
    </div>
  );
};

export default CompanyContactTab;
