import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useNavigate, useParams } from "react-router-dom";
import { IoAdd as AddIcon } from "react-icons/io5";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";
import { BASE_URL } from "../../utils/Element";
import clock from "../../assets/icons/clock.svg";
import badge from "../../assets/icons/badge.svg";
import house from "../../assets/icons/House.svg";
import BaseLayout from "../../layouts/BaseLayout";
import Edit2 from "../../assets/svgs/Pencil 2.svg";
import home from "../../assets/icons/Group 574.svg";
import dollar from "../../assets/icons/dollar 2.svg";
import key from "../../assets/icons/key-variant.svg";
import Circle from "../../assets/svgs/Ellipse 6.svg";
import building from "../../assets/icons/Building.svg";
import calendar from "../../assets/icons/calendar.svg";
import DeleteIcon from "../../assets/svgs/delete 2.svg";
import polygon from "../../assets/svgs/Polygon-grey.svg";
import LeftIcon from "../../assets/svgs/leftArrowIcon.svg";
import RightIcon from "../../assets/svgs/rightArrowIcon.svg";
import percentage from "../../assets/icons/percentage 2.svg";
import SearchDropdownList from "../../components/SearchDropdownList";
import PropertyDetailHeader from "./components/PropertyDetailHeader";
import AddPropertyHistoryModal from "./Propertymodal/AddPropertyHistoryModal";
import EditPropertyHistoryModal from "./Propertymodal/EditPropertyHistoryModal";
import DeleteConfirmationModal from "../../components/ConfirmationModals/DeleteConfirmationModal";
import moment from "moment";

const PropertyDetails = () => {
  const [config] = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editactmodal, setEditactmodal] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState({});
  const [propertyhistory, setPropertyhistory] = useState([]);
  const [deleteactmodal, setDeleteactmodal] = useState(false);
  const [selectedPropertyHistory, setSelectedPropertyHistory] = useState(null);

  const propertyData = [
    { icon: home, amount: propertyDetails?.building_size ?? "N/A", title: "Building Size" },
    { icon: house, amount: propertyDetails?.land_size ?? "N/A", title: "Land Size" },
    { icon: building, amount: propertyDetails?.lease_type ?? "N/A", title: "Lease Type" },
  ];

  const leaseData = [
    { icon: badge, date: propertyDetails?.lease_commencement_date || "N/A", title: "Lease Commencement Date" },
    { icon: key, date: propertyDetails?.lease_expiration_date || "N/A", title: "Lease Expiration Date" },
    { icon: clock, date: propertyDetails?.lease_term_remaining || "0 Day", title: "Lease Term Remaining" },
    { icon: calendar, date: propertyDetails?.anual_rent ? `$${propertyDetails?.anual_rent}` : "N/A", title: "Annual Rent/NOI" },
    { icon: percentage, date: propertyDetails?.asking_cap_rate ? `${propertyDetails.asking_cap_rate}% ` : "N/A", title: "Asking Cap Rate" },
    { icon: dollar, date: propertyDetails?.asking_price ? `$${propertyDetails?.anual_rent}` : "N/A", title: "Asking Price" },
  ];

  const fetchPropertyDetails = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/property-getbyid/${id}`, config)
      .then((res) => {
        setPropertyDetails(res?.data?.data);
        setLoading(false);
        // if (res?.data?.message) {
        //   NotificationManager.success(res?.data?.message);
        // }
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const fetchPropertyHistory = () => {
    axios
      .get(`${BASE_URL}/property-history-list?page=1&per_page=10&property_id=${id}`, config)
      .then((res) => {
        setPropertyhistory(res?.data?.data?.propertyhistories?.data || []);
        // if (res?.data?.message) {
        //   NotificationManager.success(res?.data?.message);
        // }
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  useEffect(() => {
    fetchPropertyHistory();
    fetchPropertyDetails();
  }, [id]);

  const handleDelete = (propertyHistoryData) => {
    setSelectedPropertyHistory(propertyHistoryData);
    setDeleteactmodal(true);
  };

  const handlePropertyHistoryAdded = () => {
    fetchPropertyHistory();
  };

  const handleEditPropertyHistory = (propertyHistoryData) => {
    setSelectedPropertyHistory(propertyHistoryData);
    setEditactmodal(true);
  };

  const handleDeletePropertyHistory = () => {
    axios
      .delete(`${BASE_URL}/delete-propertyhistory/${selectedPropertyHistory?.id}`, config)
      .then((res) => {
        if (res.data.success) {
          fetchPropertyHistory();
          setDeleteactmodal(false);
          if (res?.data?.message) {
            NotificationManager.success(res?.data?.message);
          }
        }
      })
      .catch((error) => {
        if (error.response?.data?.message) {
          NotificationManager.error(error.response?.data?.message);
        }
      });
  };

  return (
    <BaseLayout>
      <div className="flex justify-between items-center">
        <p role="button" className="green-H head-5 underline" onClick={() => navigate("/properties")}>
          Back to Properties
        </p>

        <div className="body-S dark-M flex items-center gap-5">
          {propertyDetails?.previous_id !== null && (
            <div role="button" onClick={() => navigate(`/property/${propertyDetails?.previous_id}`)} className="flex items-center gap-2">
              <img src={LeftIcon} alt="" />
              Previous Property
            </div>
          )}

          {propertyDetails?.next_id !== null && (
            <div role="button" onClick={() => navigate(`/property/${propertyDetails?.next_id}`)} className="flex items-center gap-2">
              Next Property
              <img src={RightIcon} alt="" />
            </div>
          )}
        </div>

        <SearchDropdownList from="property" />
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="contact-details light-bg-L">
          <PropertyDetailHeader propertydata={propertyDetails} />

          <div className="md:flex gap-5 mt-6">
            <div className="">
              <p className="dark-M body-L">LEASE INFORMATION</p>
              <div className="md:flex flex-wrap gap-4 mt-2">
                {leaseData.map((el, idx) => (
                  <div key={idx} className="lease-info-card light-bg-L mt-5 md:mt-0">
                    <img src={el.icon} alt="" className="green-bg-H mx-auto" />
                    <p className="head-2 dark-H mt-4 ">{el.date}</p>
                    <p className="body-N dark-M ">{el.title}</p>
                  </div>
                ))}
              </div>

              <p className="dark-M body-L mt-8">PROPERTY INFORMATION</p>
              <div className="flex flex-wrap gap-4 mt-2">
                {propertyData.map((el, idx) => (
                  <div key={idx} className="lease-info-card light-bg-L">
                    <img src={el.icon} alt="" className="green-bg-H mx-auto" />
                    <p className="head-2 dark-H mt-4 ">{el.amount}</p>
                    <p className="body-N dark-M ">{el.title}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-4 md:w-[42%] mt-8 md:mt-0" style={{ borderLeft: "1px solid #EDF0EB" }}>
              <div className="flex justify-between">
                <p className="dark-H head-3">Property History</p>
                <p
                  role="button"
                  className="dark-M body-N flex items-center"
                  onClick={() => {
                    setShowModal(true);
                  }}
                >
                  <AddIcon size={20} /> Add
                </p>
              </div>

              <div className="property-history-info mt-6">
                {propertyhistory.length === 0 ? (
                  <p className="text-center">No property history</p>
                ) : (
                  propertyhistory.map((el, idx) => (
                    <div key={el.id} className="pl-4 flex items-start mt-8 relative ">
                      <img src={Circle} alt="icon" className="absolute top-3 -left-[6px]" />
                      <img src={polygon} alt="icon" className="mt-3" />
                      <div className="light-bg-H card-info flex justify-between items-center gap-2 w-[100%]">
                        <div>
                          <p className="dark-H head-4">$ {el.sold_price?.toLocaleString()}</p>
                          <p className="body-N dark-M">{moment(el.sold_date).format("MM/DD/YYYY")}</p>
                        </div>
                        <div className="flex gap-1">
                          <img role="button" src={DeleteIcon} alt="" onClick={() => handleDelete(el)} />
                          <img role="button" src={Edit2} alt="" onClick={() => handleEditPropertyHistory(el)} />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <AddPropertyHistoryModal
        showModal={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        onPropertyHistoryAdded={handlePropertyHistoryAdded}
      />

      <EditPropertyHistoryModal
        showModal={editactmodal}
        onClose={() => {
          setEditactmodal(false);
        }}
        onPropertyHistoryAdded={handlePropertyHistoryAdded}
        selectedPropertyHistory={selectedPropertyHistory}
      />

      <DeleteConfirmationModal
        showModal={deleteactmodal}
        onClose={() => {
          setDeleteactmodal(false);
        }}
        handleDelete={handleDeletePropertyHistory}
      />
    </BaseLayout>
  );
};

export default PropertyDetails;
