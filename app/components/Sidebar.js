"use client";

import { Menu, X, Moon, Sun } from "lucide-react";
import { fetchTableNames } from "../backend/services";
import { useState, useEffect } from "react";
import { beautifyName } from "../helpers/utils";
import Swal from "sweetalert2";

export default function Sidebar({
  setIsSidebarOpen,
  setSelectedTable,
  setIsFetching,
  setSidebarDarkMode,
}) {
  const [tables, setTables] = useState([]);
  const [localOpen, setLocalOpen] = useState(false);
  const [localSelectedTable, setLocalSelectedTable] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Obtener modo desde localStorage al montar
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
    document.documentElement.classList.toggle("dark", savedMode);
    setSidebarDarkMode(savedMode);
  }, []);

  // Cargar tablas
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const tables = await fetchTableNames();
        if (tables) {
          setTables(tables);
        } else {
          throw new Error(tables);
        }
      } catch (error) {
        console.error("Error fetching table names:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron obtener los nombres de las tablas.",
        });
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
  }, []);

  const handleSelect = (table) => {
    setLocalSelectedTable(table);
    setSelectedTable(table);
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    setSidebarDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    document.documentElement.classList.toggle("dark", newMode);
  };

  return (
    <aside
      className={`transition-all duration-500 ease-in-out h-screen fixed top-0 left-0 z-20 flex flex-col bg-white text-black dark:bg-black dark:text-white ${
        localOpen ? "w-64" : "w-16"
      } shadow-xl`}
    >
      {/* Toggle Sidebar */}
      <button
        onClick={() => setLocalOpen(!localOpen)}
        className="p-4 hover:opacity-80 focus:outline-none self-end"
        aria-label="Toggle menu"
      >
        {localOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Lista de tablas */}
      <ul
        onMouseEnter={() => setLocalOpen(true)}
        onMouseLeave={() => setLocalOpen(false)}
        className="overflow-y-auto flex-1 divide-y divide-gray-200 dark:divide-gray-700"
      >
        {tables.map((table) => (
          <li
            key={table}
            onClick={() => handleSelect(table)}
            className={`p-3 cursor-pointer transition-colors duration-200 ${
              localSelectedTable === table
                ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
                : "hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
            } ${localOpen ? "text-left" : "text-center"}`}
          >
            {localOpen ? beautifyName(table) : table[0].toUpperCase()}
          </li>
        ))}
      </ul>

      {/* Botón modo oscuro/claro */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-center">
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-2 text-sm cursor-pointer hover:opacity-80 transition"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          {localOpen && (darkMode ? "Modo claro" : "Modo oscuro")}
        </button>
      </div>
    </aside>
  );
}
