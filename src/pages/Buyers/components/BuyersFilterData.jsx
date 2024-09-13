import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { Radio, RadioGroup, Stack } from "@chakra-ui/react";
import axios from "axios";
import Select from "react-select";
import useAuth from "../../../hooks/useAuth";
import { BASE_URL } from "../../../utils/Element";
import dollor from "../../../assets/icons/dollar.svg";
import InputWithIcon from "../../../components/InputWithIcon";
import percentage from "../../../assets/icons/percentage.svg";
import { filterThreeTabData, stateOptions } from "../../../utils/options";
import FilterTabData from "../../../components/FilterComponents/FilterTabData";
import OptionalOption from "../../../components/FilterComponents/OptionalOption";
import FilterFieldHeader from "../../../components/FilterComponents/FilterFieldHeader";
import CheckboxSearchOptions from "../../../components/FilterComponents/CheckboxSearchOptions";

const leads = [
  { label: "NNN", value: "nnn" },
  { label: "NN", value: "nn" },
  { label: "Gross", value: "gross" },
  { label: "Ground", value: "Ground" },
  { label: "Leasehold", value: "leasehold" },
];

const BuyersFilterData = ({ filterData, onSetFilterData, isSidebarOpen }) => {
  const [config] = useAuth();
  const [tenantOptions, setTenantOptions] = useState([]);
  const [contactTagOptions, setContactTagOptions] = useState([]);
  const [propertyTypeOptions, setPropertyTypeOptions] = useState([]);

  const fetchTenants = () => {
    axios
      .get(`${BASE_URL}/get-datalisting?list=tenant`, config)
      .then((res) => {
        const value = res?.data?.data?.tenant;
        setTenantOptions(value?.map((el) => ({ value: el?.id, label: el?.tenant_name })));
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const fetchPropertyTypes = () => {
    axios
      .get(`${BASE_URL}/get-datalisting?list=property_types`, config)
      .then((res) => {
        const value = res?.data?.data?.property_types;
        setPropertyTypeOptions(value?.map((el) => ({ value: el?.id, label: el?.type })));
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
      fetchPropertyTypes();
      fetchTenants();
      fetchContactTags();
    }
  }, [isSidebarOpen]);

  const handleAskingPriceClear = () => {
    onSetFilterData({ ...filterData, min_price: "", max_price: "" });
  };

  const handleLastUpdateClear = () => {
    onSetFilterData({ ...filterData, last_update_date: "", last_update: "date" });
  };

  const handleChange = (value, name) => {
    onSetFilterData({ ...filterData, [name]: value });
  };

  const handleLandlordTags = (e) => {
    const { value, checked } = e.target;
    const newValue = checked ? [...filterData.landlord_responsibilities, value] : filterData.landlord_responsibilities.filter((item) => item !== value);
    handleChange(newValue, "landlord_responsibilities");
  };

  const handleClearUpdate = () => {
    onSetFilterData({ ...filterData, lease_date: "", min_lease_term_reamaining: "date" });
  };

  return (
    <div>
      <div className="">
        <p className="head-4 dark-H mb-4">Availability Status</p>
        <RadioGroup
          onChange={(value) => {
            handleChange(value, "availability_status");
          }}
          value={filterData?.availability_status}
        >
          <Stack direction="row" gap={5}>
            <Radio value="Off Market">Off Market</Radio>
            <Radio value="On Market">On Market</Radio>
          </Stack>
        </RadioGroup>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div className="">
        <p className="head-4 dark-H mb-4">Buyer Tags</p>
        {/* <RadioGroup
          onChange={(value) => {
            handleChange(value, "buyer_status");
          }}
          value={filterData?.buyer_status}
        >
          <Stack direction="row" gap={5}>
            <Radio value="Pipeline">Pipeline</Radio>
          </Stack>
        </RadioGroup> */}

        <CheckboxSearchOptions
          handleChange={(value) => {
            handleChange(value, "buyer_status");
          }}
          selectedOptions={filterData?.buyer_status}
          options={contactTagOptions}
        />
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <FilterFieldHeader
          title={"Asking Cap Rate"}
          type={"string"}
          symbol={"%"}
          data={filterData?.min_asking_cap_rate}
          handleCross={() => {
            handleChange("", "min_asking_cap_rate");
          }}
        />
        <div className="w-[100%] mt-4">
          <InputWithIcon
            icon={percentage}
            type="number"
            min={0}
            placeholder="Asking cap rate"
            value={filterData?.min_asking_cap_rate}
            onChange={(e) => {
              if (e.target.value > 100) {
                return;
              } else {
                handleChange(e.target.value, "min_asking_cap_rate");
              }
            }}
            onWheel={(e) => e.target.blur()}
          />
        </div>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <FilterFieldHeader type={"to"} title={"Asking Price"} data={filterData?.min_price} data2={filterData?.max_price} handleCross={handleAskingPriceClear} />

        <div className="flex flex-row mt-4">
          <div className="w-[50%]">
            <InputWithIcon
              icon={dollor}
              type="number"
              min={0}
              placeholder="min price"
              value={filterData?.min_price}
              onChange={(e) => {
                handleChange(e.target.value, "min_price");
              }}
              onWheel={(e) => e.target.blur()}
            />
          </div>
          <div className="w-[50%]">
            <InputWithIcon
              icon={dollor}
              type="number"
              min={0}
              placeholder="max price"
              value={filterData?.max_price}
              onChange={(e) => {
                handleChange(e.target.value, "max_price");
              }}
              onWheel={(e) => e.target.blur()}
            />
          </div>
        </div>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <div className="flex justify-between items-center">
          <p className="head-4 dark-H">Tenant Name</p>
          {/* <UpArrow /> */}
        </div>

        <div className="w-[100%] mt-4">
          <Select
            className="body-S"
            placeholder="Search here..."
            value={tenantOptions?.find((el) => el?.value == filterData?.tenant_name)}
            options={tenantOptions}
            onChange={(option) => {
              handleChange(option?.value, "tenant_name");
            }}
          />
        </div>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      {/* <div className="">
        <div className=" flex flex-row justify-between">
          <p className="head-4 dark-H">Availability Status</p>
          <UpArrow />
        </div>

        <div className="flex gap-5 items-cente mt-5">
          <div className="flex items-center dark-M body-N">
            <input type="radio" id="yes2" name="firstDealOption" value="yes" checked={selectedOption2 === "yes"} onChange={handleRadioChange2} />
            <label htmlFor="yes2">
              <span></span>Off Market
            </label>
          </div>

          <div className="flex items-center dark-M body-N">
            <input type="radio" id="no2" name="firstDealOption" value="no" checked={selectedOption2 === "no"} onChange={handleRadioChange2} />

            <label htmlFor="no2">
              <span></span>On Market
            </label>
          </div>
        </div>
      </div> 

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />
      */}

      <div className="mt-4">
        <FilterFieldHeader
          title={"Landlord Responsibilities"}
          data={filterData?.landlord_responsibilities?.length}
          type="array"
          handleCross={() => {
            handleChange([], "landlord_responsibilities");
          }}
        />

        <div>
          <div className="mt-4">
            {leads.flatMap((el, i) => (
              <label key={i} className="container">
                <input type="checkbox" value={el.value} onChange={handleLandlordTags} checked={filterData?.landlord_responsibilities?.includes(el.value)} />
                <span className="checkmark"></span>
                <p className="dark-M body-N">{el.label}</p>
              </label>
            ))}
          </div>
        </div>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <FilterFieldHeader
          title={"Property Type"}
          data={filterData?.property_type?.length}
          type="array"
          handleCross={() => {
            handleChange([], "property_type");
          }}
        />

        <CheckboxSearchOptions
          handleChange={(value) => {
            handleChange(value, "property_type");
          }}
          selectedOptions={filterData?.property_type}
          options={propertyTypeOptions}
        />
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <FilterFieldHeader
          title={"State"}
          data={filterData?.state?.length}
          type="array"
          handleCross={() => {
            handleChange([], "state");
          }}
        />

        <CheckboxSearchOptions
          handleChange={(values) => {
            // handleChange(values, "state");
            if (values?.[values?.length - 1] === "Nationwide") {
              handleChange(["Nationwide"], "state");
            } else {
              handleChange(
                values?.filter((el) => el !== "Nationwide"),
                "state"
              );
            }
          }}
          selectedOptions={filterData?.state}
          options={stateOptions}
        />
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <FilterTabData
        title={"Lease Term Remaining"}
        tabData={filterThreeTabData}
        activeTab={filterData?.min_lease_term_reamaining}
        onSetActiveTab={(value) => {
          handleChange(value, "min_lease_term_reamaining");
        }}
        lastDate={filterData?.lease_date}
        handleLastUpdate={handleClearUpdate}
      />

      <OptionalOption
        activeTab={filterData?.min_lease_term_reamaining}
        onSetLastDate={(value) => {
          handleChange(value, "lease_date");
        }}
        date={filterData?.lease_date}
        onSetDateRange1={(value) => handleChange(value, "lease_start_date")}
        date2={filterData?.lease_start_date}
        onSetDateRange2={(value) => handleChange(value, "lease_end_date")}
        date3={filterData?.lease_end_date}
        category={filterData?.lease_date_category}
        onSetCategory={(value) => handleChange(value, "lease_date_category")}
        lastUp_days={filterData?.min_lease_term_reamaining === "within_last" ? filterData?.lease_within_last_day : filterData?.min_lease_term_reamaining === "longer_than" ? filterData?.lease_longer_than_day : ""}
        onSetDays={(value) => {
          if (filterData?.min_lease_term_reamaining === "within_last") {
            onSetFilterData({ ...filterData, lease_within_last_day: value, lease_longer_than_day: "" });
          } else if (filterData?.min_lease_term_reamaining === "longer_than") {
            onSetFilterData({ ...filterData, lease_within_last_day: "", lease_longer_than_day: value });
          } else {
            onSetFilterData({ ...filterData, lease_within_last_day: "", lease_longer_than_day: "" });
          }
        }}
      />

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div className="mb-2">
        <FilterTabData
          title={"Last Update"}
          tabData={filterThreeTabData}
          activeTab={filterData?.last_update}
          onSetActiveTab={(value) => {
            handleChange(value, "last_update");
          }}
          lastDate={filterData?.last_update_date}
          handleLastUpdate={handleLastUpdateClear}
        />

        <OptionalOption
          activeTab={filterData?.last_update}
          onSetLastDate={(value) => {
            handleChange(value, "last_update_date");
          }}
          date={filterData?.last_update_date}
          onSetDateRange1={(value) => handleChange(value, "last_update_start_date")}
          date2={filterData?.last_update_start_date}
          onSetDateRange2={(value) => handleChange(value, "last_update_end_date")}
          date3={filterData?.last_update_end_date}
          category={filterData?.date_category}
          onSetCategory={(value) => handleChange(value, "date_category")}
          lastUp_days={filterData?.last_update === "within_last" ? filterData?.within_last_day : filterData?.last_update === "longer_than" ? filterData?.longer_than_day : ""}
          onSetDays={(value) => {
            if (filterData?.last_update === "within_last") {
              onSetFilterData({ ...filterData, within_last_day: value, longer_than_day: "" });
            } else if (filterData?.last_update === "longer_than") {
              onSetFilterData({ ...filterData, within_last_day: "", longer_than_day: value });
            } else {
              onSetFilterData({ ...filterData, within_last_day: "", longer_than_day: "" });
            }
          }}
        />
      </div>
    </div>
  );
};

export default BuyersFilterData;
