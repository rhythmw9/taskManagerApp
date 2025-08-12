import React, { useState, useEffect, useRef } from "react";
import "./FeedbackPage.css";

function FeedbackPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const hideMsgTimer = useRef(null);

  // cleanup on unmount
  useEffect(() => () => clearTimeout(hideMsgTimer.current), []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Trim first (handles "   " cases)
    const n = name.trim();
    const em = email.trim();
    const msg = message.trim();

    if (!n || !em || !msg) {
      // Let the browser show which are invalid by touching the fields
      setName(n);
      setEmail(em);
      setMessage(msg);
      return;
    }

    console.log("Feedback submitted:", { name: n, email: em, message: msg });

    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");

    clearTimeout(hideMsgTimer.current);
    hideMsgTimer.current = setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="feedback-page">
      <h1 className="text-center">Feedback</h1>
      <p className="text-center">
        We value your thoughts! Please share your feedback below.
      </p>

      {submitted && (
        <p className="success-msg" role="status" aria-live="polite">
          Thank you! Your feedback has been sent.
        </p>
      )}

      <form className="feedback-form" onSubmit={handleSubmit} noValidate={false}>
        <label>
          Name
          <input
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
            required
          />
        </label>

        <label>
          Email
          <input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            autoComplete="email"
            required
          />
        </label>

        <label>
          Message
          <textarea
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message..."
            rows={5}
            required
            minLength={2}
          />
        </label>

        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
}

export default FeedbackPage;
