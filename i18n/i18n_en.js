// DEUTSCHE TEXTE http://www.mat-o-wahl.de

// Buttons
const TEXT_START = "Let's go!";
const TEXT_VOTING_PRO = "Like";
const TEXT_VOTING_NEUTRAL = "Partly";
const TEXT_VOTING_CONTRA = "Dislike";
const TEXT_VOTING_BACK = "<i class='bx bx-skip-previous bx-sm'></i>&nbsp;Back";
const TEXT_VOTING_SKIP =
  "No matter&nbsp;/ Skip <i class='bx bx-skip-next bx-sm'></i>";
const TEXT_VOTING_DOUBLE = "Double weight";
const ICON_SKIPPED = "No matter";

// Statistic
const TEXT_ALLOW_STATISTIC_TITLE = "Before you see your results...";
const TEXT_ALLOW_STATISTIC_TEXT = `Do you authorise us to transfer your <strong>anonymised</strong> answers for statistical purposes in accordance with our <a ${
  privacyExternalPageLink
    ? `href="${privacyExternalPageLink}" target="_blank"`
    : `href="#" onclick="fnShowPrivacy()"`
}>privacy policy</a>? By doing so, you will help us to improve the Boardgame-O-Matic in the future.`;
const TEXT_ALLOW_STATISTIC_YES = "Yeah, sure!";
const TEXT_ALLOW_STATISTIC_NO = "No, thanks.";

// Footer
const TEXT_IMPRINT = "Imprint";
const TEXT_PRIVACY = "Privacy Policy";
const TEXT_RESTART = "<i class='bx bx-revision'></i> Restart";

const TITLE_MATOMO_MODAL = "";
const TEXT_MATOMO_MODAL = `Do you authorise us to collect data about your visit for statistical purposes in order to further develop the Boardgame-O-Matic? You can find more details, such as the option to revoke your consent at any time, in the <a ${
  privacyExternalPageLink
    ? `href="${privacyExternalPageLink}" target="_blank"`
    : `href="#" onclick="fnShowPrivacy()"`
}>privacy policy</a>.`;

// Results
const TEXT_RESULTS_HEADING = "Your Top Matches";
const TEXT_RESULTS_SUBHEADING =
  "With these board games you have the highest match";
const TEXT_LINK_TO_EXTERNAL_PAGE =
  "<i class='bx bx-link-external' ></i> View at BoardGameGeek";
const TEXT_FINETUNING_HEADING = "Finetuning";
const TEXT_FINETUNING_SUBHEADING =
  "<ul style='text-align: left; font-size: 80%;'><li>Click on the buttons to change your answers and weights</li><li>Check out the values of your matching board games for each question</li></ul>";
const TEXT_SHOW_PARTY_DESCRIPTION = `Show details <i class='bx bx-chevron-down bx-sm' ></i>`;
const TEXT_HIDE_PARTY_DESCRIPTION = `Hide details <i class='bx bx-chevron-up bx-sm' ></i>`;
const TEXT_SHOW_PARTY_ANSWERS = `Compare answers <i class='bx bx-chevron-down bx-sm' ></i>`;
const TEXT_HIDE_PARTY_ANSWERS = `Hide answers <i class='bx bx-chevron-up bx-sm' ></i>`;
const TEXT_SHOW_THESIS_ANSWERS =
  "Show values of board games <i class='bx bx-chevron-down bx-sm' ></i>";
const TEXT_HIDE_THESIS_ANSWERS =
  "Hide values of board games <i class='bx bx-chevron-up bx-sm' ></i>";

const TEXT_SHARE_AND_SAVE_HEADING = "Share or Save your Results";
const TEXT_SHARE_AND_SAVE_SUBHEADING =
  "Generate a personal link to share your results with others or to save it for yourself";

const TEXT_INFO_HEADING =
  "About the <span style='white-space: nowrap;''>Boardgame-O-Matic</span>";
const TEXT_INFO_SUBHEADING = "";
// The following words may be used as ALT-Text or headers on the results-page
const TEXT_QUESTION = "Question";
const TEXT_POSITION_PARTY = "Position of the game";
const TEXT_ANSWER_PARTY = "Answer of the game";
const TEXT_ANSWER_USER = "Your answer";
const TEXT_IMAGE = "Image";
const TEXT_PARTY = "Board game";
const TEXT_ANSWER_NORMAL = "Question is single-weighted";
const TEXT_ANSWER_DOUBLE = "Question is double-weighted";
