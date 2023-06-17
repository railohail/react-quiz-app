import React from "react";

function ShowScore({ score, questions, leaderboard }) {
  return (
    <>
      <div className="score-section">
        You scored {score} out of {questions.length}
      </div>
      <div className="leaderboard-section">
        <h2>Leaderboard</h2>
        {leaderboard.map((entry, index) => (
          <div key={index}>
            {index + 1}. {entry.username}: {entry.score}
          </div>
        ))}
      </div>
    </>
  );
}

export default ShowScore;
