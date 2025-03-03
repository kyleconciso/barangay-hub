// TicketForm Component (pacheck if tama?)
const { useState } = React;

const TicketForm = () => {
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category || !subject || !body) {
      setError("All fields are required!");
      return;
    }
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      alert("Ticket Submitted!");
    }, 1000);
  };

  return (
    <div className="ticket-form-container">
      <h2>Submit a Concern</h2>
      <form onSubmit={handleSubmit}>
        <div className="ticket-form-group">
          <label className="ticket-label">Type of Concern:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="ticket-input"
          >
            <option value="">Select a category</option>
            <option value="complaint">Complaint</option>
            <option value="suggestion">Suggestion</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="ticket-form-group">
          <label className="ticket-label">Subject:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter subject"
            required
            className="ticket-input"
          />
        </div>
        <div className="ticket-form-group">
          <label className="ticket-label">Details of Concern:</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Describe the issue"
            required
            className="ticket-input"
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" className="ticket-button" disabled={loading}>
          {loading ? "Submitting..." : "Submit Ticket"}
        </button>
      </form>
    </div>
  );
};

export default TicketForm;
