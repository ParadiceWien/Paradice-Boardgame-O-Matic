function setMutationObserverAnswersAndFilterValuesInResultDetails() {
  const target = document.querySelector("#resultsHeading");
  var observer = new MutationObserver(dummyFunction);
  var config = {
    attributes: true,
    childList: true,
    subtree: true,
  };
  observer.observe(target, config);
}

function createLookupTablesAnswersAndFilterValuesInResultDetails() {
  window.lookupTableForCustomQuestions = {};
  QUESTIONS_TO_BE_DISPLAYED.forEach((question) => {
    if (!question.isCustomQuestion) return;
    const lookupTableEntry = {};
    objCustomQuestion = CUSTOM_POSITION_BUTTONS.find(
      (obj) => obj.questionNr === question.questionNr
    );
    objCustomQuestion.arPositionValues.forEach((value, index) => {
      lookupTableEntry[value] = objCustomQuestion.arButtonLabels[index];
    });
    window.lookupTableForCustomQuestions[question.questionNr] =
      lookupTableEntry;
  });
  window.lookupTableForFilters = {};
  FILTERS_TO_BE_DISPLAYED.forEach((filter) => {
    const objFilter = FILTERS.find(
      (obj) => obj.internalName === filter.internalName
    );
    const lookupTableEntry = {};
    objFilter.options.forEach((option) => {
      lookupTableEntry[option.value] = option.label;
    });
    lookupTableForFilters[filter.internalName] = lookupTableEntry;
  });
}

function dummyFunction() {
  if (!document.querySelector("#resultsHeading").textContent) return;
  document
    .querySelectorAll("div[id^='resultsShortPartyDescription']")
    .forEach((description) => {
      const resultNr = +description
        .getAttribute("id")
        .replace("resultsShortPartyDescription", "");
      const nodeAnswersAndFilterValues = document.createElement("div");
      let divContent = "<ul>";
      QUESTIONS_TO_BE_DISPLAYED.forEach((question) => {
        const answerIndex = resultNr * intQuestions + (question.questionNr - 1);
        const answerValue = arPartyPositions[answerIndex];
        let answerText = "";
        if (question.isCustomQuestion)
          answerText =
            window.lookupTableForCustomQuestions[question.questionNr][
              answerValue
            ];
        else
          answerText =
            arIcons[answerValue === 1 ? "0" : answerValue === 0 ? "1" : "2"];
        divContent += "<li>";
        if (question.displayQuestionHeading)
          divContent += `${arQuestionsShort[question.questionNr - 1]}: `;
        divContent += answerText;
        divContent += "</li>";
      });
      FILTERS_TO_BE_DISPLAYED.forEach((filter) => {
        const presentFilterValues = description
          .querySelector(".filter-values")
          .getAttribute(`data-${filter.internalName}`)
          .split(" ");
        if (presentFilterValues.length === 1 && presentFilterValues[0] === "")
          return;
        const textsForPresentFilterValues = presentFilterValues.map(
          (value) => window.lookupTableForFilters[filter.internalName][value]
        );
        divContent += "<li>";
        if (filter.label) divContent += `${filter.label}: `;
        if (filter.bulletList) {
          divContent += "<ul>";
          textsForPresentFilterValues.forEach((text) => {
            divContent += `<li>${text}</li>`;
          });
          divContent += "</ul>";
        } else divContent += textsForPresentFilterValues.join("; ");
      });
      divContent += "</ul>";
      nodeAnswersAndFilterValues.innerHTML = divContent;
      description.insertBefore(
        nodeAnswersAndFilterValues,
        description.querySelector("#internet-below-description")
      );
      if (HIDE_TABLE_resultsByPartyAnswers)
        description.parentNode
          .querySelector("button[id^='resultsByPartyAnswers']")
          .classList.add("d-none");
    });
}

window.addEventListener("load", () => {
  setMutationObserverAnswersAndFilterValuesInResultDetails();
  createLookupTablesAnswersAndFilterValuesInResultDetails();
});
