import React, { useState } from "react";
import Sidebar from "../component/SideBar";
import GreenBar from "../component/GreenBar";

const apiUrl = import.meta.env.VITE_API_URL;

export default function FactoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [factories, setFactories] = useState([]);
  const [selectedFactory, setSelectedFactory] = useState(null);
    const [newFactory, setNewFactory] = useState({
    name: "",
    Id: "",
    business: "",
    location: "",
    latitude: "",
    longitude: ""
    });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updateLat, setUpdateLat] = useState("");
  const [updateLong, setUpdateLong] = useState("");

  // Search factories
  const handleSearch = async () => {
    if (!searchTerm) return;
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const query = new URLSearchParams({ name: searchTerm });
      const res = await fetch(`${apiUrl}/factories/search?${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "No factories found");
      }

      const data = await res.json();
      setFactories(data);
    } catch (err) {
      setFactories([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Select factory to update
    const handleSelect = (factory) => {
    setSelectedFactory(factory);

    if (factory.mapLatLong) {
        const [lat, long] = factory.mapLatLong.split(",");
        setUpdateLat(lat);
        setUpdateLong(long);
    } else {
        setUpdateLat("");
        setUpdateLong("");
    }
    };


  // Update input changes
  const handleInputChange = (e) => {
    setSelectedFactory(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Create input changes
  const handleNewInputChange = (e) => {
    setNewFactory(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Create new factory
    const handleCreate = async () => {
    if (!newFactory.name) {
        alert("Name is required!");
        return;
    }

    const factoryPayload = {
        name: newFactory.name,
        Id: newFactory.Id || undefined,
        business: newFactory.business || undefined,
        location: newFactory.location || undefined,
        mapLatLong:
        newFactory.latitude && newFactory.longitude
            ? `${newFactory.latitude},${newFactory.longitude}`
            : undefined
    };

    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${apiUrl}/factories/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(factoryPayload)
        });

        if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to create factory");
        }

        alert("Factory created successfully!");
        setNewFactory({
        name: "",
        Id: "",
        business: "",
        location: "",
        latitude: "",
        longitude: ""
        });
        handleSearch();
    } catch (err) {
        alert(err.message);
    }
    };

  // Partial update
    const handleUpdate = async () => {
    if (!selectedFactory) return;

    const updatePayload = {
        ...selectedFactory,
        mapLatLong:
        updateLat && updateLong
            ? `${updateLat},${updateLong}`
            : selectedFactory.mapLatLong
    };

    try {
        const token = localStorage.getItem("token");
        const query = new URLSearchParams({ name: selectedFactory.name });
        const res = await fetch(`${apiUrl}/factories/?${query}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatePayload)
        });

        if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to update factory");
        }

        alert("Factory updated successfully!");
        setSelectedFactory(null);
        setUpdateLat("");
        setUpdateLong("");
        handleSearch();
    } catch (err) {
        alert(err.message);
    }
    };


  return (
    <div className="h-screen flex flex-col">
      <GreenBar />
      <div className="flex flex-1 relative pt-16">
        <Sidebar />
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4">Factories Management</h1>

          {/* Search */}
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
          </div>

          {loading && <p>Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {/* Factories Table */}
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
                    const [lat, long] = f.mapLatLong ? f.mapLatLong.split(",") : ["-", "-"];
                    return (
                    <tr key={idx} className="hover:bg-gray-100">
                        <td className="border p-2">{f.Id || "-"}</td>
                        <td className="border p-2">{f.name}</td>
                        <td className="border p-2">{f.location || "-"}</td>
                        <td className="border p-2">{f.business || "-"}</td>
                        <td className="border p-2">{lat}</td>
                        <td className="border p-2">{long}</td>
                        <td className="border p-2">
                        <button
                            onClick={() => handleSelect(f)}
                            className="px-2 py-1 bg-blue-600 text-white rounded"
                        >
                            Edit
                        </button>
                        </td>
                    </tr>
                    );
                })}
                </tbody>
            </table>
            )}


          {/* Update Form */}
            {selectedFactory && (
            <div className="border p-4 rounded bg-gray-50 mb-4">
                <h2 className="text-xl font-bold mb-2">
                Update Factory: {selectedFactory.name}
                </h2>
                <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                    type="text"
                    name="Id"
                    value={selectedFactory.Id || ""}
                    onChange={handleInputChange}
                    placeholder="ID (optional)"
                    className="border p-2"
                />
                <input
                    type="text"
                    name="name"
                    value={selectedFactory.name || ""}
                    onChange={handleInputChange}
                    placeholder="Name (required)"
                    className="border p-2"
                />
                <input
                    type="text"
                    name="business"
                    value={selectedFactory.business || ""}
                    onChange={handleInputChange}
                    placeholder="ប្រភេទក្រុមហ៊៊ុន (optional)"
                    className="border p-2"
                />
                <input
            type="text"
            name="location"
            value={selectedFactory.location || ""}
            onChange={handleInputChange}
            placeholder="ទីតាំង (optional)"
            className="border p-2"
            />
                <input
                    type="text"
                    value={updateLat}
                    onChange={(e) => setUpdateLat(e.target.value)}
                    placeholder="Latitude (optional)"
                    className="border p-2"
                />
                <input
                    type="text"
                    value={updateLong}
                    onChange={(e) => setUpdateLong(e.target.value)}
                    placeholder="Longitude (optional)"
                    className="border p-2"
                />
                </div>
                <div className="flex gap-2">
                <button
                    onClick={handleUpdate}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                >
                    Update
                </button>
                <button
                    onClick={() => setSelectedFactory(null)}
                    className="px-4 py-2 bg-gray-400 text-white rounded"
                >
                    Cancel
                </button>
                </div>
            </div>
            )}


          {/* Create Form */}
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
            required
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
            onClick={handleCreate}
            className="px-4 py-2 bg-green-600 text-white rounded"
        >
            Create
        </button>
        </div>

        </div>
      </div>
    </div>
  );
}
