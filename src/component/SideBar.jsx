import { NavLink } from "react-router-dom";
import { FaHome, FaFileAlt, FaMapMarkedAlt, FaKey } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";
import { VscGraph } from "react-icons/vsc";

export default function Sidebar() {
  const menuItems = [
    { path: "/home", icon: <FaHome size={28} />, label: "Home" },
    { path: "/poster", icon: <FaFileAlt size={28} />, label: "Automated RP" },
    { path: "/graph", icon: <FaMapMarkedAlt size={28} />, label: "Map" },
    {path: "/plot", icon: <VscGraph size={28} />, label: "Plot" },
  ];

  const bottomItem = { path: "/login", icon: <TbLogout size={28} />, label: "Log Out" };

  return (
    <div className="w-28 min-h-screen bg-gray-600 flex flex-col justify-between py-4">
      {/* Top menu items */}
      <div className="flex flex-col items-center gap-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            state={{ reload: item.path === "/poster" }}
            className={({ isActive }) =>
              `w-full flex flex-col items-center justify-center py-3 text-center transition
               ${isActive ? "bg-green-700 text-white" : "bg-gray-600 text-black hover:bg-green-100"}`
            }
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Bottom token/logout item */}
      <div className="flex flex-col items-center">
        <NavLink
          to={bottomItem.path}
          className={({ isActive }) =>
            `w-full flex flex-col items-center justify-center py-20 text-center transition
             ${isActive ? "bg-green-700 text-white" : "bg-gray-600 text-black hover:bg-green-100"}`
          }
        >
          {bottomItem.icon}
          <span className="text-xs mt-1">{bottomItem.label}</span>
        </NavLink>
      </div>
    </div>
  );
}
