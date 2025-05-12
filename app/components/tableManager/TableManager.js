"use client";

import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import { beautifyName } from "../../helpers/utils";
import { fetchTableData } from "../../backend/services";
import { generateColumns } from "./DinamicColumns";
import DynamicForm from "./DinamicForm";
import ModalDelete from "./ModalDelete";
import Swal from "sweetalert2";

export default function TableManager({ selectedTable, setIsFetching }) {
  const [tableData, setTableData] = useState([]);
  const [formState, setFormState] = useState(null);
  const [deleteRow, setDeleteRow] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleEdit = (row, selectedTable) => {
    setFormState({ row, selectedTable });
  };

  const handleAddNew = () => {
    setFormState({ row: null, selectedTable });
  };

  const handleDelete = (row, selectedTable) => {
    setDeleteRow({ row, selectedTable });
  };

  const columns = generateColumns({
    tableData,
    selectedTable,
    handleEdit,
    handleDelete,
  });

  useEffect(() => {
   // console.log("isOpenModal", isOpenModal);
   // console.log("formState", formState);
    if (!isOpenModal) {
      setFormState(null);
    } 
  }, [isOpenModal]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const data = await fetchTableData(selectedTable);
        if (data) {
          setTableData(data);
        } else {
          throw new Error(JSON.stringify(data));
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron obtener los datos de la tabla.",
        });
        console.error(error);
      } finally {
        setIsFetching(false);
        setRefresh(false);
        setFormState(null);
        setDeleteRow(null);
      }
    };

    fetchData();
  }, [selectedTable, refresh]);

  return (
    <div className="flex flex-col gap-4 md:gap-6 w-full h-full overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-semibold leading-tight text-black dark:text-white">
          Gestionar{" "}
          <span className="font-bold">{beautifyName(selectedTable)}</span>
        </h2>

        <button
          onClick={handleAddNew}
          className="cursor-pointer px-5 py-2 border border-black dark:border-white text-black dark:text-white bg-white dark:bg-black hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-sm md:text-base font-medium rounded-xl transition-colors duration-200"
        >
          + Añadir nuevo
        </button>
      </div>

      {formState && (
        <DynamicForm
          row={formState.row}
          selectedTable={formState.selectedTable}
          setIsFetching={setIsFetching}
          setRefresh={setRefresh}
          setIsOpenModal={setIsOpenModal}
        />
      )}
  
      {deleteRow && (
        <ModalDelete
          row={deleteRow.row}
          selectedTable={deleteRow.selectedTable}
          setIsFetching={setIsFetching}
          setRefresh={setRefresh}
          setIsOpenModal={setIsOpenModal}
        />
      )}
      <div className="flex flex-col rounded-2xl border border-black dark:border-white bg-white dark:bg-black shadow overflow-hidden w-full h-[650px] mx-auto">
        <div className="w-full h-full overflow-auto">
          {tableData.length > 0 ? (
            <DataTable
              columns={columns}
              data={tableData}
              pagination
              customStyles={{
                headCells: {
                  style: {
                    textAlign: "left", // Alineación a la izquierda para los encabezados
                  },
                },
                cells: {
                  style: {
                    textAlign: "left", // Alineación a la izquierda para las celdas
                  },
                },
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full px-4">
              <p className="text-gray-600 dark:text-gray-400 text-center">
                No hay datos disponibles para esta tabla.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
