import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth.js";
import Loader from "../../components/Loader";
import { BASE_URL } from "../../utils/Element.js";
import swap from "../../assets/svgs/swap-vertical.svg";
import sortAsce from "../../assets/svgs/sort-ascending.svg";
import sortDesc from "../../assets/svgs/sort-descending.svg";
import PropertyFilter from "../FilterComponents/PropertyFilter.jsx";
import ContactPagination from "../Pagination/ContactPagination.jsx";
import { initialPropertyFilterData } from "../../utils/initialData.js";
import axios from "axios";
import { NotificationManager } from "react-notifications";

const PropertyTab = ({ from }) => {
  const isSidebarCollapsed = useSelector((state) => state.isSidebarCollapsed);
  const [config] = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [propertyData, setPropertyData] = useState([]);
  const [filterData, setFilterData] = useState(initialPropertyFilterData);
  const [paginationData, setPaginationData] = useState({ totalItems: 0, from: 0, to: 0, totalPages: 0 });
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  const buildQueryParams = (filters) => {
    let params = `list_type=${from}&id=${id}&page=${currentPage}&per_page=${itemPerPage}`;

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

  const fetchData = (filters) => {
    const queryParams = buildQueryParams(filters);

    axios(`${BASE_URL}/property-list?${queryParams}`, config)
      .then((res) => {
        const value = res?.data?.properties;
        setPropertyData(value?.data || []);
        setPaginationData({
          totalItems: value?.total ?? 0,
          from: value?.from ?? 0,
          to: value?.to ?? 0,
          totalPages: value?.last_page ?? 0,
        });
        // setFilterData(initialPropertyFilterData);
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
    fetchData(filterData);
  }, [sortDirection, sortBy]);

  useEffect(() => {
    onSuccess();
  }, [id, itemPerPage, currentPage]);

  const onSuccess = (filters) => {
    setLoading(true);
    if (filters) {
      fetchData(filters);
    } else {
      fetchData(filterData);
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
        <PropertyFilter
          filterData={filterData}
          onSetFilterData={(value) => {
            setFilterData(value);
          }}
          onCallApiAgain={(filters) => onSuccess(filters)}
        />

        {/* <p className="body-N green-H" role="button">
          Relate a Property
        </p> */}
      </div>

      <div className="light-bg-L pb-3 table-container">
        <div className={`${isSidebarCollapsed ? "tab-collapsed-width" : "tab-width"} table-info light-bg-L`}>
          {loading ? (
            <Loader />
          ) : propertyData?.length === 0 ? (
            <p className="body-N text-center">No properties available</p>
          ) : (
            <table className="contact-table light-bg-L">
              <thead>
                <tr className="uppercase body-N dark-M">
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
                        className="sort-icon"
                        alt="icon"
                      />
                    </div>
                  </th>
                  <th>
                    <div className="table-header">
                      Street Address
                      <img
                        role="button"
                        src={sortBy !== "street_address" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        alt="icon"
                        className="sort-icon"
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
                        className="sort-icon"
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
                        className="sort-icon"
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
                {propertyData?.map((el) => (
                  <tr key={el.id} className="body-N dark-H">
                    <td className="head-5" role="button" onClick={() => navigate(`/property/${el.id}`)}>
                      {el.property_name}
                    </td>
                    <td>{el.street_address}</td>
                    <td>{el.city}</td>
                    <td>{el.state}</td>
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
      </div>

      {propertyData?.length !== 0 && <ContactPagination from="property" paginationData={paginationData} handleNext={handleNext} handlePrev={handlePrev} onSuccess={onSuccess} />}
    </div>
  );
};

export default PropertyTab;
