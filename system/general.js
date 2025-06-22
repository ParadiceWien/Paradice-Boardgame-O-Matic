// GENERAL.JS http://www.mat-o-wahl.de
// General functions / Allgemeine Verarbeitungen
// License: GPL 3
// Mathias Steudtner http://www.medienvilla.com

var version = "0.6.0.10.20230420";

// Globale Variablen
var arQuestionsShort = new Array(); // Kurzform der Fragen: Atomkraft, Flughafenausbau, ...
var arQuestionsLong = new Array(); // Langform der Frage: Soll der Flughafen ausgebaut werden?
const arQuestionsIcon = [];
const arIcons = ["&#x2716;", "&#x25EF;", "&#x2714;"];

var arPartyPositions = new Array(); // Position der Partei als Zahl aus den CSV-Dateien (1/0/-1)
var arPartyOpinions = new Array(); // Begründung der Parteien aus den CSV-Dateien
var arPersonalPositions = new Array(); // eigene Position als Zahl (1/0/-1)
var arVotingDouble = new Array(); // eigene Position als Zahl (2/1/0/-1/-2)

// var arPartyFiles = new Array();		// Liste mit den Dateinamen der Parteipositionen
var arPartyNamesShort = new Array(); // Namen der Parteien - kurz
var arPartyNamesLong = new Array(); // Namen der Parteien - lang
var arPartyDescription = new Array(); // Beschreibung der Datei
var arPartyInternet = new Array(); // Internetseiten der Parteien
var arPartyLogosImg = new Array(); // Logos der Parteien

var arSortParties = new Array(); // Nummern der Listen, nach Punkten sortiert

var activeQuestion = 0; //aktuell angezeigte Frage (output.js)
let intParties = 0;

// Einlesen der CSV-Datei und Weitergabe an Rückgabefunktion "fnCallback"
function fnReadCsv(csvFile, fnCallback) {
   // http://michaelsoriano.com/working-with-jquerys-ajax-promises-and-deferred-objects/
   $.ajax({
      type: "GET",
      url: csvFile,
      dataType: "text",
      contentType: "application/x-www-form-urlencoded",
      error: function (objXML, textStatus, errorThrown) {
         console.log(
            "Mat-O-Wahl ERROR - Reading CSV-file \n Code - objXML-Status: " +
               objXML.status +
               " \n Code - textStatus: " +
               textStatus +
               " \n Code - errorThrown: " +
               errorThrown +
               " \n Name and folder of CSV-file should be: " +
               csvFile +
               " \n\nPossible solutions: Check for capital letters? OR check the extension of the file (csv / xls / xlsx)? OR is the file in the wrong folder? OR are you working on a local machine :( instead of a server? See documentation on www.mat-o-wahl.de"
         );
         // document.getElementById("descriptionAddonTop").innerHTML("nanu. Da ist etwas schief gegangen.")
         $("#descriptionExplanation")
            .css("color", "red")
            .css("font-size", "150%");
         text =
            "<p>Nanu? Da ist etwas schief gegangen. Einige Dateien konnten nicht geladen werden. <br /> Sind Sie ein Besucher der Seite? Dann geben Sie bitte dem Administrator der Webseite Bescheid. <br /> Sind Sie der Administrator? Dann schauen Sie bitte in die Browser-Konsole (Strg+Umschalt+i) und/oder öffnen Sie die <q>quicktest.html</q>.</p>";
         text +=
            "<p>Oh? Something went wrong. Some files couldn't be loaded. <br /> Are you a visitor of this site? Please inform the admin of the site. <br /> Are you the admin? Please check the browser-console (Ctrl+Shift+i) and/or open <q>quicktest.html</q>.</p>";
         $("#descriptionExplanation").html(text);
      },
   })
      .done(function (data) {
         // console.log('success', data)
         console.log("Mat-o-Wahl load: " + csvFile);
         fnCallback(data);
      })
      .fail(function (xhr) {
         console.log("Mat-O-Wahl file error - ", xhr);
      });
}

// Zahl der Parteien dynamisch berechnen, anstatt sie in der definition.js anzugeben
function fnSetIntParties(data) {
   let arIntParties = data.split("\n");
   // Falls die fileAnswers (und damit der Array) mit leeren Zeilen endet, diese entfernen
   while (true) {
      if (
         arIntParties[arIntParties.length - 1] === "" ||
         arIntParties[arIntParties.length - 1] === "\r"
      ) {
         arIntParties.pop();
      } else break;
   }
   // Ergebnis runden, um Fehlertoleranz zu erhöhen
   return Math.round(arIntParties.length / (intQuestions + 6));
}

// Anzeige der Fragen (aus fnStart())
function fnShowQuestions(csvData) {
   // Einlesen der Fragen ...
   // fnSplitLines(csvData,1);
   fnTransformCsvToArray(csvData, 1);

   // ... und Anzeigen
   var questionNumber = -1;

   // v.0.6 - deaktiviert, da nun am Anfang ein Willkommensbildschirm erscheint.
   // neu: fnHideWelcomeMessage()
   // fnShowQuestionNumber(questionNumber);
}

// Einlesen der Parteipositionen und Partei-Informationen (aus fnStart())
function fnReadPositions(csvData) {
   // Einlesen der Parteipositionen und Vergleichen
   // fnSplitLines(csvData,0);
   intParties = fnSetIntParties(csvData);
   fnTransformCsvToArray(csvData, 0);
}

// Auswertung (Berechnung)
// Gibt ein Array "arResults" zurück für fnEvaluationShort(), fnEvaluationByThesis(), fnEvaluationByParty() und fnReEvaluate();
// Aufruf am Ende aller Fragen in fnShowQuestionNumber() und beim Prüfen auf die "doppelte Wertung" in fnReEvaluate()
function fnEvaluation() {
   // Abstimmungsknöpfe u.a. entfernen
   $("#sectionDescription").empty().hide();
   $("#sectionShowQuestions").empty().hide();
   $("#sectionVotingButtons").empty().hide();
   $("#sectionNavigation").empty().hide();

   $("#keepStats").hide();

   var indexPartyInArray = -1; // Berechnung der Position des Index der aktuellen Partei
   let positionsMatch = 0; // Zaehler fuer gemeinsame Positionen

   var arResults = [];

   // Vergleichen der Positionen (= Fragen x Parteien)
   for (let i = 0; i <= arPartyPositions.length; i++) {
      // Einmal mehr ausführen als arPartyPositions.length, damit Ergebnis der letzten Partei noch in den Array gepushed wird
      const modulo = i % intQuestions; // 0=0,3,6,9 ; 1=1,4,7,10 ; 2=2,5,8,11
      if (modulo === 0) {
         // neue Partei in der Array-Liste?
         if (indexPartyInArray >= 0)
            // Teste auf größer/gleich null, da indexPartyInArray am Anfang ja -1 ist
            arResults[indexPartyInArray] = positionsMatch; // Pushe das Endergebnis der alten Partei in den Array
         indexPartyInArray++; // Mach weiter mit der neuen Partei
         positionsMatch = 0;
      }

      // Frage wurde nicht uebersprungen per SKIP oder JUMP QUESTION (99)
      if (arPersonalPositions[modulo] !== 99 && +arPartyPositions[i] !== 99) {
         const faktor = arVotingDouble[modulo] ? 2 : 1; // Faktor ist 1 normal und 2, wenn Frage doppelt gewertet werden soll

         const matchValue = calculateMatchValue(
            arPersonalPositions[modulo],
            arPartyPositions[i],
            modulo + 1
         );

         positionsMatch += matchValue * faktor; // Hälfte der Differenz wir
      } // end: Frage nicht uebersprungen
   } // end: for numberOfQuestions
   return arResults;
}

function calculateMatchValue(
   personalPosition,
   arPartyPosition,
   questionNumber
) {
   const positionsDifference = Math.abs(personalPosition - arPartyPosition); // Wenn Partei und User gleich geantwortet haben (z. B. 1&1), ist die Differenz 0

   let numberOfPositionOptionsForThisQuestion = 3;

   if (
      isActivated("addon_custom_voting_buttons.js") &&
      (correspondingCustomQuestion = CUSTOM_POSITION_BUTTONS.find(
         (obj) => obj.questionNr === questionNumber
      ))
   ) {
      numberOfPositionOptionsForThisQuestion =
         correspondingCustomQuestion.arButtonLabels?.length ?? 3;
   }

   const fullMatchValue = (numberOfPositionOptionsForThisQuestion - 1) / 2;
   // If there are 3 position options, a full match (1&1, 0&0, -1&-1) gives 1 point, half a match (1&0, 0&-1, ...) gives 0.5 points
   // With 5 position options, a full match (2&2, ...) gives 2 points, an almost-match (2&1, 1&0, ...) gives 1.5 points,
   //    half a match (2&0, 1&-1, ...) gives 1 point and so on

   const unadjustedActualMatch = fullMatchValue - positionsDifference / 2;

   // In case of a custom question with a more than 3 position options, the unadjustedActualMatch can at maximum be equal to fullMatchValue
   // In case of 5 options, this means it can be 2; in case of 7 questions, it can even be 3
   // Such questions with varying number of position options shall not be automatically double weighted (or triple weighted, respectively)
   // Therefore, the unadjustedActualMatch is divided by fullMatchValue so it can at maximum be 1 (just like for regular questions with 3 options)
   return unadjustedActualMatch / fullMatchValue;
}

// Senden der persoenlichen Ergebnisse an den Server (nach Einwilligung)
// Aufruf aus fnEvaluation()
function fnSendResults(arResults, arPersonalPositions) {
   // Korrektur der Parteiposition (-1,0,1) mit den Informationen aus der doppelten Wertung (-2,-1,0,1,2)
   // Marius Nisslmueller, Bad Honnef, Juni 2020
   // Bedingung für übersprungene Frage hinzugefügt
   arPersonalPositionsForStats = arPersonalPositions.slice(); // Damit arPersonalPositions nicht verändert wird
   for (let i = 0; i < arPersonalPositionsForStats.length; i++) {
      if (arVotingDouble[i] && arPersonalPositionsForStats[i] < 99) {
         arPersonalPositionsForStats[i] *= 2;
      }
   }

   var strResults = arResults.join(",");
   // var strPersonalPositions = arPersonalPositions.join(",");
   var strPersonalPositions = arPersonalPositionsForStats.join(",");

   $.get(statsServer, {
      mowpersonal: strPersonalPositions,
      mowparties: strResults,
   });

   console.log(
      "Mat-O-Wahl. Daten gesendet an Server: " +
         statsServer +
         " - mowpersonal: " +
         strPersonalPositions +
         " - mowparties: " +
         strResults +
         ""
   );
}

// Berechnet Prozentwerte
function fnPercentage(value, max) {
   var percent = (value * 100) / max;
   percent = Math.round(percent);
   return percent;
}

// v.0.3 NEU
// CSV-Daten in Array einlesen (aus fnShowQuestions() und fnReadPositions())
function fnTransformCsvToArray(csvData, modus) {

  var autoSeparator = ",";
  if (csvData.indexOf("\t") !== -1) {
    autoSeparator = "\t";
  } else if (csvData.indexOf(";") !== -1) {
    autoSeparator = ";";
  }

  arZeilen = $.csv.toArrays(csvData, { separator: autoSeparator });
  console.log("CSV-Separator erkannt:", autoSeparator);
  console.log("Erste Zeilen:", arZeilen.slice(0, 5));

  var numberOfLines = 6 + intQuestions;

  if (modus == 1) {
    lastLine = intQuestions;
  } else {
    lastLine = (5 + intQuestions + 1) * intParties - 1;
  }

  for (i = 0; i <= lastLine - 1; i++) {
    valueOne = arZeilen[i][0];
    valueTwo = arZeilen[i][1];
    valueThree = arZeilen[i][2];

    if (modus == 1) {
      arQuestionsShort.push(valueOne);
      arQuestionsLong.push(valueTwo);
      arQuestionsIcon.push(valueThree);
    } else {
      modulo = i % numberOfLines;

      if (modulo == 0 && valueTwo != "undefined") {
        arPartyNamesShort.push(valueTwo);
      } else if (modulo == 1 && valueTwo != "undefined") {
        arPartyNamesLong.push(valueTwo);
      } else if (modulo == 2 && valueTwo != "undefined") {
        arPartyDescription.push(valueTwo);
      } else if (modulo == 3 && valueTwo != "undefined") {
        arPartyInternet.push(valueTwo);
      } else if (modulo == 4 && valueTwo != "undefined") {
        arPartyLogosImg.push(valueTwo);
      } else if (modulo > 4 && modulo <= intQuestions + 4) {
        arPartyPositions.push(valueOne);
        arPartyOpinions.push(valueTwo);
      }
    }
  }
}

// v.0.3 NEU
// ersetzt die Position (-1, 0, 1) mit dem passenden Button
function fnTransformPositionToButton(position) {
   var arButtons = new Array("btn-danger", "btn-warning", "btn-success");
   var positionButton = "btn-default";
   for (z = -1; z <= 1; z++) {
      if (z == position) {
         positionButton = arButtons[z + 1];
      }
   }
   return positionButton;
}

// v.0.3 NEU
// ersetzt die Position (-1, 0, 1) mit dem passenden Icon
function fnTransformPositionToIcon(position, type) {
   var positionIcon = type === "personal" ? ICON_SKIPPED : ICON_NO_DATA;
   for (z = -1; z <= 1; z++) {
      if (z == position) {
         positionIcon = arIcons[z + 1];
      }
   }
   return positionIcon;
}

// ersetzt die Partei-Position (-1, 0, 1) mit der passenden Farbe
function fnTransformPositionToColor(position) {
   // red, yellow, green - "#ff0000","#ffff00","#00ff00"
   // Bootstrap-colors: https://github.com/twbs/bootstrap/blob/master/dist/css/bootstrap.css
   var arColors = new Array(
      "var(--danger)",
      "var(--warning)",
      "var(--success)"
   );
   var positionColor = "#ecf1f1";
   for (z = -1; z <= 1; z++) {
      if (z == position) {
         positionColor = arColors[z + 1];
      }
   }
   return positionColor;
}

// ersetzt die Partei-Position (-1, 0, 1) mit dem passenden Text
function fnTransformPositionToText(position, type) {
   var arText = new Array("[-]", "[o]", "[+]");
   var positionText = type === "personal" ? TEXT_SKIPPED : TEXT_NO_DATA;
   for (z = -1; z <= 1; z++) {
      if (z == position) {
         positionText = arText[z + 1];
      }
   }
   return positionText;
}

// Gibt ein Bild/CSS-Klasse für den Balken in der Auswertung entsprechend der Prozentzahl Uebereinstimmung zurück
function fnBarImage(percent) {
   // bis v.0.3 mit PNG-Bildern, danach mit farblicher Bootstrap-Progressbar

   if (percent <= 33) {
      // var barImage = "contra_px.png";
      var barImage = "bg-danger";
   } else if (percent <= 66) {
      // var barImage = "neutral_px.png";
      var barImage = "bg-warning";
   } else {
      // var barImage = "pro_px.png";
      var barImage = "bg-success";
   }

   return barImage;
}

// 02/2015 BenKob (doppelte Wertung)
function fnToggleSelfPosition(target) {
   const i = +Array.from(target.classList)
      .find((cls) => cls.startsWith("selfPosition"))
      .replace("selfPosition", "");
   const selectedOption = +target.value;
   arPersonalPositions[i] = selectedOption;
   document.querySelectorAll(`.selfPosition${i}`).forEach((dropdown) => {
      dropdown.value = selectedOption;
   });
   document
      .querySelector(`#voting-double-container-question${i}`)
      .classList.toggle("d-none", selectedOption === 99);
   showOrHighlightBtnRefresh();
}

// 02/2015 BenKob (doppelte Wertung)
function fnToggleDouble(i) {
   arVotingDouble[i] = !arVotingDouble[i];
   showOrHighlightBtnRefresh();
}

// vanilla JavaScript FadeIn / FadeOut
// Modus = display: "none / block" ändern (0 = nein, 1 = ja)
function fnFadeIn(el, time, modus) {
   // Default FadeIn / FadeOut-Time
   if (!time) {
      time = 500;
   }

   // Loading CSS
   el.style.animation = "myFadeIn " + time + "ms 1";
   el.style.opacity = 1;

   if (modus == 1) {
      el.style.display = "";
      el.style.visibility = "";
   }
}

// vanilla JavaScript FadeIn / FadeOut
// Modus = visibility show / hidden ändern (0 = nein, 1 = ja)
function fnFadeOut(el, time, modus) {
   // Default FadeIn / FadeOut-Time
   if (!time) {
      time = 500;
   }

   // Loading CSS
   el.style.animation = "myFadeOut " + time + "ms 1";
   el.style.opacity = 0;

   // hide element from DOM AFTER opacity is set to 0 (setTimeout)
   if (modus == 1) {
      window.setTimeout(function () {
         el.style.display = "none";
         el.style.visibility = "hidden";
      }, time - 50);
   }
}

function calculateMaxPoints() {
   let maxPoints = 0;
   for (let i = 0; i < intQuestions; i++) {
      if (arPersonalPositions[i] === 99) continue;
      maxPoints++;
      if (arVotingDouble[i]) maxPoints++;
   }
   if (maxPoints == 0) maxPoints = 1;
   return maxPoints;
}
