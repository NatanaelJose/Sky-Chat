import { useState } from "react";
import { handleEmail } from "./services/firebaseConfig";

const LoginForm = ({ onBackButtonClick }: any) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  function handleRegister() {
    setIsRegister((prevIsRegister) => !prevIsRegister);
  }

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { userName, email, password } = formData;
    const result = await handleEmail(
      userName,
      email,
      password,
      isRegister ? "register" : "login"
    );
    if (result === "Registration successful" || result === "Login successful") {
      console.log(result);
    } else {
      console.error(result);
    }
    setFormData({
      userName: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className="w-2/6 md:w-2/5 lg:w-1/3 h-auto mx-auto flex flex-col justify-around items-center bg-gray-800 rounded-2xl p-6">
      <p className="dark:text-white text-2xl mb-4">
        {isRegister
          ? "Registre-se para acessar nosso Chat!"
          : "Faça seu login para acessar nosso Chat!"}
      </p>
      <form
        className="flex flex-col w-full justify-center items-center"
        onSubmit={handleSubmit}
      >
        {isRegister ? (
        <div className="w-5/6 mb-6">
        <label htmlFor="userName" className="dark:text-white font-semibold">
           Nome:
        </label>
        <input
          className="w-full mt-1 rounded-md h-7 pl-1 border border-blue-500 focus:outline-none"
          type="text"
          name="userName"
          id="userName"
          value={formData.userName}
          onChange={handleInputChange}
        />
      </div>
        ) : (
          ""
        )}
        <div className="w-5/6 mb-6">
          <label htmlFor="email" className="dark:text-white font-semibold">
            Email:
          </label>
          <input
          className="w-full mt-1 rounded-md h-7 pl-1 border border-blue-500 focus:outline-none"
          type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="w-5/6 mb-2">
          <label htmlFor="password" className="dark:text-white font-semibold">
            Senha:
          </label>
          <input
          className="w-full mt-1 rounded-md h-7 pl-1 border border-blue-500 focus:outline-none"
          type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="flex flex-col w-5/6">
          <a
            onClick={handleRegister}
            className="text-sm text-blue-600 underline mb-1 hover:text-blue-700 cursor-pointer"
          >
            {isRegister
              ? "Já possui uma conta? Clique aqui!"
              : "Não possui uma conta? Registre-se aqui!"}
          </a>
          <a
            className="text-sm text-blue-600 underline mb-5 hover:text-blue-700"
            href="#"
          >
            Esqueceu a senha?
          </a>
        </div>
        {isRegister ? (
          <button
            className=" font-bold bg-blue-500 w-5/6 text-white py-2 px-4 rounded-full hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            type="submit"
          >
            Registrar
          </button>
        ) : (
          <button
            className="font-bold bg-blue-500 w-5/6 text-white py-2 px-4 rounded-full hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            type="submit"
          >
            Entrar
          </button>
        )}
        <button
          className="mt-3 text-sm text-gray-500 underline hover:text-gray-700 cursor-pointer"
          onClick={onBackButtonClick}
        >
          Voltar
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
