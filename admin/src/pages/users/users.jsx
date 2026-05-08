import React, { useEffect, useState } from "react";
import "./users.css";
import { api } from "../../config/api";
import { toast } from "react-toastify";

const Users = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/user/list");
      setUsers(res.data?.data || []);
    } catch (error) {
      toast.error("Failed to load users ❌");
    }
  };

  // 🔥 DELETE USER
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await api.post("/api/user/delete", { id });
      toast.success("User deleted ✅");
      fetchUsers();
    } catch {
      toast.error("Error deleting user ❌");
    }
  };

  // 🔥 BLOCK / UNBLOCK
  const toggleBlock = async (id, currentStatus) => {
    try {
      await api.post("/api/user/block", {
        id,
        blocked: !currentStatus,
      });
      toast.success(currentStatus ? "User unblocked ✅" : "User blocked 🚫");
      fetchUsers();
    } catch {
      toast.error("Error updating user ❌");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="users-container">
      <h2>Users Management</h2>

      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>

                <td>
                  <span className={u.blocked ? "blocked" : "active"}>
                    {u.blocked ? "Blocked" : "Active"}
                  </span>
                </td>

                <td>
                  <button
                    className="block-btn"
                    onClick={() => toggleBlock(u._id, u.blocked)}
                  >
                    {u.blocked ? "Unblock" : "Block"}
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteUser(u._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Users;