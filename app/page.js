import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/dashboard');
}


// "use client";

// import { useState, useEffect } from "react";
// import DataTable from "react-data-table-component";
// import { Menu, X } from "lucide-react";
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
// import React from "react";
// import imageCompression from "browser-image-compression";

// const MySwal = withReactContent(Swal);

// export default function Home() {
//   const [tables, setTables] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedTable, setSelectedTable] = useState(null);
//   const [tableData, setTableData] = useState([]);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   useEffect(() => {
//     fetch("http://localhost:5000/api/abm/tables/list", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({}),
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error(`Error: ${res.status}`);
//         return res.json();
//       })
//       .then((!data)
//  => {
//         if (data.success) setTables(data.data);
//       })
//       .catch((err) => console.error("Failed to fetch tables:", err));
//   }, []);

//   const handleTableClick = (tableName) => {
//     setLoading(true);
//     setSelectedTable(tableName);

//     fetch(`http://localhost:5000/api/abm/${tableName}/list`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({}),
//     })
//       .then((res) => res.json())
//       .then((!data)
//  => {
//         setTableData(data.data || []);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Failed to fetch table data:", err);
//         setLoading(false);
//       });
//   };

//   const compressAndConvertToBase64 = async (file) => {
//     const options = {
//       maxSizeMB: 0.1,
//       maxWidthOrHeight: 800,
//       useWebWorker: true,
//     };

//     try {
//       const compressedFile = await imageCompression(file, options);
//       const base64 = await imageCompression.getDataUrlFromFile(compressedFile);

//       if (!base64.startsWith("data:image/")) {
//         throw new Error("Archivo no es una imagen válida");
//       }

//       return base64;
//     } catch (err) {
//       console.error("Error al comprimir o convertir la imagen:", err);
//       throw err;
//     }
//   };

//   const createMultiInput = (e, label, value = false, colName) => {
//     let parsedValues = [];
//     if (value) {
//       if (Array.isArray(value)) {
//         parsedValues = value;
//       } else if (typeof value === "string") {
//         try {
//           parsedValues = JSON.parse(value);
//         } catch (err) {
//           console.error("[multiInput] Error al parsear JSON:", err);
//           parsedValues = [];
//         }
//       }
//     }

//     const wrapper = document.createElement("div");
//     wrapper.className =
//       "flex flex-col gap-1 col-span-full transition-all duration-300 ease-in-out";

//     const container = document.createElement("div");
//     container.className =
//       "flex flex-wrap gap-2 bg-gray-50 p-2 rounded border border-gray-300";

//     const hiddenInput = document.createElement("input");
//     hiddenInput.type = "hidden";
//     hiddenInput.name = e.columnName;

//     const values = [];

//     const updateHiddenInput = () => {
//       hiddenInput.value = JSON.stringify(values);
//     };

//     const addChip = (text) => {
//       const trimmed = text.trim();
//       if (!trimmed) return;

//       values.push(trimmed);
//       updateHiddenInput();

//       const chip = document.createElement("span");
//       chip.className =
//         "text-sm px-2 py-1 rounded-full flex items-center gap-1 animate-fade-in";

//       chip.innerHTML = "";

//       if (colName === "colores") {
//         chip.style.backgroundColor = "#f0f0f0";
//         chip.style.color = trimmed;
//         chip.textContent = trimmed;
//       } else if (colName === "imagenes" && trimmed.startsWith("data:image/")) {
//         const img = document.createElement("img");
//         img.src = trimmed;
//         img.alt = "Preview";
//         img.className = "w-10 h-10 rounded object-cover";
//         chip.appendChild(img);
//       } else {
//         chip.textContent = trimmed;
//       }

//       const closeBtn = document.createElement("button");
//       closeBtn.innerText = "✕";
//       closeBtn.className = "text-blue-600 hover:text-red-500 transition ml-2";
//       closeBtn.type = "button";
//       closeBtn.addEventListener("click", () => {
//         const index = values.indexOf(trimmed);
//         if (index > -1) {
//           values.splice(index, 1);
//           updateHiddenInput();
//           chip.remove();
//         }
//       });

//       chip.appendChild(closeBtn);
//       container.appendChild(chip);
//     };

//     let input;

//     switch (colName) {
//       case "colores":
//         input = document.createElement("input");
//         input.type = "color";
//         input.className = "w-10 h-10 p-0 border-none cursor-pointer";

//         input.addEventListener("change", () => {
//           addChip(input.value);
//         });
//         break;

//       case "imagenes":
//         input = document.createElement("input");
//         input.type = "file";
//         input.accept = "image/*";
//         input.style.fontSize = "10px";
//         input.style.wordWrap = "break-word";
//         input.style.overflowWrap = "break-word";
//         input.style.whiteSpace = "normal";

//         input.addEventListener("change", async () => {
//           const file = input.files[0];
//           if (file) {
//             try {
//               const base64 = await compressAndConvertToBase64(file);
//               addChip(base64);
//             } catch (error) {
//               console.error("No se pudo procesar la imagen:", error);
//             }
//           }
//         });
//         break;

//       default:
//         input = document.createElement("input");
//         input.type = "text";
//         input.placeholder = "Presioná Enter para agregar";
//         input.className = `
//           flex-1 min-w-[120px] px-3 py-2 border rounded-md border-gray-300 focus:outline-none
//           focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out text-sm
//         `;

//         let lastEnterTime = 0;
//         input.addEventListener("keydown", (ev) => {
//           if (ev.key === "Enter") {
//             const now = Date.now();
//             if (now - lastEnterTime < 500) {
//               ev.preventDefault();
//               addChip(input.value);
//               lastEnterTime = 0;
//             } else {
//               lastEnterTime = now;
//             }
//           }
//         });
//         break;
//     }

//     wrapper.appendChild(label);
//     wrapper.appendChild(container);
//     wrapper.appendChild(hiddenInput);
//     container.appendChild(input);

//     parsedValues.forEach((val) => {
//       if (typeof val === "string" || typeof val === "number") {
//         addChip(String(val));
//       }
//     });

//     return wrapper;
//   };

//   const beautifyName = (str) => {
//     return str
//       .replace(/_/g, " ")
//       .replace(/\b\w/g, (char) => char.toUpperCase());
//   };

//   const createInputs = (row, rowData = false) => {
//     const inputs = [];

//     row.forEach((e) => {
//       if (e.isPrimaryKey === true) return;

//       const wrapper = document.createElement("div");
//       wrapper.className = `
//         flex flex-col gap-1 transition-all duration-300 ease-in-out
//       `;

//       const readableName = beautifyName(e.columnName);

//       const label = document.createElement("label");
//       label.textContent = readableName;
//       label.htmlFor = e.columnName;
//       label.className = "text-sm font-medium text-gray-700 text-left";

//       let value = rowData
//         ? Object.entries(rowData).find(
//             ([clave]) => clave === e.columnName
//           )?.[1] ?? false
//         : false;

//       let input;

//       switch (e.dataType) {
//         case "varchar":
//         case "text":
//           input = document.createElement("input");
//           input.type = "text";
//           break;

//         case "int":
//         case "bigint":
//         case "float":
//         case "decimal":
//         case "double":
//           input = document.createElement("input");
//           input.type = "number";
//           break;

//         case "date":
//         case "datetime":
//         case "timestamp":
//           input = document.createElement("input");
//           input.type = "date";
//           break;

//         case "time":
//           input = document.createElement("input");
//           input.type = "time";
//           break;

//         case "boolean":
//           input = document.createElement("input");
//           input.type = "checkbox";
//           input.checked = value === "true" || value === true;
//           input.className = "cursor-pointer";
//           break;

//         case "enum":
//           input = document.createElement("select");
//           input.className = `
//             px-3 py-2 border rounded-md border-gray-300 focus:outline-none 
//             focus:ring-2 focus:ring-blue-500 focus:border-transparent 
//             transition-all duration-300 ease-in-out bg-white text-sm
//           `;
//           const options = e.enumValues.split(",");
//           options.forEach((option) => {
//             const opt = document.createElement("option");
//             opt.value = option.trim();
//             opt.textContent = option.trim();
//             if (option.trim() === value) opt.selected = true;
//             input.appendChild(opt);
//           });
//           break;

//         case "json":
//           input = createMultiInput(e, label, value, e.columnName);
//           break;

//         default:
//           input = document.createElement("input");
//           input.type = "text";
//           console.warn(`No se ha definido un input para el tipo ${e.dataType}`);
//           break;
//       }

//       if (
//         e.dataType !== "boolean" &&
//         e.dataType !== "enum" &&
//         e.dataType !== "json"
//       ) {
//         input.name = e.columnName;
//         input.id = e.columnName;
//         input.placeholder = `Ingresá ${readableName}`;
//         input.value = value || "";
//         input.className = `
//           px-3 py-2 border rounded-md border-gray-300 focus:outline-none 
//           focus:ring-2 focus:ring-blue-500 focus:border-transparent 
//           transition-all duration-300 ease-in-out bg-white text-sm
//         `;
//       }

//       if (e.dataType !== "json") {
//         input.addEventListener("keydown", (ev) => {
//           if (ev.key === "Enter") {
//             ev.preventDefault();
//             const form = input.closest("form");
//             const focusables = Array.from(
//               form.querySelectorAll("input, select, textarea")
//             ).filter((el) => el.offsetParent !== null);
//             const currentIndex = focusables.indexOf(ev.target);
//             if (currentIndex === focusables.length - 1) {
//               document.querySelector(".swal2-confirm")?.click();
//             } else {
//               focusables[currentIndex + 1]?.focus();
//             }
//           }
//         });
//       }

//       wrapper.appendChild(label);
//       wrapper.appendChild(input);
//       inputs.push(wrapper);
//     });

//     return inputs;
//   };

//   const createForm = async (row, rowData = false) => {
//     const form = document.createElement("form");
//     form.className = `
//     grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4
//   `;

//     const title = beautifyName(selectedTable);

//     const h3 = document.createElement("h3");
//     h3.innerText = `${rowData ? "Editar" : "Crear nuevo"} registro (${title})`;
//     h3.className = "text-lg font-semibold mb-4 col-span-full";

//     form.appendChild(h3);

//     const inputs = createInputs(row, rowData);
//     //console.log("inputs", inputs);
//     inputs.forEach((inputWrapper) => form.appendChild(inputWrapper));
//     const whereData = rowData ? await getWhere(rowData) : false;

//     MySwal.fire({
//       html: form,
//       width: "60vw",
//       customClass: {
//         popup: "p-4 rounded-xl",
//       },
//       showCancelButton: true,
//       confirmButtonText: "Enviar",
//       cancelButtonText: "Cancelar",
//       didOpen: () => {
//         // Focus automático en el primer input
//         const firstInput = form.querySelector("input");
//         if (firstInput) firstInput.focus();
//       },
//       preConfirm: () => {
//         const formData = new FormData(form);
//         const data = Object.fromEntries(formData.entries());
//         return data;
//       },
//     }).then((result) => {
//       //console.log(result);
//       if (result.isConfirmed) {
//         try {
//           const response = handleSubmit(
//             result.value,
//             rowData ? "update" : "create",
//             whereData
//           );
//           if (response) {
//             const message = rowData
//               ? `Registro editado con éxito`
//               : `Registro creado con éxito`;
//             Swal.fire("Éxito", message, "success");
//             handleTableClick(selectedTable);
//           } else {
//             const message = rowData
//               ? `No se pudo editar el registro`
//               : `No se pudo crear el registro`;
//             Swal.fire("Error", message, "error");
//           }
//         } catch (error) {
//           console.error("Error al enviar el formulario:", error);
//           const message = rowData
//             ? `No se pudo editar el registro`
//             : `No se pudo crear el registro`;
//           Swal.fire("Error", message, "error");
//         }
//       }
//     });
//   };

//   const handleSubmit = async (data, method, where = false) => {
//     try {
//       setLoading(true);

//       const res = await fetch(
//         `http://localhost:5000/api/abm/${selectedTable}/${method}${
//           where ? `/${where}` : ""
//         }`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(!data)
// ,
//         }
//       );
//       const result = await res.json();

//       if (!result.success) throw new Error(result);

//       return result;
//     } catch (error) {
//       console.error(error);
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStructure = async (table) => {
//     try {
//       const res = await fetch(
//         `http://localhost:5000/api/abm/${table}/structure`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({}),
//         }
//       );
//       const data = await res.json();
//       return data.data;
//     } catch (error) {
//       console.error("Error al obtener la estructura de la tabla:", error);
//       Swal.fire(
//         "Error",
//         "No se pudo obtener la estructura de la tabla",
//         "error"
//       );
//     }
//   };

//   const handleEdit = async (row) => {
//     try {
//       setLoading(true);
//       const data = await getStructure(selectedTable);
//       await createForm(data, row);
//     } catch (error) {
//       console.error("Error al obtener la estructura de la tabla:", error);
//       Swal.fire(
//         "Error",
//         "No se pudo obtener la estructura de la tabla",
//         "error"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddNew = async (row = null) => {
//     try {
//       setLoading(true);
//       const data = await getStructure(selectedTable);
//       await createForm(!data)
// ;
//     } catch (error) {
//       console.error("Error al obtener la estructura de la tabla:", error);
//       Swal.fire(
//         "Error",
//         "No se pudo obtener la estructura de la tabla",
//         "error"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getWhere = async (row) => {
//     const data = await getStructure(selectedTable);
//     const primaryKey = data.filter((e) => e.isPrimaryKey === true);
//     const primaryKeyName = primaryKey[0].columnName;
//     const primaryKeyValue = row[primaryKeyName];
//     const where = btoa(
//       JSON.stringify({
//         [primaryKeyName]: primaryKeyValue,
//       })
//     );

//     return [where, primaryKeyName, primaryKeyValue];
//   };

//   const handleDelete = async (row) => {
//     const whereData = await getWhere(row);

//     const label = `Esta acción eliminará el registro con "${whereData[1]}: ${whereData[2]}". ¿Estás seguro de que deseas continuar?`;

//     const confirmed = await Swal.fire({
//       title: "¿Estás seguro?",
//       text: label,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Sí, eliminar",
//       cancelButtonText: "Cancelar",
//     });

//     if (confirmed.isConfirmed) {
//       try {
//         setLoading(true);
//         const response = handleSubmit(row, "delete", whereData[0]);
//         if (response) {
//           Swal.fire("Éxito", "Registro eliminado con éxito", "success");
//           handleTableClick(selectedTable);
//         } else {
//           Swal.fire("Error", "No se pudo eliminar el registro", "error");
//         }
//       } catch (err) {
//         console.error("Error eliminando:", err);
//         Swal.fire("Error", "No se pudo eliminar el registro", "error");
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const isBase64Image = (str) =>
//     typeof str === "string" &&
//     str.startsWith("data:image/") &&
//     str.includes("base64");

//   const isHexColor = (str) =>
//     typeof str === "string" && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(str);

//   const renderArrayCell = (arr) => (
//     <div className="flex gap-1 items-center flex-wrap max-w-[200px]">
//       {arr.map((item, idx) => {
//         if (isBase64Image(item)) {
//           return (
//             <img
//               key={idx}
//               src={item}
//               alt={`img-${idx}`}
//               className="w-[25px] h-[25px] rounded-sm shadow border border-gray-300"
//             />
//           );
//         } else if (isHexColor(item)) {
//           return (
//             <div
//               key={idx}
//               className="w-[25px] h-[25px] rounded-full border border-gray-400"
//               style={{ backgroundColor: item }}
//             />
//           );
//         } else {
//           return (
//             <div
//               key={idx}
//               className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-black dark:text-white text-xs rounded-full"
//             >
//               {item}
//             </div>
//           );
//         }
//       })}
//     </div>
//   );

//   const columns =
//     tableData.length > 0
//       ? [
//           {
//             name: "Acciones",
//             cell: (row) => (
//               <div className="flex gap-2 whitespace-nowrap">
//                 <button
//                   onClick={() => handleEdit(row)}
//                   className="px-2 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
//                 >
//                   ✎
//                 </button>
//                 <button
//                   onClick={() => handleDelete(row)}
//                   className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
//                 >
//                   🗑
//                 </button>
//               </div>
//             ),
//             ignoreRowClick: true,
//             style: {
//               minWidth: "100px",
//               maxWidth: "120px",
//               whiteSpace: "nowrap",
//             },
//           },
//           ...Object.keys(tableData[0]).map((key) => ({
//             name: beautifyName(key),
//             selector: (row) => row[key],
//             sortable: true,
//             style: {
//               whiteSpace: "normal",
//               minWidth: "120px",
//               color: "black", // Ensure text is black
//             },
//             cell: (row) => {
//               const value = row[key];
//               if (Array.isArray(value)) {
//                 return renderArrayCell(value);
//               } else if (typeof value === "object" && value !== null) {
//                 return (
//                   <pre className="text-xs whitespace-pre-wrap max-w-[240px] block text-black">
//                     {JSON.stringify(value, null, 2)}
//                   </pre>
//                 );
//               }
//               return (
//                 <span className="break-words whitespace-pre-wrap text-sm max-w-[240px] block text-black">
//                   {String(value)}
//                 </span>
//               );
//             },
//           })),
//         ]
//       : [];

//   return (
//     <div className="font-sans bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen flex">
//       {/* Sidebar */}
//       <aside
//         className={`transition-all duration-300 ease-in-out h-screen fixed top-0 left-0 z-20 bg-gray-800 dark:bg-gray-900 text-white flex flex-col ${
//           isSidebarOpen ? "w-64" : "w-16"
//         }`}
//       >
//         <button
//           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//           className="p-4 text-gray-400 hover:text-white focus:outline-none self-end"
//           aria-label="Toggle menu"
//         >
//           {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
//         </button>

//         {isSidebarOpen && (
//           <h2 className="text-2xl font-bold mb-6 px-4">Tablas</h2>
//         )}

//         <ul className="space-y-2 px-2 overflow-y-auto flex-1">
//           {tables.map((table) => (
//             <li
//               key={table}
//               onClick={() => handleTableClick(table)}
//               className={`p-3 rounded-md cursor-pointer transition-colors duration-200 ${
//                 selectedTable === table
//                   ? "bg-gray-700 text-white font-semibold"
//                   : "hover:bg-gray-700 text-gray-300"
//               } ${isSidebarOpen ? "text-left" : "text-center"}`}
//             >
//               {isSidebarOpen ? beautifyName(table) : table[0].toUpperCase()}
//             </li>
//           ))}
//         </ul>
//       </aside>

//       {/* Main */}
//       <main
//         className={`flex-1 py-12 px-20 transition-all duration-300 ml-${
//           isSidebarOpen ? "64" : "16"
//         }`}
//       >
//         <h1 className="text-3xl font-bold mb-4">Panel de Control</h1>

//         {selectedTable ? (
//           <div>
//             <div className="flex justify-between items-center mt-6 mb-6">
//               <h2 className="text-xl font-medium">
//                 Gestionar{" "}
//                 <span className="font-semibold text-gray-800 dark:text-gray-200">
//                   {beautifyName(selectedTable)}
//                 </span>
//               </h2>

//               <button
//                 className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
//                 onClick={handleAddNew}
//               >
//                 + Añadir nuevo
//               </button>
//             </div>

//             <div className="block mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 w-full max-w-full md:max-w-7xl h-[65vh] overflow-auto">
//               {tableData.length > 0 ? (
//                 <DataTable
//                   columns={columns}
//                   data={tableData}
//                   pagination
//                   highlightOnHover
//                   striped
//                 />
//               ) : (
//                 <p className="text-gray-500 dark:text-gray-400">
//                   No hay datos disponibles para esta tabla.
//                 </p>
//               )}
//             </div>
//           </div>
//         ) : (
//           <p className="text-gray-600 dark:text-gray-400">
//             Selecciona una tabla del menú lateral.
//           </p>
//         )}
//       </main>

//       {loading && (
//         <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
//           <div className="w-14 h-14 border-4 border-t-transparent border-white dark:border-gray-200 rounded-full animate-spin"></div>
//         </div>
//       )}
//     </div>
//   );
// }

