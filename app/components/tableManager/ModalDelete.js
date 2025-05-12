import { useEffect } from "react";
import Swal from "sweetalert2";
import { fetchSubmit, fetchWhere } from "../../backend/services";

const ModalDelete = ({ row, selectedTable, setIsFetching, setRefresh }) => {
  useEffect(() => {
    const showModal = async () => {
      const whereData = await fetchWhere(row, selectedTable);
      if (!whereData) {
        throw new Error(JSON.stringify(whereData));
      } 
      const label = `Esta acción eliminará el registro con "${whereData[1]}: ${whereData[2]}". ¿Estás seguro de que deseas continuar?`;

      const confirmed = await Swal.fire({
        title: "¿Estás seguro?",
        text: label,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (confirmed.isConfirmed) {
        try {
          setIsFetching(true);
          const data = await fetchSubmit(row, "delete", whereData[0], selectedTable);
          if (data) {
            Swal.fire("Éxito", "Registro eliminado con éxito", "success");
          } else {
            throw new Error(JSON.stringify(data));
          }
        } catch (err) {
          console.error("Error eliminando:", err);
          Swal.fire("Error", "No se pudo eliminar el registro", "error");
        } finally {
          setIsFetching(false);
          setRefresh(true);
        }
      } else {
        setRefresh(true);
      }
    };

    showModal();
  }, []);

  return null; 
};

export default ModalDelete;
