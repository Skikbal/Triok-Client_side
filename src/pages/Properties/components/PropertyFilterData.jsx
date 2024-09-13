import React, { useEffect, useRef, useState } from "react";
import { Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { NotificationManager } from "react-notifications";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { BASE_URL } from "../../../utils/Element";
import sqft from "../../../assets/icons/sq ft.svg";
import dollor from "../../../assets/icons/dollar.svg";
import { RiArrowUpSLine as UpArrow } from "react-icons/ri";
import InputWithIcon from "../../../components/InputWithIcon";
import percentage from "../../../assets/icons/percentage.svg";
import SearchDropdown from "../../../components/Dropdowns/SearchDropdown";
import { filterThreeTabData, filterTabData } from "../../../utils/options";
import FilterTabData from "../../../components/FilterComponents/FilterTabData";
import OptionalOption from "../../../components/FilterComponents/OptionalOption";
import FilterFieldHeader from "../../../components/FilterComponents/FilterFieldHeader";
import FilterSearchSection from "../../../components/FilterComponents/FilterSearchSection";
import CheckboxSearchOptions from "../../../components/FilterComponents/CheckboxSearchOptions";

const PropertyFilterData = ({ filterData, handleFilterChange, onSetFilterData, isSidebarOpen }) => {
  const [config] = useAuth();
  const [ownerOptions, setOwnerOptions] = useState([]);
  const [contactTagOptions, setContactTagOptions] = useState([]);
  const [propertyTagOptions, setPropertyTagOptions] = useState([]);
  const [propertyTypeOptions, setPropertyTypeOptions] = useState([]);

  const fetchSuggestions = (inputValue) => {
    const type = filterData?.ownerType === "company" ? "companies" : "contacts";
    axios
      .get(`${BASE_URL}/get-datalisting?list=${type}&search=${inputValue}`, config)
      .then((res) => {
        const data = res.data;
        const options = filterData?.ownerType === "company" ? data.data.company_list.map((company) => ({ value: company.id, label: company.company_name })) : data.data.contact_list.map((contact) => ({ value: contact.id, label: `${contact.first_name} ${contact.last_name}` }));
        setOwnerOptions(options);
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
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const fetchPropertyTags = () => {
    axios
      .get(`${BASE_URL}/get-datalisting?list=property_tag`, config)
      .then((res) => {
        const value = res?.data?.data?.property_tag;
        setPropertyTagOptions(value?.map((el) => ({ value: el?.id, label: el?.tag_name })));
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
      fetchContactTags();
      fetchPropertyTags();
    }
  }, [isSidebarOpen]);

  const handleHasOwner = (value) => {
    if (value === "no") {
      onSetFilterData({ ...filterData, hasOwner: "no", ownerPhoneCheck: "no", ownerPhone: "", ownerStreetAddressCheck: "no", ownerStreetAddress: "", ownerTaxRecordCheck: "no", taxRecordSentDate: "", taxRecordSentStartDate: "", taxRecordSentEndDate: "" });
    } else {
      handleFilterChange(value, "hasOwner");
    }
  };

  const handleOwnerPhoneCheck = (value) => {
    if (value === "no") {
      onSetFilterData({ ...filterData, ownerPhoneCheck: "no", ownerPhone: "" });
    } else {
      handleFilterChange(value, "ownerPhoneCheck");
    }
  };

  const handlerOwnerStreetAddressCheck = (value) => {
    if (value === "no") {
      onSetFilterData({ ...filterData, ownerStreetAddressCheck: "no", ownerStreetAddress: "" });
    } else {
      handleFilterChange(value, "ownerStreetAddressCheck");
    }
  };

  const handleOwnerTaxRecordCheck = (value) => {
    if (value === "no") {
      onSetFilterData({ ...filterData, ownerTaxRecordCheck: "no", taxRecordSentDate: "", taxRecordSentStartDate: "", taxRecordSentEndDate: "" });
    } else {
      handleFilterChange(value, "ownerTaxRecordCheck");
    }
  };

  const handleClearUpdate = () => {
    onSetFilterData({ ...filterData, sentDate: "", lastUpdateOption: "date" });
  };

  const handleClearSold = () => {
    onSetFilterData({ ...filterData, lastSoldSentDate: "", lastSoldOption: "date" });
  };

  const handleClearAskingCapRate = () => {
    onSetFilterData({ ...filterData, minCaprate: "", maxCaprate: "" });
  };

  const handleClearAskingPrice = () => {
    onSetFilterData({ ...filterData, minPrice: "", maxPrice: "" });
  };

  const handleClearBuildingSize = () => {
    onSetFilterData({ ...filterData, minBuilding: "", maxBuilding: "" });
  };

  const handleClearLandSize = () => {
    onSetFilterData({ ...filterData, minLand: "", maxLand: "" });
  };

  const handleClearVacanacy = () => {
    onSetFilterData({ ...filterData, minVacancy: "", maxVacancy: "" });
  };

  return (
    <div className="">
      <FilterSearchSection
        type="text"
        title={"Property Name"}
        placeholder={"write name here"}
        value={filterData?.propertyName}
        onChange={(e) => {
          handleFilterChange(e.target.value, "propertyName");
        }}
      />

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <FilterSearchSection
        type="text"
        title={"Store ID"}
        placeholder={"write store number"}
        value={filterData?.storeId}
        onChange={(e) => {
          handleFilterChange(e.target.value, "storeId");
        }}
      />

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <FilterFieldHeader
          title={"Property Type"}
          type="array"
          data={filterData?.propertyType.length}
          handleCross={() => {
            handleFilterChange([], "propertyType");
          }}
        />

        <CheckboxSearchOptions
          handleChange={(value) => {
            handleFilterChange(value, "propertyType");
          }}
          selectedOptions={filterData?.propertyType}
          options={propertyTypeOptions}
        />
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div className="mt-8">
        <FilterFieldHeader title={"Property Tags"} data={filterData?.tags?.length} type="array" handleCross={() => handleFilterChange([], "tags")} />

        <CheckboxSearchOptions
          handleChange={(value) => {
            handleFilterChange(value, "tags");
          }}
          selectedOptions={filterData?.tags}
          options={propertyTagOptions}
        />
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <FilterFieldHeader
          title={"Address"}
          type="string"
          data={filterData?.streetAddress}
          handleCross={() => {
            handleFilterChange("", "streetAddress");
          }}
        />

        <div className="search-box w-[100%] mt-4">
          <input
            type="text"
            className="body-N"
            placeholder="write street address here"
            style={{ width: "100%" }}
            value={filterData?.streetAddress}
            onChange={(e) => {
              handleFilterChange(e.target.value, "streetAddress");
            }}
          />
          <span className="icon-search"></span>
        </div>

        <div className="flex flex-row gap-4">
          <div className="search-box w-[30%] mt-4">
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
          <div className="search-box w-[30%] mt-4">
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
          <div className="search-box w-[30%] mt-4">
            <input
              type="number"
              min={0}
              className="body-N"
              placeholder="zip code"
              style={{ width: "100%" }}
              value={filterData?.zip}
              onChange={(e) => {
                handleFilterChange(e.target.value, "zip");
              }}
            />
          </div>
        </div>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <FilterTabData
        title={"Last Update"}
        tabData={filterThreeTabData}
        activeTab={filterData?.lastUpdateOption}
        onSetActiveTab={(value) => {
          handleFilterChange(value, "lastUpdateOption");
        }}
        lastDate={filterData?.sentDate}
        handleLastUpdate={handleClearUpdate}
      />

      <OptionalOption
        activeTab={filterData?.lastUpdateOption}
        onSetLastDate={(value) => {
          handleFilterChange(value, "sentDate");
        }}
        date={filterData?.sentDate}
        onSetDateRange1={(value) => handleFilterChange(value, "lastUpStartDate")}
        date2={filterData?.lastUpStartDate}
        onSetDateRange2={(value) => handleFilterChange(value, "lastUpEndDate")}
        date3={filterData?.lastUpEndDate}
        category={filterData?.lastUpDateCategory}
        onSetCategory={(value) => handleFilterChange(value, "lastUpDateCategory")}
        lastUp_days={filterData?.lastUpdateOption === "within_last" ? filterData?.withinLastDay : filterData?.lastUpdateOption === "longer_than" ? filterData?.longerThanDay : ""}
        onSetDays={(value) => {
          if (filterData?.lastUpdateOption === "within_last") {
            onSetFilterData({ ...filterData, withinLastDay: value, longerThanDay: "" });
          } else if (filterData?.lastUpdateOption === "longer_than") {
            onSetFilterData({ ...filterData, withinLastDay: "", longerThanDay: value });
          } else {
            onSetFilterData({ ...filterData, withinLastDay: "", longerThanDay: "" });
          }
        }}
      />

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <FilterFieldHeader title={"Asking Cap Rate"} data={filterData?.minCaprate} type="to" symbol={"  to  "} data2={filterData?.maxCaprate} handleCross={handleClearAskingCapRate} />

        <div className="flex flex-row mt-4">
          <div className="w-[50%]">
            <InputWithIcon
              icon={percentage}
              type="number"
              min={0}
              placeholder="min rate"
              value={filterData?.minCaprate}
              onChange={(e) => {
                handleFilterChange(e.target.value, "minCaprate");
              }}
            />
          </div>
          <div className="w-[50%]">
            <InputWithIcon
              icon={percentage}
              type="number"
              min={0}
              placeholder="max rate"
              value={filterData?.maxCaprate}
              onChange={(e) => {
                handleFilterChange(e.target.value, "maxCaprate");
              }}
            />
          </div>
        </div>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <FilterFieldHeader title={"Asking Price"} data={filterData?.minPrice} type="to" symbol={"  to  "} data2={filterData?.maxPrice} handleCross={handleClearAskingPrice} />

        <div className="flex flex-row mt-4">
          <div className="w-[50%]">
            <InputWithIcon
              icon={dollor}
              type="number"
              min={0}
              placeholder="min price"
              value={filterData?.minPrice}
              onChange={(e) => {
                handleFilterChange(e.target.value, "minPrice");
              }}
            />
          </div>
          <div className="w-[50%]">
            <InputWithIcon
              icon={dollor}
              type="number"
              min={0}
              placeholder="max price"
              value={filterData?.maxPrice}
              onChange={(e) => {
                handleFilterChange(e.target.value, "maxPrice");
              }}
            />
          </div>
        </div>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <FilterFieldHeader title={"Building Size"} data={filterData?.minBuilding} type="to" symbol={"  to  "} data2={filterData?.maxBuilding} handleCross={handleClearBuildingSize} />

        <div className="flex flex-row mt-4">
          <div className="w-[50%]">
            <InputWithIcon
              icon={sqft}
              type="number"
              min={0}
              placeholder="min size"
              value={filterData?.minBuilding}
              onChange={(e) => {
                handleFilterChange(e.target.value, "minBuilding");
              }}
            />
          </div>
          <div className="w-[50%]">
            <InputWithIcon
              icon={sqft}
              type="number"
              min={0}
              placeholder="max size"
              value={filterData?.maxBuilding}
              onChange={(e) => {
                handleFilterChange(e.target.value, "maxBuilding");
              }}
            />
          </div>
        </div>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <FilterFieldHeader title={"Land Size"} data={filterData?.minLand} type="to" symbol={"  to  "} data2={filterData?.maxLand} handleCross={handleClearLandSize} />

        <div className="flex mt-4">
          <div className="w-[50%]">
            <InputWithIcon
              icon={sqft}
              type="number"
              min={0}
              placeholder="min size"
              value={filterData?.minLand}
              onChange={(e) => {
                handleFilterChange(e.target.value, "minLand");
              }}
            />
          </div>
          <div className="w-[50%]">
            <InputWithIcon
              icon={sqft}
              type="number"
              min={0}
              placeholder="max size"
              value={filterData?.maxLand}
              onChange={(e) => {
                handleFilterChange(e.target.value, "maxLand");
              }}
            />
          </div>
        </div>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      {/* <div>
        <div>
         
        <FilterFieldHeader title={"Vacancy Rate"} data={filterData?.minVacancy} type="to" symbol={"  to  "} data2={filterData?.maxVacancy} handleCross={handleClearVacanacy} />

          <div className=" flex flex-row">
            <div className="w-[50%] mt-6 md:mt-0">
              <InputWithIcon icon={percentage} type="number" min={0} placeholder="min rate" value={filterData?.minVacancy} onChange={(e) => handleFilterChange(e.target.value, "minVacancy")} />
            </div>
            <div className="w-[50%] mt-6 md:mt-0">
              <InputWithIcon icon={percentage} type="number" min={0} placeholder="max rate" value={filterData?.maxVacancy} onChange={(e) => handleFilterChange(e.target.value, "maxVacancy")} />
            </div>
          </div>
        </div>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} /> */}

      <FilterTabData
        title={"Last Sold Date"}
        tabData={filterThreeTabData}
        activeTab={filterData?.lastSoldOption}
        onSetActiveTab={(value) => {
          handleFilterChange(value, "lastSoldOption");
        }}
        lastDate={filterData?.lastSoldSentDate}
        handleLastUpdate={handleClearSold}
      />

      <OptionalOption
        activeTab={filterData?.lastSoldOption}
        onSetLastDate={(value) => {
          handleFilterChange(value, "lastSoldSentDate");
        }}
        date={filterData?.lastSoldSentDate}
        onSetDateRange1={(value) => handleFilterChange(value, "lastSoldStartDate")}
        date2={filterData?.lastSoldStartDate}
        onSetDateRange2={(value) => handleFilterChange(value, "lastSoldEndDate")}
        date3={filterData?.lastSoldEndDate}
        onSetCategory={(value) => handleFilterChange(value, "lastSoldCategory")}
        category={filterData?.lastSoldCategory}
        lastUp_days={filterData?.lastUpdateOption === "within_last" ? filterData?.lastSoldWithinLastValue : filterData?.lastUpdateOption === "longer_than" ? filterData?.lastSoldLongerThanValue : ""}
        onSetDays={(value) => {
          if (filterData?.lastUpdateOption === "within_last") {
            onSetFilterData({ ...filterData, lastSoldWithinLastValue: value, lastSoldLongerThanValue: "" });
          } else if (filterData?.lastUpdateOption === "longer_than") {
            onSetFilterData({ ...filterData, lastSoldWithinLastValue: "", lastSoldLongerThanValue: value });
          } else {
            onSetFilterData({ ...filterData, lastSoldWithinLastValue: "", lastSoldLongerThanValue: "" });
          }
        }}
      />

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div className="flex gap-5 justify-between items-center">
        <p className="head-4 dark-H">Owner</p>
        <RadioGroup
          onChange={(value) => {
            onSetFilterData({
              ...filterData,
              ownerType: value,
              owner_name: "",
              owner: "",
            });
          }}
          value={filterData?.ownerType}
        >
          <Stack direction="row" gap={5}>
            <Radio value="company">Company</Radio>
            <Radio value="contact">Contact</Radio>
          </Stack>
        </RadioGroup>
      </div>

      {filterData?.ownerType !== "" && (
        <div className="mt-4">
          <SearchDropdown
            isTop={false}
            placeholder={`Search ${filterData?.ownerType}`}
            text={filterData?.owner?.name}
            options={ownerOptions}
            fetchSuggestions={fetchSuggestions}
            onSetOptions={(value) => setOwnerOptions(value)}
            handleSelect={(option) => {
              onSetFilterData({
                ...filterData,
                owner: { id: option?.value, name: option?.label },
              });
              setOwnerOptions([]);
            }}
          />
        </div>
      )}

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div className="flex gap-5 justify-between items-center">
        <p className="head-4 dark-H">Has Owner</p>
        <RadioGroup
          onChange={(value) => {
            handleHasOwner(value);
          }}
          value={filterData?.hasOwner}
        >
          <Stack direction="row" gap={5}>
            <Radio value="yes">Yes</Radio>
            <Radio value="no">No</Radio>
          </Stack>
        </RadioGroup>
      </div>

      {filterData?.hasOwner === "yes" && (
        <>
          <div>
            <div className="flex gap-5 justify-between items-center mt-4">
              <p className="head-4 dark-H">Has Owner Phone</p>
              <RadioGroup
                onChange={(value) => {
                  handleOwnerPhoneCheck(value);
                }}
                value={filterData?.ownerPhoneCheck}
              >
                <Stack direction="row" gap={5}>
                  <Radio value="yes">Yes</Radio>
                  <Radio value="no">No</Radio>
                </Stack>
              </RadioGroup>
            </div>
            {filterData?.ownerPhoneCheck === "yes" && (
              <input
                type="number"
                min={0}
                className="body-S mt-4"
                placeholder="Write owner phone here"
                value={filterData?.ownerPhone}
                onChange={(e) => {
                  handleFilterChange(e.target.value, "ownerPhone");
                }}
                onWheel={(e) => e.target.blur()}
              />
            )}
          </div>

          <div>
            <div className="flex gap-5 justify-between items-center mt-4">
              <p className="head-4 dark-H">Has Owner Street Address</p>
              <RadioGroup
                onChange={(value) => {
                  handlerOwnerStreetAddressCheck(value);
                }}
                value={filterData?.ownerStreetAddressCheck}
              >
                <Stack direction="row" gap={5}>
                  <Radio value="yes">Yes</Radio>
                  <Radio value="no">No</Radio>
                </Stack>
              </RadioGroup>
            </div>
            {filterData?.ownerStreetAddressCheck === "yes" && (
              <input
                type="text"
                className="body-S mt-4"
                placeholder="Write street address here"
                value={filterData?.ownerStreetAddress}
                onChange={(e) => {
                  handleFilterChange(e.target.value, "ownerStreetAddress");
                }}
              />
            )}
          </div>

          <div>
            <div className="flex gap-5 justify-between items-center mt-4">
              <p className="head-4 dark-H">Tax Record Letter Sent</p>
              <RadioGroup
                onChange={(value) => {
                  handleOwnerTaxRecordCheck(value);
                }}
                value={filterData?.ownerTaxRecordCheck}
              >
                <Stack direction="row" gap={5}>
                  <Radio value="yes">Yes</Radio>
                  <Radio value="no">No</Radio>
                </Stack>
              </RadioGroup>
            </div>

            {filterData?.ownerTaxRecordCheck === "yes" && (
              <OptionalOption
                activeTab="date"
                onSetLastDate={(value) => {
                  handleFilterChange(value, "taxRecordSentDate");
                }}
                date={filterData?.taxRecordSentDate}
                onSetDateRange1={(value) => handleFilterChange(value, "taxRecordSentStartDate")}
                date2={filterData?.taxRecordSentStartDate}
                onSetDateRange2={(value) => handleFilterChange(value, "taxRecordSentEndDate")}
                date3={filterData?.taxRecordSentEndDate}
              />
            )}
          </div>
        </>
      )}

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div className="flex gap-5 justify-between items-center">
        <p className="head-4 dark-H">Owner Website</p>
        <RadioGroup
          onChange={(value) => {
            handleFilterChange(value, "ownerWebsite");
          }}
          value={filterData?.ownerWebsite}
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
          title={"Owner Tags"}
          tabData={filterTabData}
          activeTab={filterData?.ownerTags}
          onSetActiveTab={(value) => {
            handleFilterChange(value, "ownerTags");
          }}
        />

        <CheckboxSearchOptions selectedOptions={filterData?.ownerTags} handleChange={(value) => handleFilterChange(value, "ownerTags")} options={contactTagOptions} />
      </div>

      {/* <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <div className="flex justify-between items-center pb-4">
          <p className="head-4 dark-H ">Lead Gen Type</p>
          <UpArrow />
        </div>

        <Dropdown
          className="company-select"
          options={options}
          placeholder="Select"
        // value={options.find((el) => el.value === addContactData.companyName)}
        // onChange={(option) => {
        //   handleChange(option.value, "companyName");
        // }}
        />
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <FilterTabData title={"Last Updated"} tabData={filterThreeTabData} activeTab={lastUpdateActiveTab} onSetActiveTab={(value) => setLastUpdateActiveTab(value)} />

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <FilterTabData title={"Last Dial"} tabData={filterThreeTabData} activeTab={lastDialActiveTab} onSetActiveTab={(value) => setLastDialActiveTab(value)} />

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <FilterTabData title={"Last Sold Date"} tabData={filterThreeTabData} activeTab={lastSoldActiveTab} onSetActiveTab={(value) => setLastSoldActiveTab(value)} /> */}
    </div>
  );
};

export default PropertyFilterData;
