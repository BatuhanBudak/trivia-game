import React, { useState, useEffect, useCallback } from "react";
import Question from "./components/Question";
import { nanoid } from "nanoid";

type APIResponseJSON = {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
};
type APIResponse = {
  responseCode: number;
  results: APIResponseJSON[];
};

export type AnswerType = {
  id: string;
  isSelected: boolean;
  value: string;
  haveAnsweredCorrectly: string | boolean;
  isCorrectAnswer: boolean;
  isHeld: boolean;
};

export type QuestionType = {
  id: string;
  isSolved: boolean;
  correct_answer: string;
  question: string;
  shuffledAnswers: AnswerType[];
};

function App() {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [questions, setQuestions] = useState([] as QuestionType[]);
  const [allSolved, setAllSolved] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [isGameEnded, setIsGameEnded] = useState<boolean>(false);

  const createAnswers = useCallback(
    (allAnswers: string[], correct_answer: string): AnswerType[] => {
      return allAnswers.map((item: string) => {
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
    },
    []
  );

  const createQuestions = useCallback(
    (data: APIResponseJSON[]): QuestionType[] => {
      return data.map((item) => {
        const convertedQuestion = convertUnicode(item.question);
        return {
          id: nanoid(),
          question: convertedQuestion,
          correct_answer: item.correct_answer,
          shuffledAnswers: shuffleArray(
            createAnswers(
              [item.correct_answer, ...item.incorrect_answers],
              item.correct_answer
            )
          ),
          isSolved: false,
        };
      });
    },
    [createAnswers]
  );

  useEffect(() => {
    fetch(
      "https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple"
    )
      .then((res) => res.json())
      .then((data: APIResponse) => setQuestions(createQuestions(data.results)));
  }, [createQuestions]);

  useEffect(() => {
    setAllSolved(
      questions.every((question) => {
        return question.isSolved;
      })
    );
  }, [questions]);

  function getNewQuestions() {
    fetch(
      "https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple"
    )
      .then((res) => res.json())
      .then((data: APIResponse) => setQuestions(createQuestions(data.results)));
  }

  function convertUnicode(item: string): string {
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
        correct_answer={question.correct_answer}
        shuffledAnswers={question.shuffledAnswers}
        isSolved={question.isSolved}
        chooseAnswer={chooseAnswer}
      />
    );
  });

  function chooseAnswer(questionId: string, answerID: string) {
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

  function shuffleArray(arr: AnswerType[]) {
    return arr.sort(() => Math.random() - 0.5);
  }

  function checkAnswers() {
    setQuestions((oldQuestions) =>
      oldQuestions.map((question) => {
        const answers = question.shuffledAnswers.map((answer) => {
          if (answer.isSelected) {
            if (answer.isCorrectAnswer) {
              // setCount((count) => count + 1);
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
    calculateScore();
    setIsGameEnded(true);
  }

  function calculateScore() {
    const totalAnswers = questions.map((question) => question.shuffledAnswers);

    totalAnswers.forEach((answers) => {
      const trueAnswer = answers.filter(
        (answer) => answer.isCorrectAnswer && answer.isSelected
      );
      if (trueAnswer.length > 0) setCount((count) => count + 1);
    });
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
