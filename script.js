(function () {
  "use strict";

  var questions = [
    { sentence: "Io ___ un gatto.", options: ["ho", "hai", "ha"], answer: 0 },
    { sentence: "Tu ___ una macchina?", options: ["hanno", "hai", "avete"], answer: 1 },
    { sentence: "Maria ___ due figli.", options: ["ho", "hanno", "ha"], answer: 2 },
    { sentence: "Noi ___ tanti amici.", options: ["avete", "abbiamo", "hanno"], answer: 1 },
    { sentence: "Voi ___ una casa in Italia?", options: ["avete", "abbiamo", "hai"], answer: 0 },
    { sentence: "Loro ___ tre bambini.", options: ["abbiamo", "ha", "hanno"], answer: 2 },
    {
      sentence: "Io ___ 30 anni.",
      options: ["sono", "ho", "ha"],
      answer: 1,
      explanation: "Ho 30 anni. = 我30岁。"
    },
    {
      sentence: "Tu ___ fame?",
      options: ["hai", "sei", "ha"],
      answer: 0,
      explanation: "Hai fame? = 你饿了吗？"
    },
    {
      sentence: "Anna ___ mal di testa.",
      options: ["è", "hanno", "ha"],
      answer: 2,
      explanation: "Anna ha mal di testa. = Anna 头疼。"
    },
    {
      sentence: "Noi ___ sete.",
      options: ["abbiamo", "siamo", "avete"],
      answer: 0,
      explanation: "Abbiamo sete. = 我们渴了。"
    }
  ];

  var letters = ["A", "B", "C"];
  var currentIndex = 0;
  var isAnswered = false;

  var quizView = document.getElementById("quiz-view");
  var completionView = document.getElementById("completion-view");
  var progress = document.getElementById("progress");
  var progressBar = document.getElementById("progress-bar");
  var partLabel = document.getElementById("part-label");
  var instructionIt = document.getElementById("instruction-it");
  var instructionZh = document.getElementById("instruction-zh");
  var questionNumber = document.getElementById("question-number");
  var questionText = document.getElementById("question-text");
  var options = document.getElementById("options");
  var feedback = document.getElementById("feedback");
  var continueButton = document.getElementById("continue-button");
  var restartTop = document.getElementById("restart-top");
  var restartBottom = document.getElementById("restart-bottom");

  function renderQuestion() {
    var question = questions[currentIndex];
    var isPartTwo = currentIndex >= 6;

    isAnswered = false;
    progress.textContent = (currentIndex + 1) + " / " + questions.length;
    progressBar.style.width = ((currentIndex + 1) / questions.length * 100) + "%";
    partLabel.textContent = isPartTwo ? "PARTE 2" : "PARTE 1";
    instructionIt.textContent = isPartTwo
      ? "Come si usa AVERE?"
      : "Scegli la forma corretta.";
    instructionZh.textContent = isPartTwo
      ? "请选择正确答案，认识 avere 在日常生活中的常见表达。"
      : "请选择 AVERE 的正确变位。";
    questionNumber.textContent = "DOMANDA " + (currentIndex + 1);
    questionText.textContent = question.sentence;
    feedback.hidden = true;
    feedback.className = "feedback";
    feedback.textContent = "";
    continueButton.hidden = true;
    options.innerHTML = "";

    question.options.forEach(function (option, optionIndex) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "option-button";
      button.setAttribute("data-index", String(optionIndex));
      button.setAttribute("aria-label", letters[optionIndex] + ". " + option);

      var letter = document.createElement("span");
      letter.className = "option-letter";
      letter.setAttribute("aria-hidden", "true");
      letter.textContent = letters[optionIndex];

      var text = document.createElement("span");
      text.className = "option-text";
      text.textContent = option;

      var status = document.createElement("span");
      status.className = "option-status";
      status.setAttribute("aria-hidden", "true");
      status.textContent = "·";

      button.appendChild(letter);
      button.appendChild(text);
      button.appendChild(status);
      button.addEventListener("click", chooseAnswer);
      options.appendChild(button);
    });
  }

  function chooseAnswer(event) {
    if (isAnswered) {
      return;
    }

    var selectedButton = event.currentTarget;
    var selectedIndex = Number(selectedButton.getAttribute("data-index"));
    var question = questions[currentIndex];

    if (selectedIndex === question.answer) {
      isAnswered = true;
      selectedButton.classList.remove("is-wrong");
      selectedButton.classList.add("is-correct");
      selectedButton.querySelector(".option-status").textContent = "✓";
      feedback.textContent = "Bravissimo/a!";

      if (question.explanation) {
        var explanation = document.createElement("span");
        explanation.className = "explanation";
        explanation.textContent = question.explanation;
        feedback.appendChild(explanation);
      }

      feedback.className = "feedback correct";
      feedback.hidden = false;
      continueButton.hidden = false;

      Array.prototype.forEach.call(options.children, function (button) {
        button.disabled = true;
      });
      continueButton.focus();
      return;
    }

    selectedButton.classList.add("is-wrong");
    selectedButton.querySelector(".option-status").textContent = "×";
    feedback.textContent = "Riprova!";
    feedback.className = "feedback wrong";
    feedback.hidden = false;
    selectedButton.setAttribute("aria-label", letters[selectedIndex] + ". " + question.options[selectedIndex] + ", risposta errata");
  }

  function nextQuestion() {
    if (!isAnswered) {
      return;
    }

    if (currentIndex < questions.length - 1) {
      currentIndex += 1;
      renderQuestion();
      questionText.focus();
      window.scrollTo(0, 0);
      return;
    }

    quizView.hidden = true;
    completionView.hidden = false;
    restartTop.hidden = true;
    completionView.focus();
    window.scrollTo(0, 0);
  }

  function restart() {
    currentIndex = 0;
    isAnswered = false;
    completionView.hidden = true;
    quizView.hidden = false;
    restartTop.hidden = false;
    renderQuestion();
    window.scrollTo(0, 0);
  }

  questionText.setAttribute("tabindex", "-1");
  completionView.setAttribute("tabindex", "-1");
  continueButton.addEventListener("click", nextQuestion);
  restartTop.addEventListener("click", restart);
  restartBottom.addEventListener("click", restart);

  renderQuestion();
}());
