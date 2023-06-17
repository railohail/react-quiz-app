import React from "react";

function QuestionAnswer({
  questions,
  currentQuestion,
  handleAnswerButtonClick,
}) {
  return (
    <>
      <div className="question-section">
        <div className="question-count">
          <span>Question {currentQuestion + 1}</span>/{questions.length}
        </div>
        <div className="question-text">
          {questions[currentQuestion].questionText}
          {questions[currentQuestion].imageURL && (
            <img
              src={questions[currentQuestion].imageURL}
              alt="Question"
              style={{
                maxWidth: "700px",
                maxHeight: "200px",
                width: "auto",
                height: "auto",
              }}
            />
          )}
        </div>
      </div>
      <div className="answer-section">
        {questions[currentQuestion].answerOptions.map((answerOption) => (
          <button
            onClick={() => handleAnswerButtonClick(answerOption.isCorrect)}
          >
            {answerOption.answerText}
          </button>
        ))}
      </div>
    </>
  );
}

export default QuestionAnswer;
