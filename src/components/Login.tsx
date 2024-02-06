import googleSvg from "../assets/svgs/google.svg";
import envelopeSvg from "../assets/svgs/square-envelope-solid.svg";
import { handleGoogleSignIn } from "./services/firebaseConfig";
import { Link } from "react-router-dom";

interface SignInButtonProps {
  src: string;
  loginText: string;
  activate?: () => void;
}

const SignInButton: React.FC<SignInButtonProps> = ({
  src,
  loginText,
  activate,
}) => {
  return (
    <div
      className="w-full border-box p-1 dark:bg-white dark:hover:bg-gray-200 flex flex-row justify-center items-center py-3 font-sans font-semibold border border-solid shadow-md rounded-lg mb-3 transition duration-300 ease-in-out hover:bg-gray-100 cursor-pointer shadow-slate-300 "
      onClick={activate}
    >
      <img
        className="w-12 h-12 object-cover"
        src={src}
        alt={`${loginText} Icon`}
      />
      <button className="ml-4 text-lg"> {loginText} </button>
    </div>
  );
};

const Login: React.FC = () => {
  return (
    <div className="w-full h-screen bg-gray-950 flex flex-row justify-center items-center">
      <div className="w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 h-4/5 flex flex-col justify-center items-center">
        <h2 className="dark:text-white text-xl mb-3">
          Faça Login para Acessar o Sky Chat!
        </h2>
        <SignInButton
          src={googleSvg}
          loginText="Logar com o Google!"
          activate={handleGoogleSignIn}
        />
        <Link to="/login" className="flex flex-row justify-center w-full">
          <SignInButton src={envelopeSvg} loginText="Logar com o E-mail!" />
        </Link>
      </div>
    </div>
  );
};

export default Login;
