import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved";
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
  priority: "low" | "medium" | "high" | "urgent";
  deadline?: string;
  helpfulNotes?: string;
  relatedSkills: string[];
  createdAt: string;
  updatedAt: string;
}

const Tickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const fetchTickets = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/tickets`,
        {
          withCredentials: true,
        },
      );
      setTickets(res.data?.tickets);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      open: "badge-error",
      "in-progress": "badge-warning",
      resolved: "badge-success",
    };
    return `badge ${statusClasses[status as keyof typeof statusClasses] || "badge-neutral"}`;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityClasses = {
      low: "badge-info",
      medium: "badge-warning",
      high: "badge-error",
      urgent: "badge-error badge-outline",
    };
    return `badge ${priorityClasses[priority as keyof typeof priorityClasses] || "badge-neutral"}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Filter tickets based on status, priority, and search term
  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus =
      statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || ticket.priority === priorityFilter;
    const matchesSearch =
      searchTerm === "" ||
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesPriority && matchesSearch;
  });
  console.log(tickets);
  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-base-100 shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-base-content">
                My Tickets
              </h1>
              <p className="text-base-content/70 mt-1">
                View and track your support requests
              </p>
            </div>
            <Link to="/create">
              <button className="btn btn-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="stat bg-base-100 rounded-lg shadow-sm">
            <div className="stat-title">Total Tickets</div>
            <div className="stat-value text-primary">{tickets.length}</div>
          </div>

          {/*
          <div className="stat bg-base-100 rounded-lg shadow-sm">
            <div className="stat-title">Open</div>
            <div className="stat-value text-error">
              {tickets.filter((t) => t.status === "open").length}
            </div>
          </div>
          */}

          <div className="stat bg-base-100 rounded-lg shadow-sm">
            <div className="stat-title">In Progress</div>
            <div className="stat-value text-warning">
              {tickets.filter((t) => t.status === "in-progress").length}
            </div>
          </div>
          <div className="stat bg-base-100 rounded-lg shadow-sm">
            <div className="stat-title">Resolved</div>
            <div className="stat-value text-success">
              {tickets.filter((t) => t.status === "resolved").length}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-base-100 rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="form-control">
              <select
                className="select select-bordered w-full max-w-xs"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <div className="form-control">
              <select
                className="select select-bordered w-full max-w-xs"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="form-control flex-1">
              <input
                type="text"
                placeholder="Search your tickets..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket._id}
              className="bg-base-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-base-content hover:text-primary cursor-pointer text-blue-500">
                        <Link to={`/ticket/${ticket._id}`}>{ticket.title}</Link>
                      </h3>
                      <span className={getStatusBadge(ticket.status)}>
                        {ticket.status === "open"
                          ? "Open"
                          : ticket.status === "in-progress"
                            ? "Progress"
                            : "Resolved"}
                      </span>
                      <span className={getPriorityBadge(ticket.priority)}>
                        {ticket.priority}
                      </span>
                    </div>
                    <p className="text-base-content/70 mb-3">
                      {ticket.description}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {ticket.relatedSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="badge badge-outline badge-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-base-content/60">
                      <span>Created: {formatDate(ticket.createdAt)}</span>
                      {ticket.assignedTo && (
                        <span>
                          Assigned to: <strong>{ticket.assignedTo.name}</strong>
                        </span>
                      )}
                      {ticket.deadline && (
                        <span>
                          Deadline:{" "}
                          <strong className="text-warning">
                            {formatDate(ticket.deadline)}
                          </strong>
                        </span>
                      )}
                      <span>Last updated: {formatDate(ticket.updatedAt)}</span>
                    </div>

                    {/* Helpful Notes */}
                    {ticket.helpfulNotes && (
                      <div className="mt-3 p-3 bg-base-200 rounded-md">
                        <p className="text-sm text-base-content/80">
                          <strong>Notes from support:</strong>{" "}
                          {ticket.helpfulNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTickets.length === 0 && tickets.length > 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">
              No tickets match your filters
            </h3>
            <p className="text-base-content/60 mb-4">
              Try adjusting your search criteria or filters.
            </p>
            <button
              className="btn btn-outline"
              onClick={() => {
                setStatusFilter("all");
                setPriorityFilter("all");
                setSearchTerm("");
              }}
            >
              Clear Filters
            </button>
          </div>
        )}

        {filteredTickets.length === 0 && tickets.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎫</div>
            <h3 className="text-xl font-semibold mb-2">No tickets yet</h3>
            <p className="text-base-content/60 mb-4">
              Create your first support ticket to get help with any issues.
            </p>
            <Link to="/create">
              <button className="btn btn-primary">
                Create Your First Ticket
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tickets;
