import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const Ticket = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const deleteTicket = async (id: string) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/tickets/${id}`,
        {
          withCredentials: true,
        },
      );
      if (res.status === 200) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/tickets/${id}`,
        {
          withCredentials: true,
        },
      );
      setTicket(res.data?.ticket);
      setError(null);
    } catch (error: any) {
      console.error("Error fetching ticket:", error);
      setError(error.response?.data?.message || "Failed to fetch ticket");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTicket();
    }
  }, [id]);

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
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-error text-xl mb-4">⚠️ {error}</div>
          <button onClick={() => navigate("/")} className="btn btn-primary">
            Back to Tickets
          </button>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-4">Ticket not found</div>
          <button onClick={() => navigate("/")} className="btn btn-primary">
            Back to Tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="btn btn-ghost btn-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Tickets
            </button>
            <h1 className="text-2xl font-bold">Ticket Details</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Status */}
            <div className="bg-base-100 rounded-lg shadow-sm p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <h2 className="text-xl font-semibold flex-1">{ticket.title}</h2>
                <div className="flex gap-2">
                  <span className={getStatusBadge(ticket.status)}>
                    {ticket.status}
                  </span>
                  <span className={getPriorityBadge(ticket.priority)}>
                    {ticket.priority}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-base-content/80 whitespace-pre-wrap">
                  {ticket.description}
                </p>
              </div>
            </div>

            {/* Skills */}
            {ticket.relatedSkills && ticket.relatedSkills.length > 0 && (
              <div className="bg-base-100 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium mb-3">Related Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {ticket.relatedSkills.map((skill, index) => (
                    <span key={index} className="badge badge-outline">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Helpful Notes */}
            {ticket.helpfulNotes && (
              <div className="bg-base-100 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium mb-3">Notes from Support</h3>
                <div className="p-4 bg-base-200 rounded-md">
                  <p className="text-base-content/80 whitespace-pre-wrap">
                    {ticket.helpfulNotes}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Metadata */}
          <div className="space-y-6">
            {/* Assignment Info */}
            <div className="bg-base-100 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-4">Assignment</h3>
              <div className="space-y-3">
                {ticket.assignedTo ? (
                  <div>
                    <div className="text-sm text-base-content/60 mb-1">
                      Assigned to
                    </div>
                    <div className="font-medium">{ticket.assignedTo.name}</div>
                    <div className="text-sm text-base-content/60">
                      {ticket.assignedTo.email}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-sm text-base-content/60 mb-1">
                      Assigned to
                    </div>
                    <div className="text-base-content/60 italic">
                      Unassigned
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-base-100 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-4">Timeline</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-base-content/60 mb-1">
                    Created
                  </div>
                  <div className="text-sm">{formatDate(ticket.createdAt)}</div>
                </div>

                <div>
                  <div className="text-sm text-base-content/60 mb-1">
                    Last updated
                  </div>
                  <div className="text-sm">{formatDate(ticket.updatedAt)}</div>
                </div>

                {ticket.deadline && (
                  <div>
                    <div className="text-sm text-base-content/60 mb-1">
                      Deadline
                    </div>
                    <div className="text-sm font-medium text-warning">
                      {formatDate(ticket.deadline)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-base-100 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium mb-4">Actions</h3>
              <div className="space-y-2">
                <button
                  className="btn btn-outline btn-sm w-full text-error"
                  onClick={() => deleteTicket(ticket._id)}
                >
                  Delete Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
