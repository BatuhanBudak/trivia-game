import React from "react";
import { AnswerType } from "../App";

type Props = {
  chooseAnswer: () => void;
} & AnswerType;
export default function Answer(props: Props) {
  let styles = {};
  if (props.isHeld && props.isSelected && props.haveAnsweredCorrectly) {
    styles = {
      backgroundColor: "#94D7A2", //green
    };
  } else if (props.isHeld && props.isSelected && !props.haveAnsweredCorrectly) {
    styles = {
      backgroundColor: "#F8BCBC", //red
      borderRadius: ".5rem",
    };
  } else if (props.isSelected && !props.isHeld) {
    styles = {
      backgroundColor: "#D6DBF5",
    };
  } else if (!props.isSelected && props.isHeld && props.isCorrectAnswer) {
    styles = {
      backgroundColor: "#94D7A2",
    };
  } else if (!props.isSelected && props.isHeld) {
    styles = {
      opacity: ".5",
    };
  }

  return (
    <span
      className="answer"
      onClick={() => props.chooseAnswer()}
      style={styles}
    >
      {props.value}
    </span>
  );
}
