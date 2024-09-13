import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { FiPlus as Plus } from "react-icons/fi";
import Loader from "../../../components/Loader";
import { BASE_URL } from "../../../utils/Element";
import account from "../../../assets/svgs/account.svg";
import AddOfferModal from "../../Offers/AddOfferModal";
import swap from "../../../assets/svgs/swap-vertical.svg";
import sortAsce from "../../../assets/svgs/sort-ascending.svg";
import sortDesc from "../../../assets/svgs/sort-descending.svg";
import ContactPagination from "../../../components/Pagination/ContactPagination";
import { initialOfferFilterData } from "../../../utils/initialData";
import OfferFilter from "../../Offers/components/OfferFilter";

const OffersTabData = () => {
  const { id } = useParams();
  const [config] = useAuth();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("id");
  const [loading, setLoading] = useState(true);
  const [offersData, setOffersData] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [sortDirection, setSortDirection] = useState("asc");
  const isSidebarCollapsed = useSelector((state) => state.isSidebarCollapsed);
  const [paginationData, setPaginationData] = useState({ totalItems: 0, from: 0, to: 0, totalPages: 0 });
  const [filterData, setFilterData] = useState(initialOfferFilterData);

  const buildQueryParams = (filters) => {
    let params = `contact_id=${id}&page=${currentPage}&per_page=${itemPerPage}`;

    const { associate, property_name, property_address, created_at, created_end_date, created_start_date, city, state, zip_code, offer_from, deal_type, offer_type, noi, offer_cap_rate, offer_price, min_asking_cap_rate, max_asking_cap_rate, min_asking_price, max_asking_price, percent_of_asking_price } = filters;

    if (associate) {
      params += `&broker=${encodeURIComponent(associate)}`;
    }
    if (property_name) {
      params += `&property_name=${encodeURIComponent(property_name)}`;
    }
    if (property_address) {
      params += `&property_address=${encodeURIComponent(property_address)}`;
    }
    if (created_at) {
      params += `&created_at=${encodeURIComponent(created_at)}`;
    }
    if (created_start_date) {
      params += `&created_start_date=${encodeURIComponent(created_start_date)}`;
    }
    if (created_end_date) {
      params += `&created_end_date=${encodeURIComponent(created_end_date)}`;
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
    if (offer_from) {
      params += `&offer_from=${encodeURIComponent(offer_from)}`;
    }
    if (deal_type) {
      params += `&deal_type=${encodeURIComponent(deal_type === "acquisition" ? 1 : 0)}`;
    }
    if (offer_type) {
      params += `&offer_type=${encodeURIComponent(offer_type)}`;
    }
    if (noi) {
      params += `&noi=${encodeURIComponent(noi)}`;
    }
    if (offer_cap_rate) {
      params += `&offer_cap_rate=${encodeURIComponent(offer_cap_rate)}`;
    }
    if (offer_price) {
      params += `&offer_price=${encodeURIComponent(offer_price)}`;
    }
    if (min_asking_cap_rate) {
      params += `&min_asking_cap_rate=${encodeURIComponent(min_asking_cap_rate)}`;
    }
    if (max_asking_cap_rate) {
      params += `&max_asking_cap_rate=${encodeURIComponent(max_asking_cap_rate)}`;
    }
    if (min_asking_price) {
      params += `&min_asking_price=${encodeURIComponent(min_asking_price)}`;
    }
    if (max_asking_price) {
      params += `&max_asking_price=${encodeURIComponent(max_asking_price)}`;
    }
    if (percent_of_asking_price) {
      params += `&percent_of_asking_price=${encodeURIComponent(percent_of_asking_price)}`;
    }
    if (sortDirection && sortBy !== "id") {
      params += `&sort_direction=${sortDirection}`;
    }
    if (sortBy !== "id") {
      params += `&sort_by=${sortBy}`;
    }

    return params;
  };

  const fetchOffers = (filters) => {
    const queryParams = buildQueryParams(filters);
    axios
      .get(`${BASE_URL}/offer-listing?${queryParams}`, config)
      .then((res) => {
        const value = res?.data?.Offerlist;
        setOffersData(value?.data || []);
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
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOffers(filterData);
  }, [sortDirection, sortBy]);

  useEffect(() => {
    onSuccess();
  }, [currentPage, itemPerPage]);

  const onSuccess = (filters) => {
    setLoading(true);
    if (filters) {
      fetchOffers(filters);
    } else {
      fetchOffers(filterData);
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
        <div>
          <OfferFilter
            filterData={filterData}
            onSetFilterData={(value) => {
              setFilterData(value);
            }}
            onCallApiAgain={(filters) => onSuccess(filters)}
          />
        </div>

        <p
          className="head-5 green-H flex items-center gap-1"
          role="button"
          onClick={() => {
            setShowModal(true);
            setSelectedId("");
          }}
        >
          <Plus /> Add Offer
        </p>
      </div>

      <div className="light-bg-L pb-3 table-container">
        <div className={`${isSidebarCollapsed ? "tab-collapsed-width" : "tab-width"} table-info light-bg-L`}>
          {loading ? (
            <Loader />
          ) : offersData?.length === 0 ? (
            <p className="body-N text-center mt-6 p-5">No Offers Available</p>
          ) : (
            <table className="contact-table light-bg-L" style={{ width: "100%" }}>
              <thead>
                <tr className="uppercase body-N dark-M">
                  {/* <th>
                    <div className="table-header">
                      Broker
                      <img
                        role="button"
                        src={sortBy !== "broker" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        alt="icon"
                        onClick={() => {
                          setSortBy("broker");
                          if (sortDirection === "desc") {
                            setSortDirection("asc");
                          } else {
                            setSortDirection("desc");
                          }
                        }}
                      />
                    </div>
                  </th> */}
                  <th className="green-H">
                    <div className="table-header">
                      Property Name
                      <img
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
                      Property Address
                      <img
                        role="button"
                        src={sortBy !== "street_address" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("street_address");
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
                      City
                      <img
                        role="button"
                        src={sortBy !== "city" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("city");
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
                      State
                      <img
                        role="button"
                        src={sortBy !== "state" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("state");
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
                      Offer From
                      <img
                        role="button"
                        src={sortBy !== "offer_from" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("offer_from");
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
                      Deal Type
                      <img
                        role="button"
                        src={sortBy !== "lead_type" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("lead_type");
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
                      Offer Date
                      <img
                        role="button"
                        src={sortBy !== "created_at" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("created_at");
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
                {offersData?.flatMap((el, idx) => (
                  <tr key={idx} className="body-N dark-H">
                    {/* <td
                      className="capitalize"
                      role="button"
                      onClick={() => {
                        navigate(`/user/${el?.lead?.broker?.id}`);
                      }}
                    >
                      {el?.lead?.broker?.first_name} {el?.lead?.broker?.last_name}
                    </td> */}
                    <td
                      className="head-5 capitalize"
                      role="button"
                      onClick={() => {
                        navigate(`/property/${el?.property_id}`);
                      }}
                    >
                      {el?.property?.property_name}
                    </td>
                    <td className="dark-M capitalize">{el?.property?.street_address}</td>
                    <td>{el?.property?.city}</td>
                    <td>{el?.property?.state}</td>
                    <td
                      className="flex items-center head-5 green-H gap-2 capitalize"
                      role="button"
                      onClick={() => {
                        if (el?.property?.owner_contact_id) {
                          navigate(`/contact/${el?.property?.owner_contact_id}`);
                        } else {
                          navigate(`/company/${el?.property?.owner_company_id}`);
                        }
                      }}
                    >
                      <img src={account} alt="contact icon" className="icon-class w-4 h-4" />
                      {el?.property?.owner?.name}
                    </td>
                    <td>{el?.lead_id ? (el?.lead?.lead_type === 0 ? "Disposition" : "Acquisition") : "Disposition"}</td>
                    <td>{moment(el?.created_at).format("MM/DD/YY")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <ContactPagination paginationData={paginationData} handleNext={handleNext} handlePrev={handlePrev} onSuccess={onSuccess} />
      </div>

      <AddOfferModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        onCallApi={() => {
          setSelectedId("");
          onSuccess();
        }}
        id={selectedId}
      />
    </div>
  );
};

export default OffersTabData;
