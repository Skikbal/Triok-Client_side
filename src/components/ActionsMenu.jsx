import React, { useEffect, useRef, useState } from "react";
import { HiDotsVertical as MenuIcon } from "react-icons/hi";
import Edit from "../assets/svgs/Pencil.svg";
import Delete from "../assets/svgs/Recycle Bin.svg";
import Menu from "../assets/svgs/Menu.svg";
import { handleDropdownClose } from "../utils/utils";

const ActionsMenu = ({ handleEdit, handleDelete, showOtherOption, handleOtherOption, otherOptionTitle }) => {
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClose = () => {
      setIsOpen(false);
    };
    handleDropdownClose(dropdownRef, handleClose);
  }, []);

  return (
    <div ref={dropdownRef} className="custom-dropdown">
      <div
        role="button"
        className="light-bg-L body-N dark-M "
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
          } else {
            setIsOpen(true);
          }
        }}
      >
        <img src={Menu} alt="icon" className="sidebar-icons" />
        {/* <MenuIcon /> */}
      </div>

      {isOpen && (
        <div className="dropdown-list-container dropdown-end light-bg-L dark-M body-N  shadow rounded-box " style={{ width: `${showOtherOption ? "180px" : "150px"}` }}>
          <ul className="dropdown-list">
            {showOtherOption && (
              <li
                role="button"
                onClick={() => {
                  handleOtherOption();
                  setIsOpen(false);
                }}
              >
                {otherOptionTitle}
              </li>
            )}
            <li
              role="button"
              onClick={() => {
                handleEdit();
                setIsOpen(false);
              }}
            >
              {showOtherOption || otherOptionTitle === "Convert To Proposal" ? "" : <img src={Edit} alt="icon" className="mr-3 sidebar-icons" />} Edit
            </li>
            <li
              className="red-D"
              role="button"
              onClick={() => {
                handleDelete();
                setIsOpen(false);
              }}
            >
              {showOtherOption || otherOptionTitle === "Convert To Proposal" ? "" : <img src={Delete} alt="icon" className="mr-3 sidebar-icons" />} Delete
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ActionsMenu;
