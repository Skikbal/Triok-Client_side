import "./App.css";
import axios from "axios";
import { Provider } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import { ChakraProvider } from "@chakra-ui/react";
import { store, persistor } from "../src/redux/Store";
import { NotificationContainer } from "react-notifications";
import { PersistGate } from "redux-persist/integration/react";
import { SelectedOptionsProvider } from "./context/selectedOptionsContext";

function App() {
  const handleLogOut = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      const errorMessage = error;
      // if (errorMessage.response.data.message === "Unauthenticated.") {
      if (errorMessage.response.status === 403) {
        handleLogOut();
      }
      return Promise.reject(error);
    }
  );

  return (
    <ChakraProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SelectedOptionsProvider>
            <div className="App">
              <AppRoutes />
              <NotificationContainer />
            </div>
          </SelectedOptionsProvider>
        </PersistGate>
      </Provider>
    </ChakraProvider>
  );
}

export default App;
