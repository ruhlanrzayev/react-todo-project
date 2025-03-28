import { Link } from 'react-router-dom';
import favIcon from '../assets/icon.jpg';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext.jsx';

const sun = 'fa-sun';
const moon = 'fa-moon';

function Home() {
  const { theme, setTheme } = useContext(ThemeContext);

  const changeTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");  
  };

  return (
    <div className="h-screen w-screen p-[50px] super-container flex items-center justify-center flex-col bg-[#eeeaea] dark:bg-[#242424] relative" id="superContainer">
      <div className="change-theme">
        <button className={`fa-solid ${theme === "light" ? moon : sun} rounded-[50%] px-4 py-3 bg-black text-amber-50 hover:border-[#333] dark:px-3 focus:outline-none focus:ring-0 absolute right-[25px] top-[25px]`} onClick={changeTheme}>
        </button>
      </div>
      <div className="image-content">
        <img className="w-[180px] sm:w-[250px] md:w-[300px]" src={favIcon} alt="website image" />
      </div>
      <div className="text-content flex items-center justify-center flex-col">
        <div className="select-none top-text text-[#242424] dark:text-amber-50 text-center text-[.75em] max-w-[250px] sm:text-xl md:text-2xl sm:max-w-[400px] md:max-w-[600px]">
          A simple and intuitive to-do list website designed to help you organize tasks. Manage your daily tasks quickly
          and efficiently with <span className="text-orange-600">our intuitive to-do list platform.</span>
        </div>
        <div className="alt-text flex items-center justify-center flex-col my-4">
          <Link
            to="/todo"
            className="bg-orange-600 rounded-2xl px-[10px] py-[5px] text-amber-50 font-bold text-[12px] sm:px-[15px] md:px-[20px] sm:py-[10px] md:py-[10px] sm:rounded-[40px] sm:text-xl sm:transition ease duration-300 hover:bg-orange-500 dark:hover:bg-orange-700 hover:text-amber-50"
          >
            GET STARTED NOW!
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
