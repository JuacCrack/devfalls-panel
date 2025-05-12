"use client";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import TableManager from "../components/tableManager/TableManager";
import Loader from "../components/Loader";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [sidebarDarkMode, setSidebarDarkMode] = useState(false);

  useEffect(() => {
    if (sidebarDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [sidebarDarkMode]);

  return (
    <div className="font-sans bg-white dark:bg-black text-black dark:text-white min-h-screen flex transition-colors duration-300">
      <Sidebar
        setIsSidebarOpen={setIsSidebarOpen}
        setSelectedTable={setSelectedTable}
        setIsFetching={setIsFetching}
        setSidebarDarkMode={setSidebarDarkMode}
      />

      <main
        className={`pt-10 flex-1 pl-4 pr-6 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        {!selectedTable && <Header />}

        {selectedTable ? (
          <TableManager
            selectedTable={selectedTable}
            setIsFetching={setIsFetching}
          />
        ) : (
          <p className="text-black/60 dark:text-white/60 text-lg font-medium mt-10">
            Selecciona una tabla del menú lateral.
          </p>
        )}
      </main>

      {isFetching && <Loader />}
    </div>
  );
}
