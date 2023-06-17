import React from "react";
import { animated } from "react-spring";
import Button from "@mui/material/Button";

export default function EmitQuestionForm({
  drawerAnimation,
  newQuestion,
  newAnswers,
  newImageURL,
  handleQuestionSubmit,
  handleNewQuestionChange,
  handleNewAnswerChange,
  handleCheckboxChange,
  setNewImageURL,
}) {
  return (
    <animated.div
      style={{
        ...drawerAnimation,
        backgroundColor: "#1D1E2C",
        color: "#1D1E2C",
        height: "100vh",
        width: "30vh",
      }}
      role="presentation"
    >
      <form onSubmit={handleQuestionSubmit}>
        <input
          className="input-field"
          type="text"
          placeholder="Question"
          value={newQuestion}
          onChange={handleNewQuestionChange}
        />
        {newAnswers.map((newAnswer, i) => (
          <div key={i}>
            <input
              className="input-field"
              type="text"
              placeholder={`Answer ${i + 1}`}
              value={newAnswer.answerText}
              onChange={(event) => handleNewAnswerChange(i, event)}
            />
            <label>
              <input
                type="checkbox"
                checked={newAnswer.isCorrect}
                onChange={(event) => handleCheckboxChange(i, event)}
              />
              Is Correct
            </label>
          </div>
        ))}
        <div>
          <input
            className="input-field"
            type="text"
            placeholder="Image URL"
            value={newImageURL}
            onChange={(e) => setNewImageURL(e.target.value)}
          />
          {newImageURL && (
            <img
              src={newImageURL}
              alt="preview"
              style={{
                maxWidth: "700px",
                maxHeight: "200px",
                width: "auto",
                height: "auto",
              }}
            />
          )}
        </div>
        <Button
          variant="outlined"
          sx={{
            color: "#42fff6",
            borderColor: "#42fff6",
            fontFamily: "Courier New",
            position: "absolute",
          }}
          type="submit"
        >
          Emit Question
        </Button>
      </form>
    </animated.div>
  );
}
