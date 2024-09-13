import React from "react";
import Close from "../../assets/svgs/Close.svg";

const Modal = ({ show, title, desc, onClose, children, width = "520px", height }) => {
  return (
    <div className={`${show ? "flex" : "hidden"} fixed inset-0 bg-gray-900 bg-opacity-50 z-10`} id="modal" style={{ justifyContent: "center", alignItems: "center" }}>
      <div className="relative mx-auto py-5 pl-5 border  shadow-lg rounded-2xl bg-white" style={{ width: width, height: height }}>
        <div className="flex justify-between pr-5">
          <p className="head-2 dark-H capitalize">{title}</p>
          <img role="button" src={Close} alt="close" onClick={onClose} />
        </div>
        {desc && <p className="dark-M body-N mt-2">{desc}</p>}
        <div className="mt-[20px] pr-5 overflow-y-auto max-h-[70vh]">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
