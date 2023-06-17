import React from "react";

function StartQuizForm({ onSubmit, username, setUsername }) {
  return (
    <form onSubmit={onSubmit}>
      <label>
        Enter your name:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="input-field"
        />
      </label>
      <button type="submit">Start Quiz</button>
    </form>
  );
}

export default StartQuizForm;
