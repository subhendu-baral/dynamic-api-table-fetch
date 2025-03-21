import axios from "axios";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { CustomTable } from "./CustomTable";

const convertNestedObjectsToString = (arr) => {
  return arr.map(obj => {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => 
        [key, typeof value === 'object' && value !== null ? JSON.stringify(value).replace(/[{}"]/g, '').replace(/,/g, ', ') : value]
        )
      );
  });
};


export default function DynamicDataTable() {
  const [apiUrl, setApiUrl] = useState("https://jsonplaceholder.typicode.com/users");
  const [tableData, setTableData] = useState([]);
  const [fetchAPI, setfetchAPI] = useState(false);
  const [loading, setloading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [error, setError] = useState(null);
  const [errorMsg, seterrorMsg] = useState("");

  useEffect(() => {
    setloading(true);
    setError(null);
    seterrorMsg("");
    axios
      .get(apiUrl)
      .then((res) => {
        dataFilter(res.data);
        // console.log(res)
      })
      .catch((err) => {
        // console.log(err)
        setError(err);
        seterrorMsg("Sorry, We are unable to fetch data from your url error");
        setTableData([]);
      })
      .finally(() => {
        setloading(false);
      });
  }, [fetchAPI]);

  // console.log(tableData)
  // console.log(error);
  
  const dataFilter = (result) => {
    if (result.length === 0) {
      setError("The API returned an empty dataset");
      setTableData([]);
      setColumns([]);
      setloading(false);
    }
    // if (!Array.isArray(result)) {
    //   result = [result]
    // }
    if (!Array.isArray(result)) {
      if (result.results) result = result.results
      else if (result.data) result = result.data
      else if (result.items) result = result.items
      if (!Array.isArray(result)) {
        result = [result]
      }
    }

    if (result) {
      setTableData(convertNestedObjectsToString(result));
      
      // console.log(result[0])
      setColumns(Object.keys(result[0]));
    } else {
      seterrorMsg("Sorry, We are unable to fetch data from your url");
      setTableData([]);
    }
  };

  // console.log(columns, tableData[0])
  
  const validateUrl = (url) => {
    try {
      new URL(url);
      seterrorMsg(null);
      return true;
    } catch (err) {
      seterrorMsg("Please enter a valid URL");
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setfetchAPI((prev) => !prev);
  };

  const handleUrlChange = (e) => {
    const newurl = e.target.value;
    setApiUrl(e.target.value);
    if (newurl.length > 0) {
      validateUrl(e.target.value);
    }
  };


  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            value={apiUrl}
            onChange={handleUrlChange}
            placeholder="Enter API URL"
            className={`w-full ${
              errorMsg ? "border-red-500 focus-visible:ring-red-500" : ""
            }`}
            required
          />
          {errorMsg && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
        </div>
        <Button
          type="submit"
          disabled={loading || errorMsg}
          className="whitespace-nowrap"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading
            </>
          ) : (
            "Fetch Data"
          )}
        </Button>
      </form>

      <CustomTable Datacolumns ={columns} data={tableData} />
    </>
  );
}
