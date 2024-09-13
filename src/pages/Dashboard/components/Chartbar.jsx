import React, { useEffect, useState } from "react";
import moment from "moment";
import DashboardFilter from "./DashboardFilter";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import { BASE_URL } from "../../../utils/Element";
import { NotificationManager } from "react-notifications";

const BarChartdata = () => {
  const [config] = useAuth();
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState([]);
  const [filterData, setFilterData] = useState(moment().year());

  const currentMonth = moment().format("MMM YYYY");

  const fetchDashboardData = () => {
    setLoading(true);

    axios
      .get(`${BASE_URL}/dashboard-count?year=${filterData}`, config)
      .then((res) => {
        const value = res?.data?.smartPlan;
        const data = value?.map((el) => ({ name: `${el?.month} ${filterData}`, count: el?.count }));
        setDashboardData(data);
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboardData();
  }, [filterData]);

  const data = [
    { name: `Jan ${filterData}`, count: 300 },
    { name: `Feb ${filterData}`, count: 600 },
    { name: `Mar ${filterData}`, count: 500 },
    { name: `Apr ${filterData}`, count: 700 },
    { name: `May ${filterData}`, count: 800 },
    { name: `Jun ${filterData}`, count: 1000 },
    { name: `Jul ${filterData}`, count: 700 },
    { name: `Aug ${filterData}`, count: 300 },
    { name: `Sep ${filterData}`, count: 600 },
    { name: `Oct ${filterData}`, count: 500 },
    { name: `Nov ${filterData}`, count: 800 },
    { name: `Dec ${filterData}`, count: 1000 },
  ];

  const barWidth = 30;

  const customYTicks = [0, 10, 50, 100, 200, 500, 1000, 2000];

  const renderCustomBar = (props) => {
    const { x, y, width, height, fill, payload } = props;

    // Change color to #2D5B30 for current month, otherwise use default color
    const color = payload.name === currentMonth ? "#2D5B30" : "#D1DBCF";
    return <rect x={x} y={y} width={width} height={height} fill={color} />;
  };

  return (
    <div className="light-bg-L p-3 rounded-md h-[100%]">
      <div className="flex justify-between mb-5">
        <div className="flex items-center">
          <span className="head-2 dark-H">Total Active 8x8s</span>
        </div>

        <DashboardFilter type="year" filterData={filterData} onSetFilterData={(value) => setFilterData(value)} />
      </div>

      <ResponsiveContainer width="100%" height={374}>
        <BarChart className="dark-M body-S" data={dashboardData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid stroke="#efefef" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} /> {/* Hide axis line and tick line */}
          <YAxis tick={customYTicks} axisLine={false} tickLine={false} /> {/* Custom ticks */}
          <Tooltip formatter={(value) => [`${value}`]} />
          <Bar dataKey="count" shape={renderCustomBar} barSize={barWidth} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartdata;
