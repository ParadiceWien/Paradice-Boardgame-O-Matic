// Defines which i18n/i18n_xx.js file is used
const language = window.origin === "https://brettspiel-o-mat.de" ? "de" : "en";

// This is the central configuration file of the Boardgame-O-Matic
// If possible, all adjustments should be made through variables in this file

const title =
   language === "de" ? "Brettspiel-O-Mat (beta)" : "BoardGame-O-Matic (beta)";

const metaDescription =
   language === "de"
      ? "Beantworte die kurzen Fragen und lass dir vom Matching-Algorithmus deine persönlichen Spiele-Highlights verraten!"
      : "Answer the short questions and let the matching algorithm suggest your personal game highlights!";

// Separator used in CSV files
const separator = ";";

// Name of the CSV file with the questions in the /data directory
const fileQuestions = `questions-${language}.csv`;

// Number of questions
const intQuestions = 6;

// Name of the CSV file with the board games in the /data directory
const fileAnswers = `games-${language}.csv`;

// File paths to system and CSS files
// If you have several instances of this tool running, you can use absolute references to global files (therefore, these are not hardcoded)=
const system = [
   "system/output.js",
   "system/general.js",
   "system/privacy.js",
   "system/permalink_to_personal_results.js",
];
const design = [
   "styles/global.css",
   "styles/demo.css",
   "styles/boxicons.min.css",
];

// Changes to how Matomo is implemented can be made directly in system/privacy.js
const matomoTracking = "off"; // "on" / "optin" / "off"
const matomoUrl = "";
const matomoSiteId = "";

// Logo in top left corner for branding (not recommended if embedded as iframe)
const showMainLogoInTopLeftCorner = true;
const mainLogoPath = "./Kopie von Paradice_Sticker.png";
const mainLogoWriting =
   language === "de"
      ? "Paradice<br><span class='stretch-text-de'>Brettspiel-O-Mat</span>&nbsp"
      : "Paradice<br><span class='stretch-text-en'>Boardgame-O-Matic</span>&nbsp";

const mainLogoHref =
   language === "de"
      ? "https://paradice.info"
      : "https://paradice.wien"; // The link opens in a new tab
const mainLogoTitle =
   language === "de" ? "Brettspiel-O-Mat Logo" : "BoardGame-O-Matic Logo"; // This is just used for the title attribute of the image, it is not displayed

// Welcome and info screen before the first question
const descriptionShowOnStart = true;
// The title of the page, which is displayed in the browser tab, must be changed directly in the index.html (<title> and meta property "og:title")
const descriptionHeading1 =
   language === "de" ? "Brettspiel-O-Mat" : "BoardGame-O-Matic";
const descriptionHeading2 =
   language === "de"
      ? "Spielerisch passende Brettspiele finden"
      : "Find your matching board games";
const descriptionExplanation =
   language === "de"
      ? "Beantworte die kurzen Fragen, um herauszufinden, welche Spiele aus der Datenbank am besten zu deinen Vorlieben passen."
      : "Answer the short questions to find out which board games of our collection best match your preferences.";

// Right to left slide animations when a new question is shown - OR - immediate cuts
const animateQuestionsCard = true;

// If true, the #resultsTabBtn is bigger than the others
// Only works if addon_filter_results.js is active, because only then there are 5 buttons with the results button in the middle (only then it makes sense to highlight it)
const highlightResultsTabBtnOfNavigationBar = false;

// Show "Current question number/total question number" (e. g. "3/15") before title of question
// Not recommended if addon_make_questions_optional.js is active
const showQuestionNumberOnCard = false;

// Optional box with info icon and text, displayed on results page between headings and results table
const showInfoBoxAboveResultsShortTable = true;
const textInfoBox =
   language === "de"
      ? "Alle Infos findest du unter <a href='https://brettspiel-o-mat.de/#faq' target='_blank'>https://brettspiel-o-mat.de/#faq</a>"
      : "Find all information under <a href='https://boardgame-o-matic.com/#faq' target='_blank'>https://boardgame-o-matic.com/#faq</a>";
// "This demo tool is not based on a real board game collection. Instead, the matching simply uses the BoardGameGeek Top 200 games (as of March 2024).";

// Save anonymous data about how users answered the questions and which results they got?
// If active, users see a modal before they get their results, asking them for permission (opt-in)
// If they agree, their data is sent to a database
// Defined in extras/statistics/db_settings.php
const statsRecord = false;
const statsServer = "extras/statistics/vote_db.php";

const aboutLink = "https://brettspiel-o-mat.de/#faq";

// URL of imprint
// If tool is embedded as iframe in a page which links to the imprint in its footer, the tool itself must not link to imprint as well
// In this case, leave empty and set --display-imprint in the CSS file to "none"
const imprintLink = "https://brettspiel-o-mat.de/impressum";

// See comment to imprintLink
const privacyExternalPageLink =
   "https://brettspiel-o-mat.de/datenschutzerklarung/";

// Instead of linking to a privacy policy page, you can also create on
// If privacyExternalPageLink is falsy, the privacy button will open open a full screen modal
const privacyModalTitle = ``;
const privacyModalGeneral = ``;

const imageInfoPopupPath = "powered-by-bgg-min.png";
const imageInfoPopupLink = "https://boardgamegeek.com/";
const imageInfoPopupWidth = "200px";

// How many seconds is the explanatory text shown after each button click before it disappears again?
const PERMALINK_DESCRIPTION_DURATION = 15;

// Addons can vastly enhance the functionality of your tool
// Add the paths of the addon files you want to activate to the array
// If you have several instances of this tool running, you can use absolute references to global files
const addons = [
   "extras/addon_limit_results.js",
   "extras/addon_filter_results.js",
   "extras/addon_custom_voting_buttons.js",
   "extras/addon_show_first_results.js",
   "extras/addon_tooltips.js",
];

// Addon-specific variables are set in this configuration file as well
// For better clarity, the variables are ordered in blocks corresponding to their plugin
// The variables in each block are only relevant if the addon is active, i. e. if it is added to the "addons" array
// Variables are declared without "let" or "const", this would make them block-scoped and therefore not accessible in the addon files

function isActivated(addonFileName) {
   // Helper function allowing us to use an easier to read shortcut
   return addons.some((item) => item.includes(addonFileName));
}

//
if (isActivated("addon_contacts_in_results.js")) {
   // Show a button, allowing the user to establish contact
   CR_CONTACT_ACTIVE_EMAIL = true;

   // Label of the buttons (displayed in the detail section of each result)
   CR_CONTACT_BUTTON_EMAIL = "";

   // Global email address
   // Only used if the result has NO data-email tag in the csv file
   CR_CONTACT_ADDRESS_EMAIL = "";

   // Subject of the email. The name of the result is automatically appended
   // 1. - if the result DOES have an data-email tag in the CSV file
   CR_CONTACT_SUBJECT_EMAIL_DATATAG = "";
   // 2. - Fallback, if the result has NO data-email tag in the CSV file
   CR_CONTACT_SUBJECT_EMAIL_DEFAULT = "";

   // Content of the email
   // 1. - if the result DOES have an data-email tag in the CSV file
   CONTACT_TEXT_EMAIL_DATATAG = ``;
   // 2. - Fallback, if the result has NO data-email tag in the CSV file

   CONTACT_TEXT_EMAIL_DEFAULT = "";
}

if (isActivated("addon_limit_results.js")) {
   // Number of results displayed at first
   // Also the number of results added to the table with each press of the show more button
   intPartiesShowAtEnd = 10;
}

if (isActivated("addon_tooltips.js")) {
   // If a tooltip should not be shown, give the variable a falsy value
   // Text of the tooltip explaining the Voting Double button
   TOOLTIP_VOTING_DOUBLE = false;
   // "If a question is particularly important to you, click on &quot;Double weight&quot; <strong>before</strong> you select your answer.";
   // Text of the tooltip explaining the buttons in the Results Short Table, with which you can change your answer
   TOOLTIP_RESULTS_SHORT = false;
   // "Click on the icon to change your answer.";
   // Text of the tooltip explaining the buttons in the Results By Thesis Table, with which you can change or double your answer
   TOOLTIP_RESULTS_BY_THESIS = false;
   // "Click on the buttons to change or double-weight your answer.";

   TOOLTIP_FILTER_TAB =
      language === "de"
         ? "Setze Filter, um präzisere Vorschläge zu erhalten."
         : "Set filters to get more precise suggestions.";

   // Number of the question where the TOOLTIP_RESULTS_BY_THESIS is displayed
   // This is relevant, if the first question(s) are custom questions (see addon_custom_voting_buttons.js) where hideVotingDouble is true
   // If this is the case, this variable should be the number of the first question where the Voting Double button is displayed
   // Otherwise, this can just be set to 1
   TOOLTIP_RESULTS_BY_THESIS_QUESTION_NUMBER = 3;
}

if (isActivated("addon_custom_voting_buttons.js")) {
   CUSTOM_POSITION_BUTTONS_DEFAULT_VALUES = {
      backgroundColor: "var(--secondary-color)",
      textColor: "var(--text-on-secondary)",
      // To overwrite the default values for a question, set the key arBackgroundColor / arTextColor in an object of CUSTOM_POSITION_BUTTONS
      // The value of arBackgroundColor / arTextColor must be an array with as many elements as there are values of the button
   };
   // For each question that should be customized, add an object to the array CUSTOM_POSITION_BUTTONS
   // The following keys are required (x = number of options/buttons for this question, should be an odd number)
   //    questionNr (integer; 1-indexed)
   //    arButtonLabels (array of x strings; texts of the voting buttons)
   //    arButtonAltTexts (array of x strings; alternative texts & titles of the buttons, e. g. same as arButtonLabels without HTML symbols)
   //    arPositionIcons (array of x strings; content of buttons/icons on the results page, must be super short, ideally symbols)
   //    arPositionValues (array of x integers; value for each button/option; the value of the middle option should be 0)
   // The following keys are optional
   //    votingDoubleByDefault (boolean; default: false; meaning: Should the voting double button be in the active state by default?)
   //    hideVotingDouble (boolean; default: false; meaning: Should the voting double button be hidden on the question card and in the results tables, so that the default state cannot be changed?)
   //    isYesOrDontCareQuestion (boolean; default: false; meaning: If true, the options with the values 0 and -1 [not necessarily the 2nd and 3rd option], cannot be selected. There is not voting button for option 0. If the user selects option -1 on the question card or changes to 0 or -1 in a results table, it automatically changes to the skipped state (99). Should only be used for yes-no-questions, where the issue of the question is either relevant for the user or not)
   //    buttonTextAndIconLabelForDontCare (string, should be very short; overrides the skipped symbol "↷" as button content in the results tables. Should be used together with isYesOrDontCareQuestion. Without it, users could be confused why they get the skipped icon when they try to choose the option with the value -1)
   //    arBackgroundColor (array of x strings, each a hex value/rgb value/CSS color keyword representing the background color of the jumpToQuestion table cell and the icons in the results tables, if the corresponding option is selected; if not set, all options get CUSTOM_POSITION_BUTTONS_DEFAULT_VALUES.backgroundColor)
   //    arTextColor (array of x strings, same as arBackgroundColor; consider the contrast to the corresponding background color)

   CUSTOM_POSITION_BUTTONS = [
      {
         questionNr: 1,

         arButtonLabels:
            language === "de"
               ? [
                    "Super einfach",
                    "Einstiegsfreundlich",
                    "Moderat",
                    "Fortgeschritten",
                    "Für Expert:innen",
                 ]
               : [
                    "Super easy",
                    "Beginner-friendly",
                    "Moderate",
                    "Advanced",
                    "For experts",
                 ],
         arButtonAltTexts: null,
         arPositionIcons: null,
         arPositionValues: [2, 1, 0, -1, -2],
         votingDoubleByDefault: false,
         hideVotingDouble: false,
      },
      {
         questionNr: 2,
         arButtonLabels:
            language === "de"
               ? [
                    "Bis zu 45&nbsp;min",
                    "45&nbsp;&ndash;&nbsp;90&nbsp;min",
                    "90&nbsp;&ndash;&nbsp;120&nbsp;min",
                    "120&nbsp;&ndash;&nbsp;180&nbsp;min",
                    "Mehr als 180&nbsp;min",
                 ]
               : [
                    "Up to 45&nbsp;min",
                    "45&nbsp;&ndash;&nbsp;90&nbsp;min",
                    "90&nbsp;&ndash;&nbsp;120&nbsp;min",
                    "120&nbsp;&ndash;&nbsp;180&nbsp;min",
                    "More than 180&nbsp;min",
                 ],
         arButtonAltTexts:
            language === "de"
               ? [
                    "Bis zu 45 min",
                    "45 - 90 min",
                    "90 - 120 min",
                    "120 - 180 min",
                    "Mehr als 180 min",
                 ]
               : [
                    "Up to 45 min",
                    "45 - 90 min",
                    "90 - 120 min",
                    "120 - 180 min",
                    "More than 180 min",
                 ],
         arPositionIcons: [
            "<&nbsp;45&prime;",
            "45&prime;&nbsp;- 90&prime;",
            "90&prime;&nbsp;- 120&prime;",
            "120&prime;&nbsp;- 180&prime;",
            ">&nbsp;180&prime;",
         ],
         arPositionValues: [2, 1, 0, -1, -2],
         votingDoubleByDefault: false,
         hideVotingDouble: false,
      },
      {
         questionNr: 3,
         arPositionValues: [1, 0, -1],
         arButtonLabels:
            language === "de"
               ? [
                    "Kooperativ<br><small>(Alle zusammen gegen das Spiel)</small>",
                    "Team-basiert / semi-kooperativ<br><small>(Team vs. Team oder eine:r vs. alle)</small>",
                    "Kompetitiv<br><small>(Alle gegen alle)</small>",
                 ]
               : [
                    "Cooperative<br><small>(All together against the game)</small>",
                    "Team-based / Semi-cooperative<br><small>(In teams against each other or 1 vs all)</small>",
                    "Competitive<br><small>(All against all)</small>",
                 ],
         arButtonAltTexts:
            language === "de"
               ? ["Kooperativ", "Team-basiert", "Kompetitiv"]
               : ["Cooperative", "Team-based", "Competitive"],
         arPositionIcons:
            language === "de"
               ? ["Kooperativ", "Team-basiert", "Kompe&shy;titiv"]
               : ["Coop", "Team-based", "Compe&shy;titive"],
      },
      {
         questionNr: 4,
         arPositionValues: [1, 0, -1],

         arButtonLabels:
            language === "de"
               ? [
                    "Geringes Konflikt-Level",
                    "Moderates Konflikt-Level",
                    "Hohes Konflikt-Level",
                 ]
               : [
                    "Low conflict level",
                    "Moderate conflict level",
                    "High conflict level",
                 ],

         arButtonAltTexts: null,
         arPositionIcons:
            language === "de"
               ? ["Wenig Konflikt", "Moderater Konflikt", "Hoher Konflikt"]
               : ["Little conflict", "Medium conflict", "High conflict"],
         // Disclaimer is only displayed if answer to previous question was "Cooperative"
         disclaimer:
            language === "de"
               ? "Du hast angegeben, dass du kooperative Spiele bevorzugst. Bitte beantworte (oder überspringe) dennoch diese Frage in Hinblick auf kompetitive und team-basierte Spiele."
               : "You just indicated that you prefer cooperative games. Nevertheless, please answer (or skip) this question with regards to competitive and team-based games.",
      },
      {
         questionNr: 5,
         arPositionValues: [2, 1, 0, -1, -2],
         arButtonLabels: [
            "No text",
            "Little text",
            "Some text",
            "Lots of text",
            "Massive text",
         ],
         arButtonLabels:
            language === "de"
               ? [
                    "Kein Text",
                    "Wenig Text",
                    "Etwas Text",
                    "Viel Text",
                    "Extrem viel Text",
                 ]
               : [
                    "No text",
                    "Little text",
                    "Some text",
                    "Lots of text",
                    "Massive text",
                 ],
         arButtonAltTexts: null,
         arPositionIcons: null,
         isYesOrDontCareQuestion: true,
         buttonTextAndIconLabelForYes:
            language === "de"
               ? "Ja, möglichst wenig Text"
               : "Yes, as little text as possible",
         buttonTextAndIconLabelForDontCare:
            language === "de" ? "Egal" : "No matter",
      },
      {
         questionNr: 6,
         arPositionValues: [2, 1, 0, -1, -2],
         arButtonLabels:
            language === "de"
               ? [
                    "≤ 2 Jahre alt",
                    "3 - 5 Jahre alt",
                    "5 - 10 Jahre alt",
                    "10 - 20 Jahre alt",
                    "> 20 Jahre alt",
                 ]
               : [
                    "≤ 2 years old",
                    "3 - 5 years old",
                    "5 - 10 years old",
                    "10 - 20 years old",
                    "> 20 years old",
                 ],

         arButtonAltTexts:
            language === "de"
               ? [
                    "Weniger als 3 Jahre alt",
                    "3 - 5 Jahre alt",
                    "5 - 10 Jahre alt",
                    "10 - 20 Jahre alt",
                    "Mehr als 20 Jahre alt",
                 ]
               : [
                    "Less than 3 years old",
                    "3 - 5 years old",
                    "5 - 10 years old",
                    "10 - 20 years old",
                    "More than 20 years old",
                 ],

         arPositionIcons: null,
         isYesOrDontCareQuestion: true,
         buttonTextAndIconLabelForYes:
            language === "de"
               ? "Ja, möglichst neue Spiele"
               : "Yes, new games if possible",
         buttonTextAndIconLabelForDontCare:
            language === "de" ? "Egal" : "No matter",
      },
   ];
}

if (addons.some((item) => item.includes("extras/addon_filter_results.js"))) {
   TEXT_FILTERS_HEADING = language === "de" ? "Filter" : "Filters";
   TEXT_FILTERS_SUBHEADING =
      language === "de"
         ? "Setze Filter, um präzisere Ergebnisse zu bekommen."
         : "Set filters to get more precise suggestions.";
   HIGHLIGHT_FILTER_ICON = true;
   FILTERS = [
      /* 
  Global keys:
    * internalName::string (required, must be unique)

  Available types and their special keys:
  "dropdown"
    * label::string (optional, but highly recommended)
    * options::object (required)
      * text::string (required)
      * value::string (required)
    * textOfOptionToShowAll::string (required)
    * setAtStart::object (optional)
      * isWanted::bool (optional; default: false)
      * cardHeading::string (required, if "isWanted: true")
      * cardBody::string (required, if "isWanted: true")
  
  "input-datalist"
    * label::string (optional)
    * datalist::array:string (required)
    * placeholder::string (required)
    * textButtonSubmit::string (required, if "displayInSharedModal: false" or undefined)
    * errorMessage::string (required)
  
  "distance" (note: only works with kilometres)
    * label::string (optional)
    * datalist::object (required)
      * text::string (required)
      * lat::number (required)
      * lon::number (required)
    * placeholderLocation::string (required)
    * placeholderDistance::string (required)
    * textButtonSubmit::string (required, if "displayInSharedModal: false" or undefined)
    * errorMessageNoLocation::string (required)
    * errorMessageWrongLocation::string (required)
    * errorMessageDistance::string (required)
  
  "checkbox-list"
    * heading::string (optional, but highly recommended)
    * options::object (required)
      * label::string (required)
      * value::string (required)
      * checkedByDefault::bool (optional; default: false; is overwritten by allCheckedByDefault)
    * allCheckedByDefault::bool (optional; default: false; overwrites allCheckedByDefault of individual options)
    * checkedMeansExcluded::bool (optional; default: false)
    * textButtonSubmit::string (required, if "displayInSharedModal: false" or undefined)
    * errorMessage::string (required)
  
  "single-checkbox"
    * heading::string (optional)
    * label::string (required)
    * value::string (required)
    * checkedByDefault::bool (optional; default: false)
    * checkedMeansExcluded::bool (optional; default: false)
      */
      {
         internalName: "player-number",
         type: "checkbox-list",
         icon: "bxs-group",
         description:
            language === "de"
               ? "Alle Spiele, die mit keiner der ausgewählten Spieler:innenzahlen spielbar sind, werden ausgeblendet."
               : "All games that cannot be played with any of the selected player numbers are hidden.",
         options: [
            {label: "Solo", value: "1"},
            {label: "2", value: "2"},
            {label: "3", value: "3"},
            {label: "4", value: "4"},
            {label: "5", value: "5"},
            {label: "6", value: "6"},
            {label: "≥ 7", value: "7"},
         ],
         allCheckedByDefault: false,
         checkedMeansExcluded: false,
         displayInCollapsibleSection: {
            isWanted: true,
            heading:
               language === "de" ? "Spieler:innenanzahl" : "Player number",
         },

         displayFilterValuesInResultDetails: {
            isWanted: true,
            label: language === "de" ? "Spieler:innenanzahl" : "Player number",
            bulletList: false,
         },
         setAtStart: {
            isWanted: true,
            cardHeading:
               language === "de" ? "Spieler:innenanzahl" : "Number of players",
            cardBody:
               language === "de"
                  ? "Zu wievielt wollt ihr spielen?"
                  : "With how many players do you want to play?",
         },
         errorMessage:
            language === "de"
               ? "Du musst mindestens eine Spieler:innenanzahl erlauben."
               : "You must allow at least one player number.",
      },

      {
         internalName: "themes",
         type: "three-states-checkbox-list",
         icon: "bxs-landscape",
         description:
            language === "de"
               ? `
         <div class="description-three-states-checkbox-list">
            <div>
               <span>
                  1x: Gewünscht
               </span>
               <div class="checkbox-container flex-center">
                  <i class="bx bx-border bx-check bg-color-success"></i>
                  <span>Beispiel</span>
               </div>
            </div>
            <div>
               <span>
                  2x: Ausgeschlossen
               </span>
               <div class="checkbox-container flex-center">
                  <i class="bx bx-border bx-x bg-color-danger"></i>
                  <span class="line-through">Beispiel</span>
               </div>
            </div>
            <div style="display: flex;">
               <button class="bx bxs-help-circle icon-help" style="font-size: 120%"
               onclick='showHelpModalExplainingFilterOption("Erklärung des Filters &#39;Themen&#39;",
               "<strong>Klicke einmal</strong> auf ein Thema, um es als <strong>gewünscht</strong> zu markieren. Jedes Spiel muss mind. eins deiner gewünschten Themen haben, sonst wird es ausgeblendet.<br><br><strong>Klicke zweimal</strong> auf ein Thema, um es <strong>auszuschließen</strong>. Jedes Spiel, das mind. eins deiner ausgeschlossenen Themen hat, wird zwangsläufig ausgeblendet &ndash; unabhängig von gewünschten Themen.", "undefined")'></button>
            </div>
         </div>`
               : `
         <div class="description-three-states-checkbox-list">
            <div>
               <span>
                  1x: Wanted
               </span>
               <div class="checkbox-container flex-center">
                  <i class="bx bx-border bx-check bg-color-success"></i>
                  <span>Example</span>
               </div>
            </div>
            <div>
               <span>
                  2x: Excluded
               </span>
               <div class="checkbox-container flex-center">
                  <i class="bx bx-border bx-x bg-color-danger"></i>
                  <span class="line-through">Example</span>
               </div>
            </div>
            <div style="display: flex;">
               <button class="bx bxs-help-circle icon-help" style="font-size: 120%"
               onclick='showHelpModalExplainingFilterOption("Explanation of the filter &#39;Themes&#39;",
               "<strong>Click once</strong> on a theme to mark it as <strong>wanted</strong>. Each game must have at least one of your wanted themes, otherwise it will be hidden.<br><br><strong>Click twice</strong> on a theme to mark it as <strong>excluded</strong>. Every game that has at least one of your excluded themes will inevitably be hidden &ndash; regardless of wanted themes.", "undefined")'></button>
            </div>
         </div>`,
         options: [
            {
               value: "adventure",
               label:
                  language === "de"
                     ? "Abenteuer & Erkundung"
                     : "Adventure & Exploration",
            },
            {
               value: "oldHistory",
               label:
                  language === "de"
                     ? "Antike & Mittelalter"
                     : "Ancient & Medieval Times",
            },
            {
               value: "animals",
               label:
                  language === "de"
                     ? "Tiere, Umwelt & Landwirtschaft"
                     : "Animals, Nature & Agriculture",
            },
            {
               value: "arts",
               label: language === "de" ? "Kunst & Handwerk" : "Arts & Crafts",
            },
            {
               value: "economy-infrastructure",
               label:
                  language === "de"
                     ? "Wirtschaft & Infrastruktur"
                     : "Economy & Infrastructure",
            },
            {
               value: "fantasy",
               label:
                  language === "de"
                     ? "Fantasy & Mythologie"
                     : "Fantasy & Mythology",
            },
            {
               value: "horror",
               label: "Horror & Zombies",
            },
            {
               value: "murder",
               label:
                  language === "de" ? "Mord & Mysterien" : "Murder & Mystery",
            },
            {
               value: "politics",
               label:
                  language === "de"
                     ? "Politik & Spionage"
                     : "Politics & Espionage",
            },
            {
               value: "newHistory",
               label:
                  language === "de"
                     ? "Neuzeitliche Geschichte"
                     : "Modern History",
               help:
                  language === "de"
                     ? "Alles nach dem Mittelalter, also Renaissance bis Gegenwart."
                     : "Everything after the Middle Ages, so Renaissance until presence.",
            },
            {
               value: "science",
               label:
                  language === "de"
                     ? "Wissenschaft & Forschung"
                     : "Science & Research",
            },
            {
               value: "scifi",
               label: "Science Fiction",
            },
            {
               value: "nautical",
               label:
                  language === "de" ? "Schiffe & Piraten" : "Ships & Pirates",
            },
            {
               value: "trains",
               label:
                  language === "de"
                     ? "Züge, Autos, Flugzeuge & Rennen"
                     : "Trains, Cars, Planes & Races",
            },
            {
               value: "war",
               label: language === "de" ? "Krieg & Kampf" : "War & Fighting",
            },
         ],
         sortOptionsAlphabetically: true,
         strikethroughOptionsThatGetHidden: true,
         displayInCollapsibleSection: {
            isWanted: true,
            heading: language === "de" ? "Themen" : "Themes",
         },
         displayFilterValuesInResultDetails: {
            isWanted: true,
            label: language === "de" ? "Themen" : "Themes",
            bulletList: true,
         },
         errorMessage:
            language === "de"
               ? "Du musst mindestens ein Thema erlauben."
               : "You must allow at least one theme.",
      },
      {
         internalName: "mechanics",
         type: "three-states-checkbox-list",
         icon: "bxs-cog",
         description:
            language === "de"
               ? `
         <div class="description-three-states-checkbox-list">
            <div>
               <span>
                  1x: Gewünscht
               </span>
               <div class="checkbox-container flex-center">
                  <i class="bx bx-border bx-check bg-color-success"></i>
                  <span>Beispiel</span>
               </div>
            </div>
            <div>
               <span>
                  2x: Ausgeschlossen
               </span>
               <div class="checkbox-container flex-center">
                  <i class="bx bx-border bx-x bg-color-danger"></i>
                  <span class="line-through">Beispiel</span>
               </div>
            </div>
            <div style="display: flex;">
               <button class="bx bxs-help-circle icon-help" style="font-size: 120%"
               onclick='showHelpModalExplainingFilterOption("Erklärung des Filters &#39;Mechaniken&#39;",
               "<strong>Klicke einmal</strong> auf eine Mechanik, um sie als <strong>gewünscht</strong> zu markieren. Jedes Spiel muss mind. eine deiner gewünschten Mechaniken haben, sonst wird es ausgeblendet.<br><br><strong>Klicke zweimal</strong> auf eine Mechanik, um sie <strong>auszuschließen</strong>. Jedes Spiel, das mind. eine deiner ausgeschlossenen Mechaniken hat, wird zwangsläufig ausgeblendet &ndash; unabhängig von gewünschten Mechaniken.", "undefined")'></button>
            </div>
         </div>`
               : `
         <div class="description-three-states-checkbox-list">
            <div>
               <span>
                  1x: Wanted
               </span>
               <div class="checkbox-container flex-center">
                  <i class="bx bx-border bx-check bg-color-success"></i>
                  <span>Example</span>
               </div>
            </div>
            <div>
               <span>
                  2x: Excluded
               </span>
               <div class="checkbox-container flex-center">
                  <i class="bx bx-border bx-x bg-color-danger"></i>
                  <span class="line-through">Example</span>
               </div>
            </div>
            <div style="display: flex;">
               <button class="bx bxs-help-circle icon-help" style="font-size: 120%"
               onclick='showHelpModalExplainingFilterOption("Explanation of the filter &#39;Mechanics&#39;",
               "<strong>Click once</strong> on a mechanic to mark it as <strong>wanted</strong>. Each game must have at least one of your wanted mechanics, otherwise it will be hidden.<br><br><strong>Click twice</strong> on a mechanic to mark it as <strong>excluded</strong>. Every game that has at least one of your excluded mechanics will inevitably be hidden &ndash; regardless of wanted mechanics.", "undefined")'></button>
            </div>
         </div>`,
         options: [
            {
               value: "action",
               label:
                  language === "de"
                     ? "Action, Schnelligkeit & Geschicklichkeit"
                     : "Action, Speed & Dexterity",
               help:
                  language === "de"
                     ? "Schnelle Reaktionen, physisches Geschick oder Echtzeit-Entscheidungen sind erforderlich."
                     : "Fast reactions, physical dexterity or real-time decisions are required.",
               examples:
                  "Jenga, Captain Sonar, KLASK, Galaxy Trucker, Pitch Car, Crokinole",
            },
            {
               value: "areaControl",
               label: "Area Control",
               help:
                  language === "de"
                     ? "Ziel ist die Vorherrschaft über bestimmte Gebiete (durch Mehrheiten, Einfluss oder direkte Eroberung), um strategische Vorteile zu sichern."
                     : "The aim is to dominate certain territories (through majorities, influence or direct conquest) in order to secure strategic advantages.",
               examples:
                  language === "de"
                     ? "Risiko, El Grande, Scythe, Small World, Blood Rage, Root, Eclipse"
                     : "Risk, El Grande, Scythe, Small World, Blood Rage, Root, Eclipse",
            },
            {
               value: "auction",
               label:
                  language === "de"
                     ? "Auktionen & Gebote"
                     : "Auctions & Bidding",
               help:
                  language === "de"
                     ? "Ressourcen, Aktionen oder Einfluss werden versteigert. Schätze den Wert richtig ein und überbiete deine Mitspieler:innen im richtigen Moment."
                     : "Resources, actions or influence are auctioned off. Estimate the value correctly and outbid your fellow players at the right moment.",
               examples:
                  language === "de"
                     ? "Funkenschlag, Modern Art, Ra, Keyflower, Furnace, QE"
                     : "Power Grid, Modern Art, Ra, Keyflower, Furnace, QE",
            },
            {
               value: "cards",
               label: language === "de" ? "Kartenspiele" : "Card Games",
               help:
                  language === "de"
                     ? "Karten sind die zentrale oder sogar die einzige Komponenente des Spiels."
                     : "Cards are the central or even the only component of the game.",
               examples:
                  language === "de"
                     ? "Dominion, 7 Wonders, Flügelschlag, Die Crew, Splendor, Codenames"
                     : "Dominion, 7 Wonders, Wingspan, The Crew, Splendor, Codenames",
            },
            {
               value: "deckBuilding",
               label: "Deck Building",
               help:
                  language === "de"
                     ? "Baue dir dein eigenes Deck aus passenden Karten zusammen, um Synergien zu schaffen und deine Strategie zu optimieren. Anstelle eines Kartendecks z.&nbsp;T. auch mit Plättchen-Beutel oder Ressourcenpool."
                     : "Build your own deck of matching cards to create synergies and optimise your strategy. Instead of a deck of cards, it can also be a token bag or resource pool.",
               examples:
                  language === "de"
                     ? "Dominion, Orleans, Die Quacksalber von Quedlinburg, Dune: Imperium, Klong!, Star Realms"
                     : "Dominion, Orleans, The Quacks, Dune: Imperium, Clank!, Star Realms",
            },
            {
               value: "deduction",
               label: language === "de" ? "Deduktion" : "Deduction",
               help:
                  language === "de"
                     ? "Nutze Hinweise und Muster, um versteckte Informationen aufzudecken. Kombiniere logisches Denken und Beobachtungsgabe, um die richtigen Schlussfolgerungen zu ziehen."
                     : "Use clues and patterns to uncover hidden information. Combine logical thinking and observation skills to draw the right conclusions.",
               examples:
                  language === "de"
                     ? "Cluedo, Codenames, Hanabi, Die Werwölfe von Düsterwald, Secret Hitler, Mysterium"
                     : "Clue, Codenames, Hanabi, The Werewolves of Miller's Hollow, Secret Hitler, Mysterium",
            },
            {
               value: "drafting",
               label: "Drafting",
               help:
                  language === "de"
                     ? "Wähle nacheinander Karten, Würfel oder andere Elemente aus einem begrenzten Angebot. Achte auf deine Strategie und passe dich an die Entscheidungen deiner Mitspieler:innen an."
                     : "Choose cards, dice or other elements from a limited selection one after the other. Pay attention to your strategy and adapt to the decisions of your fellow players.",
               examples:
                  language === "de"
                     ? "7 Wonders, Azul, Sushi Go!, Die Burgen von Burgund, Cascadia, Kingdomino"
                     : "7 Wonders, Azul, Sushi Go!, The Castles of Burgundy, Cascadia, Kingdomino",
            },
            {
               value: "dungeonCrawler",
               label: "Dungeon Crawler",
               help:
                  language === "de"
                     ? "Erkunde gefährliche Verliese, besiege Gegner und sammle Schätze. Meistere Herausforderungen, um deinen Charakter zu verbessern."
                     : "Explore dangerous dungeons, defeat enemies and collect treasures. Master challenges to improve your character.",
               examples:
                  language === "de"
                     ? "Gloomhaven, HeroQuest, Klong!, Maus und Mystik, Zombicide"
                     : "Gloomhaven, HeroQuest, Clank!, Mice and Mystics, Zombicide",
            },
            {
               value: "networks",
               label:
                  language === "de"
                     ? "Netzwerke & Verbindungen"
                     : "Networks & Connections",
               help:
                  language === "de"
                     ? "Baue ein Netzwerk aus Routen und Verbindungen, um Orte zu erreichen oder Boni freizuschalten. Plane strategisch, um dein Netz effizient zu erweitern und Vorteile zu sichern."
                     : "Build a network of routes and connections to reach locations or unlock bonuses. Plan strategically to expand your network efficiently and secure advantages.",
               examples:
                  language === "de"
                     ? "Zug um Zug, Die Siedler von Catan, Funkenschlag, Terra Mystica, Concordia, Brass: Birmingham, Thurn und Taxis"
                     : "Ticket to Ride, CATAN, Power Grid, Terra Mystica, Concordia, Brass: Birmingham, Thurn and Taxis",
            },
            {
               value: "party",
               label: language === "de" ? "Partyspiele" : "Party Games",
               help:
                  language === "de"
                     ? "Einfache Regeln, schneller Spielspaß und viel Interaktion: Perfekt für Gruppen, bei denen der Spaß und das gemeinsame Erlebnis im Vordergrund stehen."
                     : "Simple rules, quick fun and lots of interaction: perfect for groups where the focus is on fun and a shared experience.",
               examples:
                  language === "de"
                     ? "Codenames, Just One, Tabu, Cards Against Humaniy, Werwölfe von Düsterwald, Stille Post Extrem, Nobody Is Perfect"
                     : "Codenames, Just One, Taboo, Cards Against Humaniy, The Werewolves of Miller's Hollow, Telestrations, Nobody Is Perfect",
            },
            {
               value: "rollAndWrite",
               label: "Roll & Write / Flip & Write",
               help:
                  language === "de"
                     ? "Würfle oder decke Karten auf und trage die Werte in dein Spielblatt ein. Plane geschickt, um Muster zu optimieren, Boni zu nutzen und das beste Ergebnis zu erzielen."
                     : "Roll the dice or flip cards and enter the values in your game sheet. Plan skilfully to optimise patterns, take advantage of bonuses and achieve the best result.",
               examples:
                  language === "de"
                     ? "Kniffel, Qwixx, Ganz Schön Clever, Noch mal!, Der Kartograph"
                     : "Yahtzee, Qwixx, That's Pretty Clever, Encore!, Cartographers",
            },
            {
               value: "storytelling",
               label: "Storytelling & Role Playing",
               help:
                  language === "de"
                     ? "Erschaffe oder erlebe Geschichten durch Erzählungen, Entscheidungen und Charakterentwicklung. Tauche in narrative Abenteuer ein und gestalte den Verlauf der Geschichte mit."
                     : "Create or experience stories through narratives, decisions and character development. Immerse yourself in narrative adventures and help shape the course of the story.",
               examples:
                  language === "de"
                     ? "Gloomhaven, Once Upon A Time, Too Many Bones, Winter der Toten, Dixit"
                     : "Gloomhaven, Once Upon A Time, Too Many Bones, Dead of Winter, Dixit",
            },
            {
               value: "tilePlacement",
               label:
                  language === "de"
                     ? "Plättchen legen & Muster bilden"
                     : "Tile Placement & Pattern Building",
               help:
                  language === "de"
                     ? "Platziere Plättchen geschickt, um Muster zu bilden, Gebiete zu vervollständigen oder Räume optimal zu füllen. Achte auf Positionierung und Synergien, um Punkte zu maximieren oder Aktionen auszulösen."
                     : "Place tiles skilfully to form patterns, complete areas or fill spaces optimally. Pay attention to positioning and synergies to maximise points or trigger actions.",
               examples:
                  language === "de"
                     ? "Carcassone, Azul, Cascadia, Kingdomino, Patchwork, Ubungo, Die Burgen von Burgund"
                     : "Carcassone, Azul, Cascadia, Kingdomino, Patchwork, Ubungo, The Castles of Burgundy",
            },
            {
               value: "trading",
               label:
                  language === "de"
                     ? "Handeln & Verhandeln"
                     : "Trading & Negotiating",
               help:
                  language === "de"
                     ? "Tausche Ressourcen oder verhandle mit Mitspieler:innen, um Vorteile zu erlangen. Knüpfe Deals, schmiede Allianzen oder bluffe, um deine Position zu stärken."
                     : "Trade resources or negotiate with other players to gain advantages. Make deals, forge alliances or bluff to strengthen your position.",
               examples:
                  language === "de"
                     ? "Die Siedler von Catan, Monopoly, Bohnanza, Diplomacy, Cosmic Encounter, Chinatown"
                     : "CATAN, Monopoly, Bohnanza, , Diplomacy, Cosmic Encounter, Chinatown",
            },
            {
               value: "words",
               label:
                  language === "de" ? "Wörter & Sprache" : "Words & Language",
               help:
                  language === "de"
                     ? "Sei kreativ beim Erraten, Bilden oder Interpretieren von Wörtern. Clevere Assoziationen und geschickte Kommunikation führen zum Erfolg."
                     : "Be creative when guessing, forming or interpreting words. Clever associations and skilful communication lead to success.",
               examples:
                  language === "de"
                     ? "Codenames, So Kleever, Dixit, Just One, Decrypto, Werwörter, Concept, Perfect Match"
                     : "Codenames, So Clover, Dixit, Just One, Decrypto, Werewords, Concept, Wavelength",
            },
            {
               value: "workerPlacement",
               label: "Worker Placement",
               help:
                  language === "de"
                     ? "Setze deine Spielfiguren auf verschiedene Aktionensfelder, um Ressourcen zu sammeln, Aufgaben zu erfüllen und Vorteile zu sichern &ndash; oder um deinen Mitspieler:innen das Feld zu versperren."
                     : "Place your playing pieces on various action spaces to collect resources, fulfil tasks and secure advantages - or to block the space for your opponents.",
               examples:
                  "Agricola, Lords of Waterdeep, Viticulture, Caverna, Everdell, Dune: Imperium, Russian Railroads",
            },
         ],
         sortOptionsAlphabetically: true,
         strikethroughOptionsThatGetHidden: true,
         displayInCollapsibleSection: {
            isWanted: true,
            heading: language === "de" ? "Mechaniken" : "Mechanics",
         },
         displayFilterValuesInResultDetails: {
            isWanted: true,
            label: language === "de" ? "Mechaniken" : "Mechanics",
            bulletList: true,
         },
         errorMessage:
            language === "de"
               ? "Du musst mindestens eine Mechanik erlauben."
               : "You must allow at least one mechanic.",
      },
   ];
   /* 
  Other required variables:
  * BUTTON_RESET_ALL_FILTERS::object (optional)
    * showButton::bool (optional; default: false)
    * textButton::string (required, if "showButton: true")
  * ERROR_MESSAGE_NO_FILTER_RESULTS::string (required)
  */

   BUTTON_RESET_ALL_FILTERS = {
      showButton: true,
      textButton:
         language === "de" ? "Alle Filter zurücksetzen" : "Reset all filters",
      iconButton: "bxs-trash",
   };
   ERROR_MESSAGE_NO_FILTER_RESULTS =
      language === "de"
         ? "Keines unserer Spiele entspricht allen gesetzten Filtern. Bitte ändere deine Filter und versuche es erneut."
         : "None of our games match all the filters you have set. Please change your filters and try again.";
   DISPLAY_ANSWERS_TO_QUESTIONS_IN_RESULT_DETAILS = {
      isWanted: true,
      showMatchWithPersonalAnswer: true,
      questionsToBeDisplayed: [
         {questionNr: 1, displayQuestionHeading: true, isCustomQuestion: true},
         {questionNr: 2, displayQuestionHeading: true, isCustomQuestion: true},
         {questionNr: 3, displayQuestionHeading: false, isCustomQuestion: true},
         {questionNr: 4, displayQuestionHeading: false, isCustomQuestion: true},
         {questionNr: 5, displayQuestionHeading: false, isCustomQuestion: true},
      ],
   };
}

const HIDE_TABLE_resultsByPartyAnswers = true;
