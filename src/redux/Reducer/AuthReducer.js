const initialState = {
  token: null,
  userDetails: null,
  connectedAppData: null,
  userType: null,
  isSidebarCollapsed: false,
  propertyData: null,
  isShowSettingSidebar: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_TOKEN":
      return {
        ...state,
        token: action.payload.token,
      };

    case "SET_USER_TYPE":
      return {
        ...state,
        userType: action.payload.userType,
      };

    case "SET_CONNECTED_APP_DATA":
      return {
        ...state,
        connectedAppData: action.payload.connectedAppData,
      };

    case "SET_USER_DATA":
      return {
        ...state,
        userDetails: action.payload.userDetails,
      };

    case "SET_SIDEBAR_COLLAPSED":
      return {
        ...state,
        isSidebarCollapsed: action.payload.isSidebarCollapsed,
      };

    case "SET_SETTING_SIDEBAR":
      return {
        ...state,
        isShowSettingSidebar: action.payload.isShowSettingSidebar,
      };

    case "SET_PROPERTY_DATA":
      return {
        ...state,
        propertyData: action.payload.propertyData,
      };

    default:
      return state;
  }
};
export default authReducer;
