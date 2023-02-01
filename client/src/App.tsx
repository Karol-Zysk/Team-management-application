import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import SignUpForm from "./pages/Login/SignUp";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <div>
        <SignUpForm />
      </div>
    </div>
  );
}

export default App;
