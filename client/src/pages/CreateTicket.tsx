import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const CreateTicket = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { title?: string; description?: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters long";
    } else if (formData.title.trim().length > 50) {
      newErrors.title = "Title should not exceed 50 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 5) {
      newErrors.description = "Description must be at least 5 characters long";
    } else if (formData.description.trim().length > 200) {
      newErrors.description = "Description should not exceed 200 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/tickets`,
        formData,
        {
          withCredentials: true,
        },
      );
      console.log(res)
      if (res.status !== 201) {
        throw new Error("Failed to create ticket");
      } else {
        setFormData({ title: "", description: "" });
        alert("Ticket created successfully!");
        navigate("/");
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("Failed to create ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-base-100 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div>
              <Link to="/">
                <button className="flex btn btn-ghost btn-sm self-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5"
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
                  <span className="hidden sm:inline">Back to Tickets</span>
                  <span className="sm:hidden">Back</span>
                </button>
              </Link>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-base-content">
                Create New Ticket
              </h1>
              <p className="text-sm sm:text-base text-base-content/70 mt-1">
                Submit a support request for assistance
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-base-100 rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Title Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Title <span className="text-error">*</span>
                  </span>
                  <span className="label-text-alt text-base-content/60">
                    {formData.title.length}/50
                  </span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ticket Title..."
                  className={`input input-bordered w-full placeholder:text-gray-400 ${errors.title ? "input-error" : ""}`}
                  maxLength={50}
                />
                {errors.title && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.title}
                    </span>
                  </label>
                )}
              </div>

              {/* Description Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Description <span className="text-error">*</span>
                  </span>
                  <span className="label-text-alt text-base-content/60">
                    {formData.description.length}/200
                  </span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Ticket Description..."
                  className={`textarea textarea-bordered h-24 sm:h-32 w-full resize-none placeholder:text-gray-400 ${errors.description ? "textarea-error" : ""}`}
                  maxLength={200}
                />
                {errors.description && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.description}
                    </span>
                  </label>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`btn btn-primary w-full sm:flex-1 ${isSubmitting ? "loading" : ""}`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      <span className="hidden sm:inline">
                        Creating Ticket...
                      </span>
                      <span className="sm:hidden">Creating...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2"
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
                      Create Ticket
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-outline w-full sm:w-auto"
                  onClick={() => setFormData({ title: "", description: "" })}
                  disabled={isSubmitting}
                >
                  Clear
                </button>
              </div>
            </form>
          </div>

          {/* Help Section */}
          <div className="mt-6 sm:mt-8 bg-base-100 rounded-lg shadow-sm p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-info flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Tips for Better Support
            </h3>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-base-content/70">
              <div className="flex items-start gap-2 sm:gap-3">
                <span className="text-success flex-shrink-0">✓</span>
                <span>
                  Use clear, descriptive titles that summarize the issue
                </span>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <span className="text-success flex-shrink-0">✓</span>
                <span>
                  Include specific error messages or codes when applicable
                </span>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <span className="text-success flex-shrink-0">✓</span>
                <span>
                  Mention what you were trying to do when the issue occurred
                </span>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <span className="text-success flex-shrink-0">✓</span>
                <span>
                  Specify your browser, device, or platform if relevant
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;
