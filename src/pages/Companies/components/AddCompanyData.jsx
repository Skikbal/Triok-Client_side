import React from "react";
import PhoneField from "../../../components/AddDataComponents/PhoneField";
import AddressField from "../../../components/AddDataComponents/AddressField";
import DateDropdown from "../../../components/Dropdowns/DateDropdown";

const communicationData = [
  { label: "Do Not Send", value: "do not send" },
  { label: "Do Not Blast", value: "do not blast" },
  { label: "Bad #", value: "bad" },
];

const AddCompanyData = ({ addCompanyData, onSetAddCompanyData, handleSubmit, handleChange, onClose, phones, onSetPhones, addresses, onSetAddresses, disable, error }) => {
  const handleSelectCheck = (value) => {
    if (addCompanyData?.communication?.length === 0) {
      onSetAddCompanyData({ ...addCompanyData, communication: [value] });
    } else {
      const index = addCompanyData?.communication?.indexOf(value);
      if (index === -1) {
        onSetAddCompanyData({ ...addCompanyData, communication: [...addCompanyData?.communication, value] });
      } else {
        const filterData = addCompanyData?.communication?.filter((el) => el !== value);
        onSetAddCompanyData({ ...addCompanyData, communication: filterData });
      }
    }
  };

  return (
    <div>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div>
          <label className="dark-H head-4 mb-2">
            Company Name<span className="red-D">*</span>
          </label>
          <input
            className="body-N capitalize"
            name="companyName"
            type="text"
            placeholder="write company name here"
            value={addCompanyData.companyName}
            onChange={(e) => {
              onSetAddCompanyData({ ...addCompanyData, companyName: e.target.value });
            }}
          />
          {error?.companyname && <p className="body-S red-D pt-1">{error?.companyname}</p>}
        </div>

        <PhoneField phones={phones} onSetPhones={onSetPhones} />

        <div className="mt-6">
          <label className="dark-H head-4">Tags</label>
          <div className="mt-3">
            {communicationData.flatMap((el, i) => (
              <label key={i} className="container">
                <input type="checkbox" checked={addCompanyData?.communication?.includes(el.value)} onChange={() => handleSelectCheck(el.value)} />
                <span className="checkmark"></span>
                <p className="dark-M body-N">{el.label}</p>
              </label>
            ))}
          </div>
        </div>

        <AddressField isApt={false} addresses={addresses} onSetAddresses={onSetAddresses} />

        <hr className="mt-6" />

        <div className="mt-6">
          <label className="dark-H head-4">Tax Record Letter Sent</label>
          <input
            className="body-N mt-2"
            name="tax_record_sent"
            type="date"
            placeholder="write here"
            value={addCompanyData.tax_record_sent}
            onChange={(e) => {
              handleChange(e.target.value, "tax_record_sent");
            }}
          />
          {error?.tax_record_sent && <span className="body-S red-D">{error?.tax_record_sent}</span>}
        </div>

        <div className="mt-6">
          <label className="dark-H head-4 mb-2">Website Link</label>
          <input
            className="body-N"
            name="websiteLink"
            type="text"
            placeholder="write website link"
            value={addCompanyData.websiteLink}
            onChange={(e) => {
              handleChange(e.target.value, "websiteLink");
            }}
          />
        </div>

        <div className="mt-6">
          <label className="dark-H head-4 mb-2">Comments</label>
          <textarea
            rows={3}
            className="body-N"
            name="comment"
            type="text"
            placeholder="write comments here.."
            value={addCompanyData.comment}
            onChange={(e) => {
              handleChange(e.target.value, "comment");
            }}
          />
        </div>

        <div className="mt-6">
          <button type="submit" disabled={disable} className="save-button light-L head-5 green-bg-H">
            Save
          </button>

          <button type="button" onClick={onClose} className="green-H ml-5">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCompanyData;
