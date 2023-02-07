import { useState } from "react";
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
