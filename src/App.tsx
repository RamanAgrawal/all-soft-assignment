import { Link } from "react-router-dom";
import "./App.css";
import { useUser } from "./context/UserContext";
import FileSearch from "./components/FileSearch";
import FileUpload from "./components/Fileuplaod";
import { useState } from "react";


/**
 * App component
 * @returns JSX.Element
 */
const App = () => {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  const { userdata, setUserdata } = useUser();

  if (!userdata) {
    return (
      <div className="w-full max-h-[90vh] flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold">Please Login</h1>
        <Link
          to="/login"
          className="border px-4 py-2 mt-4 text-blue-500 hover:text-blue-700"
        >
          Click Here to Login
        </Link>
      </div>
    );
  }

  const handleShowComponent = (component: string) => {
    setActiveComponent(component);
  };

  const handleHideComponent = () => {
    setActiveComponent(null);
  };

  return (
    <div className="h-[80vh] p-4 mt-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Welcome {userdata.user_id}</h1>
        <div className="flex justify-center space-x-4 mb-4 flex-wrap">
          <button
            onClick={() => handleShowComponent("upload")}
            className="border px-5 h-12 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Upload a file
          </button>
          <button
            onClick={() => handleShowComponent("search")}
            className="border px-5 h-12 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Search a file
          </button>
        </div>
      </div>
      <button
        onClick={() => setUserdata(null)}
        className="border absolute top-10 right-10 px-5 h-12 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>

      {activeComponent === "upload" && (
        <FileUpload onCancel={handleHideComponent} />
      )}
      {activeComponent === "search" && (
        <FileSearch onCancel={handleHideComponent} />
      )}
    </div>
  );
};

export default App;
