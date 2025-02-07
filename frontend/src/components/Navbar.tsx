import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Scan, User } from "lucide-react"; // Icons

// For not displaying the Navbar on a specific page, you can use the context API. Here is an example:
// import { useNavbar } from "../contexts/navbarContext";

const navItems = [
  { name: "Home", path: "/", icon: <Home size={30} /> },
  { name: "Scan", path: "/scan", icon: <Scan size={30} /> },
  { name: "Profile", path: "/profile", icon: <User size={30} /> },
];

const Navbar = () => {
  const [active, setActive] = useState("Home"); // Default selected: Home
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/") setActive("Home");
    else if (location.pathname === "/scan") setActive("Scan");
    else if (location.pathname === "/profile") setActive("Profile");
  }, [location.pathname]);

  // const { showNavbar } = useNavbar();
  // if (!showNavbar) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white backdrop-blur-lg shadow-xl flex gap-6 px-6 py-3 rounded-full border border-white"
    >
      {navItems.map((item) => (
        <motion.div
          key={item.name}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center cursor-pointer"
          onClick={() => setActive(item.name)}
        >
          <Link to={item.path} className="text-green-950 flex items-center">
            {item.icon}
            {active === item.name && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-lg font-medium ml-2"
              >
                {item.name}
              </motion.div>
            )}
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Navbar;
