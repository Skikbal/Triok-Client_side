import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import axios from "axios";
import "./Companies.css";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";
import Plus from "../../assets/svgs/Plus.svg";
import { BASE_URL } from "../../utils/Element";
import AddCompanyModal from "./AddCompanyModal";
import BaseLayout from "../../layouts/BaseLayout";
import swap from "../../assets/svgs/swap-vertical.svg";
import CompanyFilter from "./components/CompanyFilter";
import ImportExport from "../../components/ImportExport";
import sortAsce from "../../assets/svgs/sort-ascending.svg";
import sortDesc from "../../assets/svgs/sort-descending.svg";
import { initialCompanyFilterData } from "../../utils/initialData";
import ContactPagination from "../../components/Pagination/ContactPagination";

const Companies = () => {
  const [config] = useAuth();
  const navigate = useNavigate();
  const isSidebarCollapsed = useSelector((state) => state.isSidebarCollapsed);
  const [tagss, setTagss] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [selectedItem, setSelectedItem] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [companiesData, setCompaniesData] = useState([]);
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterData, setFilterData] = useState(initialCompanyFilterData);
  const [paginationData, setPaginationData] = useState({ totalItems: 0, from: 0, to: 0, totalPages: 0 });

  const contactAllIds = companiesData?.map((el) => el.id);

  const buildQueryParams = (filters) => {
    let params = `page=${currentPage}&per_page=${itemPerPage}&search=${search}`;

    const { company_name, primaryphone, streetaddress, city, state, zip, website, taxrecord, taxrecordsentdate, taxrecordsentSdate, taxrecordsentEdate, tags, last_contact, lastContactSentDate, lastContactSentEdate, lastContactSentSdate, date_category, within_last_day, longer_than_day } = filters;

    if (company_name) {
      params += `&company_name=${encodeURIComponent(company_name)}`;
    }
    if (primaryphone) {
      params += `&phone=${encodeURIComponent(primaryphone)}`;
    }
    if (streetaddress) {
      params += `&street_address=${encodeURIComponent(streetaddress)}`;
    }
    if (city) {
      params += `&city=${encodeURIComponent(city)}`;
    }
    if (state) {
      params += `&state=${encodeURIComponent(state)}`;
    }
    if (zip) {
      params += `&zip_code=${encodeURIComponent(zip)}`;
    }
    if (website) {
      params += `&website=${encodeURIComponent(website)}`;
    }
    if (taxrecord) {
      params += `&tax_record_sent=${encodeURIComponent(taxrecord)}`;
    }
    if (taxrecordsentdate) {
      params += `&tax_record_sent_date=${encodeURIComponent(taxrecordsentdate)}`;
    }
    if (taxrecordsentSdate) {
      params += `&tax_record_start_date=${encodeURIComponent(taxrecordsentSdate)}`;
    }
    if (taxrecordsentEdate) {
      params += `&tax_record_end_date=${encodeURIComponent(taxrecordsentEdate)}`;
    }
    if (tags.length > 0) {
      params += `&tags=${tags.join(",")}`;
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

  const fetchCompanies = (filters) => {
    const queryParams = buildQueryParams(filters);
    axios
      .get(`${BASE_URL}/company-list?${queryParams}`, config)
      .then((res) => {
        console.log("res", res);
        const value = res?.data?.data;
        setCompaniesData(value?.companies?.data || []);
        setPaginationData({
          totalItems: value?.companies?.total ?? 0,
          from: value?.companies?.from ?? 0,
          to: value?.companies?.to ?? 0,
          totalPages: value?.companies?.last_page ?? 0,
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
      });
  };

  useEffect(() => {
    fetchCompanies(filterData);
  }, [sortBy, sortDirection]);

  useEffect(() => {
    onSuccess();
  }, [currentPage, itemPerPage, search, sortBy, sortDirection]);

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
      fetchCompanies(filters);
    } else {
      fetchCompanies(filterData);
    }
  };

  const selectedCompanies = selectedItem.length !== 0 ? companiesData?.filter((el) => selectedItem?.includes(el?.id)) : [];

  return (
    <BaseLayout>
      <div className="contact-header">
        <p className="head-1 dark-H">
          Companies
          {selectedItem?.length > 0 && (
            <span className="body-L ml-2">
              ({selectedItem?.length} <span className="dark-H">{selectedItem?.length === 1 ? "item" : "items"} selected</span>)
            </span>
          )}
        </p>
        <div className="md:flex gap-4 items-center">
          <div className="flex gap-4 items-center">
            <CompanyFilter
              filterData={filterData}
              onSetFilterData={(value) => {
                setFilterData(value);
              }}
              onCallApiAgain={(filters) => onSuccess(filters)}
            />

            <ImportExport
              from="company"
              onCallApi={() => {
                onSuccess();
                setSelectedItem([]);
              }}
              selectedData={selectedCompanies}
            />
          </div>

          <div className="flex gap-4 justify-between items-center">
            <div className="search-box contacts">
              <input
                type="text"
                className="body-S"
                placeholder="Search name and website link..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                style={{ border: "1px solid #D8D8D8", marginTop: "0px" }}
              />
              <span className="icon-search"></span>
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
          ) : companiesData.length === 0 ? (
            <p className="text-center mt-6 light-bg-L p-10">No Data Found</p>
          ) : (
            <table className="contact-table two-rows-static light-bg-L">
              <thead>
                <tr className="uppercase body-N dark-M">
                  <th>
                    <label className="container">
                      <input
                        type="checkbox"
                        checked={companiesData.length === 0 ? false : isSelectAll}
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

                  <th>
                    <div className="table-header green-H">
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
                    <div className="table-header ">
                      Website Url
                      <img
                        role="button"
                        src={sortBy !== "website_link" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        alt="icon"
                        onClick={() => {
                          setSortBy("website_link");
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
                      Company Phone
                      <img
                        role="button"
                        src={sortBy !== "phone" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        alt="icon"
                        onClick={() => {
                          setSortBy("phone");
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
                      Tags
                      <img
                        role="button"
                        src={sortBy !== "communication" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        alt="icon"
                        onClick={() => {
                          setSortBy("communication");
                          if (sortDirection === "desc") {
                            setSortDirection("asc");
                          } else {
                            setSortDirection("desc");
                          }
                        }}
                      />
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody>
                {companiesData.flatMap((el, idx) => (
                  <tr key={idx} className="dark-H body-N">
                    <td className="">
                      <label className="container">
                        <input type="checkbox" checked={selectedItem?.includes(el.id)} onChange={() => handleSelectCheck(el.id)} />
                        <span className="checkmark"></span>
                      </label>
                    </td>
                    <td className="head-5 capitalize" role="button" onClick={() => navigate(`/company/${el.id}`)}>
                      {el.company_name}
                    </td>
                    <td>
                      {moment(el?.updated_at).format("MM/DD/YY")} <span className="dark-M body-S">({moment(el?.updated_at).fromNow()})</span>
                    </td>
                    <td
                      role="button"
                      className="green-H"
                      onClick={() => {
                        if (el.website_link) {
                          window.open(el.website_link, "_blank");
                        }
                      }}
                    >
                      {el.website_link}
                    </td>
                    <td>
                      {el.phone?.[0]?.country_code} {el.phone?.[0]?.phone_number}
                    </td>
                    <td className="flex items-center gap-2">
                      {el?.communication?.map((tag, i) =>
                        tag ? (
                          <p key={i} className="tags green-H body-S capitalize">
                            {tag}
                          </p>
                        ) : null
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {companiesData.length !== 0 && <ContactPagination from="company" selectedItem={selectedItem} paginationData={paginationData} handleNext={handleNext} handlePrev={handlePrev} tags={tagss} setTags={setTagss} onSuccess={onSuccess} />}
      </div>

      <AddCompanyModal
        showModal={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        onSuccess={onSuccess}
      />
    </BaseLayout>
  );
};

export default Companies;
