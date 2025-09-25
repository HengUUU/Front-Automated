import React, { useState, useEffect } from "react";
import Sidebar from "../component/SideBar";
import GreenBar from "../component/GreenBar";

const apiUrl = import.meta.env.VITE_API_URL;

export default function FactoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
    const [popup, setPopup] = useState({
    visible: false,
    message: "",
    type: "", // "confirm", "success", "error"
    onConfirm: null,
    });

  const [factories, setFactories] = useState([]);
  const [editingRow, setEditingRow] = useState(null); // index of row being edited
  const [editedFactory, setEditedFactory] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false); // show/hide create form
  const [newFactory, setNewFactory] = useState({
    name: "",
    Id: "",
    business: "",
    location: "",
    latitude: "",
    longitude: "",
  });

  // Search factories
    const handleSearch = async () => {
    if (!searchTerm) return;

    setLoading(true);
    setError("");
    setFactories([]); // <-- clear previous results before fetching

    try {
        const token = localStorage.getItem("token");
        const query = new URLSearchParams({ name: searchTerm });
        const res = await fetch(`${apiUrl}/factories/search?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("No factories found");

        const data = await res.json();
        setFactories(data); // <-- refresh table with new results
    } catch (err) {
        setFactories([]);
        setError(err.message);
    } finally {
        setLoading(false);
    }
    };


  // Start editing a row
  const startEditing = (index) => {
    setEditingRow(index);
    const f = factories[index];
    const [lat, long] = f.mapLatLong ? f.mapLatLong.split(",") : ["", ""];
    setEditedFactory({ ...f, latitude: lat, longitude: long });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingRow(null);
    setEditedFactory({});
  };

  // Handle input change for inline editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedFactory((prev) => ({ ...prev, [name]: value }));
  };

    const handleUpdateWithPopup = (index) => {
    const factoryToUpdate = editedFactory;

    setPopup({
        visible: true,
        message: "Are you sure you want to update this factory?",
        type: "confirm",
        onConfirm: async () => {
        const payload = {
            ...factoryToUpdate,
            mapLatLong:
            factoryToUpdate.latitude && factoryToUpdate.longitude
                ? `${factoryToUpdate.latitude},${factoryToUpdate.longitude}`
                : factoryToUpdate.mapLatLong,
        };

        try {
            const token = localStorage.getItem("token");
            const query = new URLSearchParams({ name: factoryToUpdate.name });
            const res = await fetch(`${apiUrl}/factories/?${query}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to update factory");

            // Remove table after successful update
            setFactories([]); // <-- this hides the table
            cancelEditing();
            setPopup({
            visible: true,
            message: "✅ Factory updated successfully!",
            type: "success",
            });
        } catch (err) {
            setPopup({
            visible: true,
            message: `❌ Failed to update factory: ${err.message}`,
            type: "error",
            });
        }
        },
    });
    };


  // Save changes for the row
  const saveChanges = async () => {
    if (editingRow === null) return;

    const payload = {
      ...editedFactory,
      mapLatLong:
        editedFactory.latitude && editedFactory.longitude
          ? `${editedFactory.latitude},${editedFactory.longitude}`
          : editedFactory.mapLatLong,
    };

    try {
      const token = localStorage.getItem("token");
      const query = new URLSearchParams({ name: editedFactory.name });
      const res = await fetch(`${apiUrl}/factories/?${query}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update factory");

      const updatedFactories = [...factories];
      updatedFactories[editingRow] = { ...payload };
      setFactories(updatedFactories);

      cancelEditing();
      alert("Factory updated successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle new factory input change
  const handleNewInputChange = (e) => {
    const { name, value } = e.target;
    setNewFactory((prev) => ({ ...prev, [name]: value }));
  };

  // Create new factory
    const handleCreateWithPopup = () => {
    setPopup({
        visible: true,
        message: "Are you sure you want to create this factory?",
        type: "confirm",
        onConfirm: async () => {
        const factoryPayload = {
            name: newFactory.name,
            Id: newFactory.Id || undefined,
            business: newFactory.business || undefined,
            location: newFactory.location || undefined,
            mapLatLong:
            newFactory.latitude && newFactory.longitude
                ? `${newFactory.latitude},${newFactory.longitude}`
                : undefined,
        };

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${apiUrl}/factories/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(factoryPayload),
            });

            if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.detail || "Failed to create factory");
            }

            setPopup({
            visible: true,
            message: "✅ Factory created successfully!",
            type: "success",
            });

            setNewFactory({
            name: "",
            Id: "",
            business: "",
            location: "",
            latitude: "",
            longitude: "",
            });
            handleSearch();
        } catch (err) {
            setPopup({
            visible: true,
            message: `❌ Failed to create factory: ${err.message}`,
            type: "error",
            });
        }
        },
    });
    };



  return (
    <div className="h-screen flex flex-col">
      <GreenBar />
      <div className="flex flex-1 relative pt-16">
        <Sidebar />
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4">Factories Management</h1>

          {/* Search and New button */}
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 flex-1"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Search
            </button>
            <button
            onClick={() => {
                setShowCreateForm((prev) => !prev);
                setFactories([]); // <-- remove the search result table
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded"
            >
            New
            </button>
          </div>

          {loading && <p>Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {/* Factories Table */}
          {factories.length > 0 && (
            <table className="border w-full mb-4">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2">ID</th>
                  <th className="border p-2">ឈ្មោះ</th>
                  <th className="border p-2">ទីតាំង</th>
                  <th className="border p-2">ប្រភេទក្រុមហ៊៊ុន</th>
                  <th className="border p-2">Latitude</th>
                  <th className="border p-2">Longitude</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {factories.map((f, idx) => {
                  const isEditing = editingRow === idx;
                  return (
                    <tr key={idx} className="hover:bg-gray-100">
                      <td className="border p-2">
                        {isEditing ? (
                          <input
                            type="text"
                            name="Id"
                            value={editedFactory.Id || ""}
                            onChange={handleInputChange}
                            className="border p-1 w-full"
                          />
                        ) : (
                          f.Id || "-"
                        )}
                      </td>
                      <td className="border p-2">
                        {isEditing ? (
                          <input
                            type="text"
                            name="name"
                            value={editedFactory.name || ""}
                            onChange={handleInputChange}
                            className="border p-1 w-full"
                          />
                        ) : (
                          f.name
                        )}
                      </td>
                      <td className="border p-2">
                        {isEditing ? (
                          <input
                            type="text"
                            name="location"
                            value={editedFactory.location || ""}
                            onChange={handleInputChange}
                            className="border p-1 w-full"
                          />
                        ) : (
                          f.location || "-"
                        )}
                      </td>
                      <td className="border p-2">
                        {isEditing ? (
                          <input
                            type="text"
                            name="business"
                            value={editedFactory.business || ""}
                            onChange={handleInputChange}
                            className="border p-1 w-full"
                          />
                        ) : (
                          f.business || "-"
                        )}
                      </td>
                      <td className="border p-2">
                        {isEditing ? (
                          <input
                            type="text"
                            name="latitude"
                            value={editedFactory.latitude || ""}
                            onChange={handleInputChange}
                            className="border p-1 w-full"
                          />
                        ) : (
                          f.mapLatLong?.split(",")[0] || "-"
                        )}
                      </td>
                      <td className="border p-2">
                        {isEditing ? (
                          <input
                            type="text"
                            name="longitude"
                            value={editedFactory.longitude || ""}
                            onChange={handleInputChange}
                            className="border p-1 w-full"
                          />
                        ) : (
                          f.mapLatLong?.split(",")[1] || "-"
                        )}
                      </td>
                      <td className="border p-2 flex gap-1">
                        {isEditing ? (
                          <>
                            <button
                            onClick={() => handleUpdateWithPopup(editingRow)}
                            className="px-2 py-1 bg-green-600 text-white rounded"
                            >
                            Save
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="px-2 py-1 bg-gray-400 text-white rounded"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => startEditing(idx)}
                            className="px-2 py-1 bg-blue-600 text-white rounded"
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {/* pop up */}

                {popup.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
            <p className="mb-4">{popup.message}</p>
            {popup.type === "confirm" ? (
                <div className="flex justify-center gap-4">
                <button
                    onClick={() => {
                    popup.onConfirm?.();
                    setPopup({ ...popup, visible: false });
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                >
                    Yes
                </button>
                <button
                    onClick={() => setPopup({ ...popup, visible: false })}
                    className="px-4 py-2 bg-gray-400 text-white rounded"
                >
                    Cancel
                </button>
                </div>
            ) : (
                <button
                onClick={() => setPopup({ ...popup, visible: false })}
                className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                OK
                </button>
            )}
            </div>
        </div>
        )}


          {/* Create Form */}
          {showCreateForm && (
            <div className="border p-4 rounded bg-gray-100 mb-4">
              <h2 className="text-xl font-bold mb-2">Create New Factory</h2>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  name="name"
                  value={newFactory.name}
                  onChange={handleNewInputChange}
                  placeholder="Name (required)"
                  className="border p-2"
                />
                <input
                  type="text"
                  name="Id"
                  value={newFactory.Id}
                  onChange={handleNewInputChange}
                  placeholder="ID (optional)"
                  className="border p-2"
                />
                <input
                  type="text"
                  name="business"
                  value={newFactory.business}
                  onChange={handleNewInputChange}
                  placeholder="ប្រភេទក្រុមហ៊៊ុន (optional)"
                  className="border p-2"
                />
                <input
                  type="text"
                  name="location"
                  value={newFactory.location}
                  onChange={handleNewInputChange}
                  placeholder="ទីតាំង (optional)"
                  className="border p-2"
                />
                <input
                  type="text"
                  name="latitude"
                  value={newFactory.latitude}
                  onChange={handleNewInputChange}
                  placeholder="Latitude (optional)"
                  className="border p-2"
                />
                <input
                  type="text"
                  name="longitude"
                  value={newFactory.longitude}
                  onChange={handleNewInputChange}
                  placeholder="Longitude (optional)"
                  className="border p-2"
                />
              </div>
              <button
                onClick={handleCreateWithPopup}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Create
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
