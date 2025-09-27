import axios from "axios";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/logout`, {
        withCredentials: true,
      });
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };
  return (
    <div className="bg-gradient-to-r from-[#6A1B9A] to-[#8E24AA] text-white h-14 px-4 flex items-center justify-between shadow-lg md:h-20 md:px-8">
      <h1 className="text-xl font-extrabold tracking-wide md:text-3xl">
        🎟️ Ticket Pilot
      </h1>
      {token && (
        <button
          onClick={handleLogout}
          className="bg-white text-[#6A1B9A] font-semibold px-4 py-2 rounded-full text-sm md:text-base hover:bg-[#f3e5f5] transition duration-200"
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default Navbar;
