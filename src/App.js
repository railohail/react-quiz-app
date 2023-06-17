import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";
import { useSpring } from "react-spring";
import StartQuizForm from "./components/StartQuizForm";
import ShowScore from "./components/ShowScore";
import QuestionAnswer from "./components/QuestionAnswer";
import TextSection from "./components/TextSection";
import styled from "styled-components";
import Background from "./components/Background";
import EmitQuestionForm from "./components/EmitQuestionForm";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Box from "./components/box";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function App() {
  const duration = 1000;
  const [socket, setSocket] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newImageURL, setNewImageURL] = useState("");
  const [username, setUsername] = useState("");
  const [score, setScore] = useState(0);
  const [showScore, setShowscore] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const drawerAnimation = useSpring({
    from: { transform: "translateX(100%)" },
    to: { transform: "translateX(0%)" },
    reverse: !drawerOpen, // reverse the animation direction based on the drawer state
    config: { tension: 280, friction: 60 },
  });
  useEffect(() => {
    const newSocket = io("http://localhost:3001");

    if (!newSocket) return;

    // Establish event listeners
    newSocket.on("leaderboard", (data) => {
      console.log("connected to the server");
      setLeaderboard(data);
    });

    newSocket.on("questions", (data) => {
      console.log("received questions");
      setQuestions(data);
    });

    // Update state with the new socket
    setSocket(newSocket);

    // Cleanup the effect by disconnecting the socket and removing listeners
    return () => {
      newSocket.off("leaderboard");
      newSocket.off("questions");
      newSocket.disconnect();
    };
  }, []); // Note the empty dependency array, ensuring this effect only runs once (on mount)

  const [newAnswers, setNewAnswers] = useState([
    { answerText: "", isCorrect: false },
    { answerText: "", isCorrect: false },
    { answerText: "", isCorrect: false },
    { answerText: "", isCorrect: false },
  ]);
  const handleNewQuestionChange = (e) => {
    setNewQuestion(e.target.value);
  };
  const handleNewAnswerChange = (index, event) => {
    const values = [...newAnswers];
    values[index].answerText = event.target.value;
    setNewAnswers(values);
  };
  const handleCheckboxChange = (index, event) => {
    const values = [...newAnswers];
    values[index].isCorrect = event.target.checked;
    setNewAnswers(values);
  };
  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    // Emit the new question and answers to the server
    socket.emit("new-question", {
      questionText: newQuestion,
      imageURL: newImageURL,
      answerOptions: newAnswers,
    });
    // Clear the inputs
    setNewQuestion("");
    setNewAnswers([
      { answerText: "Default Answer 1", isCorrect: false },
      { answerText: "Default Answer 2", isCorrect: false },
      { answerText: "Default Answer 3", isCorrect: false },
      { answerText: "Default Answer 4", isCorrect: false },
    ]);
  };
  const handleAnswerButtonClick = (isCorrect) => {
    let newScore = score;
    if (isCorrect === true) {
      newScore = score + 1;
      setScore(newScore);
    }
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowscore(true);
      socket.emit("score", { username: username, score: newScore });
    }
  };

  const startQuiz = (event) => {
    event.preventDefault();
    setQuizStarted(true);
  };
  return (
    <Wrapper className="App">
      <Background />
      <TextSection />
      <Button
        variant="outlined"
        sx={{
          color: "#42fff6",
          borderColor: "#42fff6",
          fontFamily: "Courier New",
          position: "right",
        }}
        className="quiz-question"
        onClick={() => setDrawerOpen(!drawerOpen)}
      >
        {drawerOpen ? "Hide Form" : "Add Question"}
      </Button>
      {drawerOpen && (
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          transitionDuration={{ enter: duration, exit: duration }}
          PaperProps={{ style: { backgroundColor: "#1D1E2C" } }}
        >
          <EmitQuestionForm
            drawerAnimation={drawerAnimation}
            newQuestion={newQuestion}
            newAnswers={newAnswers}
            newImageURL={newImageURL}
            handleQuestionSubmit={handleQuestionSubmit}
            handleNewQuestionChange={handleNewQuestionChange}
            handleNewAnswerChange={handleNewAnswerChange}
            handleCheckboxChange={handleCheckboxChange}
            setNewImageURL={setNewImageURL}
          />
        </Drawer>
      )}
      <FormContainer className="form-container">
        {!quizStarted ? (
          <StartQuizForm
            onSubmit={startQuiz}
            username={username}
            setUsername={setUsername}
          />
        ) : showScore ? (
          <ShowScore
            score={score}
            questions={questions}
            leaderboard={leaderboard}
          />
        ) : (
          <QuestionAnswer
            questions={questions}
            currentQuestion={currentQuestion}
            handleAnswerButtonClick={handleAnswerButtonClick}
          />
        )}
      </FormContainer>
      <CanvasWrapper>
        <Canvas>
          <OrbitControls enableZoom={false} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[-2, 5, 2]} intensity={1} />
          <Box />
        </Canvas>
      </CanvasWrapper>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  position: relative;
  background: #1f1144;
`;
const FormContainer = styled.div`
  position: absolute;
  top: 160%;
  left: 30%;
  transform: translate(-50%, -50%);
`;
const CanvasWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 50%; // Adjust width based on your needs
  height: 100vh; // This will make it full height
`;
