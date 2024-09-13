import React, { useEffect, useState } from "react";
import { Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { NotificationManager } from "react-notifications";
import Select from "react-select";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { BASE_URL } from "../../../utils/Element";
import { RiArrowUpSLine as UpArrow } from "react-icons/ri";
import SearchDropdown from "../../../components/Dropdowns/SearchDropdown";
import OptionalOption from "../../../components/FilterComponents/OptionalOption";
import FilterFieldHeader from "../../../components/FilterComponents/FilterFieldHeader";
import CheckboxSearchOptions from "../../../components/FilterComponents/CheckboxSearchOptions";

const LeadsFilterData = ({ isSidebarOpen, filterData, onSetFilterData, from }) => {
  const [config] = useAuth();
  const [loading, setLoading] = useState(false);
  const [bdsOptions, setBdsOptions] = useState([]);
  const [linkOptions, setLinkOptions] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [buyerOptions, setBuyerOptions] = useState([]);
  const [brokerOptions, setBrokerOptions] = useState([]);
  const [propertyOptions, setPropertyOptions] = useState([]);
  const [leadSourcesOptions, setLeadSourcesOptions] = useState([]);

  const handleFilterChange = (value, name) => {
    onSetFilterData({ ...filterData, [name]: value });
  };

  const fetchSuggestions = (inputValue) => {
    axios
      .get(`${BASE_URL}/get-datalisting?list=contacts&search=${inputValue}`, config)
      .then((res) => {
        const data = res.data.data.contact_list;
        const options = data.map((contact) => ({ value: contact.id, label: `${contact.first_name} ${contact.last_name}` }));
        setContactData(options);
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const fetchPropertySuggestions = (inputValue) => {
    axios
      .get(`${BASE_URL}/get-datalisting?list=properties&search=${inputValue}`, config)
      .then((res) => {
        const data = res.data.data.properties;
        const options = data.map((el) => ({ value: el.id, label: el?.property_name, desc: `${el.street_address}, ${el.city}, ${el.state}` }));
        setPropertyOptions(options);
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const fetchBuyers = () => {
    axios
      .get(`${BASE_URL}/get-datalisting?list=buyer`, config)
      .then((res) => {
        const value = res?.data?.data;
        const acquisitionOptions = value?.buyer?.map((el) => ({ value: el?.id, label: el?.property_type?.[0]?.type, minPrice: el?.min_price, maxPrice: el?.max_price }));
        setBuyerOptions(acquisitionOptions);
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

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

  const fetchUsers = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/get-datalisting?list=users`, config)
      .then((res) => {
        const data = res?.data?.data;
        const options = data?.map((el) => ({ value: el?.id, label: `${el?.first_name} ${el?.last_name}`, role: el?.role_id }));
        setBdsOptions(options);
        setBrokerOptions(options?.filter((el) => el.role === 3));
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => setLoading(false));
  };

  const fetchLinks = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/get-ContactData/${filterData?.contact}`, config)
      .then((res) => {
        const data = res?.data?.data;
        const properties = data?.properties;
        const acquisitions = data?.acquisitions;
        const propertyOptions = properties?.map((el) => ({ value: el?.id, label: el?.property_name, desc: `${el.street_address}, ${el.city}, ${el.state}` }));
        const acquisitionOptions = acquisitions?.map((el) => ({ value: el?.id, label: el?.property_type?.[0]?.type, minPrice: el?.min_price, maxPrice: el?.max_price }));
        if (filterData.lead_type === "acquisition") {
          setLinkOptions(acquisitionOptions);
        } else {
          setLinkOptions(propertyOptions);
        }
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isSidebarOpen) {
      fetchLeadSources();
      fetchUsers();
      fetchBuyers();
    }
  }, [isSidebarOpen]);

  useEffect(() => {
    if (isSidebarOpen) {
      if (filterData?.contact !== "") {
        fetchLinks();
      }
    }
  }, [isSidebarOpen, filterData?.contact, filterData?.lead_type]);

  const formatOptionLabel = ({ value, label, minPrice, maxPrice, desc }) => (
    <div>
      <div>{label}</div>
      {desc && <p className="">{desc}</p>}
      {(minPrice || maxPrice) && (
        <div className="flex gap-2">
          {minPrice && <p>Min Price-{minPrice}</p>}/{maxPrice && <p>Max Price-{maxPrice}</p>}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div>
        <div className="flex justify-between items-center">
          <p className="head-4 dark-H">BDS</p>
          {/* <UpArrow /> */}
        </div>

        <div className="w-[100%] mt-2">
          <Select
            // ref={selectRef}
            className="body-S"
            placeholder="Search here..."
            value={bdsOptions?.find((el) => el?.value == filterData?.bds)}
            options={bdsOptions}
            onChange={(option) => {
              handleFilterChange(option?.value, "bds");
            }}
          />
        </div>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <p className="head-4 dark-H">Broker</p>

        <div className="w-[100%] mt-2">
          <Select
            className="body-S"
            placeholder="Search here ..."
            value={brokerOptions?.find((el) => el.value == filterData?.broker)}
            options={brokerOptions}
            onChange={(option) => {
              handleFilterChange(option.value, "broker");
            }}
          />
        </div>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <p className="head-4 dark-H">Contact</p>

        <div className="mt-2">
          <SearchDropdown
            isTop={false}
            placeholder={`Search contact`}
            text={filterData?.contact?.name}
            options={contactData}
            fetchSuggestions={fetchSuggestions}
            onSetOptions={(value) => setContactData(value)}
            handleSelect={(option) => {
              onSetFilterData({
                ...filterData,
                contact: { id: option?.value, name: option?.label },
              });
              setContactData([]);
            }}
          />
        </div>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      {from === "lead" ? (
        <div>
          <FilterFieldHeader
            title={"Lead Source"}
            data={filterData?.lead_source?.length}
            type="array"
            handleCross={() => {
              handleFilterChange([], "lead_source");
            }}
          />

          <CheckboxSearchOptions
            handleChange={(value) => {
              handleFilterChange(value, "lead_source");
            }}
            selectedOptions={filterData?.lead_source}
            options={leadSourcesOptions}
          />
        </div>
      ) : (
        <div className="mt-4">
          <p className="head-4 dark-H mb-4">Proposal Status</p>

          <RadioGroup
            onChange={(value) => {
              handleFilterChange(value, "status");
            }}
            value={filterData?.status}
          >
            <Stack direction="row" gap={5}>
              <Radio value="followup">Follow-Up</Radio>
              <Radio value="won">Won</Radio>
              <Radio value="lost">Lost</Radio>
            </Stack>
          </RadioGroup>
        </div>
      )}

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div className="mt-4">
        <p className="head-4 dark-H mb-2">Lead Type</p>

        <RadioGroup
          onChange={(value) => {
            handleFilterChange(value, "lead_type");
          }}
          value={filterData?.lead_type}
        >
          <Stack direction="row" gap={5}>
            <Radio value="disposition">Disposition</Radio>
            <Radio value="acquisition">Acquisition</Radio>
          </Stack>
        </RadioGroup>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      {/* {filterData?.lead_type !== "" && (
        <div className="mt-4">
          <label className="dark-H head-4 mb-4">{filterData?.lead_type === "disposition" ? "Property" : "Acquisition Criteria"}</label>
          <div className="mt-2">
            <Select
              className="body-N"
              options={linkOptions}
              formatOptionLabel={formatOptionLabel}
              placeholder={"Select"}
              value={linkOptions.find((option) => option.value === filterData.link_id)}
              onChange={(option) => {
                handleFilterChange(option.value, "link_id");
              }}
            />
          </div>

          <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />
        </div>
      )} */}

      <div className="mt-4">
        <label className="dark-H head-4 mb-4">Acquisition Criteria</label>
        <div className="mt-2">
          <Select
            className="body-N"
            options={buyerOptions}
            formatOptionLabel={formatOptionLabel}
            placeholder={"Select"}
            value={buyerOptions.find((option) => option.value === filterData.buyer_id)}
            onChange={(option) => {
              handleFilterChange(option.value, "buyer_id");
            }}
          />
        </div>

        <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />
      </div>

      <div className="mt-4">
        <label className="dark-H head-4 mb-4">Property</label>
        <div className="mt-2">
          <SearchDropdown
            isTop={false}
            placeholder={`Search Property`}
            text={filterData?.property?.name}
            options={propertyOptions}
            fetchSuggestions={fetchPropertySuggestions}
            onSetOptions={(value) => setPropertyOptions(value)}
            handleSelect={(option) => {
              onSetFilterData({
                ...filterData,
                property: { id: option?.value, name: option?.label },
              });
              setPropertyOptions([]);
            }}
          />
        </div>

        <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />
      </div>

      <div>
        <p className="head-4 dark-H capitalize">{from} Date</p>

        <OptionalOption
          activeTab="date"
          onSetLastDate={(value) => handleFilterChange(value, "created_at")}
          date={filterData?.created_at}
          onSetDateRange1={(value) => {
            handleFilterChange(value, "created_start_date");
          }}
          date2={filterData?.created_start_date}
          onSetDateRange2={(value) => handleFilterChange(value, "created_end_date")}
          date3={filterData?.created_end_date}
        />
      </div>
    </div>
  );
};

export default LeadsFilterData;
