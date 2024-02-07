import { auth } from "./services/firebaseConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ProfilePic } from "./Profile";
import { useState } from "react";

const NavBar = ({ isSelected }: any) => {
  const user = auth.currentUser;
  const [navVisible, setNavVisible] = useState(false);

  return (
    <div className="relative">
      <button
        className="toggle-nav-button absolute top-0 left-0 sm:hidden m-5"
        onClick={() => setNavVisible(!navVisible)}
      >
        <FontAwesomeIcon icon="bars" className="text-white text-3xl" />
      </button>
      <div
        className={`${
          navVisible ? "w-20" : "w-0"
        } h-screen flex flex-col justify-center bg-gray-800 transition-width duration-300 ease-in-out`}
      >
        <div className="h-5/6 w-full flex flex-col items-center justify-evenly">
        <div
            className={`${
              isSelected === 1 ? "bg-gray-950" : ""
            } p-3 rounded-xl h-12 w-12 transition-transform duration-300 transform hover:scale-110 flex items-center justify-center cursor-pointer ${
              navVisible ? "" : "hidden"
            }`}
          >
            <FontAwesomeIcon icon="home" className="text-white text-3xl" />
          </div>
          <div
            className={`${
              isSelected === 2 ? "bg-gray-950" : ""
            } p-3 rounded-xl h-12 w-12 transition-transform duration-300 transform hover:scale-110 flex items-center justify-center cursor-pointer ${
              navVisible ? "" : "hidden"
            }`}
          >
            <FontAwesomeIcon icon="comment" className="text-white text-3xl" />
          </div>
          <div
            className={`${
              isSelected === 3 ? "bg-gray-950" : ""
            } p-3 rounded-xl h-12 w-12 transition-transform duration-300 transform hover:scale-110 flex items-center justify-center cursor-pointer ${
              navVisible ? "" : "hidden"
            }`}
          >
            <FontAwesomeIcon icon="cog" className="text-white text-3xl" />
          </div>
        </div>
        {user && navVisible ? <ProfilePic /> : ""}
      </div>
    </div>
  );
};

export default NavBar;
