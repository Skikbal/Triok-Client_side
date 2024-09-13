import React from "react";
import { RiArrowUpSLine as UpArrow } from "react-icons/ri";
import { Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { filterThreeTabData } from "../../../utils/options";
import FilterTabData from "../../../components/FilterComponents/FilterTabData";
import OptionalOption from "../../../components/FilterComponents/OptionalOption";
import FilterFieldHeader from "../../../components/FilterComponents/FilterFieldHeader";
import FilterSearchSection from "../../../components/FilterComponents/FilterSearchSection";

const tag = [
  { label: "Do Not Send", value: "do not send" },
  { label: "Do Not Blast", value: "do not blast" },
  { label: "Bad #", value: "bad" },
];

const CompanyFilterData = ({ filterData, handleFilterChange, onSetFilterData, isSidebarOpen }) => {
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    const newTags = checked ? [...filterData.tags, value] : filterData.tags.filter((tag) => tag !== value);
    handleFilterChange(newTags, "tags");
  };

  const lastupdatehandler = () => {
    onSetFilterData({ ...filterData, last_contact: "date", lastContactSentDate: "" });
  };

  return (
    <div className="">
      <FilterSearchSection
        type="text"
        title={"Company Name"}
        placeholder={"write here"}
        value={filterData?.company_name}
        onChange={(e) => {
          handleFilterChange(e.target.value, "company_name");
        }}
      />

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <FilterSearchSection
        type="number"
        title={"Primary Phone"}
        placeholder={"write phone"}
        value={filterData?.primaryphone}
        onChange={(e) => {
          handleFilterChange(e.target.value, "primaryphone");
        }}
      />

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <FilterFieldHeader
          title={"Address"}
          data={filterData?.streetaddress}
          type="string"
          handleCross={() => {
            handleFilterChange("", "streetaddress");
          }}
        />

        <div className="search-box w-[100%] mt-2">
          <input type="text" className="body-N" placeholder="write street address here" style={{ width: "100%" }} value={filterData?.streetaddress} onChange={(e) => handleFilterChange(e.target.value, "streetaddress")} />
          <span className="icon-search"></span>
        </div>

        <div className=" flex flex-row gap-4 mt-2">
          <div className="search-box w-[30%]">
            <input
              type="text"
              className="body-N"
              placeholder="city"
              style={{ width: "100%" }}
              value={filterData?.city}
              onChange={(e) => {
                handleFilterChange(e.target.value, "city");
              }}
              onWheel={(e) => e.target.blur()}
            />
          </div>
          <div className="search-box w-[30%]">
            <input
              type="text"
              className="body-N"
              placeholder="state"
              style={{ width: "100%" }}
              value={filterData?.state}
              onChange={(e) => {
                handleFilterChange(e.target.value, "state");
              }}
              onWheel={(e) => e.target.blur()}
            />
          </div>
          <div className="search-box w-[30%]">
            <input
              type="number"
              className="body-N"
              placeholder="zip code"
              style={{ width: "100%" }}
              value={filterData?.zip}
              onChange={(e) => {
                handleFilterChange(e.target.value, "zip");
              }}
              onWheel={(e) => e.target.blur()}
            />
          </div>
        </div>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <div className="flex gap-5 justify-between items-center">
          <p className="head-4 dark-H">Tax Record Letter Sent</p>

          <RadioGroup
            onChange={(value) => {
              handleFilterChange(value, "taxrecord");
            }}
            value={filterData?.taxrecord}
          >
            <Stack direction="row" gap={5}>
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
            </Stack>
          </RadioGroup>
        </div>

        {filterData?.taxrecord === "yes" && (
          <OptionalOption
            activeTab="date"
            onSetLastDate={(value) => {
              handleFilterChange(value, "taxrecordsentdate");
            }}
            date={filterData?.taxrecordsentdate}
            onSetDateRange1={(value) => handleFilterChange(value, "taxrecordsentSdate")}
            date2={filterData?.taxrecordsentSdate}
            onSetDateRange2={(value) => handleFilterChange(value, "taxrecordsentEdate")}
            date3={filterData?.taxrecordsentEdate}
          />
        )}
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <FilterTabData
          title={"Last Contacted"}
          tabData={filterThreeTabData}
          activeTab={filterData?.last_contact}
          onSetActiveTab={(value) => {
            handleFilterChange(value, "last_contact");
          }}
          lastDate={filterData?.lastContactSentDate}
          handleLastUpdate={lastupdatehandler}
        />
        <OptionalOption
          activeTab={filterData?.last_contact}
          onSetLastDate={(value) => {
            handleFilterChange(value, "lastContactSentDate");
          }}
          date={filterData?.lastContactSentDate}
          onSetDateRange1={(value) => handleFilterChange(value, "lastContactSentSdate")}
          date2={filterData?.lastContactSentSdate}
          onSetDateRange2={(value) => handleFilterChange(value, "lastContactSentEdate")}
          date3={filterData?.lastContactSentEdate}
          category={filterData?.date_category}
          onSetCategory={(value) => handleFilterChange(value, "date_category")}
          lastUp_days={filterData?.last_contact === "within_last" ? filterData?.within_last_day : filterData?.last_contact === "longer_than" ? filterData?.longer_than_day : ""}
          onSetDays={(value) => {
            if (filterData?.last_contact === "within_last") {
              onSetFilterData({ ...filterData, within_last_day: value, longer_than_day: "" });
            } else if (filterData?.last_contact === "longer_than") {
              onSetFilterData({ ...filterData, within_last_day: "", longer_than_day: value });
            } else {
              onSetFilterData({ ...filterData, within_last_day: "", longer_than_day: "" });
            }
          }}
        />
        <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />
      </div>

      <div className="flex gap-5 justify-between items-center">
        <p className="head-4 dark-H">Website</p>
        <RadioGroup
          onChange={(value) => {
            handleFilterChange(value, "website");
          }}
          value={filterData?.website}
        >
          <Stack direction="row" gap={5}>
            <Radio value="yes">Yes</Radio>
            <Radio value="no">No</Radio>
          </Stack>
        </RadioGroup>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <FilterFieldHeader
          title={"Tags"}
          data={filterData?.tags?.length}
          type="array"
          handleCross={() => {
            handleFilterChange([], "tags");
          }}
        />

        {/* <FilterTabData
          title={"Tags"}
          tabData={filterTabData}
          activeTab={filterData?.tagCategory}
          onSetActiveTab={(value) => {
            handleFilterChange(value, "tagCategory");
          }}
        /> */}
        {/* <div className="search-box w-[100%] mt-5">
          <input type="text" className="body-N" placeholder="Search tags here ...." style={{ width: "100%" }} />
          <span className="icon-search"></span>
        </div> */}

        <div className="mt-4">
          {tag.flatMap((el, idx) => (
            <label key={idx} className="container">
              <input type="checkbox" value={el.value} onChange={handleCheckboxChange} checked={filterData.tags.includes(el.value)} />
              <span className="checkmark"></span>
              <p className="tags green-H body-S">{el.label}</p>
            </label>
          ))}
        </div>
      </div>

      {/* <div className=" mt-8">
        <FilterFieldHeader
          title={"Tags"}
          data={filterData?.tags?.length}
          type="array"
          handleCross={() => {
            handleFilterChange([], "tags");
          }}
        />

        <div className="mt-6">
          {tag.flatMap((el, idx) => (
            <label key={idx} className="container">
              <input type="checkbox" value={el.value} onChange={handleCheckboxChange} checked={filterData.tags.includes(el.value)} />
              <span className="checkmark"></span>
              <p className="tags green-H body-S">{el.label}</p>
            </label>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default CompanyFilterData;
