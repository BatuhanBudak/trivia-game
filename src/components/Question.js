import React from "react";
import Answer from './Answer';

export default function Question(props){

    function chooseAnswer(answerID){
        props.chooseAnswer(props.id, answerID );
        
    }
   
   const allAnswers =  props.shuffledAnswers.map(answer => {
        return (
            <Answer 
            key = {answer.id}
            id = {answer.id}
            isSelected = {answer.isSelected}
            isHeld = {answer.isHeld}
            haveAnsweredCorrectly = {answer.haveAnsweredCorrectly}
            value = {answer.value}
            isCorrectAnswer = {answer.isCorrectAnswer}
            chooseAnswer = {() => chooseAnswer(answer.id)}
            />
        )
    });

    return (

        <div className="question--container">
        <h2 className="question--title">{props.question} </h2>
        <div className="answer-container">
            {allAnswers}
        </div>
        <hr className="question-break" ></hr>
    </div>
    )
   
}