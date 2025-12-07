import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="ml-4 flex h-24 border-2 border-gray-300 p-3 text-gray-700 shadow-md">
        <h1 class="text-3xl font-bold text-red-500 underline">Hello world!</h1>
      </div>
    </>
  );
}

export default App;
