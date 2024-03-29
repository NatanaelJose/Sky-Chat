import { auth } from "./services/firebaseConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ProfilePic } from "./Profile";
import { Link } from "react-router-dom";



const NavBar = ({ isSelected, navVisible, setNavVisible }: any) => {
  const user = auth.currentUser;

  return (
    <div className="relative flex flex-row">
      <button
        className="absolute top-0 left-0 sm:hidden my-7 mx-4"
        onClick={() => setNavVisible(!navVisible)}
      >
        {navVisible ? (
          <FontAwesomeIcon icon="arrow-left" className="text-white text-3xl bg-sky-900 dark:bg-gray-800 p-3 rounded-xl" />
        ) : (
          <FontAwesomeIcon icon="bars" className="text-white text-3xl bg-sky-900 dark:bg-gray-800 p-3 rounded-xl" />
        )}
      </button>

      <div
        className={`${
          navVisible ? "w-20" : "w-0"
        } h-screen flex flex-col justify-center dark:bg-gray-800 bg-sky-600 transition-width duration-300 ease-in-out`}
      >
        <div className="h-5/6 w-full mt-7 flex flex-col items-center justify-evenly">
        <Link to="/global">
          <div
              className={`${
                isSelected === 1 ? "dark:bg-gray-950 bg-sky-900" : ""
              } p-3 rounded-xl h-12 w-12 transition-transform duration-300 transform hover:scale-110 flex items-center justify-center cursor-pointer ${
                navVisible ? "" : "hidden"
              }`}
            >
              <FontAwesomeIcon icon="home" className="text-white text-3xl" />
            </div>
        </Link>
        <Link to="/contats">
          <div
            className={`${
              isSelected === 2 ? "dark:bg-gray-950 bg-sky-900" : ""
            } p-3 rounded-xl h-12 w-12 transition-transform duration-300 transform hover:scale-110 flex items-center justify-center cursor-pointer ${
              navVisible ? "" : "hidden"
            }`}
          >
            <FontAwesomeIcon icon="comment" className="text-white text-3xl" />
          </div>
        </Link>
          <Link to="/config">
            <div
              className={`${
                isSelected === 3 ? "dark:bg-gray-950 bg-sky-900" : ""
              } p-3 rounded-xl h-12 w-12 transition-transform duration-300 transform hover:scale-110 flex items-center justify-center cursor-pointer ${
                navVisible ? "" : "hidden"
              }`}
            >
              <FontAwesomeIcon icon="cog" className="text-white text-3xl" />
            </div>
          </Link>

        </div>
        {user && navVisible ? <ProfilePic /> : ""}
      </div>
    </div>
  );
};

export default NavBar;
