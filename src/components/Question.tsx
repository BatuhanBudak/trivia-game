import React from "react";
import Answer from "./Answer";
import { QuestionType } from "../App";

type Props = {
  chooseAnswer: (question_id: string, answer_id: string) => void;
} & QuestionType;

export default function Question(props: Props) {
  function chooseAnswer(answerID: string) {
    props.chooseAnswer(props.id, answerID);
  }

  const allAnswers = props.shuffledAnswers.map((answer) => {
    return (
      <Answer
        key={answer.id}
        id={answer.id}
        isSelected={answer.isSelected}
        isHeld={answer.isHeld}
        haveAnsweredCorrectly={answer.haveAnsweredCorrectly}
        value={answer.value}
        isCorrectAnswer={answer.isCorrectAnswer}
        chooseAnswer={() => chooseAnswer(answer.id)}
      />
    );
  });

  return (
    <div className="question--container">
      <h2 className="question--title">{props.question} </h2>
      <div className="answer-container">{allAnswers}</div>
      <hr className="question-break"></hr>
    </div>
  );
}
