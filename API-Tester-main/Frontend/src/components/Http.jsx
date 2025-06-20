//Running Code
//   import React, { useState, useMemo } from "react";
//   import axios from "axios";
//   import {
//     useReactTable,
//     getCoreRowModel,
//     flexRender,
//   } from "@tanstack/react-table";
//   import { toast, ToastContainer } from "react-toastify";
//   import "react-toastify/dist/ReactToastify.css";
// import TableComponent from "./TableComponent";
// // import FileUpload from "./FileUpload";

//   const Http = () => {
//     const [modalData, setModalData] = useState(null);
//     const [form, setForm] = useState({ file: null });
//     const [dragActive, setDragActive] = useState(false);
//     const [filePreview, setFilePreview] = useState(null);

//     const backendBaseURL = "http://localhost:5000";
//     const testUserId = "683da5c9eff38ab98aaa5c04";

//     const handleFileChange = (e) => {
//       const file = e.target.files[0];
//       if (file) {
//         setForm((prev) => ({ ...prev, file }));
//         setFilePreview(URL.createObjectURL(file));
//       }
//     };

//     const handleDragOver = (e) => {
//       e.preventDefault();
//       setDragActive(true);
//     };

//     const handleDragLeave = () => setDragActive(false);

//     const handleDrop = (e) => {
//       e.preventDefault();
//       setDragActive(false);
//       const file = e.dataTransfer.files[0];
//       if (file) {
//         setForm((prev) => ({ ...prev, file }));
//         setFilePreview(URL.createObjectURL(file));
//       }
//     };

//     const data = useMemo(
//       () => [
//         { method: "GET", desc: "Fetch all users" },
//         { method: "POST", desc: "Register a new user" },
//         { method: "PUT", desc: "Replace all data" },
//         { method: "PATCH", desc: "Update user profile" },
//         { method: "DELETE", desc: "Delete a user" },
//       ],
//       []
//     );

//     const columns = useMemo(
//       () => [
//         {
//           header: "Method",
//           accessorKey: "method",
//         },
//         {
//           header: "Description",
//           accessorKey: "desc",
//         },
//         {
//           header: "Action",
//           cell: ({ row }) => {
//             const method = row.original.method;

//             return (
//               <div className="flex flex-col gap-2">
//                 {method === "POST" && (
//                   <div
//                     onDragOver={handleDragOver}
//                     onDragLeave={handleDragLeave}
//                     onDrop={handleDrop}
//                     className={`border-2 border-dashed rounded p-4 text-center transition ${
//                       dragActive
//                         ? "border-blue-500 bg-blue-50"
//                         : "border-gray-300"
//                     }`}
//                   >
//                     <p className="text-sm text-gray-600 mb-2">
//                       Drag & drop an image here, or click to browse
//                     </p>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleFileChange}
//                       className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
//                       file:rounded file:border-0 file:text-sm file:font-semibold
//                       file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                     />
//                     {filePreview && (
//                       <img
//                         src={filePreview}
//                         alt="Preview"
//                         className="mt-3 mx-auto h-24 rounded object-contain"
//                       />
//                     )}
//                   </div>
//                 )}
//                 <button
//                   onClick={() => handleApiCall(method)}
//                   className="bg-blue-600 text-white px-3 py-1 text-sm w-20 rounded hover:bg-blue-700"
//                 >
//                   Call API
//                 </button>
//               </div>
//             );
//           },
//         },
//       ],
//       [dragActive, filePreview]
//     );

//     const table = useReactTable({
//       data,
//       columns,
//       getCoreRowModel: getCoreRowModel(),
//     });

//     const handleApiCall = async (method) => {
//       let url = "";
//       let data = {};

//       switch (method) {
//         case "GET":
//           url = `${backendBaseURL}/api/users/all-users`;
//           break;

//         case "POST":
//           url = `${backendBaseURL}/api/users/register`;
//           data = new FormData();
//           data.append("name", "rajiv");
//           data.append("email", "rajiv@g.com");
//           data.append("password", "rajiv@we3");
//           if (form.file) {
//             data.append("profilePicture", form.file);
//           }
//           break;

//         case "PUT":
//           url = `${backendBaseURL}/api/users/update-user/${testUserId}`;
//           data = {
//             name: "kevan patel ",
//             email: `kevan@mail.com`,
//             password: "newpassword123",
//             profilePicture: "https://example.com/bird.jpg",
//           };
//           break;

//         case "PATCH":
//           url = `${backendBaseURL}/api/users/update-profile/${testUserId}`;
//           data = { name: "Karan Patel" };
//           break;

//         case "DELETE":
//           url = `${backendBaseURL}/api/users/delete-user/${testUserId}`;
//           break;

//         default:
//           return;
//       }

//       try {
//         const response = await axios({
//           url,
//           method,
//           ...(method !== "DELETE" && { data }),
//           headers:
//             method === "POST" ? { "Content-Type": "multipart/form-data" } : {},
//         });

//         setModalData(JSON.stringify(response.data, null, 2));
//       } catch (err) {
//         toast.error(err.response?.data?.message || "API Call Failed");
//       }
//     };

//     return (
//       <div className="p-8">
//         <ToastContainer />
//         <h1 className="text-3xl font-bold mb-6 text-center">
//           HTTP Method API Tester
//         </h1>

//         <div className="overflow-x-auto">
//           <table className="min-w-full border border-gray-300 text-left">
//             <thead className="bg-gray-200">
//               {table.getHeaderGroups().map((headerGroup) => (
//                 <tr key={headerGroup.id}>
//                   {headerGroup.headers.map((header) => (
//                     <th key={header.id} className="p-3 border">
//                       {flexRender(
//                         header.column.columnDef.header,
//                         header.getContext()
//                       )}
//                     </th>
//                   ))}
//                 </tr>
//               ))}
//             </thead>
//             <tbody>

//               {table.getRowModel().rows.map((row) => (
//                 <tr key={row.id} className="hover:bg-gray-100">
//                   {row.getVisibleCells().map((cell) => (
//                     <td key={cell.id} className="p-3 border">
//                       {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {modalData && (
//           <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
//             <div className="bg-white p-6 rounded-xl shadow-xl max-w-xl w-full mx-4">
//               <h2 className="text-xl font-semibold mb-4">API Response</h2>
//               <pre className="text-sm bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
//                 {modalData}
//               </pre>
//               <div className="mt-4 flex justify-end">
//                 <button
//                   onClick={() => setModalData(null)}
//                   className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   export default Http;

import React, { useState, useMemo } from "react";
import axios from "axios";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TableComponent from "./TableComponent";
import FileUpload from "./FileUpload";

const Http = () => {
  const [modalData, setModalData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const backendBaseURL = "http://localhost:5000";
  const testUserId = "683ff5b44262a2b04a24be14";

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const data = useMemo(
    () => [
      { method: "GET", desc: "Fetch all users" },
      { method: "POST", desc: "Register a new user" },
      { method: "PUT", desc: "Replace all data" },
      { method: "PATCH", desc: "Update user profile" },
      { method: "DELETE", desc: "Delete a user" },
    ],
    []
  );

  const columns = useMemo(
    () => [
      {
        header: "Method",
        accessorKey: "method",
      },
      {
        header: "Description",
        accessorKey: "desc",
      },
      {
        header: "Action",
        cell: ({ row }) => {
          const method = row.original.method;

          return (
            <div className="flex flex-col gap-3 items-center">
              {method === "POST" && (
                <div className="w-full">
                  <FileUpload
                    onFileSelect={handleFileSelect}
                    selectedFile={selectedFile}
                    accept="image/*"
                    className="mb-2"
                  />
                </div>
              )}
              <button
                onClick={() => handleApiCall(method)}
                className="bg-blue-600 text-white px-4 py-2 text-sm rounded hover:bg-blue-700 transition-colors duration-200"
              >
                Call API
              </button>
            </div>
          );
        },
      },
    ],
    [selectedFile]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleApiCall = async (method) => {
    let url = "";
    let data = {};

    switch (method) {
      case "GET":
        url = `${backendBaseURL}/api/users/all-users`;
        break;

      case "POST":
        url = `${backendBaseURL}/api/users/register`;
        data = new FormData();
        data.append("name", "rajiv");
        data.append("email", "rajiv@g.com");
        data.append("password", "rajiv@we3");
        if (selectedFile) {
          data.append("profilePicture", selectedFile);
        }
        break;

      case "PUT":
        url = `${backendBaseURL}/api/users/update-user/${testUserId}`;
        data = {
          name: "rajiv ",
          email: `kevavfvvfv`,
          password: "newpassword123",
          profilePicture: "https://example.com/bird.jpg",
        };
        break;

      case "PATCH":
        url = `${backendBaseURL}/api/users/update-profile/${testUserId}`;
        data = { name: "Karan Patel" };
        break;

      case "DELETE":
        url = `${backendBaseURL}/api/users/delete-user/${testUserId}`;
        break;

      default:
        return;
    }

    try {
      const response = await axios({
        url,
        method,
        ...(method !== "DELETE" && { data }),
        headers:
          method === "POST" ? { "Content-Type": "multipart/form-data" } : {},
      });

      setModalData(JSON.stringify(response.data, null, 2));
      toast.success(`${method} request successful!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "API Call Failed");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          HTTP Method API Tester
        </h1>
        <p className="text-gray-600">
          Test your API endpoints with different HTTP methods
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full h-[85vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-800">
                API Response
              </h2>
              <button
                onClick={() => setModalData(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-hidden p-6">
              <div className="h-full overflow-y-auto border rounded-lg">
                <pre className="text-sm bg-gray-50 p-4 whitespace-pre-wrap break-words">
                  <code>{modalData}</code>
                </pre>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 flex-shrink-0">
              <button
                onClick={() => navigator.clipboard.writeText(modalData)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors duration-200"
              >
                Copy Response
              </button>
              <button
                onClick={() => setModalData(null)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Http;
