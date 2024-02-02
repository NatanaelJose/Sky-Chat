const LoginForm = () => {
  return (
    <div className="w-2/5 h-4/5 flex flex-col justify-center items-center bg-gray-800 rounded-2xl">
    <p className="dark:text-white ">
        Faça seu Login para acessar nosso website
      </p>
      <form action="" method="post" className="flex flex-col">
        <label htmlFor="email" className="dark:text-white  flex flex-col">
          Email:
          <input type="email" name="email" id="email" required />
        </label>

        <label htmlFor="password" className="dark:text-white flex flex-col">
          Senha:
          <input type="password" name="password" id="password" required />
        </label>
      </form>
    </div>
  );
};

export default LoginForm;
