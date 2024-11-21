function setMutationObserverAnswersAndFilterValuesInResultDetails() {
  const target = document.querySelector("#resultsHeading");
  var observer = new MutationObserver(
    displayAnswersAndFilterValuesInResultDetails
  );
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
  if (!isActivated("addon_filter_results.js")) return;
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

function displayAnswersAndFilterValuesInResultDetails() {
  if (!document.querySelector("#resultsHeading").textContent) return;
  document
    .querySelectorAll("div[id^='resultsShortPartyDescription']")
    .forEach((description) => {
      const resultNr = +description
        .getAttribute("id")
        .replace("resultsShortPartyDescription", "");
      const nodeAnswersAndFilterValues = document.createElement("div");
      let divContent =
        "<ul class='list-answers-and-filter-values-in-result-details'>";
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
        divContent += `<li class="flex-center"><i class="bx ${
          arQuestionsIcon[question.questionNr - 1]
        }"></i> `;
        if (question.displayQuestionHeading)
          divContent += `${arQuestionsShort[question.questionNr - 1]}: `;
        divContent += answerText;
        divContent += "</li>";
      });
      if (isActivated("addon_filter_results.js")) {
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
          const icon = FILTERS.find(
            (obj) => obj.internalName === filter.internalName
          ).icon;
          divContent += `<li><span class="flex-center"><i class="bx ${icon}"></i> `;
          if (filter.label) divContent += `${filter.label}: </span>`;
          if (filter.bulletList) {
            divContent += "<ul>";
            textsForPresentFilterValues.forEach((text) => {
              divContent += `<li>${text}</li>`;
            });
            divContent += "</ul>";
          } else divContent += textsForPresentFilterValues.join("; ");
        });
      }

      divContent += "</ul>";
      nodeAnswersAndFilterValues.innerHTML = divContent;
      description.insertBefore(
        nodeAnswersAndFilterValues,
        description.querySelector("#internet-below-description")
      );
    });
}

window.addEventListener("load", () => {
  setMutationObserverAnswersAndFilterValuesInResultDetails();
  createLookupTablesAnswersAndFilterValuesInResultDetails();
});
