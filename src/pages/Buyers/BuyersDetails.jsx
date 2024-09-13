import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";
import { BASE_URL } from "../../utils/Element";
import badge from "../../assets/icons/badge.svg";
import BaseLayout from "../../layouts/BaseLayout";
import dollar from "../../assets/icons/dollar 2.svg";
import key from "../../assets/icons/key-variant.svg";
import calendar from "../../assets/icons/calendar.svg";
import LeftIcon from "../../assets/svgs/leftArrowIcon.svg";
import percentage from "../../assets/icons/percentage 2.svg";
import RightIcon from "../../assets/svgs/rightArrowIcon.svg";
import BuyersDetailsHeader from "./components/BuyersDetailsHeader";

const BuyersDetails = () => {
  const { id } = useParams();
  const [config] = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [buyerData, setBuyerData] = useState();

  const fetchDetails = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/acquisition-getbyid/${id}`, config)
      .then((res) => {
        const value = res?.data?.data;
        setBuyerData(value);
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
    fetchDetails();
  }, [id]);

  const leaseData = [
    { icon: badge, date: buyerData?.availability_status === 0 ? "Off Market" : "On Market", title: "Availability Status" },
    { icon: key, date: buyerData?.buyer_status === 0 ? "Pipeline" : buyerData?.buyerStatus, title: "Buyer Status" },
    { icon: calendar, date: buyerData?.updated_at ? moment(buyerData?.updated_at).format("MM/DD/YYYY") : "N/A", title: "Criteria Update Date" },
    { icon: calendar, date: buyerData?.min_lease_term_reamaining ? moment(buyerData?.min_lease_term_reamaining).format("MM/DD/YYYY") : "N/A", title: "Min Lease Term Reamaining" },
    { icon: dollar, date: buyerData?.min_price?.toLocaleString(), title: "Min Price" },
    { icon: dollar, date: buyerData?.max_price?.toLocaleString(), title: "Max Price" },
    { icon: percentage, date: buyerData?.min_asking_cap_rate, title: "Asking Cap Rate" },
  ];

  return (
    <BaseLayout>
      <div className="flex justify-between items-center">
        <p role="button" className="green-H head-5 underline" onClick={() => navigate("/buyers")}>
          Back to Buyers
        </p>

        <div className="body-S dark-M flex items-center gap-5">
          {buyerData?.previous_id !== null && (
            <div role="button" onClick={() => navigate(`/buyer/${buyerData?.previous_id}`)} className="flex items-center gap-2">
              <img src={LeftIcon} alt="" />
              Previous Buyer
            </div>
          )}

          {buyerData?.next_id !== null && (
            <div role="button" onClick={() => navigate(`/buyer/${buyerData?.next_id}`)} className="flex items-center gap-2">
              Next Buyer
              <img src={RightIcon} alt="" />
            </div>
          )}
        </div>

        <div className="search-box contacts">
          <input type="text" className="body-S" placeholder="Search Property" style={{ border: "1px solid #D8D8D8" }} />
          <span className="icon-search"></span>
        </div>
      </div>

      <div className="contact-details light-bg-L">
        {loading ? (
          <Loader />
        ) : (
          <>
            <BuyersDetailsHeader buyerData={buyerData} onCallApi={fetchDetails} />

            <div className="md:flex gap-5 mt-6">
              <div className="">
                <p className="dark-M body-L">LEASE INFORMATION</p>
                <div className="md:flex flex-wrap gap-4 mt-2">
                  {leaseData.flatMap((el, idx) => (
                    <div key={idx} className="lease-info-card light-bg-L mt-5 md:mt-0">
                      <img src={el.icon} alt="" className="green-bg-H mx-auto" />
                      <p className="head-2 dark-H mt-4 ">{el.date}</p>
                      <p className="body-N dark-M ">{el.title}</p>
                    </div>
                  ))}
                </div>

                {/* <p className="dark-M body-L mt-8">PROPERTY INFORMATION</p>
                <div className="flex flex-wrap gap-4 mt-2">
                  {propertyData.flatMap((el, idx) => (
                    <div key={idx} className="lease-info-card light-bg-L">
                      <img src={el.icon} alt="" className="green-bg-H mx-auto" />
                      <p className="head-2 dark-H mt-4 ">{el.amount}</p>
                      <p className="body-N dark-M ">{el.title}</p>
                    </div>
                  ))}
                </div> */}
              </div>

              {/* <div className="px-4 md:w-[42%] mt-8 md:mt-0" style={{ borderLeft: "1px solid #EDF0EB" }}>
                <div className="flex justify-between">
                  <p className="dark-H head-3">Property History</p>
                  <p role="button" className="dark-M body-N flex items-center">
                    <AddIcon size={20} /> Add
                  </p>
                </div>

                <div className="property-history-info mt-6">
                  {propertyHistoryData.flatMap((el, idx) => (
                    <div key={idx} className="pl-4 flex items-start mt-8 relative">
                      <img src={Circle} alt="icon" className="absolute top-3 -left-[6px]" />
                      <img src={polygon} alt="icon" className="mt-3" />
                      <div className="light-bg-H card-info flex justify-between items-center gap-2">
                        <div>
                          <p className="dark-H head-4">$ {el.amount}</p>
                          <p className="body-N dark-M">{el.date}</p>
                        </div>
                        <div className="flex gap-1">
                          <img role="button" src={DeleteIcon} alt="" />
                          <img role="button" src={Edit2} alt="" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div> */}
            </div>
          </>
        )}
      </div>
    </BaseLayout>
  );
};

export default BuyersDetails;
