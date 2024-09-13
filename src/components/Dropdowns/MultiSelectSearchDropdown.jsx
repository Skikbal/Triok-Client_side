import React from "react";
import Loader from "../Loader";
import { AiOutlineClose as CrossIcon } from "react-icons/ai";

const MultiSelectSearchDropdown = ({ options, error, onSetError, selectedData, onSetSelectedData, loading, isWidth, search, onSetSearch }) => {
  const handleCheckboxChange = (item) => {
    const { id, first_name, last_name } = item;
    const name = `${first_name} ${last_name}`;

    const index = selectedData?.findIndex((el) => el?.id === id);
    const newSelectedContacts = index !== -1 ? selectedData?.filter((el) => el?.id !== id) : [...selectedData, { id: id, name: name }];

    onSetSelectedData(newSelectedContacts);
  };

  const handleRemove = (id) => {
    const filteredData = selectedData?.filter((el) => el.id !== id);
    onSetSelectedData(filteredData);
  };

  return (
    <div>
      {selectedData?.length > 0 && (
        <div className="flex flex-wrap gap-2 my-3">
          {selectedData?.map((el, idx) => (
            <p key={idx} className="tags green-H body-S flex items-center gap-1">
              {el?.name} <CrossIcon role="button" onClick={() => handleRemove(el.id)} />
            </p>
          ))}
        </div>
      )}

      <div className="relative">
        <input
          className="body-N"
          type="text"
          placeholder="Search here"
          value={search}
          onChange={(e) => {
            onSetSearch(e.target.value);
            if (onSetError) {
              onSetError(null);
            }
          }}
        />
      </div>
      {error && <p className="red-D">{error}</p>}

      {options?.length !== 0 && (
        <div className="link-contact-list mt-4 absolute z-10 w-full light-bg-L" style={{ height: `${isWidth ? "250px" : "150px"}` }}>
          {loading ? (
            <Loader />
          ) : (
            options?.map((item, idx) => (
              <label key={idx} className="container flex flex-col items-start mb-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedData?.map((el) => el.id)?.includes(item?.id)}
                    onChange={() => {
                      handleCheckboxChange(item);
                    }}
                  />
                  <span className="checkmark mr-2"></span>
                  <p className="head-6">{`${item?.first_name} ${item?.last_name}`}</p>
                </div>
                {item?.email && item?.email?.length > 0 && <p className="body-ES">{item?.email[0]?.email_id}</p>}
              </label>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelectSearchDropdown;
