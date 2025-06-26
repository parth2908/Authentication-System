import React, { useEffect, useState } from "react";
import API from "../api/axios";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";



const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [excludedUsers, setExcludedUsers] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 52;
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const SERVER_URL = `${import.meta.env.VITE_API_BASE_URL}`;

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users/all-users");
      setUsers(res.data);
    } catch (err) {
      setError("Failed to fetch users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const totalPages = Math.ceil(users.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const downloadExcel = () => {
    if (users.length === 0) return;

    const data = users.map((user, index) => ({
      SNo: index + 1,
      Name: user.name,
      Email: user.email,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    XLSX.writeFile(workbook, "RegisteredUsers.xlsx");
    toast.success("Excel downloaded successfully!");
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("excelFile", file);

    setLoading(true);

    try {
      const res = await API.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/bulk-register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const results = res.data.importResults || [];

      const importedCount = results.filter((r) => r.status === "Imported").length;
      const duplicateCount = results.filter((r) => r.status === "Already registered").length;
      const errorCount = results.filter((r) => r.status.startsWith("Error") || r.status === "Missing required fields").length;

      const excluded = results.filter((r) => r.status !== "Imported");
      setExcludedUsers(excluded);

      if (importedCount > 0) {
        toast.success(`${importedCount} user(s) imported successfully!`);
      }
      if (duplicateCount > 0 || errorCount > 0) {
        toast.error(`Import completed with ${duplicateCount} duplicates and ${errorCount} errors.`);
        setModalOpen(true);
      }
      if (importedCount === 0 && excluded.length > 0) {
        toast.error("No users imported. All were excluded.");
        setModalOpen(true);
      }

      fetchUsers();
      event.target.value = null;
    } catch (error) {
      console.error("File upload error:", error);
      toast.error("Import failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white-200 p-6 relative">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="text-white text-xl font-bold">Uploading...</div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">
          All Registered Users
        </h2>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div className="relative inline-block">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload Excel"}
            </button>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={loading}
            />
          </div>

          <button
            onClick={downloadExcel}
            className="px-4 py-2 bg-green-400 text-white rounded hover:bg-green-600"
          >
            Download Excel
          </button>

          {excludedUsers.length > 0 && (
            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 bg-red-400 text-black font-semibold rounded hover:bg-red-400"
            >
              View Excluded Users
            </button>
          )}
        </div>

        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {currentUsers.map((user, index) => (
            <div
              key={user.id || index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center p-6"
            >
              <img
                src={
                  user.profilePicture?.startsWith("http")
                    ? user.profilePicture
                    : `${SERVER_URL}/uploads/${user.profilePicture}`
                }
                alt={user.name}
                // onError={(e) => (e.target.src = "/default-profile.png")}
                className="w-24 h-24 object-cover rounded-full border-4 border-indigo-500 mb-4"
              />
              <p className="text-lg font-semibold text-gray-700">{user.name}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center mt-10 space-x-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-lg font-semibold text-gray-800">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Excluded Users Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "white",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <h3 className="text-lg font-semibold mb-4">Excluded Users</h3>
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Reason</th>
              </tr>
            </thead>
            <tbody>
              {excludedUsers.map((user, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 border-t border-gray-200">
                    {user.Email}
                  </td>
                  <td className="px-4 py-2 border-t border-gray-200 text-red-600">
                    {user.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Modal>
    </div>
  );
};

export default UsersPage;
