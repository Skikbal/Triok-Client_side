import React from "react";
import Loader from "../Loader";
import MessageBox from "../MessageBox";
import circle from "../../assets/svgs/Ellipse.svg";
import polygon from "../../assets/svgs/Polygon.svg";

const UpdateTab = ({ activitydata, loading, hasMore }) => {
  return (
    <div>
      <div>
        {activitydata?.length !== 0 && activitydata !== undefined ? (
          activitydata?.flatMap(({ date, data }, idx) => (
            <div key={idx} className="px-6 updates-date-info">
              <div className="pb-8 relative">
                <img src={circle} alt="icon" className="absolute top-2.5 -left-[30px]" />
                <div className="flex" style={{ marginLeft: "-12px" }}>
                  <img src={polygon} alt="icon" />
                  <p className="date dark-M body-S" style={{ backgroundColor: "#edf0eb" }}>
                    {date}
                  </p>
                </div>
                <div className="pl-4">
                  {data.map((activity) => (
                    <MessageBox key={activity?.id} activity={activity} activityId={activity?.id} />
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center mt-5">No data available</p>
        )}

        {!hasMore && activitydata?.length !== 0 && <p className="text-center dark-M mt-6 body-S">End of Timeline</p>}
      </div>

      {loading && <Loader />}
    </div>
  );
};

export default UpdateTab;
