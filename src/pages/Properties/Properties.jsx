import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Properties.css";
import axios from "axios";
import moment from "moment";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";
import Plus from "../../assets/svgs/Plus.svg";
import { BASE_URL } from "../../utils/Element";
import BaseLayout from "../../layouts/BaseLayout";
import swap from "../../assets/svgs/swap-vertical.svg";
import ImportExport from "../../components/ImportExport";
import sortAsce from "../../assets/svgs/sort-ascending.svg";
import sortDesc from "../../assets/svgs/sort-descending.svg";
import { initialPropertyFilterData } from "../../utils/initialData";
import ContactPagination from "../../components/Pagination/ContactPagination";
import PropertyFilter from "../../components/FilterComponents/PropertyFilter";
import { NotificationManager } from "react-notifications";

const Properties = () => {
  const [config] = useAuth();
  const navigate = useNavigate();
  const isSidebarCollapsed = useSelector((state) => state.isSidebarCollapsed);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [selectedItem, setSelectedItem] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [propertylistingdata, setPropertylistingdata] = useState([]);
  const [filterData, setFilterData] = useState(initialPropertyFilterData);
  const [paginationData, setPaginationData] = useState({ totalItems: 0, from: 0, to: 0, totalPages: 0 });

  const propertiesAllIds = propertylistingdata.map((el) => el.id);

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
    if (selectedItem.length === propertiesAllIds.length) {
      setIsSelectAll(true);
    } else {
      setIsSelectAll(false);
    }
  }, [selectedItem, propertiesAllIds]);

  const buildQueryParams = (filters) => {
    let params = `page=${currentPage}&per_page=${itemPerPage}&search=${search}`;

    const { propertyName, storeId, propertyType, streetAddress, city, state, zip, owner, ownerType, lastUpdateOption, sentDate, lastUpStartDate, lastUpEndDate, lastUpDateCategory, withinLastDay, longerThanDay, minCaprate, maxCaprate, minPrice, maxPrice, minBuilding, maxBuilding, minLand, maxLand, minVacancy, maxVacancy, lastSoldOption, lastSoldSentDate, lastSoldStartDate, lastSoldEndDate, lastSoldCategory, lastSoldWithinLastValue, lastSoldLongerThanValue, tags, hasOwner, ownerPhoneCheck, ownerPhone, ownerStreetAddressCheck, ownerStreetAddress, ownerTaxRecordCheck, taxRecordSentDate, taxRecordSentStartDate, taxRecordSentEndDate, ownerWebsite, ownerTags } = filters;

    if (propertyName) {
      params += `&property_name=${encodeURIComponent(propertyName)}`;
    }
    if (storeId) {
      params += `&store_id=${encodeURIComponent(storeId)}`;
    }
    if (propertyType) {
      params += `&property_type=${encodeURIComponent(propertyType)}`;
    }
    if (streetAddress) {
      params += `&street_address=${encodeURIComponent(streetAddress)}`;
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
    if ((lastUpdateOption && sentDate) || lastUpStartDate || lastUpEndDate) {
      params += `&last_update=${encodeURIComponent(lastUpdateOption)}`;
    }
    if (sentDate) {
      params += `&last_update_date=${encodeURIComponent(sentDate)}`;
    }
    if (lastUpStartDate) {
      params += `&last_update_start_date=${encodeURIComponent(lastUpStartDate)}`;
    }
    if (lastUpEndDate) {
      params += `&last_update_end_date=${encodeURIComponent(lastUpEndDate)}`;
    }
    if (lastUpDateCategory) {
      params += `&date_category=${encodeURIComponent(lastUpDateCategory)}`;
    }
    if (withinLastDay) {
      params += `&within_last_day=${encodeURIComponent(withinLastDay)}`;
    }
    if (longerThanDay) {
      params += `&longer_than_day=${encodeURIComponent(longerThanDay)}`;
    }
    if (minCaprate) {
      params += `&min_rate=${encodeURIComponent(minCaprate)}`;
    }
    if (maxCaprate) {
      params += `&max_rate=${encodeURIComponent(maxCaprate)}`;
    }
    if (minBuilding) {
      params += `&building_min_size=${encodeURIComponent(minBuilding)}`;
    }
    if (maxBuilding) {
      params += `&building_max_size=${encodeURIComponent(maxBuilding)}`;
    }
    if (minPrice) {
      params += `&min_price=${encodeURIComponent(minPrice)}`;
    }
    if (maxPrice) {
      params += `&max_price=${encodeURIComponent(maxPrice)}`;
    }
    if (minLand) {
      params += `&land_min_size=${encodeURIComponent(minLand)}`;
    }
    if (maxLand) {
      params += `&land_max_size=${encodeURIComponent(maxLand)}`;
    }
    if (ownerType) {
      params += `&owner_type=${encodeURIComponent(ownerType)}`;
    }
    if (owner?.id) {
      params += `&owner=${encodeURIComponent(owner?.id)}`;
    }
    if (hasOwner) {
      params += `&has_owner=${encodeURIComponent(hasOwner)}`;
    }
    if (ownerPhoneCheck) {
      params += `&has_owner_phone=${encodeURIComponent(ownerPhoneCheck)}`;
    }
    if (ownerPhone) {
      params += `&owner_phone=${encodeURIComponent(ownerPhone)}`;
    }
    if (ownerStreetAddressCheck) {
      params += `&has_owner_street_adrees=${encodeURIComponent(ownerStreetAddressCheck)}`;
    }
    if (ownerStreetAddress) {
      params += `&owner_street_adrees=${encodeURIComponent(ownerStreetAddress)}`;
    }
    if (ownerWebsite) {
      params += `&owner_website=${encodeURIComponent(ownerWebsite)}`;
    }
    if (ownerTaxRecordCheck) {
      params += `&has_owner_tax_record=${encodeURIComponent(ownerTaxRecordCheck)}`;
    }
    if (taxRecordSentDate) {
      params += `&tax_record_sent_date=${encodeURIComponent(taxRecordSentDate)}`;
    }
    if (taxRecordSentStartDate) {
      params += `&tax_record_start_date=${encodeURIComponent(taxRecordSentStartDate)}`;
    }
    if (taxRecordSentEndDate) {
      params += `&tax_record_end_date=${encodeURIComponent(taxRecordSentEndDate)}`;
    }
    if (ownerTags) {
      params += `&owner_tags=${encodeURIComponent(ownerTags)}`;
    }
    if (tags?.length > 0) {
      params += `&tags=${encodeURIComponent(tags?.join(","))}`;
    }
    if ((lastSoldOption && lastSoldSentDate) || lastSoldStartDate || lastSoldEndDate) {
      params += `&last_sold=${encodeURIComponent(lastSoldOption)}`;
    }
    if (lastSoldSentDate) {
      params += `&last_sold_date=${encodeURIComponent(lastSoldSentDate)}`;
    }
    if (lastSoldStartDate) {
      params += `&last_sold_start_date=${encodeURIComponent(lastSoldStartDate)}`;
    }
    if (lastSoldEndDate) {
      params += `&last_sold_end_date=${encodeURIComponent(lastSoldEndDate)}`;
    }
    if (lastSoldCategory) {
      params += `&sold_date_category=${encodeURIComponent(lastSoldCategory)}`;
    }
    if (lastSoldWithinLastValue) {
      params += `&sold_within_last_day=${encodeURIComponent(lastSoldWithinLastValue)}`;
    }
    if (lastSoldLongerThanValue) {
      params += `&sold_longer_than_day=${encodeURIComponent(lastSoldLongerThanValue)}`;
    }
    if (sortDirection && sortBy !== "id") {
      params += `&sort_direction=${sortDirection}`;
    }
    if (sortBy !== "id") {
      params += `&sort_by=${sortBy}`;
    }
    return params;
  };

  const fetchProperties = (filters) => {
    const queryParams = buildQueryParams(filters);
    axios
      .get(`${BASE_URL}/property-list?${queryParams}`, config)
      .then((res) => {
        const value = res?.data?.properties;
        setPropertylistingdata(value?.data || []);
        setPaginationData({
          totalItems: value?.total ?? 0,
          from: value?.from ?? 0,
          to: value?.to ?? 0,
          totalPages: value?.last_page ?? 0,
        });
        setSelectedItem([]);
        setIsSelectAll(false);
        // setFilterData(initialPropertyFilterData);
        // if (res?.data?.message) {
        //   NotificationManager.success(res?.data?.message);
        // }
      })
      .catch((error) => {
        if (error.response?.data?.message) {
          NotificationManager.error(error.response?.data?.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProperties(filterData);
  }, [sortDirection, sortBy]);

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
      fetchProperties(filters);
    } else {
      fetchProperties(filterData);
    }
  };

  const selectedProperties = selectedItem.length !== 0 ? propertylistingdata?.filter((el) => selectedItem?.includes(el?.id)) : [];

  return (
    <BaseLayout>
      <div className="contact-header">
        <p className="head-1 dark-H">
          Properties
          {selectedItem?.length > 0 && (
            <span className="body-L ml-2">
              ({selectedItem?.length} <span className="dark-H">{selectedItem?.length === 1 ? "item" : "items"} selected</span>)
            </span>
          )}
        </p>
        <div className="md:flex block gap-4 items-center">
          <div className="flex gap-4 items-center">
            <PropertyFilter
              filterData={filterData}
              onSetFilterData={(value) => {
                setFilterData(value);
              }}
              onCallApiAgain={(filters) => onSuccess(filters)}
            />

            <ImportExport
              from="property"
              onCallApi={() => {
                onSuccess();
                setSelectedItem([]);
              }}
              selectedData={selectedProperties}
            />
          </div>

          <div className="flex gap-4 justify-between items-center">
            <div className="search-box contacts">
              <input
                type="text"
                className="body-S"
                placeholder="Search property, owner, city, state.."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                style={{ border: "1px solid #D8D8D8", marginTop: "0px" }}
              />
              <span className="icon-search"></span>
            </div>
            <button className="add-contact-button green-bg-H light-L body-S" onClick={() => navigate("/add-property")}>
              <img className="mr-2 sidebar-icons" src={Plus} alt="plus" /> Add
            </button>
          </div>
        </div>
      </div>

      <div className="light-bg-L pb-3 table-container">
        <div className={`${isSidebarCollapsed ? "collapsed-width" : "width"} table-info light-bg-L`}>
          {loading ? (
            <Loader />
          ) : propertylistingdata.length === 0 ? (
            <p className="text-center mt-6 light-bg-L p-10">No Data Found</p>
          ) : (
            <table className="contact-table two-rows-static light-bg-L">
              <thead>
                <tr className="uppercase body-N dark-M">
                  <th>
                    <label className="container">
                      <input
                        type="checkbox"
                        checked={propertylistingdata.length === 0 ? false : isSelectAll}
                        onChange={(e) => {
                          setIsSelectAll(e.target.checked);
                          if (e.target.checked) {
                            setSelectedItem(propertiesAllIds);
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
                      Property Name
                      <img
                        role="button"
                        src={sortBy !== "property_name" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("property_name");
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
                      Property Type
                      <img
                        role="button"
                        src={sortBy !== "property_type" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        alt="icon"
                        onClick={() => {
                          setSortBy("property_type");
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
                      Property Address
                      <img
                        role="button"
                        src={sortBy !== "street_address" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        alt="icon"
                        onClick={() => {
                          setSortBy("street_address");
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
                      City
                      <img
                        role="button"
                        src={sortBy !== "city" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        alt="icon"
                        onClick={() => {
                          setSortBy("city");
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
                      State
                      <img
                        role="button"
                        src={sortBy !== "state" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        alt="icon"
                        onClick={() => {
                          setSortBy("state");
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
                      Owner
                      <img
                        role="button"
                        src={sortBy !== "owner" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        alt="icon"
                        onClick={() => {
                          setSortBy("owner");
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
                      Last Update
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
                  {/* <th>
                    <div className="table-header">
                      Owner Address
                      <img
                        role="button"
                        src={sortBy !== "owner_street_adrees" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("owner_street_adrees");
                          if (sortDirection === "desc") {
                            setSortDirection("asc");
                          } else {
                            setSortDirection("desc");
                          }
                        }}
                        alt="icon"
                      />
                    </div>
                  </th> */}
                  {/* <th>
                    <div className="table-header">
                      Owner Phone
                      <img
                        role="button"
                        src={sortBy !== "owner_phone" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("owner_phone");
                          if (sortDirection === "desc") {
                            setSortDirection("asc");
                          } else {
                            setSortDirection("desc");
                          }
                        }}
                        alt="icon"
                      />
                    </div>
                  </th> */}
                  <th>
                    <div className="table-header">
                      Tags
                      <img
                        role="button"
                        src={sortBy !== "propertytag_id" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("propertytag_id");
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
                {propertylistingdata.map((el, idx) => (
                  <tr key={idx} className="dark-H body-N">
                    <td className="">
                      <label className="container">
                        <input type="checkbox" checked={selectedItem?.includes(el.id)} onChange={() => handleSelectCheck(el.id)} />
                        <span className="checkmark"></span>
                      </label>
                    </td>
                    <td className="head-5 capitalize" role="button" onClick={() => navigate(`/property/${el.id}`)}>
                      {el.property_name}
                    </td>
                    <td className="dark-M capitalize">{el.property_type?.type}</td>
                    <td className="">{el.street_address}</td>
                    <td>{el.city}</td>
                    <td>{el.state}</td>
                    <td
                      role="button"
                      className="head-5 green-H capitalize"
                      onClick={() => {
                        if (el?.owner_company_id) {
                          navigate(`/company/${el?.owner_company_id}`);
                        } else {
                          navigate(`/contact/${el?.owner_contact_id}`);
                        }
                      }}
                    >
                      {el.owner?.name}
                    </td>
                    <td className="dark-M">{moment(el.updated_at).format("MM/DD/YYYY")}</td>
                    {/* <td>
                      {el.owner_address?.[0]?.street} {el.owner_address?.[0]?.city} {el.owner_address?.[0]?.state}
                    </td>
                    <td>
                      {el.owner_phone?.[0]?.country_code} {el.owner_phone?.[0]?.phone_number}
                    </td> */}
                    <td className="flex flex-wrap items-center gap-2" style={{ maxWidth: "450px" }}>
                      {el?.propertytag_details?.map((tag, i) => (
                        <p key={i} className="tags green-H body-S">
                          {tag?.tag_name}
                        </p>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {propertylistingdata?.length !== 0 && <ContactPagination from="property" selectedItem={selectedItem} paginationData={paginationData} handleNext={handleNext} handlePrev={handlePrev} onSuccess={onSuccess} />}
      </div>
    </BaseLayout>
  );
};

export default Properties;
