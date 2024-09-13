import "./Sidebar.css";
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Tooltip } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import Logo from "../../assets/images/Logo.png";
import Tasks from "../../assets/icons/tasks.svg";
import Leads from "../../assets/icons/leads.svg";
import User from "../../assets/icons/account.svg";
import Logo2 from "../../assets/images/Logo2.png";
import Buyers from "../../assets/icons/buyers.svg";
import Offers from "../../assets/icons/offers.svg";
import { CgMenu as MenuIcon } from "react-icons/cg";
import Smart from "../../assets/icons/smart-plans.svg";
import Document from "../../assets/icons/document.svg";
import Home from "../../assets/icons/home-outline.svg";
import Contacts from "../../assets/icons/contacts.svg";
import Proposals from "../../assets/icons/proposals.svg";
import LeftArrow from "../../assets/svgs/left-arrow.svg";
import Companies from "../../assets/icons/companies.svg";
import Properties from "../../assets/icons/properties.svg";
import Exclusives from "../../assets/icons/exclusives.svg";
import RightArrow from "../../assets/svgs/right-arrow.svg";
import ContractClose from "../../assets/icons/approve file.svg";
import { MdOutlineArrowBack as BackIcon } from "react-icons/md";
import { setIsShowSettingSidebar, setIsSidebarCollapsed } from "../../redux/Action/AuthActions";

const sidebarOptions = [
  { name: "Home", icon: Home, link: "/" },
  { name: "Users", icon: User, link: "/users" },
  { name: "Contacts", icon: Contacts, link: "/contacts" },
  { name: "Companies", icon: Companies, link: "/companies" },
  { name: "Properties", icon: Properties, link: "/properties" },
  { name: "Buyers", icon: Buyers, link: "/buyers", hasBottomBorder: true, specialClass: true },
  { name: "Tasks", icon: Tasks, link: "/tasks" },
  { name: "TouchPlans", icon: Smart, link: "/touch-plans", hasBottomBorder: true, specialClass: true },
  { name: "Leads", icon: Leads, link: "/leads" },
  { name: "Proposals", icon: Proposals, link: "/proposals", hasBottomBorder: true, specialClass: true },
  { name: "Exclusives", icon: Exclusives, link: "/exclusives" },
  { name: "Offers", icon: Offers, link: "/offers" },
  { name: "Under Contract", icon: Document, link: "/under-contract" },
  { name: "Contract to Close", icon: ContractClose, link: "/contact-close" },
  { name: "Closed", icon: Document, link: "/closed" },
];

const settingOptions = [
  { name: "Contact Archive", link: "/settings/contact-archive" },
  { name: "Company Archive", link: "/settings/company-archive" },
  { name: "Property Archive", link: "/settings/property-archive" },
  { name: "Buyer Archive", link: "/settings/buyer-archive", hasBottomBorder: true },
  { name: "Contact Tags", link: "/settings/contact-tags" },
  { name: "Property Tags", link: "/settings/property-tags", hasBottomBorder: true },
  { name: "Property Types", link: "/settings/property-types" },
  { name: "Lead Sources", link: "/settings/lead-sources" },
  { name: "Tenant", link: "/settings/tenant" },
  { name: "Designated Agents", link: "/settings/designated-agents" },
  { name: "Connected App", link: "/settings/connected-app" },
  { name: "My Profile", link: "/settings/profile" },
];

const SidebarComponent = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const userType = useSelector((state) => state.userType);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const isSidebarCollapsed = useSelector((state) => state.isSidebarCollapsed);
  const isShowSettingSidebar = useSelector((state) => state.isShowSettingSidebar);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  useEffect(() => {
    if (location?.pathname?.includes("settings")) {
      // dispatch(setIsSidebarCollapsed(true));
      dispatch(setIsShowSettingSidebar(true));
    } else {
      dispatch(setIsSidebarCollapsed(false));
      dispatch(setIsShowSettingSidebar(false));
    }
  }, [location.pathname]);

  const sidebarList = userType === 3 ? sidebarOptions?.filter((el) => el.name !== "Users") : sidebarOptions;

  return (
    <>
      <button className="toggle-button" onClick={toggleSidebar}>
        {isSidebarVisible ? <BackIcon /> : <MenuIcon size={20} />}
      </button>

      <div className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""} ${isSidebarVisible ? "visible" : ""}`}>
        <div className={`${isSidebarCollapsed ? "top-section-collapsed" : "top-section"}`}>
          <div>
            <NavLink to="/">
              <img src={isSidebarCollapsed ? Logo2 : Logo} alt="Logo" />
            </NavLink>
          </div>

          {isShowSettingSidebar ? null : (
            <button
              onClick={() => {
                dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
              }}
            >
              <img src={isSidebarCollapsed ? RightArrow : LeftArrow} alt="Collapse Icon" className="arrow-icon" />
            </button>
          )}
        </div>

        {isShowSettingSidebar ? (
          <ul className={`flex gap-1 ${isSidebarCollapsed ? "options-collapsed" : "options"}`} style={{ width: "100%" }}>
            <div style={{ width: "24%" }} className={`middle_sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
              {sidebarList.map((option, index) => (
                <Tooltip key={index} placement="right" label={option.name}>
                  <li
                    onClick={() => {
                      dispatch(setIsShowSettingSidebar(false));
                    }}
                    className={`option ${isSidebarCollapsed ? "w-fit" : ""} ${option.hasBottomBorder ? "border-bottom" : ""} ${option.specialClass ? "special-class" : ""} ${option.setting_only ? "setting_only" : ""} ${option.blog_only ? "blog_only" : ""}`}
                  >
                    <NavLink to={option.link} className={`option-link body-N ${isSidebarCollapsed ? "collapsed" : ""}`} activeclassname="">
                      <img src={option.icon} alt="icon" className="sidebar-icons" />
                    </NavLink>
                  </li>
                </Tooltip>
              ))}
            </div>

            <div className="w-[90%]">
              <p className="dark-H head-4 pt-3 pl-2">Settings</p>
              {settingOptions.map((option, index) => (
                <li
                  key={index}
                  // onClick={() => {
                  //   setIsShowSettingSidebar(false);
                  // }}
                  className={`option ${isSidebarCollapsed ? "w-fit" : ""} ${option.hasBottomBorder ? "border-bottom" : ""} ${option.specialClass ? "special-class" : ""} ${option.setting_only ? "setting_only" : ""} ${option.blog_only ? "blog_only" : ""}`}
                >
                  <NavLink to={option.link} className={`option-link body-N ${isSidebarCollapsed ? "collapsed" : ""}`} activeclassname="">
                    <p className="text-left">{option.children ? <>{option.name}</> : option.name}</p>
                  </NavLink>
                </li>
              ))}
            </div>
          </ul>
        ) : (
          <ul className={`${isSidebarCollapsed ? "options-collapsed" : "options"}`} style={{ width: "100%" }}>
            <div className={`middle_sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
              {sidebarList.map((option, index) => (
                <Tooltip key={index} placement="right" isDisabled={isSidebarCollapsed === false || !isShowSettingSidebar === false} label={option.name}>
                  <li
                    onClick={() => {
                      dispatch(setIsShowSettingSidebar(false));
                    }}
                    className={`option ${isSidebarCollapsed ? "w-fit" : ""} ${option.hasBottomBorder ? "border-bottom" : ""} ${option.specialClass ? "special-class" : ""} ${option.setting_only ? "setting_only" : ""} ${option.blog_only ? "blog_only" : ""}`}
                  >
                    <NavLink to={option.link} className={`option-link body-N ${isSidebarCollapsed ? "collapsed" : ""}`} activeclassname="">
                      <img src={option.icon} alt="icon" className="sidebar-icons" />
                      {!isSidebarCollapsed && <p className="ml-3 body-N text-left">{option.children ? <>{option.name}</> : option.name}</p>}
                    </NavLink>
                  </li>
                </Tooltip>
              ))}
            </div>
          </ul>
        )}
      </div>
    </>
  );
};

export default SidebarComponent;
