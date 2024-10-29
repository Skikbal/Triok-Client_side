import React, { useState, useEffect, useRef } from "react";
import { NotificationManager } from "react-notifications";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Header.css";
import useAuth from "../../hooks/useAuth";
import { BASE_URL } from "../../utils/Element";
import NotesModal from "./components/NotesModal";
import Logout from "../../assets/svgs/Logout.svg";
import avatar from "../../assets/images/avatar.png";
import Profile from "../../assets/svgs/profile.svg";
import Setting from "../../assets/svgs/Setting.svg";
import Arrow from "../../assets/svgs/angle down.svg";
import { useDispatch, useSelector } from "react-redux";
import { handleDropdownClose } from "../../utils/utils";
import {
  setConnectedAppData,
  setIsShowSettingSidebar,
  setIsSidebarCollapsed,
  setToken,
  setUserData,
  setUserType,
} from "../../redux/Action/AuthActions";

const options = [
  { name: "My Profile", icon: Profile, link: "/settings/profile" },
  { name: "Settings", icon: Setting, link: "/settings/contact-archive" },
  { name: "Logout", icon: Logout, link: "/logout" },
];

const Header = () => {
  const [config] = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserProfileData] = useState();
  const [showModal, setShowModal] = useState(false);
  const userType = useSelector((state) => state.userType);
  const userDetails = useSelector((state) => state.userDetails);
  const dropdownOptions =
    userType === 3 ? options?.filter((el) => el.name !== "Settings") : options;

  const fetchProfile = () => {
    axios
      .get(`${BASE_URL}/get-profile`, config)
      .then((res) => {
        setUserProfileData(res?.data?.data);
      })
      .catch((err) => {
        if (
          err.response?.data?.message &&
          err.response?.data?.message !== "Too Many Attempts."
        ) {
          NotificationManager.error(err.response?.data?.message);
        }
      });
  };

  // useEffect(() => {
  //   if (userData === undefined) {
  //     fetchProfile();
  //   }
  // }, [userData]);

  const handleLogOut = () => {
    navigate("/login");
    dispatch(setToken(null));
    dispatch(setUserType(null));
    dispatch(setUserData(null));
    dispatch(setConnectedAppData(null));
    dispatch(setIsShowSettingSidebar(false));
    localStorage.clear();
  };

  useEffect(() => {
    const handleClose = () => {
      setIsOpen(false);
    };
    handleDropdownClose(sidebarRef, handleClose);
  }, []);

  return (
    <div className="header light-bg-L">
      <div className="left-section">
        {/* <div className="search-box mr-5">
          <input type="text" className="body-N" placeholder="Search..." />
        </div> */}
      </div>

      <div className="right-section">
        <>
          {/* <button className="body-S green-H  mr-5 tags mt-[5px]" onClick={() => setShowModal(true)}>
            All Note
          </button> */}
          <img
            src={
              userDetails?.profile_photo ? userDetails?.profile_photo : avatar
            }
            alt="user"
            className="user-image rounded-full "
          />

          <div ref={sidebarRef} className="custom-dropdown">
            <div className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
              <p className="head-5 dark-H capitalize">
                {userDetails?.first_name} {userDetails?.last_name}
              </p>
              <img
                src={Arrow}
                alt="Dropdown Arrow"
                className="dropdown-arrow"
              />
            </div>

            {isOpen && (
              <div
                className="dropdown-list-container dropdown-end green-bg-H light-L"
                // style={{ width: `${userType === 1 ? "280px" : ""}` }}
              >
                <ul className="dropdown-list">
                  <li className="profile-image" onClick={() => navigate("/")}>
                    <img
                      src={
                        userDetails?.profile_photo
                          ? userDetails?.profile_photo
                          : avatar
                      }
                      alt="icon"
                      className="rounded-full h-[50px] w-[50px]"
                    />
                    <p className="mt-2 head-4 light-L capitalize">
                      {userDetails?.first_name} {userDetails?.last_name}
                    </p>
                  </li>

                  <hr className="my-2 green-L" />

                  {/* {userType === 1 && (
                    <>
                      <div className="flex items-center gap-3">
                        <img src={Logo} alt="" className="rounded-full h-[45px] w-[45px]" />
                        <div>
                          <p className="head-5 light-L">Tri-Oak Consulting Group</p>
                          <p className="body-S light-H">Tri-Oak Consulting Group</p>
                        </div>
                      </div>

                      <hr className="my-3 green-L" />
                    </>
                  )} */}

                  {dropdownOptions.map((option, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        if (option.name === "Logout") {
                          handleLogOut();
                        } else {
                          if (userType !== 3) {
                            dispatch(setIsShowSettingSidebar(true));
                            dispatch(setIsSidebarCollapsed(false));
                          }
                          navigate(option.link);
                        }
                      }}
                      className="hover:bg-none"
                    >
                      <img src={option.icon} alt="icon" />{" "}
                      <p className="ml-2 body-L light-L">{option.name}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      </div>

      <NotesModal showModal={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default Header;
