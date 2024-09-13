import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import Dropdown from "react-dropdown";
import Modal from "../../../components/Modal/Modal";
import PhoneField from "../../../components/AddDataComponents/PhoneField";
import EmailField from "../../../components/AddDataComponents/EmailField";
import { languageOptions, stateOptions } from "../../../utils/options";
import DateDropdown from "../../../components/Dropdowns/DateDropdown";
import { AiOutlineDelete as DeleteIcon } from "react-icons/ai";
import { PiImage as ImageIcon } from "react-icons/pi";
import DeleteConfirmationModal from "../../ConfirmationModals/DeleteConfirmationModal";
import moment from "moment";
import axios from "axios";
import { BASE_URL } from "../../../utils/Element";
import useAuth from "../../../hooks/useAuth";
import avatar from "../../../assets/images/avatar.png";
import { NotificationManager } from "react-notifications";

const initialPhoneData = [{ phone_category: "", country_code: "+1", phone_number: "", ext: "" }];
const initialDateData = { date: "", month: "", year: "" };

const specialtiesOptions = [
  { value: "net-lease", label: "Net-Lease" },
  { value: "retail", label: "Retail" },
  { value: "investment properties", label: "Investment Properties" },
];

const EditProfileModal = ({ showModal, onClose, userData, fetchProfile }) => {
  const imageRef = useRef();
  const [config, configFormData] = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState();
  const [phones, setPhones] = useState(initialPhoneData);
  const [emails, setEmails] = useState([{ email_category: "", email: "" }]);
  const [profileData, setProfileData] = useState({
    profileImage: "",
    firstName: "",
    lastName: "",
    bio: "",
    serviceAreas: [],
    specialties: [],
    language: [],
    birthday: "",
    licenseNumber: "",
    licenseState: "",
    license_expiry_date: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (value, name) => {
    setProfileData({ ...profileData, [name]: value });
  };

  const clearError = (name) => {
    setError({ ...error, name: "" });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setError((prevErrors) => ({
        ...prevErrors,
        profile_photo: "",
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        // setProfileData({ ...userData, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  useEffect(() => {
    if (userData) {
      setImagePreview(userData?.profile_photo);
      setProfileData({
        profileImage: userData?.profile_photo,
        firstName: userData?.first_name,
        lastName: userData?.last_name,
        bio: userData?.my_bio,
        serviceAreas: userData?.service_areas,
        specialties: userData?.specialties,
        language: userData?.language,
        license_expiry_date: userData?.license_expiry_date,
        birthday: userData?.birthday,
        licenseDate: { date: moment(userData?.license_expiry_date).date(), month: moment(userData?.license_expiry_date).month() + 1, year: moment(userData?.license_expiry_date).year() },
        licenseNumber: userData?.real_estate_licence?.licence_number,
        licenseState: userData?.real_estate_licence?.state,
      });
      setPhones(userData?.phone !== null ? userData?.phone : initialPhoneData);
      setEmails(userData?.user_email !== null ? userData?.user_email : [{ email_category: "", email: "" }]);
    }
  }, [userData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      profile_photo: imageFile,
      first_name: profileData?.firstName,
      last_name: profileData.lastName,
      my_bio: profileData.bio,
      phone: phones,
      user_email: emails,
      service_areas: profileData.serviceAreas,
      specialties: profileData.specialties,
      birthday: profileData.birthday,
      language: profileData?.language,
      real_estate_licence: { licence_number: profileData.licenseNumber, state: profileData.licenseState },
      license_expiry_date: profileData.license_expiry_date,
    };

    axios
      .post(`${BASE_URL}/edit-profile`, dataToSend, configFormData)
      .then((res) => {
        fetchProfile();
        onClose();
        setShowDeleteModal();
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  const handleDelete = () => {
    axios
      .delete(`${BASE_URL}/delete-profile-image`, config)
      .then((res) => {
        setShowDeleteModal(false);
        fetchProfile();
        onClose();
        setImagePreview("");
        setImageFile(null);
        setProfileData({ ...profileData, profileImage: "" });
        if (res?.data?.message) {
          NotificationManager.success(res?.data?.message);
        }
      })
      .catch((err) => {
        if (err.response?.data?.message && err.response?.data?.message !== "Too Many Attempts.") {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  return (
    <Modal title={"My Profile"} desc={"Update your personal details and preferences here."} show={showModal} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div>
          <div className="flex gap-4">
            <img src={imagePreview ? imagePreview : avatar} alt="" className="rounded-full" height={"80px"} width={"80px"} />
            <div>
              <p className="head-4 dark-H">Profile Photo</p>
              <p className="body-S dark-M mt-1">Upload a photo to personalize your profile.</p>

              <div className="head-6 flex justify-between items-center mt-4">
                <input className="hidden" ref={imageRef} type="file" onChange={handleImageUpload} />
                <div role="button" onClick={() => imageRef.current.click()} className="green-H flex items-center gap-1">
                  <ImageIcon size={20} />
                  <p>Choose Image</p>
                </div>
                <div role="button" onClick={() => setShowDeleteModal(true)} className="red-D flex items-center gap-1">
                  <DeleteIcon size={20} />
                  <p>Delete Image</p>
                </div>
              </div>
            </div>
          </div>
          {error?.profile_photo && <span className="body-S red-D">{error?.profile_photo}</span>}
        </div>

        <div className="flex gap-5 mt-6">
          <div>
            <label className="dark-H head-4 mb-2 required:*:">
              First Name<span className="red-D">*</span>
            </label>
            <input
              className="body-N capitalize"
              name="firstName"
              type="text"
              placeholder="write first name here"
              value={profileData.firstName}
              onChange={(e) => {
                clearError("first_name");
                handleChange(e.target.value, "firstName");
              }}
            />
            {error?.first_name && <span className="body-S red-D">{error?.first_name}</span>}
          </div>

          <div>
            <label className="dark-H head-4 mb-2 ">
              Last Name<span className="red-D">*</span>
            </label>
            <input
              className="body-N capitalize"
              name="lastName"
              type="text"
              placeholder="write last name here"
              value={profileData.lastName}
              onChange={(e) => {
                clearError("last_name");
                handleChange(e.target.value, "lastName");
              }}
            />
            {error?.last_name && <span className="body-S red-D">{error?.last_name}</span>}
          </div>
        </div>

        <div className="mt-6">
          <label className="dark-H head-4 mb-2">My Bio</label>
          <textarea
            rows={3}
            className="body-N"
            name="bio"
            type="text"
            placeholder="write contact bio"
            value={profileData.bio}
            onChange={(e) => {
              clearError("bio");
              handleChange(e.target.value, "bio");
            }}
          />
        </div>

        <PhoneField phones={phones} onSetPhones={(value) => setPhones(value)} />

        <EmailField emails={emails} onSetEmails={(value) => setEmails(value)} />

        <div className="mt-6">
          <p className="head-4 dark-H mb-2 ">
            Service Areas<span className="red-D">*</span>
          </p>

          <Select
            isMulti
            className="service-area"
            placeholder="write service area here"
            options={stateOptions}
            value={stateOptions.filter((el) => profileData.serviceAreas?.includes(el?.label))}
            onChange={(options) => {
              clearError("service_areas");
              const values = options?.map((el) => el?.label);
              if (values?.[values?.length - 1] === "Nationwide") {
                setProfileData({ ...profileData, serviceAreas: ["Nationwide"] });
              } else {
                setProfileData({ ...profileData, serviceAreas: values?.filter((el) => el !== "Nationwide") });
              }
            }}
          />
          {error?.service_areas && <span className="body-S red-D">{error?.service_areas}</span>}

          {/* {profileData?.serviceAreas.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {profileData?.serviceAreas?.flatMap((el, idx) => (
                <p className="green-H body-S tags flex items-center gap-1" key={idx}>
                  {el} <CrossIcon />
                </p>
              ))}
            </div>
          )} */}
        </div>

        <div className="mt-6">
          <p className="head-4 dark-H mb-2 ">
            Specialties <span className="red-D">*</span>
          </p>

          <Select
            isMulti
            className="specialties"
            placeholder="write specialties here"
            options={specialtiesOptions}
            value={specialtiesOptions.filter((el) => profileData?.specialties?.includes(el.value))}
            onChange={(options) => {
              clearError("specialties");
              const values = options?.map((el) => el?.value);
              setProfileData({ ...profileData, specialties: values });
            }}
          />
          {error?.specialties && <span className="body-S red-D">{error?.specialties}</span>}
        </div>

        <div className="mt-6">
          <label className="dark-H head-4">
            Birthday <span className="red-D">*</span>
          </label>
          <input
            className="body-N mt-2"
            name="birthday"
            type="date"
            placeholder="write here"
            value={profileData.birthday}
            max={moment().format("YYYY-MM-DD")}
            onChange={(e) => {
              clearError("birthday");
              handleChange(e.target.value, "birthday");
            }}
          />
          {error?.birthday && <span className="body-S red-D">{error?.birthday}</span>}
        </div>

        <div className="mt-6">
          <p className="head-4 dark-H mb-2 ">
            Language <span className="red-D">*</span>
          </p>

          <Select
            isMulti
            className="service-area"
            placeholder="select"
            options={languageOptions}
            value={languageOptions.filter((el) => profileData.language.includes(el.value))}
            onChange={(options) => {
              clearError("language");
              const values = options?.map((el) => el?.value);
              setProfileData({ ...profileData, language: values });
            }}
          />
          {error?.language && <span className="body-S red-D">{error?.language}</span>}
        </div>

        <div className="mt-6">
          <p className="head-4 dark-H mb-2 ">
            Real Estate License <span className="red-D">*</span>
          </p>
          <div className="flex flex-row-reverse items-start" style={{ width: "100%" }}>
            <div style={{ minWidth: "30%" }}>
              <Dropdown
                className="license-select body-N"
                options={stateOptions}
                placeholder="Select"
                value={stateOptions.find((data) => data.label === profileData.licenseState)}
                onChange={(option) => {
                  clearError("licenseState");
                  handleChange(option.label, "licenseState");
                }}
              />
            </div>

            <input
              className="body-N"
              name="licenseNumber"
              type="text"
              placeholder="write license number"
              style={{ borderRadius: "8px 0px 0px 8px", minHeight: "42px", height: "100%" }}
              value={profileData.licenseNumber}
              onChange={(e) => {
                clearError("real_estate_licence");
                handleChange(e.target.value, "licenseNumber");
              }}
            />
          </div>
          {error?.real_estate_licence && <span className="body-S red-D">{error?.real_estate_licence}</span>}
        </div>

        <div className="mt-6">
          <label className="dark-H head-4">
            License Expiry Date <span className="red-D">*</span>
          </label>
          <input
            className="body-N mt-2"
            name="first_deal_anniversary"
            type="date"
            placeholder="write here"
            value={profileData.license_expiry_date}
            max={moment().format("YYYY-MM-DD")}
            onChange={(e) => {
              clearError("license_expiry_date");
              handleChange(e.target.value, "license_expiry_date");
            }}
          />
          {error?.license_expiry_date && <span className="body-S red-D">{error?.license_expiry_date}</span>}
        </div>

        <div className="mt-6">
          <button type="submit" className="save-button light-L head-5 green-bg-H">
            Save
          </button>
          <button type="button" onClick={onClose} className="green-H ml-5">
            Cancel
          </button>
        </div>
      </form>

      <DeleteConfirmationModal showModal={showDeleteModal} onClose={() => setShowDeleteModal(false)} handleDelete={handleDelete} />
    </Modal>
  );
};

export default EditProfileModal;
