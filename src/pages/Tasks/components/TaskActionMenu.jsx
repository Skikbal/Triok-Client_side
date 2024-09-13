import React, { useEffect, useRef, useState } from "react";
import { handleDropdownClose } from "../../../utils/utils";
import { HiDotsVertical as Menu } from "react-icons/hi";

const TaskActionMenu = ({ options, handleSelect }) => {
  const menuRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClose = () => {
      setIsOpen(false);
    };
    handleDropdownClose(menuRef, handleClose);
  }, []);

  return (
    <div>
      <div className="flex gap-2">
        <div ref={menuRef} className="custom-dropdown">
          <div role="button" className="pt-0.5" onClick={() => setIsOpen(!isOpen)}>
            <Menu />
          </div>

          {isOpen && (
            <ul className="dropdown-list-container dropdown-end light-bg-L dark-M body-N p-2 shadow rounded-box" style={{ width: "180px" }}>
              {options?.map((item, i) => (
                <li
                  key={i}
                  role="button"
                  className={`${i !== 0 ? "mt-2" : ""} ${item === "Delete" ? "red-D" : ""}`}
                  onClick={() => {
                    handleSelect(item);
                    setIsOpen("");
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskActionMenu;
