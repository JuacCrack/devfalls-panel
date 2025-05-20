const fetchTableData = async (tableName) => {
  try {
    const res = await fetch(`${process.env.URL_API}/api/abm/${tableName}/list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    return data.success ? data.data : false;
  } catch (error) {
    console.error("Error in fetchTableData:", error);
    return false;
  }
};

const fetchSubmit = async (dataForm, method, where = false, selectedTable) => {
  try {
    console.log(dataForm, method, where, selectedTable);
    const res = await fetch(
      `${process.env.URL_API}/api/abm/${selectedTable}/${method}${
        where ? `/${where}` : ""
      }`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataForm),
      }
    );
    const data = await res.json();
    return data.success ? true : false;
  } catch (error) {
    console.error("Error in fetchSubmit:", error);
    return false;
  }
};

const fetchStructure = async (table) => {
  try {
    const res = await fetch(
      `${process.env.URL_API}/api/abm/${table}/structure`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }
    );
    const data = await res.json();
    return data.success ? data.data : false;
  } catch (error) {
    console.error("Error in fetchStructure:", error);
    return false;
  }
};

const fetchWhere = async (row, selectedTable) => {
  try {
    const data = await fetchStructure(selectedTable);
    const primaryKey = data.filter((e) => e.isPrimaryKey === true);
    const primaryKeyName = primaryKey[0].columnName;
    const primaryKeyValue = row[primaryKeyName];
    const where = btoa(
      JSON.stringify({
        [primaryKeyName]: primaryKeyValue,
      })
    );

    return [where, primaryKeyName, primaryKeyValue];
  } catch (error) {
    console.error("Error in fetchWhere:", error);
    return false;
  }
};

const fetchTableNames = async () => {
  try {
    const res = await fetch("${process.env.URL_API}/api/abm/tables/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    return data.success ? data.data : false;
  } catch (error) {
    console.error("Error in fetchTableNames:", error);
    return false;
  }
};

export {
  fetchTableData,
  fetchSubmit,
  fetchStructure,
  fetchWhere,
  fetchTableNames,
};
