import {auth} from './services/firebaseConfig'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ProfilePic } from './Profile';

const NavBar = ({isSelected}:any) => {
  const user = auth.currentUser;

  return (
    <div className="w-20 h-screen flex flex-col justify-center bg-gray-800">
      <div className="h-1/2 w-full flex flex-col items-center justify-evenly">
        <div
          className={`${
            isSelected === 1 ? "bg-gray-950" : ""
          } h-12 w-12 p-3 transition-transform duration-300 transform hover:scale-110 flex items-center justify-center rounded-xl cursor-pointer`}
        >
          <FontAwesomeIcon
            icon="home"
            className="text-white text-3xl"
          />
        </div>
        <div
          className={`${
            isSelected === 2 ? "bg-gray-950" : ""
          } p-3 rounded-xl h-12 w-12 transition-transform duration-300 transform hover:scale-110 flex items-center justify-center cursor-pointer`}
        >
          <FontAwesomeIcon
            icon="comment"
            className="text-white text-3xl"
          />
        </div>
        <div
          className={`${
            isSelected === 3 ? "bg-gray-950" : ""
          } p-3 rounded-xl h-12 w-12 transition-transform duration-300 transform hover:scale-110 flex items-center justify-center cursor-pointer`}
        >
          <FontAwesomeIcon
            icon="cog"
            className="text-white text-3xl"
          />
        </div>
      </div>
      {user ? <ProfilePic/> : ''}
    </div>
  );
};

export default NavBar;
