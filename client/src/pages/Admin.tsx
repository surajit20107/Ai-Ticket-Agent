import { useState, useEffect } from "react";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "moderator" | "admin";
  skills: string[];
  createdAt: string;
}

interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high";
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  relatedSkills: string[];
  createdAt: string;
  updatedAt: string;
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState<"tickets" | "users">("tickets");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newSkill, setNewSkill] = useState("");

  // Fetch tickets
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/tickets`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );
      setTickets(res.data?.tickets || []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );
      setUsers(res.data?.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchUsers();
  }, []);

  // Update ticket status
  const updateTicketStatus = async (ticketId: string) => {
    try {
      await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/tickets/update/${ticketId}`,
        {
          withCredentials: true,
        },
      );
      fetchTickets();
    } catch (error) {
      console.error("Error updating ticket status:", error);
      alert("Failed to update ticket status");
    }
  };

  // Update user role
  const updateUserRole = async (userId: string, role: string) => {
    try {
      
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/role`,
        { role },
        {
          withCredentials: true,
        },
      );
      fetchUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Failed to update user role");
    }
  };

  // Update user skills
  const updateUserSkills = async (userId: string, skills: string[]) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/skills`,
        { skills },
        {
          withCredentials: true,
        },
      );
      fetchUsers();
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user skills:", error);
      alert("Failed to update user skills");
    }
  };

  const addSkillToUser = (user: User, skill: string) => {
    if (skill.trim() && !user.skills.includes(skill.trim())) {
      const updatedSkills = [...user.skills, skill.trim()];
      updateUserSkills(user._id, updatedSkills);
    }
  };

  const removeSkillFromUser = (user: User, skillToRemove: string) => {
    const updatedSkills = user.skills.filter(
      (skill) => skill !== skillToRemove,
    );
    updateUserSkills(user._id, updatedSkills);
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      open: "badge-error",
      "in-progress": "badge-warning",
      resolved: "badge-success",
    };
    return `badge ${statusClasses[status as keyof typeof statusClasses] || "badge-neutral"}`;
  };

  const getRoleBadge = (role: string) => {
    const roleClasses = {
      user: "badge-info",
      moderator: "badge-warning",
      admin: "badge-error",
    };
    return `badge ${roleClasses[role as keyof typeof roleClasses] || "badge-neutral"}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-base-100 shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-base-content">
                Admin Dashboard
              </h1>
              <p className="text-base-content/70 mt-1">
                Manage tickets, users, and system settings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="tabs tabs-boxed w-fit mb-6">
          <button
            className={`tab ${activeTab === "tickets" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("tickets")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Tickets Management
          </button>
          <button
            className={`tab ${activeTab === "users" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
            Users Management
          </button>
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === "tickets" && !loading && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="stat bg-base-100 rounded-lg shadow-sm">
                <div className="stat-title">Total Tickets</div>
                <div className="stat-value text-primary">{tickets.length}</div>
              </div>
              <div className="stat bg-base-100 rounded-lg shadow-sm">
                <div className="stat-title">Open Tickets</div>
                <div className="stat-value text-error">
                  {tickets.filter((t) => t.status === "open").length}
                </div>
              </div>
              <div className="stat bg-base-100 rounded-lg shadow-sm">
                <div className="stat-title">In Progress</div>
                <div className="stat-value text-warning">
                  {tickets.filter((t) => t.status === "in-progress").length}
                </div>
              </div>
            </div>

            <div className="bg-base-100 rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Created By</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket) => (
                      <tr key={ticket._id}>
                        <td>
                          <div className="font-semibold">{ticket.title}</div>
                          <div className="text-sm text-base-content/60 truncate max-w-xs">
                            {ticket.description}
                          </div>
                        </td>
                        <td>
                          <div>{ticket.createdBy.name}</div>
                          <div className="text-sm text-base-content/60">
                            {ticket.createdBy.email}
                          </div>
                        </td>
                        <td>
                          <span className={getStatusBadge(ticket.status)}>
                            {ticket.status}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge ${ticket.priority === "high" ? "badge-error" : ticket.priority === "medium" ? "badge-warning" : "badge-info"}`}
                          >
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="text-sm">
                          {formatDate(ticket.createdAt)}
                        </td>
                        <td>
                          <div className="dropdown dropdown-end">
                            <div
                              tabIndex={0}
                              role="button"
                              className="btn btn-sm btn-ghost"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 5v.01M12 12v.01M12 19v.01"
                                />
                              </svg>
                            </div>
                            <ul
                              tabIndex={0}
                              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                            >
                              <li>
                                <button
                                  onClick={() => updateTicketStatus(ticket._id)}
                                  className="text-success"
                                >
                                  Mark as resolved
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && !loading && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="stat bg-base-100 rounded-lg shadow-sm">
                <div className="stat-title">Total Users</div>
                <div className="stat-value text-primary">{users.length}</div>
              </div>
              <div className="stat bg-base-100 rounded-lg shadow-sm">
                <div className="stat-title">Moderators</div>
                <div className="stat-value text-warning">
                  {users.filter((u) => u.role === "moderator").length}
                </div>
              </div>
              <div className="stat bg-base-100 rounded-lg shadow-sm">
                <div className="stat-title">Admins</div>
                <div className="stat-value text-error">
                  {users.filter((u) => u.role === "admin").length}
                </div>
              </div>
            </div>

            <div className="bg-base-100 rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Skills</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>
                          <div className="font-semibold">{user.name}</div>
                          <div className="text-sm text-base-content/60">
                            {user.email}
                          </div>
                        </td>
                        <td>
                          <span className={getRoleBadge(user.role)}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {user.skills.slice(0, 3).map((skill, index) => (
                              <span
                                key={index}
                                className="badge badge-outline badge-sm"
                              >
                                {skill}
                              </span>
                            ))}
                            {user.skills.length > 3 && (
                              <span className="badge badge-outline badge-sm">
                                +{user.skills.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="text-sm">
                          {formatDate(user.createdAt)}
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <div className="dropdown dropdown-end">
                              <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-sm btn-outline"
                              >
                                Role
                              </div>
                              <ul
                                tabIndex={0}
                                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32"
                              >
                                <li>
                                  <button
                                    onClick={() =>
                                      updateUserRole(user._id, "user")
                                    }
                                    className="text-info"
                                  >
                                    User
                                  </button>
                                </li>
                                <li>
                                  <button
                                    onClick={() =>
                                      updateUserRole(user._id, "moderator")
                                    }
                                    className="text-warning"
                                  >
                                    Moderator
                                  </button>
                                </li>
                                <li>
                                  <button
                                    onClick={() =>
                                      updateUserRole(user._id, "admin")
                                    }
                                    className="text-error"
                                  >
                                    Admin
                                  </button>
                                </li>
                              </ul>
                            </div>
                            <button
                              className="btn btn-sm btn-outline"
                              onClick={() => setEditingUser(user)}
                            >
                              Skills
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Skills Management Modal */}
      {editingUser && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">
              Manage Skills for {editingUser.name}
            </h3>

            {/* Current Skills */}
            <div className="mb-4">
              <label className="label">
                <span className="label-text font-semibold">
                  Current Skills:
                </span>
              </label>
              <div className="flex flex-wrap gap-2">
                {editingUser.skills.map((skill, index) => (
                  <div key={index} className="badge badge-outline gap-2">
                    {skill}
                    <button
                      className="btn btn-ghost btn-xs p-0 h-4 w-4"
                      onClick={() => removeSkillFromUser(editingUser, skill)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
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
                ))}
                {editingUser.skills.length === 0 && (
                  <span className="text-base-content/60 italic">
                    No skills assigned
                  </span>
                )}
              </div>
            </div>

            {/* Add New Skill */}
            <div className="mb-6">
              <label className="label">
                <span className="label-text font-semibold">Add New Skill:</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="input input-bordered flex-1"
                  placeholder="Enter skill name..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addSkillToUser(editingUser, newSkill);
                      setNewSkill("");
                    }
                  }}
                />
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    addSkillToUser(editingUser, newSkill);
                    setNewSkill("");
                  }}
                >
                  Add
                </button>
              </div>
            </div>

            <div className="modal-action">
              <button
                className="btn"
                onClick={() => {
                  setEditingUser(null);
                  setNewSkill("");
                }}
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

export default Admin;
