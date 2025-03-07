'use client'
import { useState } from "react";
import Link from "next/link";
import { Search, FileSpreadsheet, Ghost, HardDrive } from "lucide-react";
import * as XLSX from 'xlsx';

interface TableProps<T> {
  data: T[];
  exportFilename: string;
  rowLink?: (row: T) => string;
  view?: String;
  className?: string;
}

const DataTable = <T,>({ data, exportFilename, rowLink, view = "details", className }: TableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState<string>("");


  // Dynamically extract columns from data keys
  const columns = data?.[0]
    ? Object.keys(data[0]).map(key => ({
      label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),  // Format key for label
      field: key
    }))
    : [];

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, `${exportFilename}.xlsx`);
  };

  const filteredData = data?.length > 0 ? data.filter((row: T) => {
    const search = searchTerm.toLowerCase().trim();
    if (!search) return true;
    return columns.some((col) => {
      const value = (row as any)[col.field]?.toString().toLowerCase();
      return value?.includes(search);
    });
  }) : [];

  return (
    <div className={`bg-gray-800 rounded-xl p-6 mb-6 shadow-lg max-w-[90vw] overflow-x-auto ${className}`}>
      {/* Search and Export */}
      {filteredData.length > 0 ?
        <>

          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="flex gap-4 flex-1">

              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full bg-gray-700 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportToExcel}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FileSpreadsheet className="w-5 h-5" />
                Export Excel
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-300">
              <thead className="text-gray-400 border-b border-gray-700">
                <tr>
                  {columns.map((col, index) => (
                    <th key={index} className="pb-3 px-4 text-nowrap">{col.label}</th>
                  ))}
                  <th className="pb-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-700/50 transition-colors">
                    {columns.map((col, colIndex) => (
                      <td key={colIndex} className="py-2 px-4 text-nowrap">
                        {(row as any)[col.field] === null ? <span className="text-gray-400 font-semibold">N/A</span> : (row as any)[col.field]}
                      </td>
                    ))}
                    <td className="py-2 px-4">

                      {rowLink ? (
                        <Link
                          href={rowLink(row)}
                          className="text-blue-500 text-nowrap   hover:text-blue-600 hover:underline underline-offset-2"
                        >
                          View {view}
                        </Link>

                      ) : "--------"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
        : (
          <div className="flex flex-col gap-2 items-center py-8">
            <HardDrive />
            <h1 className="text-lg font-bold text-zinc-200">No data available</h1>
          </div>
        )}
    </div>
  );
};

export default DataTable;
