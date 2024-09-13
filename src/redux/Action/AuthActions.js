export const setToken = (token) => ({
  type: "SET_TOKEN",
  payload: {
    token,
  },
});

export const setUserType = (userType) => ({
  type: "SET_USER_TYPE",
  payload: {
    userType,
  },
});

export const setUserData = (userDetails) => ({
  type: "SET_USER_DATA",
  payload: {
    userDetails: userDetails,
  },
});

export const setConnectedAppData = (connectedAppData) => ({
  type: "SET_CONNECTED_APP_DATA",
  payload: {
    connectedAppData: connectedAppData,
  },
});

export const setIsSidebarCollapsed = (isCollapsed) => ({
  type: "SET_SIDEBAR_COLLAPSED",
  payload: {
    isSidebarCollapsed: isCollapsed,
  },
});

export const setIsShowSettingSidebar = (isShow) => ({
  type: "SET_SETTING_SIDEBAR",
  payload: {
    isShowSettingSidebar: isShow,
  },
});

export const setPropertyData = (propertyData) => ({
  type: "SET_PROPERTY_DATA",
  payload: {
    propertyData,
  },
});
