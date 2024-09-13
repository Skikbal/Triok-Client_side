import React, { createContext, useContext, useState } from "react";
const SelectedOptionsContext = createContext();

export const SelectedOptionsProvider = ({ children }) => {
  const [isDeletedactivity, setIsDeletedactivity] = useState(false);
  const [isEditedactivity, setIsEditedactivity] = useState(false);
  const [isactivityDataSentSuccessfully, setIsactivityDataSentSuccessfully] = useState(false);
  const [propertyEditdata, setPropertyEditdata] = useState("");

  return (
    <SelectedOptionsContext.Provider
      value={{
        isDeletedactivity,
        setIsDeletedactivity,
        isEditedactivity,
        setIsEditedactivity,
        isactivityDataSentSuccessfully,
        setIsactivityDataSentSuccessfully,
        propertyEditdata,
        setPropertyEditdata,
      }}
    >
      {children}
    </SelectedOptionsContext.Provider>
  );
};

export const useSelectedOptions = () => {
  const context = useContext(SelectedOptionsContext);
  if (context === undefined) {
    throw new Error("useSelectedOptions must be used within a SelectedOptionsProvider");
  }
  return context;
};
