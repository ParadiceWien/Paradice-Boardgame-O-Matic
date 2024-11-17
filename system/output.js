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
  $("#votingDouble").html(TEXT_VOTING_DOUBLE);

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
  //	$("#keepStatsQuestion").empty();
  $("#statisticsModalLabel").html(TEXT_ALLOW_STATISTIC_TITLE);
  $("#statisticsModalBody").html(TEXT_ALLOW_STATISTIC_TEXT);
  $("#statisticsModalButtonNo").html(TEXT_ALLOW_STATISTIC_NO);
  $("#statisticsModalButtonYes").html(TEXT_ALLOW_STATISTIC_YES);

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

  // arVotingDouble initialisieren
  /* for (let i = 0; i < intQuestions; i++) {
    arVotingDouble[i] = false;
    arPersonalPositions[i] = 99;
  } */
  $("#votingDouble").attr("checked", false);

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
      let questionTitle = "<h2>";
      questionTitle += showQuestionNumberOnCard
        ? `${questionNumber + 1}/${intQuestions}: `
        : "";
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
    $("#votingDouble").attr("checked", arVotingDouble[questionNumber]);
    // Button nur zuruecksetzen, wenn Frage nicht doppelt gewertet (relevant fürs Zurückspringen)
    if (!arVotingDouble[questionNumber])
      $("#votingDouble").removeClass("btn-dark").addClass("btn-outline-dark");
    else
      $("#votingDouble").addClass("btn-dark").removeClass("btn-outline-dark");
  }

  // Alle Fragen durchgelaufen -> Auswertung
  else {
    if (isActivated("addon_custom_voting_buttons.js")) {
      CUSTOM_POSITION_BUTTONS.forEach((questionWithCustomButtons) => {
        if (questionWithCustomButtons.isYesOrDontCareQuestion) {
          const correspondingQuestion =
            questionWithCustomButtons.questionNr - 1;
          if (arPersonalPositions[correspondingQuestion] === -1)
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
  strBtnSrc = $("#votingDouble").hasClass("btn-outline-dark");

  if (strBtnSrc) {
    // wenn vorher unwichtig -> jetzt doppelt werten
    $("#votingDouble").removeClass("btn-outline-dark").addClass("btn-dark");
    $(`#jumpToQuestionNr${activeQuestion + 1}`).css("font-weight", "bold");
  }
  // wenn vorher wichtig -> jetzt wieder auf normal setzen
  else {
    $("#votingDouble").removeClass("btn-dark").addClass("btn-outline-dark");
    $(`#jumpToQuestionNr${activeQuestion + 1}`).css("font-weight", "normal");
  }
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
      $(`#jumpToQuestionNr${i}`).css("font-weight", "bold");
    }
  }
}

// Anzeige der Ergebnisse - zusammengefasst (Prozentwerte) - nur Parteien
// Array arResults kommt von fnEvaluation
function generateSectionResults(arResults) {
  function addContentToResultsTab() {
    document.querySelector(
      "#resultsHeading"
    ).innerHTML = `<h1>${TEXT_RESULTS_HEADING}</h1><h2>${TEXT_RESULTS_SUBHEADING}</h2>`;

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
    <div class='col col-2 col-md-1' role='cell'>
      <img src='${
        arPartyLogosImg[partyNum]
      }' class='rounded img-fluid' alt='Logo ${arPartyNamesLong[partyNum]}' />
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
    <div id='resultsShortPartyDescription${partyNum}'>
    <br /> 
    <span id="internet-above-description"><a href='https://boardgamegeek.com/boardgame/${
      arPartyNamesShort[partyNum]
    }' target='_blank' class='flex-center' alt='Link: ${
        arPartyNamesLong[partyNum]
      }'
              title='Link: ${arPartyNamesLong[partyNum]}'>
              ${TEXT_LINK_TO_EXTERNAL_PAGE}</a>
    <br / ></span>
        ${arPartyDescription[partyNum] ? arPartyDescription[partyNum] : null}
    <br /> 
    <span id="internet-below-description"><a href='https://boardgamegeek.com/boardgame/${
      arPartyNamesShort[partyNum]
    }' target='_blank'  class='flex-center' alt='Link: ${
        arPartyNamesLong[partyNum]
      }'
              title='Link: ${arPartyNamesLong[partyNum]}'>
              ${TEXT_LINK_TO_EXTERNAL_PAGE}</a>
    <br / ></span>
    </div>
    <div id="containerForAddonGeneratedElements"></div>
    <div style='text-align: center; width: 100%;'>
    <button id='resultsByPartyAnswers${partyNum}collapse' class='nonexpanded btn btn-sm btn-outline-secondary' type='button'>
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
                <div class='row mow-row-striped' role='row'>
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
          arPersonalPositions[modulo]
        );
        var positionText = fnTransformPositionToText(
          arPersonalPositions[modulo]
        );

        tableContentResultsShort += `<div class='col col-4 col-md-2' id='selfPositionContainer${modulo}' role='cell'>
                      <button type='button' id='' class='btn ${positionButton} btn-sm selfPosition${modulo}' 
                              onclick='fnToggleSelfPosition(${modulo})' alt='${TEXT_ANSWER_USER} : ${positionText}'
                              title='${TEXT_ANSWER_USER} : ${positionText}' data-value='${arPersonalPositions[modulo]}'>
                          ${positionIcon}
                      </button>
                  </div>`;

        // 3./4 Zellen - Icons für Postion der Parteien [+] [0] [-]
        var positionIcon = fnTransformPositionToIcon(arPartyPositions[j]);
        var positionButton = fnTransformPositionToButton(arPartyPositions[j]);
        var positionText = fnTransformPositionToText(arPartyPositions[j]);

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
          </div> <!-- end span resultsShortPartyDetails -->
        </div> <!-- end: row .mow-row-striped + #resultsShortPartyClampX -->
    </div> <!-- row #resultsShortPartyX -->`;
    } // end for
    tableContentResultsShort += `</div>
  </div> <!-- end: col (resultsShortTable) -->
</div> <!-- end: row (resultsShortTable) -->`;

    // Daten in Browser schreiben
    document.querySelector("#resultsShort").innerHTML =
      tableContentResultsShort;

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

    // Funktion zur Berechnung der "Doppelten Wertung" aufrufen
    // -> enthält Aufruf für farbliche Progressbar (muss hier ja nicht extra wiederholt werden)
    fnReEvaluate();

    for (let i = 0; i < intParties; i++) {
      const btnExpandDetailsForThisParty = document.querySelector(
        `#resultsShortPartyDescriptionButton${i}`
      );
      btnExpandDetailsForThisParty.addEventListener("click", () => {
        $(`#resultsShortPartyDetails${i}`).toggle(500);

        btnExpandDetailsForThisParty.classList.toggle("expanded");

        if (btnExpandDetailsForThisParty.classList.contains("expanded")) {
          btnExpandDetailsForThisParty.innerHTML = TEXT_HIDE_PARTY_DESCRIPTION; // MINUS
        } else {
          btnExpandDetailsForThisParty.innerHTML = TEXT_SHOW_PARTY_DESCRIPTION; // PLUS

          // If the details are closed and the answers were expanded, collapse the answers
          const btnCollapseAnswersOfThisParty = document.querySelector(
            `#resultsByPartyAnswers${i}collapse`
          );
          if (btnCollapseAnswersOfThisParty.classList.contains("expanded"))
            btnCollapseAnswersOfThisParty.click();
        }
      });

      $(`#resultsByPartyAnswersToQuestion${i}`).hide(500);

      // am Anfang die Antworten ausblenden
      $(`#resultsShortPartyDetails${i}`).fadeOut(0);
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
      var positionIcon = fnTransformPositionToIcon(arPersonalPositions[i]);
      var positionText = fnTransformPositionToText(arPersonalPositions[i]);

      tableContentResultsByThesis += `<div class='row border' id='resultsByThesisQuestion${i}Container' role='row'>
                  <div class='col' id='resultsByThesisQuestion${i}' role='cell'>
                  
                      <div id='resultsByThesisQuestion${i}Text'>
                          <strong>${i + 1}. ${arQuestionsShort[i]}</strong>: ${
        arQuestionsLong[i]
      }
                      </div>

                      <div id='resultsByThesisQuestion${i}PersonalPosition'>
                      <small>${TEXT_ANSWER_USER}: </small><button type='button' id='' class='btn ${positionButton} btn-sm selfPosition${i}' onclick='fnToggleSelfPosition(${i})' 
                              alt='${TEXT_ANSWER_USER} : ${positionText}' title='${TEXT_ANSWER_USER} : ${positionText}' data-value="${
        arPersonalPositions[i]
      }">
                          ${positionIcon}
                      </button>
                      <button type='button'  id='doubleIcon${i}'
                            onclick='fnToggleDouble(${i})' 
     ${
       arVotingDouble[i]
         ? `class='btn btn-sm btn-dark' title='${TEXT_ANSWER_DOUBLE}'>x2`
         : `class='btn btn-sm btn-outline-dark' title='${TEXT_ANSWER_NORMAL}'>x1`
     }
                    
                      </button>
                  </div>

                      <button id='resultsByThesisQuestion${i}collapse' class='nonexpanded btn btn-sm btn-outline-secondary flex-center' type='button'>
                          ${TEXT_SHOW_THESIS_ANSWERS}
                      </button>
                  </div>
                 

              <!-- darunterliegende Zeile - Parteipositionen anzeigen -->
              <div class='row border rounded' id='resultsByThesisAnswersToQuestion${i}'>
                  <div class='col'>`;

      // darunterliegende Zeile - Parteipositionen anzeigen
      for (j = 0; j < intParties; j++) {
        var partyNum = arSortParties[j];
        var partyPositionsRow = partyNum * intQuestions + i;
        var positionButton = fnTransformPositionToButton(
          arPartyPositions[partyPositionsRow]
        );
        var positionIcon = fnTransformPositionToIcon(
          arPartyPositions[partyPositionsRow]
        );
        var positionText = fnTransformPositionToText(
          arPartyPositions[partyPositionsRow]
        );

        // Inhalt der Zelle
        tableContentResultsByThesis += `<div class='row mow-row-striped row-with-one-result' role='row'>
  
                          <div class='w-50 d-flex align-items-center' role='cell'>
                              <small><strong>${arPartyNamesLong[
                                partyNum
                              ].replace(
                                / <small>.*?<\/small>/,
                                ""
                              )}: </strong></small>${
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
          $(`#resultsByThesisAnswersToQuestion${i}`).toggle(200);

          function makePartyAnswerListFullscreenOnMobile() {
            function addClosingButton() {
              const btnClose = document.createElement("button");
              btnClose.innerHTML = TEXT_BUTTON_CLOSE_FULLSCREEN_EVENT_DETAILS;
              btnClose.addEventListener("click", () => {
                btnExpand.click();
              });
              sectionQuestion.parentNode.appendChild(btnClose);
              btnClose.classList.add(
                "fullscreen-on-mobile-btn-close",
                "fullscreen-on-mobile-btn-close-out-of-screen"
              );
              setTimeout(() => {
                btnClose.classList.remove(
                  "fullscreen-on-mobile-btn-close-out-of-screen"
                );
              }, 10);
            }

            sectionQuestion.scrollIntoView({ behavior: "smooth" });
            const wrapperDiv = document.createElement("div");
            wrapperDiv.classList.add("fullscreen-on-mobile-overlay");
            sectionQuestion.classList.add("fullscreen-on-mobile-content");
            questionTextContainer.classList.add("fullscreen-on-mobile-header");
            const heightOfQuestionTextContainer = window.getComputedStyle(
              questionTextContainer
            ).height;
            console.log(heightOfQuestionTextContainer);
            console.log(
              +heightOfQuestionTextContainer.replace("px", "") + 10 + "px"
            );

            console.log(questionTextContainer.nextElementSibling);
            setTimeout(() => {
              sectionQuestion.parentNode.insertBefore(
                wrapperDiv,
                sectionQuestion
              );
              wrapperDiv.appendChild(sectionQuestion);
              document.body.style.overflow = "hidden";
              questionTextContainer.nextElementSibling.style.margin = `${
                +heightOfQuestionTextContainer.replace("px", "") + 10
              }px auto 0 auto`;
              addClosingButton();
            }, 300);
          }
          function closeFullscreenPartyAnswerListOnMobile() {
            console.log("hey");
            const wrapperDiv = sectionQuestion.parentNode;
            wrapperDiv.parentNode.insertBefore(sectionQuestion, wrapperDiv);
            wrapperDiv.remove();
            sectionQuestion.classList.remove("fullscreen-on-mobile-content");
            questionTextContainer.classList.remove(
              "fullscreen-on-mobile-header"
            );
            questionTextContainer.nextElementSibling.style.marginTop = "0";
            document.body.style.overflow = "unset";
            sectionQuestion.scrollIntoView({ behavior: "smooth" });
          }
          const sectionQuestion = document.querySelector(
            `#resultsByThesisQuestion${i}Container`
          );
          const btnExpand = document.querySelector(
            `#resultsByThesisQuestion${i} .nonexpanded`
          );
          const questionTextContainer = document.querySelector(
            `#resultsByThesisQuestion${i}`
          );
          btnExpand.classList.toggle("expanded");
          if (btnExpand.classList.contains("expanded")) {
            btnExpand.innerHTML = TEXT_HIDE_THESIS_ANSWERS; // MINUS
            if (window.innerWidth <= 768)
              makePartyAnswerListFullscreenOnMobile();
          } else {
            btnExpand.innerHTML = TEXT_SHOW_THESIS_ANSWERS; // PLUS
            if (window.innerWidth <= 768)
              closeFullscreenPartyAnswerListOnMobile();
          }
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
  }
  function addContentToInfoTab() {
    document.querySelector(
      "#infoHeading"
    ).innerHTML = `<h1>${TEXT_INFO_HEADING}</h1><h2>${TEXT_INFO_SUBHEADING}</h2>`;

    document.querySelector("#info .col").innerHTML = textInfoBox;
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

    const navigationBar = document.createElement("div");
    navigationBar.setAttribute("id", "navigationBar");
    const arTabsNavigationBar = [
      {
        icon: "bx-slider-alt",
        id: "finetuning",
      },
      {
        icon: "bx-trophy",
        id: "results",
      },
      {
        icon: "bx-share-alt",
        id: "shareAndSave",
      },
      {
        icon: "bx-info-circle",
        id: "info",
      },
    ];
    if (isActivated("addon_filter_results.js"))
      arTabsNavigationBar.splice(1, 0, {
        icon: "bx-filter-alt",
        id: "filters",
      });

    arTabsNavigationBar.forEach((tab) => {
      const tabBtnContainer = document.createElement("div");
      tabBtnContainer.setAttribute("id", `${tab.id}TabBtnContainer`);
      tabBtnContainer.innerHTML = `<button id='${tab.id}TabBtn' ${
        tab.id === "results" ? "class='activeTabBtn'" : ""
      }><i class='bx ${tab.icon}'></i></button>`;

      tabBtnContainer.addEventListener("click", () => {
        const oldActiveTab = document.querySelector(".activeTab");
        const newActiveTab = document.querySelector(`#${tab.id}`);
        if (oldActiveTab === newActiveTab) return;
        animateTabs(arTabsNavigationBar, oldActiveTab, newActiveTab);
        document
          .querySelector(".activeTabBtn")
          .classList.remove("activeTabBtn");
        document
          .querySelector(`.${tab.icon}`)
          .parentNode.classList.add("activeTabBtn");
      });
      navigationBar.appendChild(tabBtnContainer);
    });
    document.body.appendChild(navigationBar);

    circulateSharingAndSavingIcon();
  }
  document.querySelector("#sectionShowQuestions").remove();
  addContentToResultsTab();
  addContentToFinetuningTab();
  addContentToInfoTab();
  createNavigationBar();
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
    }, 290);
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
