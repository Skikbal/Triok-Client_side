import React, { useEffect, useState } from "react";
import { Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { NotificationManager } from "react-notifications";
import { useLocation } from "react-router-dom";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { BASE_URL } from "../../../utils/Element";
import { filterTabData, filterThreeTabData } from "../../../utils/options";
import SearchDropdown from "../../../components/Dropdowns/SearchDropdown";
import FilterTabData from "../../../components/FilterComponents/FilterTabData";
import OptionalOption from "../../../components/FilterComponents/OptionalOption";
import FilterFieldHeader from "../../../components/FilterComponents/FilterFieldHeader";
import FilterSearchSection from "../../../components/FilterComponents/FilterSearchSection";
import CheckboxSearchOptions from "../../../components/FilterComponents/CheckboxSearchOptions";

const ContactFilterData = ({ isSidebarOpen, filterData, onSetFilterData }) => {
  const [config] = useAuth();
  const location = useLocation();
  const [companyOptions, setCompanyOptions] = useState([]);
  const [contactTagOptions, setContactTagOptions] = useState([]);
  const [leadSourcesOptions, setLeadSourcesOptions] = useState([]);

  const isCompany = location.pathname.includes("company");

  const fetchLeadSources = () => {
    axios
      .get(`${BASE_URL}/get-datalisting?list=lead_sources`, config)
      .then((res) => {
        const value = res?.data?.data?.lead_sources;
        setLeadSourcesOptions(value?.map((el) => ({ value: el?.id, label: el?.name, category: el?.category })));
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const handleFilterChange = (value, name) => {
    onSetFilterData({ ...filterData, [name]: value });
  };

  const fetchSuggestions = (inputValue) => {
    if (inputValue !== "") {
      axios
        .get(`${BASE_URL}/get-datalisting?list=companies&search=${inputValue}`, config)
        .then((res) => {
          const value = res?.data?.data?.company_list;
          setCompanyOptions(
            value?.map((data) => ({
              value: data.id,
              label: data.company_name,
            }))
          );
        })
        .catch((err) => {
          if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
            NotificationManager.error(err.response?.data?.message);
          }
        });
    } else {
      setCompanyOptions([]);
    }
  };

  const fetchContactTags = () => {
    axios
      .get(`${BASE_URL}/get-datalisting?list=contact_tags`, config)
      .then((res) => {
        const value = res?.data?.data?.contact_tags;
        setContactTagOptions(value?.map((el) => ({ value: el?.id, label: el?.tag_name })));
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  useEffect(() => {
    if (isSidebarOpen) {
      fetchLeadSources();
      fetchContactTags();
    }
  }, [isSidebarOpen]);

  const lastupdatehandler = () => {
    onSetFilterData({ ...filterData, last_contact: "date", lastContactSentDate: "" });
  };

  console.log("filterData", filterData);

  return (
    <div className="">
      {isCompany ? null : (
        <>
          <div>
            <p className="head-4 dark-H">Company</p>

            <div className="mt-4 flex-1">
              <SearchDropdown
                placeholder="search company here"
                text={filterData?.company?.name}
                options={companyOptions}
                fetchSuggestions={fetchSuggestions}
                onSetOptions={(value) => setCompanyOptions(value)}
                handleSelect={(option) => {
                  onSetFilterData({ ...filterData, company: { id: option?.value, name: option?.label } });
                  setCompanyOptions([]);
                }}
              />
            </div>
          </div>

          <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />
        </>
      )}

      <div className="flex gap-2">
        <FilterSearchSection
          type="text"
          title={"First Name"}
          placeholder={"write here"}
          value={filterData?.first_name}
          onChange={(e) => {
            handleFilterChange(e.target.value, "first_name");
          }}
        />

        <FilterSearchSection
          type="text"
          title={"Last Name"}
          placeholder={"write here"}
          value={filterData?.last_name}
          onChange={(e) => {
            handleFilterChange(e.target.value, "last_name");
          }}
        />
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <FilterSearchSection
        type="email"
        title={"Primary Email"}
        placeholder={"write anything"}
        value={filterData?.email}
        onChange={(e) => {
          handleFilterChange(e.target.value, "email");
        }}
      />

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <FilterSearchSection
        type="number"
        title={"Primary Phone"}
        placeholder={"write anything"}
        value={filterData?.phone}
        onChange={(e) => {
          handleFilterChange(e.target.value, "phone");
        }}
      />

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <FilterFieldHeader
          title={"Address"}
          data={filterData?.street_address}
          type="string"
          handleCross={() => {
            handleFilterChange("", "street_address");
          }}
        />

        <div className="search-box w-[100%] mt-2">
          <input
            type="text"
            className="body-N"
            placeholder="write street address here"
            style={{ width: "100%" }}
            value={filterData?.street_address}
            onChange={(e) => {
              handleFilterChange(e.target.value, "street_address");
            }}
          />
          <span className="icon-search"></span>
        </div>

        <div className="flex flex-row gap-4 mt-2">
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
            />
          </div>
          <div className="search-box w-[30%]">
            <input
              type="number"
              className="body-N"
              placeholder="zip code"
              style={{ width: "100%" }}
              value={filterData?.zip_code}
              onChange={(e) => {
                handleFilterChange(e.target.value, "zip_code");
              }}
              onWheel={(e) => e.target.blur()}
            />
          </div>
        </div>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <FilterFieldHeader
          title={"Lead Source"}
          data={filterData?.leadsource_id?.length}
          type="array"
          handleCross={() => {
            handleFilterChange([], "leadsource_id");
          }}
        />

        <CheckboxSearchOptions
          handleChange={(value) => {
            handleFilterChange(value, "leadsource_id");
          }}
          selectedOptions={filterData?.leadsource_id}
          options={leadSourcesOptions}
        />
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

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

      <div className="flex gap-5 justify-between items-center">
        <p className="head-4 dark-H">First Deal Anniversary</p>
        <RadioGroup
          onChange={(value) => {
            handleFilterChange(value, "first_deal_anniversary");
          }}
          value={filterData?.first_deal_anniversary}
        >
          <Stack direction="row" gap={5}>
            <Radio value="yes">Yes</Radio>
            <Radio value="no">No</Radio>
          </Stack>
        </RadioGroup>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div className="flex gap-5 justify-between items-center">
        <p className="head-4 dark-H">Has Acquisition Criteria</p>
        <RadioGroup
          onChange={(value) => {
            handleFilterChange(value, "has_acquisition");
          }}
          value={filterData?.has_acquisition}
        >
          <Stack direction="row" gap={5}>
            <Radio value="yes">Yes</Radio>
            <Radio value="no">No</Radio>
          </Stack>
        </RadioGroup>
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

      <div>
        <div className="flex  justify-between items-center">
          <p className="head-4 dark-H">Tax Record Letter Sent</p>

          <RadioGroup
            onChange={(value) => {
              handleFilterChange(value, "tax_record_sent");
            }}
            value={filterData?.tax_record_sent}
          >
            <Stack direction="row" gap={5}>
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
            </Stack>
          </RadioGroup>
        </div>

        {filterData?.tax_record_sent === "yes" && (
          <OptionalOption
            activeTab="date"
            onSetLastDate={(value) => handleFilterChange(value, "tax_record_sent_date")}
            date={filterData?.tax_record_sent_date}
            onSetDateRange1={(value) => {
              handleFilterChange(value, "tax_record_start_date");
            }}
            date2={filterData?.tax_record_start_date}
            onSetDateRange2={(value) => handleFilterChange(value, "tax_record_end_date")}
            date3={filterData?.tax_record_end_date}
          />
        )}
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <FilterTabData
          title={"Tags"}
          tabData={filterTabData}
          activeTab={filterData?.tag_category}
          onSetActiveTab={(value) => {
            handleFilterChange(value, "tag_category");
          }}
        />

        <CheckboxSearchOptions
          handleChange={(value) => {
            handleFilterChange(value, "tags");
          }}
          selectedOptions={filterData?.tags}
          options={contactTagOptions}
        />
      </div>
    </div>
  );
};

export default ContactFilterData;
