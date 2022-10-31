import React, { useState, useEffect } from "react";
import Question from "./components/Question";
import { nanoid } from "nanoid";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [allSolved, setAllSolved] = useState(false);
  const [count, setCount] = useState(0);
  const [isGameEnded, setIsGameEnded] = useState(false);

  useEffect(() => {
    fetch(
      "https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple"
    )
      .then((res) => res.json())
      .then((data) => setQuestions(createQuestions(data.results)));
  }, []);

  useEffect(() => {
    setAllSolved(
      questions.every((question) => {
        return question.isSolved;
      })
    );
  }, [questions]);

  function createQuestions(data) {
    return data.map((item) => {
      const convertedQuestion = convertUnicode(item.question);
      return {
        id: nanoid(),
        question: convertedQuestion,
        correctAnswer: item.correct_answer,
        shuffledAnswers: shuffleArray(
          createAnswers(
            [item.correct_answer, ...item.incorrect_answers],
            item.correct_answer
          )
        ),
        isSolved: false,
      };
    });
  }
  function getNewQuestions() {
    fetch(
      "https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple"
    )
      .then((res) => res.json())
      .then((data) => setQuestions(createQuestions(data.results)));
  }

  function convertUnicode(item) {
    return item
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&rsquo;/g, "")
      .replace(/&oacute;/g, "Ó")
      .replace(/&uacute;/g, "ú")
      .replace(/&eacute;/g, "é")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");
  }

  const questionBlock = questions.map((question) => {
    return (
      <Question
        key={question.id}
        id={question.id}
        question={question.question}
        correctAnswer={question.correctAnswer}
        shuffledAnswers={question.shuffledAnswers}
        isSolved={question.isSolved}
        chooseAnswer={chooseAnswer}
      />
    );
  });

  function chooseAnswer(questionId, answerID) {
    setQuestions((oldQuestions) =>
      oldQuestions.map((question) => {
        if (questionId === question.id) {
          const answers = question.shuffledAnswers.map((answer) => {
            if (answer.id === answerID) {
              return {
                ...answer,
                isSelected: true,
              };
            } else {
              return { ...answer, isSelected: false };
            }
          });
          return {
            ...question,
            shuffledAnswers: answers,
            isSolved: true,
          };
        } else {
          return question;
        }
      })
    );
  }

  function createAnswers(allAnswers, correct_answer) {
    return allAnswers.map((item) => {
      const convertedAnswer = convertUnicode(item);
      return {
        id: nanoid(),
        isSelected: false,
        value: convertedAnswer,
        haveAnsweredCorrectly: "unset",
        isCorrectAnswer: item === correct_answer,
        isHeld: false,
      };
    });
  }

  function shuffleArray(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }

  function checkAnswers() {
    setQuestions((oldQuestions) =>
      oldQuestions.map((question) => {
        const answers = question.shuffledAnswers.map((answer) => {
          if (answer.isSelected) {
            if (answer.isCorrectAnswer) {
              setCount((count) => count + 1);
              return {
                ...answer,
                isHeld: true,
                haveAnsweredCorrectly: true,
              };
            } else if (!answer.isCorrectAnswer) {
              return {
                ...answer,
                isHeld: true,
                haveAnsweredCorrectly: false,
              };
            } else {
              return {
                ...answer,
                isHeld: true,
              };
            }
          } else {
            return {
              ...answer,
              isHeld: true,
            };
          }
        });
        return {
          ...question,
          shuffledAnswers: answers,
        };
      })
    );
    setIsGameEnded(true);
  }

  function startNewGame() {
    setCount(0);
    setIsGameEnded(false);
    getNewQuestions();
    setAllSolved(false);
  }

  return (
    <div className="main-container">
      {!gameStarted && (
        <div className="intro">
          <h1> Quizzical </h1>
          <p>Are you ready to test your knowledge ! </p>
          <button onClick={() => setGameStarted(true)}>Start quiz</button>
        </div>
      )}
      {gameStarted && (
        <main>
          {questionBlock}
          {allSolved && !isGameEnded && (
            <button className="check-button" onClick={checkAnswers}>
              Check answers
            </button>
          )}
          {isGameEnded && (
            <div className="end-game-container">
              <span className="end-game-info">
                You scored {count}/5 correct answers
              </span>
              <button className="end-game-button" onClick={startNewGame}>
                Play Again
              </button>
            </div>
          )}
        </main>
      )}
    </div>
  );
}

export default App;
