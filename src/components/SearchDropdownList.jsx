import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { BASE_URL } from "../utils/Element";
import { handleDropdownClose } from "../utils/utils";
import { NotificationManager } from "react-notifications";

const SearchDropdownList = ({ from }) => {
  const [config] = useAuth();
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchList, setSearchList] = useState([]);

  useEffect(() => {
    const handleClose = () => {
      setSearchList([]);
    };
    handleDropdownClose(dropdownRef, handleClose);
  }, []);

  useEffect(() => {
    const fetchSuggestions = () => {
      axios
        .get(`${BASE_URL}/search?search=${search}&type=${from}`, config)
        .then((res) => {
          const data = res.data?.results;
          const options = from === "contact" ? data?.map((el) => ({ value: el?.id, label: `${el?.first_name} ${el?.last_name}`, desc: el?.email })) : from === "company" ? data?.map((el) => ({ value: el?.id, label: el?.company_name, desc: el?.website_link })) : data?.map((el) => ({ value: el?.id, label: el?.property_name, desc: "" }));
          setSearchList(options);
        })
        .catch((err) => {
          setSearchList([]);
          if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
            NotificationManager.error(err.response?.data?.message);
          }
        });
    };

    if (search !== "") {
      fetchSuggestions();
    }
  }, [search, from]);

  return (
    <div className="search-box contacts">
      <div className="relative">
        <input
          type="text"
          placeholder={`Search ${from}`}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          style={{ border: "1px solid #D8D8D8", backgroundColor: `${search !== "" ? "#ffffff" : ""}` }}
          className="body-S focus:outline-none"
        />

        {searchList?.length !== 0 && searchList !== undefined && (
          <div ref={dropdownRef} className="absolute z-10 w-full mt-1 light-bg-L border border-gray-300 rounded-md shadow-md">
            {searchList?.map((el, idx) => (
              <div
                role="button"
                key={idx}
                onClick={() => {
                  navigate(`/${from}/${el?.value}`);
                  setSearchList([]);
                  setSearch("");
                }}
                className="px-3 py-2 hover:bg-gray-100"
              >
                <p className="dark-H head-6">{el.label}</p>
                <p className="dark-M body-XS">{el.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchDropdownList;
