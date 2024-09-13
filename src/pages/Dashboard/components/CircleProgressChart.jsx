import React from "react";
import "../Dashboard.css";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const CircleProgressChart = ({ dashboardData }) => {
  const data = [
    { value: dashboardData?.contactsWithTagMet, name: "Met contacts", color: "#2D5B30" },
    { value: dashboardData?.contactsWithoutTagMet, name: "Have not met contacts", color: "#D1DBCF" },
  ];

  const totalContacts = Number(dashboardData?.contactsWithTagMet) + Number(dashboardData?.contactsWithoutTagMet);

  return (
    <div className="contact-circle light-bg-L rounded-md h-[100%]">
      <div className="row p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center animate__animated animate__fadeInDown animate__delay-2s" style={{ animationDuration: "1.5s", animationIterationCount: "1", animationFillMode: "forwards", animationName: "slideDown" }}>
            <span className="head-2 dark-H">Contacts</span>
          </div>
        </div>
      </div>

      <div className="mx-auto relative">
        <div className="flex justify-center">
          <div className="w-full md:w-3/4">
            <div className="row items-center relative">
              <ResponsiveContainer width="100%" height={390}>
                <PieChart>
                  <Pie data={data} dataKey="value" startAngle={90} endAngle={450} innerRadius={120} outerRadius={160} paddingAngle={0} label={false}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="number-Text dark-H">{totalContacts?.toLocaleString()}</div>
                  <div className="body-N dark-M">Total Contacts</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-[70px]">
        <div className="flex items-start">
          <div className="metdot mr-3"></div>
          <div>
            <div className="number-Text dark-H">{dashboardData?.contactsWithTagMet?.toLocaleString()}</div>
            <div className="body-N dark-M">Met Contacts</div>
          </div>
        </div>
        <div className="flex items-start">
          <div className="metdot2 mr-3"></div>
          <div>
            <div className="number-Text dark-H">{dashboardData?.contactsWithoutTagMet?.toLocaleString()}</div>
            <div className="body-N dark-M">Haven't Met Contacts</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircleProgressChart;
