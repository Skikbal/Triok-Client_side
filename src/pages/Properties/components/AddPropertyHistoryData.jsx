import React from "react";
import InputWithIcon from "../../../components/InputWithIcon";
import dollor from "../../../assets/icons/dollar.svg";
import moment from "moment";

const AddPropertyHistoryData = ({ handleSubmit, clearError, formData, onSetFormData, error, handleCancel }) => {
  const handleChange = (value, name) => {
    onSetFormData({ ...formData, [name]: value });
  };

  return (
    <form className="py-3" onSubmit={handleSubmit}>
      <div className="flex-1 mt-3">
        <div className="w-[100%]  md:mt-0">
          <label className="dark-H head-4 mb-2">Sold Price
            <span className=" red-D">*</span>
          </label>
          <InputWithIcon
            icon={dollor}
            type="number"
            min="0"
            placeholder="Write property sold price"
            value={formData?.sold_price}
            onChange={(e) => {
              handleChange(e.target.value, "sold_price");
              clearError("sold_price");
            }}
            onWheel={(e) => e.target.blur()}
          />
        </div>
        {error?.sold_price && <p className="body-S red-D">{error.sold_price}</p>}
      </div>

      <div className="flex-1 mt-3">
        <div className="w-[100%] mt-6 md:mt-0">
          <label className="dark-H head-4 mb-2">Sold Date
            <span className="red-D">*</span>
          </label>
          <input
            className="body-N"
            type="date"
            max={moment().format("YYYY-MM-DD")}
            placeholder="select property sold date"
            value={formData?.sold_date}
            onChange={(e) => {
              handleChange(e.target.value, "sold_date");
              clearError("sold_date");
            }}
          />
        </div>
        {error?.sold_date && <p className="body-S red-D">{error.sold_date}</p>}
      </div>

      <div className="mt-6">
        <button type="submit" className="save-button light-L head-5 w-50 green-bg-H">
          Save
        </button>
        <button type="button" onClick={handleCancel} className="green-H ml-5">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddPropertyHistoryData;
