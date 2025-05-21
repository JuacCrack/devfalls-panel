import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { compressAndConvertToBase64, beautifyName } from "../../helpers/utils";
import {
  fetchSubmit,
  fetchWhere,
  fetchStructure,
} from "../../backend/services";
import { useEffect, useRef } from "react";

const MySwal = withReactContent(Swal);

const createMultiInput = (e, label, value = false, colName) => {
  let parsedValues = [];
  if (value) {
    if (Array.isArray(value)) {
      parsedValues = value;
    } else if (typeof value === "string") {
      try {
        parsedValues = JSON.parse(value);
      } catch (err) {
        console.error("[multiInput] Error al parsear JSON:", err);
        parsedValues = [];
      }
    }
  }

  const wrapper = document.createElement("div");
  wrapper.className =
    "flex flex-col gap-1 col-span-full transition-all duration-300 ease-in-out";

  const container = document.createElement("div");
  container.className =
    "flex flex-wrap gap-2 bg-gray-50 p-2 rounded border border-gray-300";

  const hiddenInput = document.createElement("input");
  hiddenInput.type = "hidden";
  hiddenInput.name = e.columnName;

  const values = [];

  const updateHiddenInput = () => {
    hiddenInput.value = JSON.stringify(values);
  };

  const addChip = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    values.push(trimmed);
    updateHiddenInput();

    const chip = document.createElement("span");
    chip.className =
      "text-sm px-2 py-1 rounded-full flex items-center gap-1 animate-fade-in";

    chip.innerHTML = "";

    if (colName === "colores") {
      chip.style.backgroundColor = "#f0f0f0";
      chip.style.color = trimmed;
      chip.textContent = trimmed;
    } else if (colName === "imagenes" && trimmed.startsWith("data:image/")) {
      const img = document.createElement("img");
      img.src = trimmed;
      img.alt = "Preview";
      img.className = "w-10 h-10 rounded object-cover";
      chip.appendChild(img);
    } else {
      chip.textContent = trimmed;
    }

    const closeBtn = document.createElement("button");
    closeBtn.innerText = "✕";
    closeBtn.className = "text-blue-600 hover:text-red-500 transition ml-2";
    closeBtn.type = "button";
    closeBtn.addEventListener("click", () => {
      const index = values.indexOf(trimmed);
      if (index > -1) {
        values.splice(index, 1);
        updateHiddenInput();
        chip.remove();
      }
    });

    chip.appendChild(closeBtn);
    container.appendChild(chip);
  };

  let input;

  switch (colName) {
    case "colores":
      input = document.createElement("input");
      input.type = "color";
      input.className = "w-10 h-10 p-0 border-none cursor-pointer";

      input.addEventListener("change", () => {
        addChip(input.value);
      });
      break;

    case "imagenes":
      input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.style.fontSize = "10px";
      input.style.wordWrap = "break-word";
      input.style.overflowWrap = "break-word";
      input.style.whiteSpace = "normal";

      input.addEventListener("change", async () => {
        const file = input.files[0];
        if (file) {
          try {
            const base64 = await compressAndConvertToBase64(file);
            addChip(base64);
          } catch (error) {
            console.error("No se pudo procesar la imagen:", error);
          }
        }
      });
      break;

    default:
      input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Presioná Enter para agregar";
      input.className = `
          flex-1 min-w-[120px] px-3 py-2 border rounded-md border-gray-300 focus:outline-none
          focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out text-sm
        `;

      let lastEnterTime = 0;
      input.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter") {
          const now = Date.now();
          if (now - lastEnterTime < 500) {
            ev.preventDefault();
            addChip(input.value);
            lastEnterTime = 0;
          } else {
            lastEnterTime = now;
          }
        }
      });
      break;
  }

  wrapper.appendChild(label);
  wrapper.appendChild(container);
  wrapper.appendChild(hiddenInput);
  container.appendChild(input);

  parsedValues.forEach((val) => {
    if (typeof val === "string" || typeof val === "number") {
      addChip(String(val));
    }
  });

  return wrapper;
};

const createInputs = (structure, row = false) => {
  const inputs = [];

  structure.forEach((e) => {
    if (e.isPrimaryKey === true) return;

    const wrapper = document.createElement("div");
    wrapper.className = `
        flex flex-col gap-1 transition-all duration-300 ease-in-out
      `;

    const readableName = beautifyName(e.columnName);

    const label = document.createElement("label");
    label.textContent = readableName;
    label.htmlFor = e.columnName;
    label.className = "text-sm font-medium text-gray-700 text-left";

    let value = row
      ? Object.entries(row).find(([clave]) => clave === e.columnName)?.[1] ??
        false
      : false;

    let input;

    if (e.isForeignKey && e.foreignKey?.rows?.length > 0) {
      input = document.createElement("select");
      input.name = e.columnName;
      input.id = e.columnName;
      input.className = `
    px-3 py-2 border rounded-md border-gray-300 focus:outline-none 
    focus:ring-2 focus:ring-blue-500 focus:border-transparent 
    transition-all duration-300 ease-in-out bg-white text-sm
  `;

      const opt = document.createElement("option");
      opt.value = null;
      opt.textContent = "Seleccioná una opción";
      opt.selected = value === null;
      input.appendChild(opt);

      e.foreignKey.rows.forEach(({ pk, col2 }) => {
        const opt = document.createElement("option");
        opt.value = pk;
        opt.textContent = col2;
        if (value == pk) opt.selected = true;
        input.appendChild(opt);
      });

      const wrapper = document.createElement("div");
      wrapper.className =
        "flex flex-col gap-1 transition-all duration-300 ease-in-out";

      const label = document.createElement("label");
      label.textContent = beautifyName(e.columnName);
      label.htmlFor = e.columnName;
      label.className = "text-sm font-medium text-gray-700 text-left";

      wrapper.appendChild(label);
      wrapper.appendChild(input);
      inputs.push(wrapper);
      return; // Salteamos el resto del loop para esta columna
    }

    switch (e.dataType) {
      case "varchar":
      case "text":
        input = document.createElement("input");
        input.type = "text";
        break;

      case "int":
      case "bigint":
      case "float":
      case "decimal":
      case "double":
        input = document.createElement("input");
        input.type = "number";
        break;

      case "date":
      case "datetime":
      case "timestamp":
        input = document.createElement("input");
        input.type = "date";
        break;

      case "time":
        input = document.createElement("input");
        input.type = "time";
        break;

      case "boolean":
        input = document.createElement("input");
        input.type = "checkbox";
        input.checked = value === "true" || value === true;
        input.className = "cursor-pointer";
        break;

      case "enum":
        input = document.createElement("select");
        input.className = `
            px-3 py-2 border rounded-md border-gray-300 focus:outline-none 
            focus:ring-2 focus:ring-blue-500 focus:border-transparent 
            transition-all duration-300 ease-in-out bg-white text-sm
          `;
        const options = e.enumValues.split(",");
        options.forEach((option) => {
          const opt = document.createElement("option");
          opt.value = option.trim();
          opt.textContent = option.trim();
          if (option.trim() === value) opt.selected = true;
          input.appendChild(opt);
        });
        break;

      case "json":
        input = createMultiInput(e, label, value, e.columnName);
        break;

      default:
        input = document.createElement("input");
        input.type = "text";
        console.warn(`No se ha definido un input para el tipo ${e.dataType}`);
        break;
    }

    if (
      e.dataType !== "boolean" &&
      e.dataType !== "enum" &&
      e.dataType !== "json"
    ) {
      input.name = e.columnName;
      input.id = e.columnName;
      input.placeholder = `Ingresá ${readableName}`;
      input.value = value || "";
      input.className = `
          px-3 py-2 border rounded-md border-gray-300 focus:outline-none 
          focus:ring-2 focus:ring-blue-500 focus:border-transparent 
          transition-all duration-300 ease-in-out bg-white text-sm
        `;
    }

    if (e.dataType !== "json") {
      input.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter") {
          ev.preventDefault();
          const form = input.closest("form");
          const focusables = Array.from(
            form.querySelectorAll("input, select, textarea")
          ).filter((el) => el.offsetParent !== null);
          const currentIndex = focusables.indexOf(ev.target);
          if (currentIndex === focusables.length - 1) {
            document.querySelector(".swal2-confirm")?.click();
          } else {
            focusables[currentIndex + 1]?.focus();
          }
        }
      });
    }

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    inputs.push(wrapper);
  });

  return inputs;
};

const DynamicForm = ({
  row,
  selectedTable,
  setIsFetching,
  setRefresh,
  setIsOpenModal,
}) => {
  useEffect(() => {
    const openForm = async () => {
      try {
        setIsOpenModal(true);
        setIsFetching(true);
        const form = document.createElement("form");
        form.className = `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4`;

        const title = beautifyName(selectedTable);

        const h3 = document.createElement("h3");
        h3.innerText = `${row ? "Editar" : "Crear nuevo"} registro (${title})`;
        h3.className = "text-lg font-semibold mb-4 col-span-full";

        form.appendChild(h3);

        const structure = await fetchStructure(selectedTable);

        if (!structure) {
          throw new Error(structure);
        }

        const inputs = createInputs(structure, row);
        inputs.forEach((inputWrapper) => form.appendChild(inputWrapper));

        const whereData = row ? await fetchWhere(row, selectedTable) : false;

        MySwal.fire({
          html: form,
          width: "60vw",
          customClass: {
            popup: "p-4 rounded-xl",
          },
          showCancelButton: true,
          confirmButtonText: "Enviar",
          cancelButtonText: "Cancelar",
          didOpen: () => {
            const firstInput = form.querySelector("input");
            if (firstInput) firstInput.focus();
          },
          preConfirm: () => {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            return data;
          },
          didClose: () => {
            setIsOpenModal(false);
          },
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              setIsFetching(true);
              const data = await fetchSubmit(
                result.value,
                row ? "update" : "create",
                whereData,
                selectedTable
              );
              if (data) {
                const message = row
                  ? `Registro editado con éxito`
                  : `Registro creado con éxito`;
                MySwal.fire("Éxito", message, "success");
              } else {
                throw new Error(JSON.stringify(data));
              }
            } catch (error) {
              console.error("Error al enviar el formulario:", error);
              const message = row
                ? `No se pudo editar el registro`
                : `No se pudo crear el registro`;
              MySwal.fire("Error", message, "error");
            } finally {
              setIsFetching(false);
              setRefresh(true);
              setIsOpenModal(false);
            }
          }
        });
      } catch (error) {
        console.error("Error al abrir el formulario:", error);
        MySwal.fire("Error", "No se pudo abrir el formulario", "error");
      } finally {
        setIsFetching(false);
      }
    };
    openForm();
  }, []);

  return null;
};

export default DynamicForm;
