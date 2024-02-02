import { useState } from "react";

const LoginForm = () => {
  const [isRegister, setIsRegister] = useState(false);

  function handleRegister() {
    setIsRegister(!isRegister);
  }
  return (
    <div className="w-1/6 md:w-2/5 lg:w-1/3 h-96 mx-auto flex flex-col justify-around items-center bg-gray-800 rounded-2xl p-6">
      <p className="dark:text-white text-2xl mb-4">
        {isRegister
          ? "Registre-se para acessar nosso site!"
          : "Faça seu login para acessar nosso Chat!"}
        <span className="text-4xl">☁️</span>
      </p>
      <form className="flex flex-col w-full justify-center items-center">
        <div className="w-5/6 mb-6">
          <label htmlFor="email" className="dark:text-white font-semibold">
            Email:
          </label>
          <input
            className="w-full mt-1 rounded-md h-7 pl-2"
            type="email"
            name="email"
            id="email"
          />
        </div>
        <div className="w-5/6 mb-2">
          <label htmlFor="password" className="dark:text-white font-semibold">
            Senha:
          </label>
          <input
            className="w-full mt-1 rounded-md h-7 pl-2"
            type="password"
            name="password"
            id="password"
            required
          />
        </div>
        <div className="flex flex-col w-5/6">
          <a
            onClick={handleRegister}
            className="text-sm text-blue-600 underline mb-1 hover:text-blue-700 cursor-pointer"
          >
            Não possui uma conta? Registre-se aqui!
          </a>
          <a
            className="text-sm text-blue-600 underline mb-5 hover:text-blue-700"
            href="#"
          >
            Esqueceu a senha?
          </a>
        </div>
        {isRegister ? (
          <button className="bg-blue-500 w-5/6 text-white py-2 px-4 rounded-full hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300">
            Registrar
          </button>
        ) : (
          <button className="bg-blue-500 w-5/6 text-white py-2 px-4 rounded-full hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300">
            Entrar
          </button>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
