import React from "react";
import { beautifyName, isBase64Image, isHexColor } from "../../helpers/utils";

export function generateColumns({
  tableData,
  selectedTable,
  handleEdit,
  handleDelete,
}) {
  const renderArrayCell = (arr) => (
    <div className="flex gap-1 items-center flex-wrap max-w-[200px]">
      {arr.map((item, idx) => {
        if (isBase64Image(item)) {
          return (
            <img
              key={idx}
              src={item}
              alt={`img-${idx}`}
              className="w-[25px] h-[25px] rounded-sm shadow border border-gray-300"
            />
          );
        } else if (isHexColor(item)) {
          return (
            <div
              key={idx}
              className="w-[25px] h-[25px] rounded-full border border-gray-400"
              style={{ backgroundColor: item }}
            />
          );
        } else {
          return (
            <div
              key={idx}
              className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-black dark:text-white text-xs rounded-full"
            >
              {item}
            </div>
          );
        }
      })}
    </div>
  );

  const columns =
    tableData.length > 0
      ? [
          {
            name: "Acciones",
            cell: (row) => (
              <div className="flex gap-2 whitespace-nowrap">
                <button
                  onClick={() => handleEdit(row, selectedTable)}
                  className="px-2 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  ✎
                </button>
                <button
                  onClick={() => handleDelete(row, selectedTable)}
                  className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  🗑
                </button>
              </div>
            ),
            ignoreRowClick: true,
            // style: {
            //   minWidth: "100px",
            //   maxWidth: "120px",
            //   whiteSpace: "nowrap",
            // },
          },
          ...Object.keys(tableData[0]).map((key) => ({
            name: beautifyName(key),
            selector: (row) => row[key],
            sortable: true,
            // style: {
            //   whiteSpace: "normal",
            //   minWidth: "120px",
            // },
            cell: (row) => {
              const value = row[key];
              if (Array.isArray(value)) {
                return renderArrayCell(value);
              } else if (typeof value === "object" && value !== null) {
                return (
                  <pre className="text-xs whitespace-pre-wrap max-w-[240px] block text-black dark:text-gray">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                );
              }
              return (
                <span className="break-words whitespace-pre-wrap text-sm max-w-[240px] block text-black dark:text-gray">
                  {String(value)}
                </span>
              );
            },
          })),
        ]
      : [];

  return columns;
}
