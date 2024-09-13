import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import AddOfferModal from "./AddOfferModal";
import Loader from "../../components/Loader";
import EditOfferModal from "./EditOfferModal";
import Plus from "../../assets/svgs/Plus.svg";
import { BASE_URL } from "../../utils/Element";
import BaseLayout from "../../layouts/BaseLayout";
import contact from "../../assets/images/contact.png";
import ActionsMenu from "../../components/ActionsMenu";
import swap from "../../assets/svgs/swap-vertical.svg";
import sortAsce from "../../assets/svgs/sort-ascending.svg";
import sortDesc from "../../assets/svgs/sort-descending.svg";
import ContactPagination from "../../components/Pagination/ContactPagination";
import DeleteConfirmationModal from "../../components/ConfirmationModals/DeleteConfirmationModal";
import { initialOfferFilterData } from "../../utils/initialData";
import OfferFilter from "./components/OfferFilter";
import { getPercentAskingPrice } from "../../utils/utils";

const Offers = () => {
  const [config] = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [leadId, setleadId] = useState("");
  const [loading, setLoading] = useState(true);
  const [offersData, setOffersData] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const isSidebarCollapsed = useSelector((state) => state.isSidebarCollapsed);
  const [paginationData, setPaginationData] = useState({ totalItems: 0, from: 0, to: 0, totalPages: 0 });
  const [filterData, setFilterData] = useState(initialOfferFilterData);

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

  const buildQueryParams = (filters) => {
    let params = `page=${currentPage}&per_page=${itemPerPage}&search=${search}`;

    const { associate, contact, property_name, property_address, created_at, created_end_date, created_start_date, city, state, zip_code, offer_from, deal_type, offer_type, noi, offer_cap_rate, offer_price, min_asking_cap_rate, max_asking_cap_rate, min_asking_price, max_asking_price, percent_of_asking_price } = filters;

    if (associate) {
      params += `&broker=${encodeURIComponent(associate)}`;
    }
    if (contact?.id !== "") {
      params += `&contact=${encodeURIComponent(contact?.id)}`;
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
        // if (res?.data?.message) {
        //   NotificationManager.success(res?.data?.message);
        // }
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
  }, [search, currentPage, itemPerPage]);

  const onSuccess = (filters) => {
    setLoading(true);
    if (filters) {
      fetchOffers(filters);
    } else {
      fetchOffers(filterData);
    }
  };

  const handleDelete = () => {
    axios
      .delete(`${BASE_URL}/delete-offer/${selectedId}`, config)
      .then((res) => {
        setSelectedId("");
        onSuccess();
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
    <BaseLayout>
      <div className="contact-header">
        <p className="head-1 dark-H">Offers</p>
        <div className="md:flex block gap-4 items-center">
          <div className="flex gap-4 justify-between items-center">
            <OfferFilter
              filterData={filterData}
              onSetFilterData={(value) => {
                setFilterData(value);
              }}
              onCallApiAgain={(filters) => onSuccess(filters)}
            />
            <div className="search-box contacts">
              <input
                type="text"
                className="body-S"
                placeholder="Search name, address, city, state"
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
                setSelectedId("");
                setShowAddModal(true);
              }}
            >
              <img className="mr-2" src={Plus} alt="plus" /> Add
            </button>
          </div>
        </div>
      </div>

      <div className="light-bg-L pb-3 table-container">
        <div className={`${isSidebarCollapsed ? "collapsed-width" : "width"} table-info light-bg-L`}>
          {loading ? (
            <Loader />
          ) : offersData?.length === 0 ? (
            <p className="body-N text-center mt-6 p-10">No Offers Available</p>
          ) : (
            <table className="contact-table light-bg-L">
              <thead>
                <tr className="uppercase body-N dark-M">
                  <th>
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
                  {/* <th>
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
                  </th> */}
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
                  <th>
                    <div className="table-header">
                      Initial or Counter
                      <img
                        role="button"
                        src={sortBy !== "type" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("type");
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
                      Noi
                      <img
                        role="button"
                        src={sortBy !== "anual_rent" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("anual_rent");
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
                      Offer Cap Rate
                      <img
                        role="button"
                        src={sortBy !== "offer_cap_rate" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("offer_cap_rate");
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
                      Offer Price
                      <img
                        role="button"
                        src={sortBy !== "offer_price" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("offer_price");
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
                      Asking Cap Rate
                      <img
                        role="button"
                        src={sortBy !== "asking_cap_rate" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("asking_cap_rate");
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
                      Asking Price
                      <img
                        role="button"
                        src={sortBy !== "asking_price" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("asking_price");
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
                      % Asking Price
                      <img
                        role="button"
                        src={sortBy !== "percent_of_asking_price" ? swap : sortDirection === "desc" ? sortDesc : sortAsce}
                        onClick={() => {
                          setSortBy("percent_of_asking_price");
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
                    <div className="table-header">More</div>
                  </th>
                </tr>
              </thead>

              <tbody>
                {offersData?.map((el, idx) => (
                  <tr key={idx} className="dark-H body-N">
                    <td
                      className="capitalize"
                      role={el?.lead_id ? "button" : ""}
                      onClick={() => {
                        if (el?.lead_id) {
                          navigate(`/user/${el?.lead?.broker?.id}`);
                        }
                      }}
                    >
                      {el?.lead?.broker?.first_name} {el?.lead?.broker?.last_name}
                    </td>
                    <td
                      className="head-5 capitalize"
                      role="button"
                      onClick={() => {
                        navigate(`/property/${el?.property_id}`);
                      }}
                    >
                      {el?.property?.property_name}
                    </td>
                    {/* <td className="dark-M body-S capitalize">{el?.property?.street_address}</td> */}
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
                      <img src={contact} alt="contact icon" className="icon-class w-4 h-4" />
                      {el?.property?.owner?.name}
                    </td>
                    <td>{el?.lead_id ? (el?.lead?.lead_type === 0 ? "Disposition" : "Acquisition") : "Disposition"}</td>
                    <td>{moment(el?.created_at).format("MM/DD/YY")}</td>
                    <td className="flex items-center gap-2">
                      <p className="tags green-H body-S capitalize">{el?.type} Counter</p>
                    </td>
                    <td>{el?.property?.anual_rent ? `$ ${el?.property?.anual_rent?.toLocaleString()}` : ""}</td>
                    <td className="text-center">{el?.offer_cap_rate ? `${el?.offer_cap_rate?.toLocaleString()} %` : ""}</td>
                    <td>{el?.offer_price ? `$ ${el?.offer_price?.toLocaleString()}` : ""}</td>
                    <td className="text-center">{el?.property?.asking_cap_rate ? `${el?.exclusive?.property?.asking_cap_rate?.toLocaleString()} %` : ""}</td>
                    <td className="text-center">{el?.property?.asking_price ? `$ ${el?.exclusive?.property?.asking_price?.toLocaleString()}` : ""}</td>
                    <td className="text-center">{el?.percent_of_asking_price ? `${el?.percent_of_asking_price?.toLocaleString()} %` : ""}</td>

                    <td className="flex gap-3 items-center w-full justify-center">
                      <ActionsMenu
                        handleEdit={() => {
                          setShowEditModal(true);
                          setSelectedId(el?.id);
                          setleadId(el?.lead_id);
                        }}
                        handleDelete={() => {
                          setSelectedId(el?.id);
                          setShowDeleteModal(true);
                        }}
                        showOtherOption={true}
                        otherOptionTitle={"New Counter Offer"}
                        handleOtherOption={() => {
                          setShowAddModal(true);
                          setSelectedId(el?.id);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <ContactPagination paginationData={paginationData} handleNext={handleNext} handlePrev={handlePrev} onSuccess={onSuccess} />
      </div>

      <AddOfferModal
        showModal={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCallApi={() => {
          setSelectedId("");
          onSuccess();
        }}
        id={selectedId}
      />

      <EditOfferModal
        showModal={showEditModal}
        onClose={() => setShowEditModal(false)}
        id={selectedId}
        onCallApi={() => {
          setSelectedId("");
          onSuccess();
        }}
      />

      <DeleteConfirmationModal showModal={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleDelete={handleDelete} />
    </BaseLayout>
  );
};

export default Offers;
