import React, { useEffect, useState } from "react";
import { Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { NotificationManager } from "react-notifications";
import Select from "react-select";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { BASE_URL } from "../../../utils/Element";
import sqft from "../../../assets/icons/sq ft.svg";
import dollor from "../../../assets/icons/dollar.svg";
import { RiArrowUpSLine as UpArrow } from "react-icons/ri";
import InputWithIcon from "../../../components/InputWithIcon";
import percentage from "../../../assets/icons/percentage.svg";
import OptionalOption from "../../../components/FilterComponents/OptionalOption";
import FilterFieldHeader from "../../../components/FilterComponents/FilterFieldHeader";
import SearchDropdown from "../../../components/Dropdowns/SearchDropdown";

const OfferFilterData = ({ isSidebarOpen, filterData, onSetFilterData }) => {
  const [config] = useAuth();
  const [loading, setLoading] = useState(false);
  const [contactData, setContactData] = useState([]);
  const [brokerOptions, setBrokerOptions] = useState([]);

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

  const fetchUsers = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/get-datalisting?list=users`, config)
      .then((res) => {
        const data = res?.data?.data;
        const options = data?.map((el) => ({ value: el?.id, label: `${el?.first_name} ${el?.last_name}`, role: el?.role_id }));
        setBrokerOptions(options?.filter((el) => el.role === 3));
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
      fetchUsers();
    }
  }, [isSidebarOpen]);

  return (
    <div>
      <div>
        <div className="flex justify-between items-center">
          <p className="head-4 dark-H">Broker</p>
          {/* <UpArrow /> */}
        </div>

        <div className="mt-2">
          <Select
            className="body-S"
            placeholder="Search here ..."
            value={brokerOptions?.find((el) => el.value == filterData?.associate)}
            options={brokerOptions}
            onChange={(option) => {
              handleFilterChange(option.value, "associate");
            }}
          />
        </div>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <p className="head-4 dark-H">Property Name</p>

        <div className="search-box mt-2">
          <input
            type="text"
            className="body-S"
            placeholder="write here"
            style={{ width: "100%" }}
            value={filterData?.property_name}
            onChange={(e) => {
              handleFilterChange(e.target.value, "property_name");
            }}
          />
        </div>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <FilterFieldHeader
          title={"Address"}
          type="string"
          data={filterData?.property_address}
          handleCross={() => {
            handleFilterChange("", "property_address");
          }}
        />

        <div className="search-box w-[100%] mt-2">
          <input
            type="text"
            className="body-N"
            placeholder="write street address here"
            style={{ width: "100%" }}
            value={filterData?.property_address}
            onChange={(e) => {
              handleFilterChange(e.target.value, "property_address");
            }}
          />
        </div>

        <div className="flex flex-row gap-4 mt-2">
          <div className="search-box w-[30%] ">
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
              min={0}
              className="body-N"
              placeholder="zip code"
              style={{ width: "100%" }}
              value={filterData?.zip_code}
              onChange={(e) => {
                handleFilterChange(e.target.value, "zip_code");
              }}
            />
          </div>
        </div>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div className="mt-4">
        <p className="head-4 dark-H mb-2">Deal Type</p>

        <RadioGroup
          onChange={(value) => {
            handleFilterChange(value, "deal_type");
          }}
          value={filterData?.deal_type}
        >
          <Stack direction="row" gap={5}>
            <Radio value="disposition">Disposition</Radio>
            <Radio value="acquisition">Acquisition</Radio>
          </Stack>
        </RadioGroup>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div className="mt-4">
        <p className="head-4 dark-H mb-2">Counter Type</p>

        <RadioGroup
          onChange={(value) => {
            handleFilterChange(value, "offer_type");
          }}
          value={filterData?.offer_type}
        >
          <Stack direction="row" gap={5}>
            <Radio value="seller">Seller</Radio>
            <Radio value="buyer">Buyer</Radio>
          </Stack>
        </RadioGroup>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div className="mt-4">
        <p className="head-4 dark-H mb-2">Offer From</p>

        <div className="mt-2">
          <SearchDropdown
            isTop={false}
            placeholder={`Search here`}
            text={filterData?.contact?.name}
            options={contactData}
            fetchSuggestions={fetchSuggestions}
            onSetOptions={(value) => setContactData(value)}
            handleSelect={(option) => {
              onSetFilterData({
                ...filterData,
                contact: { id: option?.value, name: option?.label },
                // contact_name: option?.label,
                // contact: option?.value,
              });
              setContactData([]);
            }}
          />
        </div>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <p className="head-4 dark-H capitalize">Offer Date</p>

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

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <FilterFieldHeader
          title={"Asking Cap Rate"}
          data={filterData?.min_asking_cap_rate}
          type="to"
          symbol={"  to  "}
          data2={filterData?.max_asking_cap_rate}
          handleCross={() => {
            onSetFilterData({ ...filterData, min_asking_cap_rate: "", max_asking_cap_rate: "" });
          }}
        />

        <div className="flex flex-row mt-2">
          <div className="w-[50%]">
            <InputWithIcon icon={percentage} type="number" min={0} placeholder="min rate" value={filterData?.min_asking_cap_rate} onChange={(e) => handleFilterChange(e.target.value, "min_asking_cap_rate")} />
          </div>
          <div className="w-[50%]">
            <InputWithIcon icon={percentage} type="number" min={0} placeholder="max rate" value={filterData?.max_asking_cap_rate} onChange={(e) => handleFilterChange(e.target.value, "max_asking_cap_rate")} />
          </div>
        </div>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <FilterFieldHeader
          title={"Asking Price"}
          data={filterData?.min_asking_price}
          type="to"
          symbol={"  to  "}
          data2={filterData?.max_asking_price}
          handleCross={() => {
            onSetFilterData({ ...filterData, min_asking_price: "", max_asking_price: "" });
          }}
        />

        <div className="flex flex-row mt-2">
          <div className="w-[50%]">
            <InputWithIcon icon={dollor} type="number" min={0} placeholder="min rate" value={filterData?.min_asking_price} onChange={(e) => handleFilterChange(e.target.value, "min_asking_price")} />
          </div>
          <div className="w-[50%]">
            <InputWithIcon icon={dollor} type="number" min={0} placeholder="max rate" value={filterData?.max_asking_price} onChange={(e) => handleFilterChange(e.target.value, "max_asking_price")} />
          </div>
        </div>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <p className="head-4 dark-H">NOI</p>

        <div className="mt-2">
          <InputWithIcon
            icon={dollor}
            type="number"
            min={0}
            placeholder="write here"
            value={filterData?.noi}
            onChange={(e) => {
              handleFilterChange(e.target.value, "noi");
            }}
          />
        </div>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <p className="head-4 dark-H">Offer Price</p>

        <div className="mt-2">
          <InputWithIcon
            icon={dollor}
            type="number"
            min={0}
            placeholder="write here"
            value={filterData?.offer_price}
            onChange={(e) => {
              handleFilterChange(e.target.value, "offer_price");
            }}
          />
        </div>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <p className="head-4 dark-H">Offer Cap Price</p>

        <div className="mt-2">
          <InputWithIcon
            icon={percentage}
            type="number"
            min={0}
            placeholder="write here"
            value={filterData?.offer_cap_rate}
            onChange={(e) => {
              handleFilterChange(e.target.value, "offer_cap_rate");
            }}
          />
        </div>
      </div>

      <hr className="my-6" style={{ borderColor: "#6F6F6F" }} />

      <div>
        <p className="head-4 dark-H">Percent of asking price</p>

        <div className="my-2">
          <InputWithIcon
            icon={percentage}
            type="number"
            min={0}
            placeholder="write here"
            value={filterData?.percent_of_asking_price}
            onChange={(e) => {
              handleFilterChange(e.target.value, "percent_of_asking_price");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default OfferFilterData;
