import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useSelector } from "react-redux";
import moment from "moment";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import Chartbar from "./components/Chartbar";
import Loader from "../../components/Loader";
import { BASE_URL } from "../../utils/Element";
import BaseLayout from "../../layouts/BaseLayout";
import Closedlogo from "../../assets/svgs/closed.svg";
import DataContainer from "./components/DataContainer";
import DashboardFilter from "./components/DashboardFilter";
import buyerLogo from "../../assets/svgs/active-buyer.svg";
import Proposalslogo from "../../assets/svgs/proposals.svg";
import Exclusiveslogo from "../../assets/svgs/exclusives.svg";
import Totalleadslogo from "../../assets/svgs/total-leads.svg";
import CircleProgressChart from "./components/CircleProgressChart";
import Undercontractlogo from "../../assets/svgs/under-contract.svg";
import propertyLogo from "../../assets/svgs/off-market-property.svg";

const Dashboard = () => {
  const [config] = useAuth();
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState();
  const userDetails = useSelector((state) => state.userDetails);
  const [selectedFilter, setSelectedFilter] = useState("0");
  const [filterData, setFilterData] = useState({ startDate: moment().startOf("month")?.format(), endDate: moment().endOf("month")?.format() });

  const tabData = [
    { name: "Total Leads", value: dashboardData?.lead?.toLocaleString(), logo: Totalleadslogo, link: "/leads" },
    { name: "Proposals", value: dashboardData?.proposal?.toLocaleString(), logo: Proposalslogo, link: "/proposals" },
    { name: "Exclusives", value: dashboardData?.exclusive?.toLocaleString(), logo: Exclusiveslogo, link: "/exclusives" },
    { name: "Under Contract", value: dashboardData?.undercontract?.toLocaleString(), logo: Undercontractlogo, link: "/under-contract" },
    { name: "Closed", value: dashboardData?.close?.toLocaleString(), logo: Closedlogo, link: "/closed" },
  ];

  const fetchDashboardData = () => {
    setLoading(true);

    axios
      .get(`${BASE_URL}/dashboard-count?start_date=${filterData?.startDate}&end_date=${filterData?.endDate}`, config)
      .then((res) => {
        setDashboardData(res?.data);
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (selectedFilter !== "custom") {
      fetchDashboardData();
    }
  }, [selectedFilter]);

  return (
    <div className="dashboard_only">
      <BaseLayout>
        <div className="flex justify-between items-center">
          <p className="head-1 dark-H capitalize">
            Welcome Home, {userDetails?.first_name} {userDetails?.last_name}
          </p>

          <DashboardFilter
            filterData={filterData}
            selectedFilter={selectedFilter}
            onSetSelectedFilter={(value) => setSelectedFilter(value)}
            onSetFilterData={(value) => {
              setFilterData(value);
            }}
            onSuccess={fetchDashboardData}
          />
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="container-non mx-auto mt-5">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {tabData?.flatMap((el, idx) => (
                <div key={idx} className="md:col-span-1">
                  <DataContainer logo={el.logo} text={el.name} value={el.value} link={el.link} />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-4 grid_class">
              <div className="col-span-1 md:col-span-1 h-[100%] progressor">
                <CircleProgressChart dashboardData={dashboardData} />
              </div>

              <div className="col-span-1 md:col-span-1 h-[100%]">
                <div className="md:w-full flex gap-4">
                  <div className="w-full md:w-1/2">
                    <DataContainer logo={propertyLogo} text="Off-Market Properties" value={dashboardData?.properties?.toLocaleString()} link="/properties" />
                  </div>
                  <div className="w-full md:w-1/2">
                    <DataContainer logo={buyerLogo} text="Total Active Buyers" value={dashboardData?.buyer?.toLocaleString()} link="/buyers" />
                  </div>
                </div>

                <div className="w-full mt-3 grid_class">
                  <Chartbar />
                </div>
              </div>
            </div>
          </div>
        )}
      </BaseLayout>
    </div>
  );
};

export default Dashboard;
