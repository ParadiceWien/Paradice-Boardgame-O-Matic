/*
This file seems to be long and complex, and it kind of is, because it must accommodate a variety of different filter types and configurations as well as their interactions
However, the procedure for each filter type (started by setupFilters()) is the same:
  * createFilterHtml (of course, highly different HTML for each filter type)
  * addFilterNodeToDOM (the same for each filter type, only difference is display above resultsShortTable (#resultsAddonTop) vs. in popup modal (which triggers createAndAppendSharedFilterModal))
  * addEventListenerToFilter (little differences depending on filter type)
  * Now, after the filter is triggered:
    * validateFilter (only required for filter types where input can be invalid; if input is invalid, error message is displayed)
    * hideResults (logic is highly different for each filter type)
    * checkIfAnyResultsLeft (always the same; if not, explanatory message is displayed)
    * sendMessageToLimitResultsAddon (always the same; ensures compatability of both addons)

Other functions:
  * setFiltersAtStart (incl. internal functions) & setPreselectedFilter: Only called if any of the filters are to be set at the beginning before the first question
  * setupButtonResetAllFilters: Only called if button shall be displayed

*/

window.addEventListener("load", setupFilters);

function setupFilters() {
  if (FILTERS.some((filter) => filter.setAtStart?.isWanted))
    setFiltersAtStart();
  FILTERS.forEach((filter) => {
    const nodeFilter = createFilterHtml(filter);
    // Start mutation observer to recognize when the results page is displayed
    const target = document.querySelector("#resultsHeading");
    const observer = new MutationObserver(() => {
      addFilterNodeToDOM(nodeFilter, filter);
    });
    var config = {
      childList: true,
    };
    observer.observe(target, config);
  });
  if (BUTTON_RESET_ALL_FILTERS?.showButton) setupButtonResetAllFilters();
}

function createFilterHtml(filter) {
  // All filters, regardless of type, have the container in common
  const containerOfFilter = document.createElement("div");
  containerOfFilter.classList.add("filter-container");
  containerOfFilter.setAttribute(
    "id",
    `filter-container-${filter.internalName}`
  );
  let divContent = "";
  // Content of container highly differs depending on filter type
  if (filter.type === "dropdown") {
    containerOfFilter.classList.add("filter-container-dropdown");
    if (filter.label)
      divContent += `<label id="filter-label-dropdown-${filter.internalName}" class="filter-label" for="filter-dropdown-${filter.internalName}">${filter.label}</label>`;
    divContent += `<select name="filter-dropdown-${filter.internalName}" id="filter-dropdown-${filter.internalName}">`;
    divContent += `<option value="show-all">${filter.textOfOptionToShowAll}</option>`; // the 1st option is always a "show all" option (applies no filter to results)
    filter.options.forEach((option) => {
      divContent += `<option value="${option.value}">${option.text}</option>`;
    });
    divContent += "</select>";
  } else if (filter.type === "input-datalist") {
    containerOfFilter.classList.add("filter-container-input-datalist");
    if (filter.label)
      divContent += `<label for="filter-input-${filter.internalName}">${filter.label}</label>`;
    divContent += `
    <input
      type="text"
      placeholder="${filter.placeholder}"
      id="filter-input-${filter.internalName}"
      list="datalist-${filter.internalName}"
    />`; // the input type is not relevant, because it is not actually submitted and sent to a server , "text" works just fine for all cases
    // If the filter is in the modal, the modal button acts as submit button
    if (
      !filter.displayInSharedModal &&
      !filter.displayInIndividualModal?.isWanted
    )
      divContent += `<button id='submit-filter-${filter.internalName}'>${filter.textButtonSubmit}</button>`;

    divContent += `<p class='error-message' id='error-message-filter-${filter.type}-${filter.internalName}'></p>
    <datalist id="datalist-${filter.internalName}">`;
    // The datalist generates a dropdown which is filtered by the input and therefore allows auto-complete
    filter.datalist.forEach((item) => {
      divContent += `<option value="${item}"></option>`;
    });
    divContent += "</datalist>";
  } else if (filter.type === "distance") {
    containerOfFilter.classList.add("filter-container-distance");
    divContent += `
    <label for="filter-distance-${filter.internalName}">${filter.label}</label><br>
    <input
      type="text"
      placeholder="${filter.placeholderLocation}"
      id="filter-distance-location-${filter.internalName}"
      list="datalist-${filter.internalName}"
    />`;

    divContent += `<datalist id="datalist-${filter.internalName}">`;
    // The datalist generates a dropdown which is filtered by the input and therefore allows auto-complete
    filter.datalist.forEach((item) => {
      divContent += `<option value="${item.text}"></option>`;
    });
    divContent += "</datalist>";
    divContent += `
    <input
      type="number"
      placeholder="${filter.placeholderDistance}"
      id="filter-distance-distance-${filter.internalName}"
    /> km
    <p class='error-message' id='error-message-filter-${filter.type}-${filter.internalName}'></p>`;
    // If the filter is in the modal, the modal button acts as submit button
    if (
      !filter.displayInSharedModal &&
      !filter.displayInIndividualModal?.isWanted
    ) {
      divContent += `<button id='submit-filter-${filter.internalName}'>${filter.textButtonSubmit}</button>`;
    }
  } else if (filter.type === "checkbox-list") {
    if (filter.heading)
      divContent += `<p id="filter-heading-checkbox-list-${filter.internalName}" class="filter-heading">${filter.heading}</p>`;
    divContent +=
      "<div class='container-checkbox-list' style='padding-left: 20px'>";
    for (let i = 0; i < filter.options.length; i++) {
      const isChecked =
        filter.allCheckedByDefault || filter.options[i].checkedByDefault;
      const isActive =
        (isChecked && !filter.checkedMeansExcluded) ||
        (!isChecked && filter.checkedMeansExcluded);
      divContent += `
      <input type="checkbox" id="filter-checkbox-list-${
        filter.internalName
      }-option${i}" ${
        isChecked ? "checked" : ""
      }><label for="filter-checkbox-list-${
        filter.internalName
      }-option${i}"><i class='bx bx-${
        isActive ? "check" : "x"
      } bx-sm bx-border'></i>&nbsp;<span ${
        !isActive && filter.strikethroughOptionsThatGetHidden
          ? "class='line-through'"
          : ""
      }>${filter.options[i].label}</span></label><br>`;
    }
    divContent += "</div>";
    divContent += `<p class="error-message" id='error-message-filter-${filter.type}-${filter.internalName}'></p>`;
    // If the filter is in the modal, the modal button acts as submit button
    if (
      !filter.displayInSharedModal &&
      !filter.displayInIndividualModal?.isWanted
    ) {
      divContent += `<button id='submit-filter-${filter.internalName}'>${filter.textButtonSubmit}</button>`;
    }
  } else if (filter.type === "single-checkbox") {
    if (filter.heading)
      divContent += `<p id="filter-heading-single-checkbox-${filter.internalName}" class="filter-heading">${filter.heading}</p>`;
    divContent += `<input type="checkbox" id="filter-single-checkbox-${
      filter.internalName
    }" ${filter.checkedByDefault ? "checked" : ""}>
    <label for="filter-single-checkbox-${filter.internalName}"> ${
      filter.label
    }</label>`;
  }
  containerOfFilter.innerHTML = divContent;

  if (filter.type === "checkbox-list") {
    containerOfFilter
      .querySelectorAll("[type='checkbox']")
      .forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
          const icon = checkbox.nextSibling.querySelector("i");
          ["bx-check", "bx-x", "color-success", "color-danger"].forEach((cls) =>
            icon.classList.toggle(cls)
          );
          if (filter.strikethroughOptionsThatGetHidden) {
            checkbox.nextSibling
              .querySelector("span")
              .classList.toggle("line-through");
          }
        });
      });
  }
  return containerOfFilter;
}

function addFilterNodeToDOM(nodeFilter, filter) {
  const filtersTab = document.createElement("div");
  filtersTab.setAttribute("id", "filters");
  filtersTab.classList.add("row", "d-none");
  filtersTab.innerHTML = `<div id="filtersHeading"><h1>${TEXT_FILTERS_HEADING}</h1><h2>${TEXT_FILTERS_SUBHEADING}</h2></div>  `;
  if (!document.querySelector("#resultsHeading").textContent) return;
  if (filter.displayInSharedModal) {
    if (!document.querySelector("#sharedFilterModal"))
      createAndAppendSharedFilterModal();
    document.querySelector("#sharedFilterModalBody").appendChild(nodeFilter);
  } else if (filter.displayInIndividualModal?.isWanted) {
    createAndAppendIndividualFilterModal(nodeFilter, filter);
  } else filtersTab.appendChild(nodeFilter);
  document
    .querySelector("#sectionResults")
    .insertBefore(filtersTab, document.querySelector("#info"));

  addEventListenerToFilter(filter);
  if (FILTERS.some((filter) => filter.setAtStart?.isWanted))
    setPreselectedFilter();
}

function addEventListenerToFilter(filter) {
  let selector;
  let event;
  if (filter.type === "dropdown" || filter.type === "single-checkbox") {
    selector = `#filter-${filter.type}-${filter.internalName}`;
    event = "change";
  } else if (
    filter.type === "input-datalist" ||
    filter.type === "distance" ||
    filter.type === "checkbox-list"
  ) {
    // If not in a modal, each of these filter types have their own submit button; otherwise, the modal button acts as global submit button for all filters it contains
    selector = filter.displayInSharedModal
      ? "#shared-filter-modal-confirm"
      : filter.displayInIndividualModal?.isWanted
      ? `#individual-filter-modal-confirm-${filter.internalName}`
      : `#submit-filter-${filter.internalName}`;
    event = "click";
  }

  document.querySelector(selector).addEventListener(event, () => {
    const isFilterValid = validateFilter(filter);
    if (!isFilterValid) {
      if (filter.displayInSharedModal)
        window.allFiltersInSharedModalCorrect = false; // This causes the modal not to close
      return;
    }
    hideResults(filter);
    checkIfAnyResultsLeft();
    sendMessageToLimitResultsAddon();
  });
  if (filter.type === "single-checkbox" || filter.type === "checkbox-list") {
    // In case filters are set by default, a first check must be done upfront
    document.querySelector(selector).dispatchEvent(new Event(event));
  }
}

function validateFilter(filter) {
  if (filter.type === "dropdown" || filter.type === "single-checkbox")
    return true;
  const nodeErrorMessage = document.querySelector(
    `#error-message-filter-${filter.type}-${filter.internalName}`
  );
  nodeErrorMessage.innerHTML = "";
  if (filter.type === "input-datalist") {
    const inputValue = document.querySelector(
      `#filter-input-${filter.internalName}`
    ).value;
    // If the input is empty, the validation succeeds (no filter is applied)
    if (inputValue && !filter.datalist.includes(inputValue)) {
      nodeErrorMessage.innerHTML = filter.errorMessage;
      return false;
    } else return true;
  } else if (filter.type === "distance") {
    const inputValueLocation = document.querySelector(
      `#filter-distance-location-${filter.internalName}`
    ).value;
    const inputValueDistance = document.querySelector(
      `#filter-distance-distance-${filter.internalName}`
    ).value;
    // If both inputs are empty, the validation succeeds (no filter is applied)
    if (!inputValueLocation && !inputValueDistance) return true;
    // If one of the inputs is empty and the other one is not, the validation fails
    if (!inputValueLocation) {
      nodeErrorMessage.innerHTML = filter.errorMessageNoLocation;
      return false;
    } else if (
      !filter.datalist.some((item) => item.text === inputValueLocation)
    ) {
      nodeErrorMessage.innerHTML = filter.errorMessageWrongLocation;
      return false;
    } else if (!inputValueDistance) {
      // Since the input has "type='number'", any non-numerical input resolves to ""  (empty string)
      nodeErrorMessage.innerHTML = filter.errorMessageDistance;
      return false;
    } else return true;
  } else if (filter.type === "checkbox-list") {
    const checkboxes = document.querySelectorAll(
      `[id^="filter-checkbox-list-${filter.internalName}-option"]`
    );
    const areNoneChecked = !Array.from(checkboxes).some(
      (checkbox) => checkbox.checked
    );
    const areAllChecked = Array.from(checkboxes).every(
      (checkbox) => checkbox.checked
    );
    if (
      (filter.checkedMeansExcluded && areAllChecked) ||
      (!filter.checkedMeansExcluded && areNoneChecked)
    ) {
      nodeErrorMessage.innerHTML = filter.errorMessage;
      return false;
    } else return true;
  }
}

function hideResults(filter) {
  const nodelistAllResults = document.querySelectorAll(".row-with-one-result");
  if (filter.type === "dropdown") {
    const selectedOption = document.querySelector(
      `#filter-dropdown-${filter.internalName}`
    ).value;
    nodelistAllResults.forEach((nodeResult) => {
      nodeResult.classList.remove(`hidden-by-filter-${filter.internalName}`);
      const arCorrespondingFilterValues = nodeResult
        .querySelector(".filter-values")
        ?.getAttribute(`data-${filter.internalName}`)
        ?.split(" ");

      if (
        selectedOption !== "show-all" &&
        (!arCorrespondingFilterValues ||
          !arCorrespondingFilterValues.includes(selectedOption))
      )
        nodeResult.classList.add(`hidden-by-filter-${filter.internalName}`);
    });
  } else if (filter.type === "input-datalist") {
    const inputValue = document.querySelector(
      `#filter-input-${filter.internalName}`
    ).value;
    nodelistAllResults.forEach((nodeResult) => {
      nodeResult.classList.remove(`hidden-by-filter-${filter.internalName}`);
      const arCorrespondingFilterValues = nodeResult
        .querySelector(".filter-values")
        ?.getAttribute(`data-${filter.internalName}`)
        ?.split(" ");

      if (
        inputValue &&
        (!arCorrespondingFilterValues ||
          !arCorrespondingFilterValues.includes(inputValue))
      )
        nodeResult.classList.add(`hidden-by-filter-${filter.internalName}`);
    });
  } else if (filter.type === "distance") {
    const inputValueLocation = document.querySelector(
      `#filter-distance-location-${filter.internalName}`
    ).value;

    const inputValueDistance = +document.querySelector(
      `#filter-distance-distance-${filter.internalName}`
    ).value;
    // If both are empty, the validation succeeded, but no filter shall be applied
    if (!inputValueLocation && !inputValueDistance) return;

    const correspondingDatalistItem = filter.datalist.filter(
      (item) => item.text === inputValueLocation
    )[0];
    const latUser = +correspondingDatalistItem.lat;
    const lonUser = +correspondingDatalistItem.lon;

    nodelistAllResults.forEach((nodeResult) => {
      nodeResult.classList.remove(`hidden-by-filter-${filter.internalName}`);
      const latResult = +nodeResult
        .querySelector(".filter-values")
        ?.getAttribute(`data-${filter.internalName}-lat`);
      const lonResult = +nodeResult
        .querySelector(".filter-values")
        ?.getAttribute(`data-${filter.internalName}-lon`);

      if (
        !latResult ||
        !lonResult ||
        +haversineDistance(latUser, lonUser, latResult, lonResult) >
          inputValueDistance
      )
        nodeResult.classList.add(`hidden-by-filter-${filter.internalName}`);

      function haversineDistance(latUser, lonUser, latParty, lonParty) {
        // Radius of the Earth in kilometers
        const R = 6371;
        // Convert latitude and longitude from degrees to radians
        const dLat = ((latParty - latUser) * Math.PI) / 180;
        const dLon = ((lonParty - lonUser) * Math.PI) / 180;
        // Haversine formula
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((latUser * Math.PI) / 180) *
            Math.cos((latParty * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        // Distance in kilometers
        const distance = R * c;
        return distance;
      }
    });
  } else if (filter.type === "checkbox-list") {
    const selectedOptions = [];
    for (let i = 0; i < filter.options.length; i++) {
      if (
        document.querySelector(
          `#filter-checkbox-list-${filter.internalName}-option${i}`
        ).checked
      )
        selectedOptions.push(filter.options[i].value);
    }

    nodelistAllResults.forEach((nodeResult) => {
      nodeResult.classList.remove(`hidden-by-filter-${filter.internalName}`);
      const arCorrespondingFilterValues = nodeResult
        .querySelector(".filter-values")
        ?.getAttribute(`data-${filter.internalName}`)
        ?.split(" ");
      const doFiltersValuesIncludeSelectedOption = selectedOptions.some(
        (item) => arCorrespondingFilterValues.includes(item)
      );

      if (
        !arCorrespondingFilterValues ||
        (filter.checkedMeansExcluded && doFiltersValuesIncludeSelectedOption) ||
        (!filter.checkedMeansExcluded && !doFiltersValuesIncludeSelectedOption)
      )
        nodeResult.classList.add(`hidden-by-filter-${filter.internalName}`);
    });
  } else if (filter.type === "single-checkbox") {
    const isChecked = document.querySelector(
      `#filter-single-checkbox-${filter.internalName}`
    ).checked;
    nodelistAllResults.forEach((nodeResult) => {
      nodeResult.classList.remove(`hidden-by-filter-${filter.internalName}`);
      const correspondingFilterValue = nodeResult
        .querySelector(".filter-values")
        ?.getAttribute(`data-${filter.internalName}`);
      // If checkedMeansExcluded is false, all results are shown when the box is checked. If the box is unchecked, those results with the corresponding value are hidden
      // If checkedMeansExcluded is true, vice versa (results with the value are hidden when box is checked)
      // if correspondingFilterValue is undefined, the result is not hidden; therefore, the attribute is only required on results to be hidden by this filter
      if (
        correspondingFilterValue === filter.value &&
        ((!filter.checkedMeansExcluded && !isChecked) ||
          (filter.checkedMeansExcluded && isChecked))
      )
        nodeResult.classList.add(`hidden-by-filter-${filter.internalName}`);
    });
  }
}

function checkIfAnyResultsLeft() {
  const nodelistResultsNotHiddenByFilters = document.querySelectorAll(
    ".row-with-one-result:not([class*='hidden-by-filter'])"
  );
  if (nodelistResultsNotHiddenByFilters.length === 0) {
    if (document.querySelector("#error-message-no-filter-results")) return;
    const nodeErrorMessage = document.createElement("p");
    nodeErrorMessage.classList.add("error-message");
    nodeErrorMessage.setAttribute("id", "error-message-no-filter-results");
    nodeErrorMessage.innerHTML = ERROR_MESSAGE_NO_FILTER_RESULTS;
    document.querySelector("#resultsShort").appendChild(nodeErrorMessage);
  } else document.querySelector("#error-message-no-filter-results")?.remove();
}

function sendMessageToLimitResultsAddon() {
  window.postMessage("filter changed", "*");
}

function createAndAppendSharedFilterModal() {
  const containerBtnOpenSharedFilterModal = document.createElement("div");
  containerBtnOpenSharedFilterModal.classList.add("row");
  containerBtnOpenSharedFilterModal.setAttribute(
    "id",
    "container-button-open-shared-filter-modal"
  );
  containerBtnOpenSharedFilterModal.innerHTML = `<button id="button-open-shared-filter-modal">${SHARED_MODAL.textButtonOpenModal}</button>`;
  document
    .querySelector("#filters")
    .appendChild(containerBtnOpenSharedFilterModal);

  const sharedFilterModal = document.createElement("div");
  let divContent = `
    <div data-backdrop="static" class="modal fade show" id="sharedFilterModal" tabindex="-1" role="dialog" aria-labelledby="sharedFilterModalLabel" aria-modal="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${SHARED_MODAL.heading}</h2>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body" id="sharedFilterModalBody"></div>
                <div class="modal-footer">
                    <button type="button" id="shared-filter-modal-confirm" class="btn">
                        ${SHARED_MODAL.buttonShowResults}
                    </button>
                </div>
            </div>
        </div>
    </div>`;
  sharedFilterModal.innerHTML = divContent;
  document.body.append(sharedFilterModal);
  document
    .querySelector("#button-open-shared-filter-modal")
    .addEventListener("click", () => {
      $("#sharedFilterModal").modal("show");
    });
  document
    .querySelector("#shared-filter-modal-confirm")
    .addEventListener("click", () => {
      window.allFiltersInSharedModalCorrect = true;
      // If a filter in the modal fails validation, this is set to false, preventing the closing of the modal
      setTimeout(() => {
        if (window.allFiltersInSharedModalCorrect)
          $("#sharedFilterModal").modal("hide");
      }, 300);
    });
}

function createAndAppendIndividualFilterModal(nodeFilter, filter) {
  const containerBtnOpenIndividualFilterModal = document.createElement("div");
  containerBtnOpenIndividualFilterModal.classList.add("row");
  containerBtnOpenIndividualFilterModal.setAttribute(
    "id",
    `container-button-open-individual-filter-modal-${filter.internalName}`
  );
  containerBtnOpenIndividualFilterModal.innerHTML = `<button id="button-open-individual-filter-modal-${filter.internalName}">${filter.displayInIndividualModal.textButtonOpenModal}</button>`;
  document
    .querySelector("#filters")
    .appendChild(containerBtnOpenIndividualFilterModal);

  const individualFilterModal = document.createElement("div");
  let divContent = `
      <div data-backdrop="static" class="modal fade show" id="individualFilterModal-${filter.internalName}" tabindex="-1" role="dialog" aria-labelledby="individualFilterModalLabel-${filter.internalName}" aria-modal="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                  <div class="modal-header">
                      <h2>${filter.displayInIndividualModal.heading}</h2>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                      </button>
                  </div>
                  <div class="modal-body" id="individualFilterModalBody-${filter.internalName}"></div>
                  <div class="modal-footer">
                      <button type="button" id="individual-filter-modal-confirm-${filter.internalName}" class="btn">
                          ${filter.displayInIndividualModal.buttonShowResults}
                      </button>
                  </div>
              </div>
          </div>
      </div>`;
  individualFilterModal.innerHTML = divContent;
  individualFilterModal
    .querySelector(`#individualFilterModalBody-${filter.internalName}`)
    .appendChild(nodeFilter);
  document.body.append(individualFilterModal);
  document
    .querySelector(
      `#button-open-individual-filter-modal-${filter.internalName}`
    )
    .addEventListener("click", () => {
      $(`#individualFilterModal-${filter.internalName}`).modal("show");
    });
  document
    .querySelector(`#individual-filter-modal-confirm-${filter.internalName}`)
    .addEventListener("click", () => {
      $(`#individualFilterModal-${filter.internalName}`).modal("hide");
    });
}

function setFiltersAtStart() {
  const arFiltersToSetAtStart = FILTERS.filter(
    (filter) => filter.setAtStart?.isWanted
  );
  const elementsToHide = document.querySelectorAll(
    "#sectionShowQuestions, #sectionNavigation, #restart"
  );
  document
    .querySelector("#descriptionButtonStart")
    .addEventListener("click", () => {
      elementsToHide.forEach((element) => {
        element.classList.add("d-none");
      });
      showNextCardToSetFilter(0);
    });

  // From here it is just function declarations, nothing directly happening in setFiltersAtStart()

  function showNextCardToSetFilter(index) {
    if (index >= arFiltersToSetAtStart.length) {
      // All filters are set (or skipped), therefore show first question
      if (animateQuestionsCard) {
        setTimeout(() => {
          elementsToHide.forEach((element) => {
            element.classList.remove("d-none");
          });
          document
            .querySelector("#sectionShowQuestions")
            .classList.add("flyInRight");
        }, 400);
        setTimeout(() => {
          document
            .querySelector("#sectionShowQuestions")
            .classList.remove("flyInRight");
        }, 800);
      } else {
        elementsToHide.forEach((element) => {
          element.classList.remove("d-none");
        });
      }
      return;
    }

    const filter = arFiltersToSetAtStart[index];
    if (filter.type !== "dropdown") return; // So far, only dropdown filters are supported; other filters can be added in the future if needed
    const cardToSetFilter = document.createElement("div");
    cardToSetFilter.classList.add("card");
    cardToSetFilter.setAttribute(
      "id",
      `card-to-set-filter-${filter.internalName}`
    );
    cardToSetFilter.style.cssText = "margin: 1rem 15px 0 15px;";
    let divContent = `<div class="card-header"><h2>${filter.setAtStart.cardHeading}</h2></div>
            <hr>
            <div class="card-body">
              <p class="card-text lead">${filter.setAtStart.cardBody}</p>
            </div>
            <section>
                    <div class="row">`;
    for (let i = 0; i < filter.options.length; i++) {
      divContent += `<div class="col">
            <button type="button" data-value="${filter.options[i].value}" class="btn btn-lg btn-block btn-voting btn-set-filter-${filter.internalName}">${filter.options[i].text}</button>
          </div>`;
    }
    divContent += `</div></section>
        <div class="w-100"></div>
        <div class="col">
                        <button type="button" style="background-color: transparent;" id="skip-set-filter-${filter.internalName}" class="btn btn-secondary btn float-right">${TEXT_VOTING_SKIP}</button>
                      </div>`;

    cardToSetFilter.innerHTML = divContent;
    addCardToSetFilterToDOM(cardToSetFilter, filter, index);

    function addCardToSetFilterToDOM(cardToSetFilter, filter, index) {
      if (animateQuestionsCard) {
        setTimeout(() => {
          sectionShowQuestions.parentNode.insertBefore(
            cardToSetFilter,
            sectionShowQuestions
          );
          cardToSetFilter.classList.add("flyInRight");
        }, 400);
        setTimeout(() => {
          cardToSetFilter.classList.remove("flyInRight");
          addEventListenersToButtons(filter, index);
        }, 800);
      } else {
        sectionShowQuestions.parentNode.insertBefore(
          cardToSetFilter,
          sectionShowQuestions
        );
        addEventListenersToButtons(filter, index);
      }
    }
    function addEventListenersToButtons(filter, index) {
      const buttonsSetFilter = document.querySelectorAll(
        `#card-to-set-filter-${filter.internalName} .btn-set-filter-${filter.internalName}`
      );
      buttonsSetFilter.forEach((button) => {
        button.addEventListener("click", (e) => {
          window[`setFilter${filter.internalName}`] =
            e.target.getAttribute("data-value");
          hideCardToSetFilter(index);
        });
      });
      document
        .querySelector(
          `#card-to-set-filter-${filter.internalName} #skip-set-filter-${filter.internalName}`
        )
        .addEventListener("click", () => {
          window[`setFilter${filter.internalName}`] = null;
          hideCardToSetFilter(index);
        });
    }
    function hideCardToSetFilter(index) {
      const cardToSetFilter = document.querySelector(
        `#card-to-set-filter-${arFiltersToSetAtStart[index].internalName}`
      );
      if (animateQuestionsCard) {
        cardToSetFilter.classList.add("flyOutLeft");
        setTimeout(() => {
          cardToSetFilter.classList.add("d-none");
          showNextCardToSetFilter(index + 1);
        }, 400);
      } else {
        cardToSetFilter.classList.add("d-none");
        showNextCardToSetFilter(index + 1);
      }
    }
  }
}

function setPreselectedFilter() {
  if (window.allFiltersResetted) {
    // If BUTTON_RESET_ALL_FILTERS.showButton is true and the button has been clicked already, window.allFiltersResetted is set to true
    // This prevents setting preselected filters again (reset all filters overwrites preselected filters)
    return;
  }
  setTimeout(() => {
    const arFiltersSetAtStart = FILTERS.filter(
      (filter) => filter.setAtStart?.isWanted
    );
    arFiltersSetAtStart.forEach((filter) => {
      const selectedFilter = window[`setFilter${filter.internalName}`];
      if (selectedFilter) {
        document.querySelector(
          `#filter-dropdown-${filter.internalName}`
        ).value = selectedFilter;
        const eventFilterChanged = new Event("change", { bubbles: true });
        document
          .querySelector(`#filter-dropdown-${filter.internalName}`)
          .dispatchEvent(eventFilterChanged);
      }
    });
  }, 100);
}

function setupButtonResetAllFilters() {
  const target = document.querySelector("#resultsHeading");
  const observer = new MutationObserver(createButtonResetAllFilters);
  var config = {
    childList: true,
  };
  observer.observe(target, config);
  function createButtonResetAllFilters() {
    if (!document.querySelector("#resultsHeading").textContent) return;
    const containerBtn = document.createElement("div");
    containerBtn.innerHTML = `<button id="reset-all-filters">${BUTTON_RESET_ALL_FILTERS.textButton}</button>`;
    document.querySelector("#filters").appendChild(containerBtn);
    document
      .querySelector("#reset-all-filters")
      .addEventListener("click", () => {
        window.allFiltersResetted = true; // This prevents that the preselected filters from the start are set again by setPreselectedFilter()
        // Instead of manually resetting each filter, we just delete and re-create them all
        document
          .querySelectorAll(
            `.filter-container, \
            #container-button-open-shared-filter-modal, \
            [id^='container-button-open-individual-filter-modal'], \
            #sharedFilterModal, [id^='individualFilterModal'], \
            #reset-all-filters, \
            #error-message-no-filter-results`
          )
          .forEach((node) => {
            node.remove();
          });
        FILTERS.forEach((filter) => {
          const nodeFilter = createFilterHtml(filter);
          addFilterNodeToDOM(nodeFilter, filter);
        });
        document.querySelectorAll(".row-with-one-result").forEach((result) => {
          Array.from(result.classList).forEach((className) => {
            if (className.startsWith("hidden-by-filter")) {
              result.classList.remove(className);
            }
          });
        });
        createButtonResetAllFilters();
        sendMessageToLimitResultsAddon();
      });
  }
}
