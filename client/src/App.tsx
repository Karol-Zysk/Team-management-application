import Views from "./components/Views";
import { AccountContextProvider } from "./context/AccountContext";

function App() {
  return (
    <AccountContextProvider>
      <Views />
    </AccountContextProvider>
  );
}

export default App;
