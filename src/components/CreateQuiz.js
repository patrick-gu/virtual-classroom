import React from "react";
import "./CreateQuiz.css";

const CreateQuiz = () => {
    const quiz=  {
        name: "quiz name",
        questions: 
          [{
            text: "What is 2 + 3?",
            responses: [
              { "text": "5", "correct": true },
              { "text": "4 + 1", "correct": true },
              { "text": "8", "correct": false },
            ]
        },
        ]
      }
  return (
      <>
     {quiz.questions.map((item, index) => (
          <div className="container">
          <div class="card">
            <div class="card-header">{`Question ${index + 1}`}</div>
            <div class="card-body">
              <h4>{item.text}</h4>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name={`answer${index}`}
                
                  value="option1"
                />
                <label class="form-check-label">
                  32
                </label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name={`answer${index}`}
                 
                  value="option2"
                />
                <label class="form-check-label" >
                  41
                </label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name={`answer${index}`}
              
                  value="option3"
                />
                <label class="form-check-label" >
                  40
                </label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name={`answer${index}`}
              
                  value="option3"
                />
                <label class="form-check-label">
                  49
                </label>
              </div>
            </div>
          </div>
        </div>
     ))}
    
    </>
  );
};

export default CreateQuiz;
