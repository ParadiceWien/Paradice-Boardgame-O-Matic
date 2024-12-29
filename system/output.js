// OUTPUT.JS http://www.mat-o-wahl.de
// Output of information / Ausgabe der Informationen
// License: GPL 3
// Mathias Steudtner http://www.medienvilla.com
/* eslint-disable */

function fnStart() {
  // alte Inhalte loeschen bzw. ausblenden

  // 1. Bereich -  Überschriften, Erklärung zur Wahl
  // sectionDescription
  $("#descriptionHeading1").empty().append(`<h1>${descriptionHeading1}</h1>`);
  $("#descriptionHeading2").empty().append(`<h2>${descriptionHeading2}</h2>`);
  $("#descriptionExplanation").empty().append(descriptionExplanation);
  $("#descriptionButtonStart").html(TEXT_START);
  $("#descriptionAddonTop").empty();
  $("#descriptionAddonBottom").empty();

  // 2. Bereich - Anzeige der Fragen - am Anfang ausblenden
  $("#sectionShowQuestions").hide();
  $("#showQuestionsHeader").empty();
  $("#showQuestionsQuestion").empty();

  // 3. Voting Buttons
  $("#sectionVotingButtons").hide();
  $("#votingPro").html(TEXT_VOTING_PRO);
  $("#votingNeutral").html(TEXT_VOTING_NEUTRAL);
  $("#votingContra").html(TEXT_VOTING_CONTRA);
  $("#votingBack").html(TEXT_VOTING_BACK);
  $("#votingSkip").html(TEXT_VOTING_SKIP);
  document.querySelector("#voting-double-container-card label span").innerHTML =
    TEXT_VOTING_DOUBLE;

  // 4. Navigation
  $("#sectionNavigation").hide();

  // Bereich - Ergebnisse
  $("#sectionResults").hide();
  $("#resultsHeading").empty();
  $("#resultsShort").empty();
  $("#resultsByThesis").empty();
  $("#resultsByParty").empty();
  $("#resultsAddonTop").empty();
  $("#resultsAddonBottom").empty();

  // Bereich - Footer
  $("#statisticsModalLabel").html(TEXT_ALLOW_STATISTIC_TITLE);
  $("#statisticsModalBody").html(TEXT_ALLOW_STATISTIC_TEXT);
  $("#statisticsModalButtonNo").html(TEXT_ALLOW_STATISTIC_NO);
  $("#statisticsModalButtonYes").html(TEXT_ALLOW_STATISTIC_YES);

  $("#votingDoubleModalLabel").html(TEXT_VOTING_DOUBLE_MODAL_HEADING);
  $("#votingDoubleModalBody").html(TEXT_VOTING_DOUBLE_MODAL_BODY);

  // Nach jedem Klick auf einen Button den Fokus wieder entfernen, um bleibende Hervorhebungen (Unterstreichungen) zu vermeiden
  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      document.activeElement.blur();
    });
  });

  //////////////////////////////////////////////////////////////////
  // FOOTER

  // Impressum auf Startseite ersetzen
  // Text aus i18n einfügen
  $("#privacy").html(TEXT_PRIVACY);
  // Link aus definition.js einfügen
  if (privacyExternalPageLink)
    $("#privacy")
      .attr("href", privacyExternalPageLink)
      .attr("target", "_blank");
  else $("#privacy").attr("onclick", "fnShowPrivacy()");

  // Impressum auf Startseite ersetzen
  // Text aus i18n einfügen
  $("#imprint").html(TEXT_IMPRINT);
  // Link aus definition.js einfügen
  $("#imprint").attr("href", imprintLink);

  // Neustart / Wiederholung
  var jetzt = new Date();
  var sekunden = jetzt.getTime();
  $("#restart").attr("href", `index.html?${sekunden}`);
  $("#restart").html(TEXT_RESTART);

  //////////////////////////////////////////////////////////////////
  // Anzahl der Parteien berechnen

  // FRAGEN UND ANTWORTEN in Arrays einlesen und Folgefunktionen aufrufen
  // (a) Fragen
  fnReadCsv(`data/${fileQuestions}`, fnShowQuestions);

  // (b) Antworten der Parteien und Partei-Informationen
  fnReadCsv(`data/${fileAnswers}`, fnReadPositions);

  // Wenn "descriptionShowOnStart = 0" in DEFINITION.JS, dann gleich die Fragen anzeigen
  if (!descriptionShowOnStart) {
    // Das System ist am Anfang noch nicht fertig geladen. Deshalb müssen wir einen Moment warten. :(
    $("#descriptionHeading1").empty().append("<h1>Loading / Lädt</h1>");
    $("#descriptionHeading2")
      .empty()
      .append("<h2>Please wait a moment / Bitte einen Moment warten</h2>");

    let descriptionExplanationContent = `
      <div class="progress">
         <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width:50%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
      This message disappears in less than 5 seconds. If not, something went wrong. / <br>
      Diese Nachricht verschwindet in weniger als 5 Sekunden. Andernfalls ist etwas schief gelaufen.
     `;

    $("#descriptionExplanation").empty().append(descriptionExplanationContent);

    window.setTimeout(fnHideWelcomeMessage, 2500);
  }
}

// Ausblenden der Willkommensmeldung (#sectionDescription)
// und direkt in die Fragen gehen
// neu ab v.0.6
// Aufruf aus fnStart() wenn "descriptionShowOnStart = 0" ODER beim Klick auf Start-Button
function fnHideWelcomeMessage() {
  document.querySelector("#restart").classList.remove("d-none");
  // Warn user before leaving the page and ask for confirmation
  window.addEventListener("beforeunload", function (event) {
    event.preventDefault(); // Required in some browsers
    event.returnValue = "dummy"; // A non-empty string is often ignored
  });
  fnShowQuestionNumber(-1);
}

// (a) Anzeige von Frage Nummer XY
// (b) Weiterleitung zur Auswertung
// Aufruf aus fnStart() -> fnShowQuestions(csvData)
function fnShowQuestionNumber(questionNumber) {
  // Nummer der Frage im Array um eins erhöhen
  questionNumber++;

  $("#votingPro").unbind("click");
  $("#votingNeutral").unbind("click");
  $("#votingContra").unbind("click");
  $("#votingBack").unbind("click");
  $("#votingSkip").unbind("click");

  $("#sectionNavigation").show();

  // solange Fragen gestellt werden -> Anzeigen (sonst Auswertung)
  if (questionNumber < arQuestionsLong.length) {
    function appendQuestion(questionNumber) {
      let questionTitle = "<h2 class='flex-center'>";
      if (showQuestionNumberOnCard) {
        questionTitle += `${questionNumber + 1}/${intQuestions}: `;
      } else {
        questionTitle += `<i class="bx ${arQuestionsIcon[questionNumber]}"></i> `;
      }
      questionTitle += arQuestionsShort[questionNumber];
      questionTitle += "</h2>";
      $("#showQuestionsHeader").empty().append(questionTitle);
      $("#showQuestionsQuestion")
        .empty()
        .append(arQuestionsLong[questionNumber]);
    }

    if (animateQuestionsCard) {
      function fnAnimateSectionShowQuestions(movementDirection) {
        document
          .querySelector("#sectionShowQuestions")
          .classList.add(movementDirection);
        setTimeout(() => {
          appendQuestion(questionNumber);
        }, 400);
        setTimeout(() => {
          document
            .querySelector("#sectionShowQuestions")
            .classList.remove(movementDirection);
        }, 800);
      }
      if (
        document.querySelector("#sectionDescription").style.display !== "none"
      ) {
        document
          .querySelector("#sectionDescription")
          .classList.add("flyOutLeft");
        setTimeout(() => {
          document.querySelector("#sectionDescription").style.display = "none";
          document.querySelector("#sectionShowQuestions").style.display = "";
          document.querySelector("#sectionVotingButtons").style.display = "";
          appendQuestion(questionNumber);
          document
            .querySelector("#sectionShowQuestions")
            .classList.add("flyInRight");
        }, 400);
        setTimeout(() => {
          document
            .querySelector("#sectionShowQuestions")
            .classList.remove("flyInRight");
        }, 800);
      } else if (questionNumber > activeQuestion)
        fnAnimateSectionShowQuestions("flyOutLeftFlyInRight");
      else if (questionNumber < activeQuestion)
        fnAnimateSectionShowQuestions("flyOutRightFlyInLeft");
    } else {
      if (
        document.querySelector("#sectionDescription").style.display !== "none"
      ) {
        $("#sectionDescription").hide().empty();
        $("#sectionShowQuestions").show();
        $("#sectionVotingButtons").show();
      }
      appendQuestion(questionNumber);
    }

    activeQuestion = questionNumber; // globale Variable

    if (activeQuestion > 0) $("#votingBack").show();
    else $("#votingBack").hide();

    // Aufbau der Liste zum Vor/Zurückgehen bei den Fragen
    fnJumpToQuestionNumber(questionNumber);

    // Klick-Funktion auf Bilder/Buttons legen.
    $("#votingPro").click(function () {
      arPersonalPositions[questionNumber] = 1;
      fnShowQuestionNumber(questionNumber);
    });

    $("#votingNeutral").click(function () {
      arPersonalPositions[questionNumber] = 0;
      fnShowQuestionNumber(questionNumber);
    });

    $("#votingContra").click(function () {
      arPersonalPositions[questionNumber] = -1;
      fnShowQuestionNumber(questionNumber);
    });

    $("#votingBack").click(function () {
      if (activeQuestion > 0) fnShowQuestionNumber(activeQuestion - 2);
    });

    $("#votingSkip").click(function () {
      arPersonalPositions[questionNumber] = 99;
      fnShowQuestionNumber(questionNumber);
    });

    // Checkbox für doppelte Bewertung

    const votingDoubleCheckbox = document.querySelector(
      "#checkbox-voting-double"
    );
    if (votingDoubleCheckbox.checked !== !!arVotingDouble[questionNumber]) {
      setTimeout(
        () => {
          votingDoubleCheckbox.checked = arVotingDouble[questionNumber];
        },
        animateQuestionsCard ? 400 : 0
      );
    }
  }

  // Alle Fragen durchgelaufen -> Auswertung
  else {
    if (isActivated("addon_custom_voting_buttons.js")) {
      CUSTOM_POSITION_BUTTONS.forEach((questionWithCustomButtons) => {
        if (questionWithCustomButtons.isYesOrDontCareQuestion) {
          const correspondingQuestion =
            questionWithCustomButtons.questionNr - 1;
          if (
            arPersonalPositions[correspondingQuestion] ===
            questionWithCustomButtons.arPositionValues[
              questionWithCustomButtons.arPositionValues.length - 1
            ]
          )
            arPersonalPositions[correspondingQuestion] = 99;
        }
      });
    }

    // Show loading icon
    const loadingAnimation = document.createElement("div");
    loadingAnimation.classList.add("lds-default");
    loadingAnimation.innerHTML =
      "<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>";
    document.body.appendChild(loadingAnimation);

    setTimeout(() => {
      arResults = fnEvaluation();

      //Parteien sortieren
      arSortParties = new Array();
      //		for (i = 0; i < arPartyFiles.length; i++)
      for (i = 0; i < intParties; i++) {
        arSortParties[i] = i;
      }
      // Sortieren der Parteien nach Uebereinstimmung
      arSortParties.sort(function (a, b) {
        return arResults[b] - arResults[a];
      });

      // Übergabe an Tabellen zur Darstellung/Ausgabe
      generateSectionResults(arResults); // Kurzüberblick mit Progress-bar

      // Buttons einblenden für detaillierte Ergebnisse
      $("#resultsButtons").fadeIn(0);

      // Hide loading icon
      document.querySelector(".lds-default").classList.add("d-none");

      // Abfrage zur Statistik einblenden (v.0.6.)
      if (statsRecord) {
        $("#statisticsModal").modal("show");
        // Klick-Funktion mit den Ergebnissen zum Senden auf "Ja" legen
        document
          .getElementById("statisticsModalButtonYes")
          .addEventListener("click", function () {
            fnSendResults(arResults, arPersonalPositions);
            $("#statisticsModal").modal("toggle");
          });
      }
    }, 0);
  }
}

// 02/2015 BenKob
function fnChangeVotingDouble() {
  arVotingDouble[activeQuestion] = !arVotingDouble[activeQuestion];
  const isNowDoubled = document.querySelector(
    "#checkbox-voting-double"
  ).checked;
  document.querySelector(
    `#jumpToQuestionNr${activeQuestion + 1}`
  ).style.fontWeight = isNowDoubled ? "bold" : "normal";
}

// Springe zu Frage Nummer XY (wird in fnShowQuestionNumber() aufgerufen)
function fnJumpToQuestionNumber(questionNumber) {
  // alten Inhalt ausblenden und loeschen
  $("#navigationJumpToQuestion").fadeOut(0).empty().hide();

  // Durchlauf des Arrays bis zur ausgewählten Frage und Setzen der 99, falls NaN
  for (i = 0; i < questionNumber; i++) {
    if (isNaN(arPersonalPositions[i])) {
      arPersonalPositions[i] = 99;
    }
  }

  var maxQuestionsPerLine = 12; // z.B. 16

  // Wenn mehr als XY Fragen vorhanden, dann erstelle eine zweite/dritte/... Zeile
  if (intQuestions >= maxQuestionsPerLine) {
    var tableRows =
      arQuestionsLong.length /
      maxQuestionsPerLine; /* z.B. nicht mehr als 16 Fragen pro Zeile */
    tableRows =
      Math.ceil(
        tableRows
      ); /* 17 Fragen / 16 = 1,06 ### 31 Fragen / 16 = 1,9 -> 2 Zeilen */
    var questionsPerLine =
      arQuestionsLong.length /
      tableRows; /* 23 Fragen / 2 Zeilen = 12 & 11 Fragen/Zeile */
    questionsPerLine = Math.ceil(questionsPerLine);
  } else {
    questionsPerLine = maxQuestionsPerLine;
  }

  // Tabelle aufbauen
  let tableContentJumpToQuestion =
    "<table width='100%' class='table table-bordered table-striped table-hover' aria-role='presentation'>";
  for (i = 1; i <= arQuestionsLong.length; i++) {
    const modulo = i % questionsPerLine;
    // neue Zeile
    if (modulo == 1) tableContentJumpToQuestion += "<tr>";
    tableContentJumpToQuestion += `
    <td align='center' id='jumpToQuestionNr${i}' title='${
      arQuestionsShort[i - 1]
    } - ${arQuestionsLong[i - 1]}'>
      <a href='javascript:fnShowQuestionNumber(${
        i - 2
      })' style='display:block;'>${i} </a>
    </td>`;
    if (modulo == 0) tableContentJumpToQuestion += "</tr>";
  }
  tableContentJumpToQuestion += "</table>";
  $("#navigationJumpToQuestion").append(tableContentJumpToQuestion).fadeIn(0);

  // alte Meinungen farblich hervorheben und aktuelle Frage markieren
  for (i = 1; i <= arQuestionsLong.length; i++) {
    // beantwortete Fragen farblich markieren
    let positionColor = fnTransformPositionToColor(arPersonalPositions[i - 1]);

    if (
      isActivated("addon_custom_voting_buttons.js") &&
      (correspondingCustomQuestion = CUSTOM_POSITION_BUTTONS.find(
        (obj) => obj.questionNr === i
      ))
    ) {
      const index = correspondingCustomQuestion.arPositionValues.indexOf(
        arPersonalPositions[i - 1]
      );
      if (index === -1) positionColor = "transparent";
      else {
        positionColor =
          correspondingCustomQuestion.arBackgroundColor?.[index] ||
          CUSTOM_POSITION_BUTTONS_DEFAULT_VALUES.backgroundColor;
        const textColor =
          correspondingCustomQuestion.arTextColor?.[index] ||
          CUSTOM_POSITION_BUTTONS_DEFAULT_VALUES.textColor;
        document.querySelector(`#jumpToQuestionNr${i} a`).style.color =
          textColor;
      }
    }
    $(`#jumpToQuestionNr${i}`).css("background", positionColor);

    // aktuelle Frage markieren
    if (i - 1 === questionNumber)
      document
        .querySelector(`#jumpToQuestionNr${i}`)
        .classList.add("currentQuestion");
    else
      document
        .querySelector(`#jumpToQuestionNr${i}`)
        .classList.remove("currentQuestion");

    if (arVotingDouble[i - 1]) {
      document.querySelector(`#jumpToQuestionNr${i}`).style.fontWeight = "bold";
    }
  }
}

// Anzeige der Ergebnisse - zusammengefasst (Prozentwerte) - nur Parteien
// Array arResults kommt von fnEvaluation
function addContentToResultsTab() {
  if (!document.querySelector("#resultsHeading").textContent)
    document.querySelector(
      "#resultsHeading"
    ).innerHTML = `<h1>${TEXT_RESULTS_HEADING}</h1><h2>${TEXT_RESULTS_SUBHEADING}</h2>`;

  (function addButtonsAboveResultsShort() {
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add(
      "col",
      "d-flex",
      "flex-column",
      "align-items-start"
    );
    let divContent = "";
    if (isActivated("addon_filter_results.js")) {
      divContent += `<button id="btn-above-results-short-filter-results" class="btn btn-secondary flex-center" onclick="document.querySelector('#filtersTabBtn').click()">
        ${TEXT_BUTTON_ABOVE_RESULTS_SHORT_FILTER_RESULTS}
      </button>`;
    }
    divContent += `<button id="btn-above-results-short-change-answers" class="btn btn-secondary flex-center" onclick="document.querySelector('#finetuningTabBtn').click()">
              ${TEXT_BUTTON_ABOVE_RESULTS_SHORT_CHANGE_ANSWERS}
            </button>`;
    buttonsContainer.innerHTML = divContent;
    document
      .querySelector("#buttonsAboveResultsShort")
      .appendChild(buttonsContainer);
  })();
  //Anzahl der Maximalpunkte ermitteln
  const maxPoints = calculateMaxPoints();

  let tableContentResultsShort = `<div class='row' id='resultsShortTable' role='table'>
  <div class='col'>`;

  for (i = 0; i <= intParties - 1; i++) {
    let partyNum = arSortParties[i];
    let percent = fnPercentage(arResults[partyNum], maxPoints);

    // "Klammer" um den Inhalt.
    // Wenn ein Addon (z.B. addon_contacts_in_results.js) eine neue Zeile unter die Zeile #resultsShortParty einfügt,
    // bleiben die Zebrastreifen aus der Klasse ".mow-row-striped" in der richtigen Reihenfolge.
    tableContentResultsShort += `<div class='border rounded mow-row-striped row-with-one-result' id='resultsShortPartyClamp${partyNum}' role='row'>
<div class='row' id='resultsShortParty${partyNum}' role='row'>
  <div class='col col-2 col-md-1 logo-container' role='cell'>
    ${
      !isActivated("addon_limit_results.js") || i < intPartiesShowAtEnd
        ? `<img src="${arPartyLogosImg[partyNum]}" class='result-logo rounded img-fluid' alt="Logo ${arPartyNamesLong[partyNum]}" />`
        : ""
    }
  </div>
  <div class='col col-10 col-md-7' role='cell'>
      <strong>${arPartyNamesLong[partyNum]}</strong>
      <br />
      <span class="tagline">${arPartyInternet[partyNum]}</span>
      <br /> 
      <button type="button" class="btn btn-sm btn-outline-secondary flex-center" 
        id="resultsShortPartyDescriptionButton${partyNum}">
        ${TEXT_SHOW_PARTY_DESCRIPTION}</button>
  </div> 
  <div class='col col-12 col-md-4' role='cell'>
      <div class='progress'>
          <div class='progress-bar' role='progressbar' id='partyBar${partyNum}' style='width:${percent}%;'
                aria-valuenow='${percent}' aria-valuemin='0' aria-valuemax='100'>JUST_A_PLACEHOLDER_TEXT - SEE FUNCTION fnReEvaluate()
          </div>
      </div>
  </div>
</div>
<div id="resultsShortPartyDetails${partyNum}">
  <div id="resultsShortPartyDescription${partyNum}">
  <br /> 
  <span id="internet-above-description"><a href='https://boardgamegeek.com/boardgame/${
    arPartyNamesShort[partyNum]
  }' target='_blank' class='flex-center' alt="Link: ${
      arPartyNamesLong[partyNum]
    }"
            title="Link: ${arPartyNamesLong[partyNum]}">
            ${TEXT_LINK_TO_EXTERNAL_PAGE}</a>
  <br / ></span>
      ${arPartyDescription[partyNum] ? arPartyDescription[partyNum] : null}
  <br /> 
  <span id="internet-below-description"><a href='https://boardgamegeek.com/boardgame/${
    arPartyNamesShort[partyNum]
  }' target='_blank'  class='flex-center' alt="Link: ${
      arPartyNamesLong[partyNum]
    }"
            title="Link: ${arPartyNamesLong[partyNum]}">
            ${TEXT_LINK_TO_EXTERNAL_PAGE}</a>
  <br / ></span>
  </div>
  <div id="containerForAddonGeneratedElements"></div>`;
    if (!HIDE_TABLE_resultsByPartyAnswers) {
      tableContentResultsShort += `<div style='text-align: center; width: 100%;'>
  <button id='resultsByPartyAnswers${partyNum}collapse' class='nonexpanded btn btn-sm btn-outline-secondary flex-center' type='button'>
      ${TEXT_SHOW_PARTY_ANSWERS}
  </button>
  <span id='resultsByPartyAnswersToQuestion${partyNum}'> <!-- Hilfs-SPAN für Textfilter -->
      <div class='row border rounded'>
        <div class='col'>`;

      jStart = partyNum * intQuestions; // z.B. Citronen Partei = 3. Partei im Array[2] = 2 * 5 Fragen = 10
      jEnd = jStart + intQuestions - 1; // 10 + 5 Fragen -1 = 14

      // Anzeige der Partei-Antworten
      for (j = jStart; j <= jEnd; j++) {
        // 1./4 Zellen - Frage
        modulo = j % intQuestions; // z.B. arPartyPositions[11] % 5 Fragen = 1 -> arQuestionsShort[1] = 2. Frage

        tableContentResultsShort += `
              <div class='row mow-row-striped' id='resultsAnswerParty${partyNum}ToQuestion${
          modulo + 1
        }' role='row'>
                  <div class='col col-10 col-md-5' role='cell'>
                      ${modulo + 1}. <strong>${
          arQuestionsShort[modulo]
        }</strong> - ${arQuestionsLong[modulo]}
                  </div>`;
        // 2./4 Zellen - Icon für eigene Meinung [+] [0] [-]
        var positionButton = fnTransformPositionToButton(
          arPersonalPositions[modulo]
        );
        var positionIcon = fnTransformPositionToIcon(
          arPersonalPositions[modulo],
          "personal"
        );
        var positionText = fnTransformPositionToText(
          arPersonalPositions[modulo],
          "personal"
        );

        tableContentResultsShort += `<div class='col col-4 col-md-2' id='selfPositionContainer${modulo}' role='cell'>
                    <select class="selfPosition${modulo}" onchange="fnToggleSelfPosition(this)">
                      <option value="1">${TEXT_VOTING_PRO}</option>
                      <option value="0">${TEXT_VOTING_NEUTRAL}</option>
                      <option value="-1">${TEXT_VOTING_CONTRA}</option>
                      <option value="99">${ICON_SKIPPED}</option>
                    </select>
                </div>`;

        // 3./4 Zellen - Icons für Postion der Parteien [+] [0] [-]
        var positionIcon = fnTransformPositionToIcon(
          arPartyPositions[j],
          "party"
        );
        var positionButton = fnTransformPositionToButton(arPartyPositions[j]);
        var positionText = fnTransformPositionToText(
          arPartyPositions[j],
          "party"
        );

        tableContentResultsShort += `<div class='col col-4 col-md-2' id='partyPositionContainer${modulo}' role='cell'>
                    <button type='button' class='btn ${positionButton} partyPositionToQuestion${modulo} btn-sm' disabled data-value="${arPartyPositions[j]}"
                            alt='${TEXT_ANSWER_PARTY} : ${positionText}' title='${TEXT_ANSWER_PARTY} : ${positionText}'>
                        ${positionIcon}
                    </button>
                </div>
                <div class='col col-6 col-md-3' role='cell' headers='resultsByPartyHeading${i}'>
                    ${arPartyOpinions[j]}
                    <!-- die Beschreibung der Partei in einem VERSTECKTEN DIV -> ein Workaround für das Addon "Textfilter" (siehe /EXTRAS) :( -->
                </div>
            </div> <!-- end: row Anzeige der Partei-Antworten -->`;
      } // end: for-j
      tableContentResultsShort += `</div> <!-- end col -->
          </div> <!-- end row resultsByPartyAnswersToQuestion -->
        </span> <!-- end span resultsByPartyAnswersToQuestion -->
        </div> <!-- end span resultsShortPartyDetails -->`;
    }
    tableContentResultsShort += `</div> <!-- end: row .mow-row-striped + #resultsShortPartyClampX -->
  </div> <!-- row #resultsShortPartyX -->`;
  } // end for
  tableContentResultsShort += `</div>
</div> <!-- end: col (resultsShortTable) -->
</div> <!-- end: row (resultsShortTable) -->`;

  // Daten in Browser schreiben
  document.querySelector("#resultsShort").innerHTML = tableContentResultsShort;
  document.querySelectorAll("#resultsShort");

  if (!HIDE_TABLE_resultsByPartyAnswers) {
    for (let i = 0; i < intParties; i++) {
      const btnShowAnswersOfThisParty = document.querySelector(
        `#resultsShortPartyClamp${i} .nonexpanded`
      );
      btnShowAnswersOfThisParty.addEventListener("click", () => {
        $(`#resultsByPartyAnswersToQuestion${i}`).toggle(500);
        btnShowAnswersOfThisParty.classList.toggle("expanded");
        btnShowAnswersOfThisParty.classList.toggle("nonexpanded");
        if (btnShowAnswersOfThisParty.classList.contains("expanded")) {
          btnShowAnswersOfThisParty.innerHTML = TEXT_HIDE_PARTY_ANSWERS;
        } else {
          btnShowAnswersOfThisParty.innerHTML = TEXT_SHOW_PARTY_ANSWERS;
        }
      });
    }
  }

  // Funktion zur Berechnung der "Doppelten Wertung" aufrufen
  // -> enthält Aufruf für farbliche Progressbar (muss hier ja nicht extra wiederholt werden)
  fnReEvaluate();

  for (let i = 0; i < intParties; i++) {
    const btnExpandDetails = document.querySelector(
      `#resultsShortPartyDescriptionButton${i}`
    );
    btnExpandDetails.addEventListener("click", () => {
      function handleFullscreenEventDetails() {
        const clampResult = document.querySelector(
          `#resultsShortPartyClamp${i}`
        );
        if (btnExpandDetails.classList.contains("expanded")) {
          clampResult.scrollIntoView({ behavior: "smooth" });
          const wrapperDiv = document.createElement("div");
          wrapperDiv.classList.add("fullscreen-result-details-overlay");
          clampResult.classList.add("fullscreen-result-details-content");
          setTimeout(() => {
            clampResult.parentNode.insertBefore(wrapperDiv, clampResult);
            wrapperDiv.appendChild(clampResult);
            document.body.style.overflow = "hidden";
            const btnClose = document.createElement("button");
            btnClose.innerHTML = TEXT_BUTTON_CLOSE_FULLSCREEN_EVENT_DETAILS;
            btnClose.addEventListener("click", () => {
              btnExpandDetails.click();
            });
            clampResult.parentNode.appendChild(btnClose);
            btnClose.classList.add(
              "fullscreen-result-details-close",
              "off-screen"
            );
            setTimeout(() => {
              btnClose.classList.remove("off-screen");
            }, 0);
          }, 500); // Wait for the toggle animation to be finished
        } else {
          const wrapperDiv = clampResult.parentNode;
          wrapperDiv.parentNode.insertBefore(clampResult, wrapperDiv);
          wrapperDiv.remove();
          clampResult.classList.remove("fullscreen-result-details-content");
          document.body.style.overflow = "unset";
          clampResult.scrollIntoView({ behavior: "smooth" });
        }
      }
      if (window.innerWidth > 768) {
        // Close result details that are currently open
        document
          .querySelector(
            `[id^="resultsShortPartyDescriptionButton"]:not(#resultsShortPartyDescriptionButton${i}).expanded`
          )
          ?.click();
      }
      $(`#resultsShortPartyDetails${i}`).toggle(450);
      btnExpandDetails.classList.toggle("expanded");
      if (btnExpandDetails.classList.contains("expanded")) {
        btnExpandDetails.innerHTML = TEXT_HIDE_PARTY_DESCRIPTION; // MINUS
      } else {
        btnExpandDetails.innerHTML = TEXT_SHOW_PARTY_DESCRIPTION; // PLUS
        // If the details are closed and the answers were expanded, collapse the answers
        const btnExpandAnswers = document.querySelector(
          `#resultsByPartyAnswers${i}collapse`
        );
        if (btnExpandAnswers?.classList.contains("expanded"))
          btnExpandAnswers.click();
      }
      if (window.innerWidth <= 768) handleFullscreenEventDetails();
    });

    $(`#resultsByPartyAnswersToQuestion${i}`).hide(500);

    // am Anfang die Antworten ausblenden
    $(`#resultsShortPartyDetails${i}`).fadeOut(0);
  }

  if (isActivated("addon_filter_results.js")) {
    window.addEventListener("message", (event) => {
      if (
        event.data !== "filter changed" &&
        event.data !== "limit results changed"
      )
        return;
      setTimeout(() => {
        document
          .querySelectorAll(
            "#resultsShortTable .row-with-one-result:not([class*='hidden-by'])"
          )
          .forEach((row) => {
            if (row.querySelector(".result-logo")) return;
            const partyNum = +row
              .getAttribute("id")
              .replace("resultsShortPartyClamp", "");
            row.querySelector(
              ".logo-container"
            ).innerHTML = `<img src="${arPartyLogosImg[partyNum]}" class='result-logo rounded img-fluid' alt="Logo ${arPartyNamesLong[partyNum]}" />`;
          });
      }, 0);
    });
  }
}

function addContentToFinetuningTab() {
  document.querySelector(
    "#finetuningHeading"
  ).innerHTML = `<h1>${TEXT_FINETUNING_HEADING}</h1><h2>${TEXT_FINETUNING_SUBHEADING}</h2>`;

  let tableContentResultsByThesis = `
      <div class='row' id='resultsByThesisTable' role='table'>
        <div class='col'>`;
  for (i = 0; i < intQuestions; i++) {
    var positionButton = fnTransformPositionToButton(arPersonalPositions[i]);
    var positionIcon = fnTransformPositionToIcon(
      arPersonalPositions[i],
      "personal"
    );
    var positionText = fnTransformPositionToText(
      arPersonalPositions[i],
      "personal"
    );

    tableContentResultsByThesis += `<div class='row border' id='resultsByThesisQuestion${i}Container' role='row'>
                <div class='col' id='resultsByThesisQuestion${i}' role='cell'>
                
                    <div id='resultsByThesisQuestion${i}Text'>
                        <strong class="flex-center" style="display: inline-flex"><i class="bx ${
                          arQuestionsIcon[i]
                        }"></i> ${arQuestionsShort[i]}</strong>: ${
      arQuestionsLong[i]
    }
                    </div>

                    <div id='resultsByThesisQuestion${i}PersonalPosition'>
                    <div id="voting-double-container-question${i}">
                      <input type="checkbox" id="checkbox-voting-double-question${i}" onchange="fnToggleDouble(${i})" ${
      arVotingDouble[i] ? "checked" : ""
    }>
                      <label for="checkbox-voting-double-question${i}" class="flex-center"
                      ><i class="bx bx-check bx-border"></i>
                      <span>Double-weighted</span>
                      <button
                        class="bx bx-help-circle icon-help icon-help-voting-double"
                        onclick="$('#votingDoubleModal').modal('show');"
                      ></button
                    ></label>
                    </div>

                    <label class="your-answer" for="resultsByThesisSelfPosition${i}">${TEXT_ANSWER_USER}: </label>
                    <select id="resultsByThesisSelfPosition${i}" class="selfPosition${i}" onchange="fnToggleSelfPosition(this)">
                      <option value="1">${TEXT_VOTING_PRO}</option>
                      <option value="0">${TEXT_VOTING_NEUTRAL}</option>
                      <option value="-1">${TEXT_VOTING_CONTRA}</option>
                      <option value="99">${ICON_SKIPPED}</option>
                    </select>
                </div>

                    <button id='resultsByThesisQuestion${i}collapse' style='float: left;' class='nonexpanded btn btn-sm flex-center' type='button'>
                        ${TEXT_SHOW_THESIS_ANSWERS}
                    </button>
                </div>
               

            <!-- darunterliegende Zeile - Parteipositionen anzeigen -->
            <div class='border rounded' id='resultsByThesisAnswersToQuestion${i}'>
                <div class='col'>`;

    // darunterliegende Zeile - Parteipositionen anzeigen
    for (j = 0; j < intParties; j++) {
      var partyNum = arSortParties[j];
      var partyPositionsRow = partyNum * intQuestions + i;
      var positionButton = fnTransformPositionToButton(
        arPartyPositions[partyPositionsRow]
      );
      var positionIcon = fnTransformPositionToIcon(
        arPartyPositions[partyPositionsRow],
        "party"
      );
      var positionText = fnTransformPositionToText(
        arPartyPositions[partyPositionsRow],
        "party"
      );

      // Inhalt der Zelle
      tableContentResultsByThesis += `<div class='row mow-row-striped row-with-one-result result${partyNum}' role='row'>

                        <div class='w-50 d-flex align-items-center' role='cell'>
                        <button class="bx bx-info-circle icon-help" onclick="showModalResultDetails(${partyNum})"></button>
                        <small><strong>${arPartyNamesLong[partyNum].replace(
                          / <small>.*?<\/small>/,
                          ""
                        )}</strong></small>${
        arPartyOpinions[partyPositionsRow] ? ":" : ""
      } ${arPartyOpinions[partyPositionsRow]}
                        <!-- die Beschreibung der Partei in einem VERSTECKTEN DIV -> ein Workaround für das Addon "Textfilter" (siehe /EXTRAS) :( -->
                            <span style='visibility:hidden; display:none;' aria-hidden='true'>${
                              arPartyDescription[partyNum]
                            }</span> 
                        </div>
                        <div class='w-50 d-flex align-items-center' role='cell'>
                            <button type='button' class='btn ${positionButton} partyPositionToQuestion${i} btn-sm' disabled data-value="${
        arPartyPositions[partyPositionsRow]
      }"
                                    alt='${TEXT_ANSWER_PARTY} : ${positionText}' title='${TEXT_ANSWER_PARTY} : ${positionText}'>
                                ${positionIcon}
                            </button>
                        </div>
                    </div>`;
    }
    tableContentResultsByThesis += `</div> <!-- col (Partei-Antworten) -->
            </div> <!-- row (Partei-Antworten) -->
            </div> <!-- row Fragen -->
            `;
  } // end if

  tableContentResultsByThesis += `</div> <!-- col -->
    </div> <!-- row -->`;

  // Daten in Browser schreiben
  $("#resultsByThesis").append(tableContentResultsByThesis);

  for (let i = 0; i < intQuestions; i++) {
    document
      .querySelector(`#resultsByThesisQuestion${i} .nonexpanded`)
      .addEventListener("click", () => {
        function handleFullscreenPartyAnswerList() {
          const containerQuestion = document.querySelector(
            `#resultsByThesisQuestion${i}Container`
          );
          const questionTextContainer = document.querySelector(
            `#resultsByThesisQuestion${i}`
          );
          if (btnExpand.classList.contains("expanded")) {
            containerQuestion.scrollIntoView({ behavior: "smooth" });
            const wrapperDiv = document.createElement("div");
            wrapperDiv.classList.add("fullscreen-on-mobile-overlay");
            containerQuestion.classList.add("fullscreen-on-mobile-content");
            questionTextContainer.classList.add("fullscreen-on-mobile-header");

            setTimeout(() => {
              // Wait for toggle animation to be finished
              containerQuestion.parentNode.insertBefore(
                wrapperDiv,
                containerQuestion
              );
              wrapperDiv.appendChild(containerQuestion);
              document.body.style.overflow = "hidden";
              // The questionTextContainer is fixed at the top; the answers list must be pushed down accordingly
              const heightOfQuestionTextContainer = window.getComputedStyle(
                questionTextContainer
              ).height;
              questionTextContainer.nextElementSibling.style.marginTop = `${
                +heightOfQuestionTextContainer.replace("px", "") + 10
              }px`;
              const btnClose = document.createElement("button");
              btnClose.innerHTML = TEXT_BUTTON_CLOSE_FULLSCREEN_EVENT_DETAILS;
              btnClose.addEventListener("click", () => {
                btnExpand.click();
              });
              containerQuestion.parentNode.appendChild(btnClose);
              btnClose.classList.add(
                "fullscreen-on-mobile-btn-close",
                "off-screen"
              );
              setTimeout(() => {
                btnClose.classList.remove("off-screen");
              }, 0);
            }, 450);
          } else {
            const wrapperDiv = containerQuestion.parentNode;
            wrapperDiv.parentNode.insertBefore(containerQuestion, wrapperDiv);
            wrapperDiv.remove();
            containerQuestion.classList.remove("fullscreen-on-mobile-content");
            questionTextContainer.classList.remove(
              "fullscreen-on-mobile-header"
            );
            questionTextContainer.nextElementSibling.style.marginTop = "0";
            document.body.style.overflow = "unset";
            containerQuestion.scrollIntoView({ behavior: "smooth" });
          }
        }
        if (window.innerWidth > 768) {
          // Close answer list that is currently open
          document
            .querySelector(
              `#resultsByThesisTable .expanded:not(#resultsByThesisQuestion${i}collapse)`
            )
            ?.click();
        }
        const btnExpand = document.querySelector(
          `#resultsByThesisQuestion${i} .nonexpanded`
        );
        $(`#resultsByThesisAnswersToQuestion${i}`).toggle(400);
        btnExpand.classList.toggle("expanded");
        if (btnExpand.classList.contains("expanded")) {
          btnExpand.innerHTML = TEXT_HIDE_THESIS_ANSWERS; // MINUS
        } else {
          btnExpand.innerHTML = TEXT_SHOW_THESIS_ANSWERS; // PLUS
        }
        if (window.innerWidth <= 768) handleFullscreenPartyAnswerList();
      });

    // am Anfang die Antworten ausblenden
    //		$("#resultsByThesisAnswersToQuestion"+i).fadeOut(500);	// irgendwie verrutschen die Zeilen bei fadeOut() -> deshalb die css()-Lösung
    $(`#resultsByThesisAnswersToQuestion${i}`).css("display", "none");
  }

  // Nach jedem Klick auf einen Button den Fokus wieder entfernen, um bleibende Hervorhebungen (Unterstreichungen) zu vermeiden
  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      document.activeElement.blur();
    });
  });

  (function checkIfResultsChange() {
    setTimeout(
      () => {
        const nodelistResultChangingButtons = document.querySelectorAll(
          "[id^='checkbox-voting-double']"
        );
        nodelistResultChangingButtons.forEach((btn) => {
          btn.addEventListener("click", showOrHighlightBtnRefresh);
        });
      },
      isActivated("addon_custom_voting_buttons.js") ? 500 : 0 // If there are custom buttons, wait for the addon file to exchange the selfPosition buttons before assigning the event listener
    );

    // In iframe, position:fixed does not work, because from the viewpoint of the iframe page, the window is much larger than the actual users' screen
    // This workaround positions the button at the actual button of the users' screen
    // if (
    //   addons.some((item) => item.includes("addon_check_iframe_resize_client.js"))
    // ) {
    //   // The addon_check_iframe_resize_host.js sends message with all required values from parent window whenever it's scrolled
    //   window.addEventListener("message", (event) => {
    //     if (
    //       !(btnRefresh = document.querySelector("#btn-see-updated-results")) ||
    //       event.data.type !== "scroll"
    //     )
    //       return;
    //     btnRefresh.style.bottom = "unset"; // Without iframe, the button is positioned with "bottom"; here, we use "top"
    //     const scrollYRelativeToIframe =
    //       event.data.scrollY - event.data.distanceDocTopToIframe;
    //     const viewportBottomRelativeToIframe =
    //       scrollYRelativeToIframe + event.data.viewportHeight;
    //     let valueOfCssPropertyTop = viewportBottomRelativeToIframe - 60;
    //     valueOfCssPropertyTop = Math.max(300, valueOfCssPropertyTop);
    //     valueOfCssPropertyTop = Math.min(
    //       window.innerHeight - 150,
    //       valueOfCssPropertyTop
    //     );
    //     btnRefresh.style.top = valueOfCssPropertyTop + "px";
    //   });
    // }
  })();
}

function generateSectionResults(arResults) {
  function addContentToInfoTab() {
    function showLegalBtnsOnlyInInfoTab() {
      const legalBtns = document.querySelectorAll("#privacy, #imprint");
      legalBtns.forEach((node) => {
        node.classList.add("d-none");
      });
      setTimeout(() => {
        // Wait for navigation bar to be created and appended
        document.querySelectorAll("#navigationBar button").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (btn.getAttribute("id") === "infoTabBtn") {
              legalBtns.forEach((node) => {
                node.classList.remove("d-none");
              });
            } else {
              legalBtns.forEach((node) => {
                node.classList.add("d-none");
              });
            }
          });
        });
      }, 300);
    }
    document.querySelector(
      "#infoHeading"
    ).innerHTML = `<h1>${TEXT_INFO_HEADING}</h1><h2>${TEXT_INFO_SUBHEADING}</h2>`;

    document.querySelector("#infoText").innerHTML = textInfoBox;

    showLegalBtnsOnlyInInfoTab();
  }
  function createNavigationBar() {
    function animateTabs(arTabs, oldActiveTab, newActiveTab) {
      const idOldActiveTab = oldActiveTab.getAttribute("id");
      const indexOldActiveTab = arTabs.findIndex(
        (obj) => obj.id === idOldActiveTab
      );
      const idNewActiveTab = newActiveTab.getAttribute("id");
      const indexNewActiveTab = arTabs.findIndex(
        (obj) => obj.id === idNewActiveTab
      );
      const goRight = indexOldActiveTab < indexNewActiveTab;

      oldActiveTab.classList.add(goRight ? "flyOutLeft" : "flyOutRight");
      setTimeout(() => {
        oldActiveTab.classList.replace("activeTab", "d-none");
        oldActiveTab.classList.remove(goRight ? "flyOutLeft" : "flyOutRight");
        newActiveTab.classList.add(goRight ? "flyInRight" : "flyInLeft");
        newActiveTab.classList.replace("d-none", "activeTab");
      }, 350);
      setTimeout(() => {
        newActiveTab.classList.remove(goRight ? "flyInRight" : "flyInLeft");
      }, 700);
    }
    function highlightFilterIcon() {
      const filterIcon = navigationBar.querySelector("#filtersTabBtn i");
      filterIcon.classList.add("bx-tada");
      setTimeout(() => {
        filterIcon.classList.remove("bx-tada");
      }, 1500);
    }

    const navigationBar = document.createElement("div");
    navigationBar.setAttribute("id", "navigationBar");
    const arTabsNavigationBar = [
      {
        icon: "bx-slider-alt",
        id: "finetuning",
        tooltip: "Finetuning",
      },
      {
        icon: "bx-trophy",
        id: "results",
        tooltip: "Results",
      },
      {
        icon: "bx-share-alt",
        id: "shareAndSave",
        tooltip: "Share & Save",
      },
      {
        icon: "bx-info-circle",
        id: "info",
        tooltip: "About",
      },
    ];
    if (isActivated("addon_filter_results.js"))
      arTabsNavigationBar.splice(1, 0, {
        icon: "bx-filter-alt",
        id: "filters",
        tooltip: "Filter",
      });

    arTabsNavigationBar.forEach((tab) => {
      const tabBtnContainer = document.createElement("div");
      tabBtnContainer.setAttribute("id", `${tab.id}TabBtnContainer`);
      tabBtnContainer.innerHTML = `
      <button
        id='${tab.id}TabBtn'
        class="title-on-hover ${tab.id === "results" ? "activeTabBtn" : ""}"
        type="button" data-tooltip="${tab.tooltip}"
      ><i class='bx ${tab.icon}'></i></button>`;

      tabBtnContainer.addEventListener("click", () => {
        const oldActiveTab = document.querySelector(".activeTab");
        const newActiveTab = document.querySelector(`#${tab.id}`);
        if (oldActiveTab === newActiveTab) return;
        animateTabs(arTabsNavigationBar, oldActiveTab, newActiveTab);
        document
          .querySelector("#navigationBar .activeTabBtn")
          .classList.remove("activeTabBtn");
        document
          .querySelector(`#navigationBar .${tab.icon}`)
          .parentNode.classList.add("activeTabBtn");
      });
      navigationBar.appendChild(tabBtnContainer);
    });

    if (isActivated("addon_filter_results.js") && HIGHLIGHT_FILTER_ICON) {
      const intervalId = setInterval(highlightFilterIcon, 10000);
      navigationBar
        .querySelector("#filtersTabBtn")
        .addEventListener("click", () => {
          clearInterval(intervalId);
        });
    }

    if (
      highlightResultsTabBtnOfNavigationBar &&
      arTabsNavigationBar.length % 2 === 1
    ) {
      navigationBar
        .querySelector("#resultsTabBtnContainer")
        .classList.add("highlightedTabBtn");
    }
    document.querySelector("#sectionResults").appendChild(navigationBar);
    circulateSharingAndSavingIcon();
  }
  document.querySelector("#sectionShowQuestions").remove();
  createNavigationBar();
  addContentToResultsTab();
  addContentToFinetuningTab();
  for (let i = 0; i < intQuestions; i++) {
    document.querySelectorAll(`.selfPosition${i}`).forEach((dropdown) => {
      dropdown.value = arPersonalPositions[i];
    });
    if (arPersonalPositions[i] === 99)
      document
        .querySelector(`#voting-double-container-question${i}`)
        .classList.add("d-none");
  }
  addContentToInfoTab();

  document.querySelector("#sectionResults").style.display = "block";
}

function circulateSharingAndSavingIcon() {
  const initialIcon = document.querySelector("#shareAndSaveTabBtn i");
  const newIcon = initialIcon.cloneNode();
  const btn = initialIcon.parentNode;
  initialIcon.classList.add("currentIcon");
  btn.style.position = "relative";
  newIcon.classList.replace("bx-share-alt", "bx-save");
  newIcon.style.position = "absolute";
  newIcon.classList.add("invisible");
  btn.appendChild(newIcon);

  function swapIcons() {
    const rectInitialIcon = initialIcon.getBoundingClientRect();
    const rectBtn = btn.getBoundingClientRect();
    newIcon.style.left = `${rectInitialIcon.left - rectBtn.left}px`;
    newIcon.style.top = `${rectInitialIcon.top - rectBtn.top}px`;
    const currentIcon = document.querySelector(".currentIcon");
    const otherIcon = document.querySelector(
      "#shareAndSaveTabBtn i:not(.currentIcon)"
    );
    const direction = currentIcon.classList.contains("bx-share-alt")
      ? "Top"
      : "Bottom";
    currentIcon.classList.replace("currentIcon", `fadeOut${direction}`);
    otherIcon.classList.replace("invisible", `fadeIn${direction}`);
    setTimeout(() => {
      currentIcon.classList.replace(`fadeOut${direction}`, "invisible");
      otherIcon.classList.replace(`fadeIn${direction}`, "currentIcon");
    }, 350);
  }

  setInterval(swapIcons, 8000);
}

// Anzeige der Ergebnisse - detailliert, Fragen und Antworten der Parteien
// Array arResults kommt von fnEvaluation
// end function

// 02/2015 BenKob
// Aktualisierung der Ergebnisse in der oberen Ergebnistabelle (short)
// Aufruf heraus in:
// (a) generateSectionResults() nach dem Aufbau der oberen Tabelle
// (b) in den Buttons in der detaillierten Auswertung (fnToggleSelfPosition() und fnToggleDouble())
function fnReEvaluate() {
  //Ergebniss neu auswerten und Anzeige aktualisieren
  arResults = fnEvaluation();

  //Anzahl der Maximalpunkte ermitteln
  const maxPoints = calculateMaxPoints();
  //	for (i = 0; i <= (arPartyFiles.length-1); i++)
  for (i = 0; i <= intParties - 1; i++) {
    var percent = fnPercentage(arResults[i], maxPoints);

    // bis v.0.3 mit PNG-Bildern, danach mit farblicher Bootstrap-Progressbar
    var barImage = fnBarImage(percent);

    // neu ab v.0.3 - Bootstrap-Progressbar
    $(`#partyBar${i}`).width(`${percent}%`);
    // $(`#partyBar${i}`).text(`${percent}% (${arResults[i]} / ${maxPoints})`);
    $(`#partyBar${i}`).text(`${percent}%`);
    $(`#partyBar${i}`)
      .removeClass("bg-success bg-warning bg-danger")
      .addClass(barImage);

    $(`#partyPoints${i}`).html(`${arResults[i]}/${maxPoints}`);
  }
}

function showOrHighlightBtnRefresh() {
  if (
    document
      .querySelector("#resultsTabBtn")
      .classList.contains("reload-results")
  )
    return;

  document.querySelector("#resultsTabBtn").addEventListener("click", () => {
    fnReEvaluate();
    for (i = 0; i < intParties; i++) {
      arSortParties[i] = i;
    }
    arSortParties.sort((a, b) => arResults[b] - arResults[a]);
    arSortParties.forEach((num) => {
      document
        .querySelector("#resultsShortTable .col")
        .appendChild(document.querySelector(`#resultsShortPartyClamp${num}`));
    });
    document
      .querySelectorAll("[id^='resultsByThesisAnswersToQuestion']")
      .forEach((table) => {
        arSortParties.forEach((num) => {
          table
            .querySelector(".col")
            .appendChild(table.querySelector(`.result${num}`));
        });
      });
    sendMessageToLimitResultsAddon();
    document.querySelector("#resultsTabBtn").classList.remove("reload-results");
  });
  document.querySelector("#resultsTabBtn").classList.add("reload-results");

  if (document.querySelector("#btn-see-updated-results")) return;
  const btnRefresh = document.createElement("button");
  btnRefresh.setAttribute("id", "btn-see-updated-results");
  btnRefresh.classList.add(
    "btn",
    "btn-secondary",
    "flex-center",
    "off-screen",
    "btn-above-navbar"
  );
  btnRefresh.innerHTML =
    REFRESH_BUTTON_TEXT !== undefined
      ? REFRESH_BUTTON_TEXT
      : "&#8634; Ranking aktualisieren";
  btnRefresh.addEventListener("click", () => {
    document.querySelector("#resultsTabBtn").click();
  });
  document.querySelector("#resultsTabBtn").addEventListener("click", () => {
    btnRefresh.remove();
  });

  document.querySelector("#sectionResults").appendChild(btnRefresh);
  setTimeout(() => {
    btnRefresh.classList.remove("off-screen");
  }, 100);
  if (
    addons.some((item) => item.includes("addon_check_iframe_resize_client.js"))
  ) {
    // In iframe, the button is (re-)positioned whenever the parent window scrolls
    // This must happen as soon as the button is created
    // Message is listened to by addon_check_iframe_resize_host.js, sends scroll event with position values back
    parent.postMessage(["triggerScrollEvent", null], "*");
  }
}

function showModalResultDetails(i) {
  let nodeModal = document.querySelector(`#modal-result-details`);
  if (!nodeModal) {
    nodeModal = document.createElement("div");
    nodeModal.classList.add("modal", "fade");
    nodeModal.setAttribute("id", `modal-result-details`);
    nodeModal.setAttribute("role", "dialog");
    nodeModal.setAttribute("aria-modal", "true");
    nodeModal.setAttribute("tabindex", "-1");
    let divContent = `
          <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                  <div class="modal-header">
                      <h2>${HEADING_MODAL_RESULT_DETAILS_FINETUNING}</h2>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                      </button>
                  </div>
                  <div class="modal-body">

                  </div>
                  <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">
                  ${TEXT_BTN_CLOSE_MODAL_RESULT_DETAILS_FINETUNING}
                  </button>
                </div>
              </div>
          </div>`;
    nodeModal.innerHTML = divContent;
    document.body.append(nodeModal);
  }
  document.querySelector("#modal-result-details .modal-body").innerHTML =
    document.querySelector(`#resultsShortPartyClamp${i}`).innerHTML;
  $(`#modal-result-details`).modal("show");
}
