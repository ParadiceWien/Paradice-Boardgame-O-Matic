/*
 * Rewrite content of tabs
 * Replace Mutation Observers with message event (and https://github.com/fenglisch/boardgame-o-matic/issues/23)
 * Circulate between sharing and saving icon
 * Add button "See updated results" after changing filters or personal answers (maybe bx-tada )
 * Add button "Change filters" if no results match all filters
 * Add desktop view
 */

function setMutationObserverResultsViewInTabs() {
  const target = document.querySelector("#resultsHeading");
  var observer = new MutationObserver(dummyFunctionAbc);
  var config = {
    attributes: true,
    childList: true,
    subtree: true,
  };
  observer.observe(target, config);

  function dummyFunctionAbc() {
    if (!document.querySelector("#resultsHeading").textContent) return;
    observer.disconnect();

    document.querySelector("#separator-results-sections").remove();
    document.querySelector("#results").classList.add("activeTab");

    const bottomNavigationBar = document.createElement("div");
    bottomNavigationBar.setAttribute("id", "bottomNavigationBar");
    document.body.appendChild(bottomNavigationBar);
    const arTabs = [
      {
        icon: "bx-slider-alt",
        id: "finetuning",
        nodeToBeMoved:
          document.querySelector("#resultsByThesis").parentNode.parentNode,
      },
      {
        icon: "bx-filter-alt",
        id: "filters",
        nodeToBeMoved: document.querySelector("#resultsAddonTop"),
      },
      {
        icon: "bx-trophy",
        id: "results",
        nodeToBeMoved: false,
      },
      {
        icon: "bx-share-alt",
        id: "shareAndSave",
        nodesToBeMoved: document.querySelectorAll(
          "#permalink-button, #permalink-description"
        ),
      },
      {
        icon: "bx-info-circle",
        id: "info",
        nodeToBeMoved: document.querySelector("#resultsIntro"),
      },
    ];
    arTabs.forEach((tab) => {
      const tabBtnContainer = document.createElement("div");
      tabBtnContainer.innerHTML = `<button id='${tab.id}TabBtn' ${
        tab.id === "results" ? "class='activeTabBtn'" : ""
      }><i class='bx ${tab.icon}'></i></button>`;
      tabBtnContainer
        .querySelector("button")
        .parentNode.addEventListener("click", () => {
          const oldActiveTab = document.querySelector(".activeTab");
          const newActiveTab = document.querySelector(`#${tab.id}`);
          if (oldActiveTab === newActiveTab) return;
          animateTabs(arTabs, oldActiveTab, newActiveTab);

          document
            .querySelector(".activeTabBtn")
            .classList.remove("activeTabBtn");
          document
            .querySelector(`.${tab.icon}`)
            .parentNode.classList.add("activeTabBtn");
        });
      document
        .querySelector("#bottomNavigationBar")
        .appendChild(tabBtnContainer);
      if (!tab.nodeToBeMoved && !tab.nodesToBeMoved) return;
      const nodeTab = document.createElement("div");
      nodeTab.setAttribute("id", tab.id);
      nodeTab.classList.add("row", "d-none");
      nodeTab.innerHTML = "<div class='col'></div>";
      if (tab.nodeToBeMoved)
        nodeTab.querySelector(".col").appendChild(tab.nodeToBeMoved);
      else if (tab.nodesToBeMoved) {
        tab.nodesToBeMoved.forEach((node) => {
          nodeTab.querySelector(".col").appendChild(node);
        });
      }
      document.querySelector("#sectionResults").appendChild(nodeTab);
    });
  }
}

function addCssResultsViewInTabs() {
  const stylesheet = document.createElement("style");
  stylesheet.setAttribute("id", "resultsViewInTabsCSS");
  stylesheet.textContent += `
        #bottomNavigationBar {
            height: 70px;
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            color: var(--text-on-primary);
            z-index: 500;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
        }
        #bottomNavigationBar div {
            flex: 1 0 auto;
            display: flex;
            justify-content: center;
            background-color: var(--primary-color);
            height: 100%;
            font-size: 30px;
  
          }

          #sectionResults {
            overflow: hidden;
          }

          #bottomNavigationBar button {
            width: 100%;
            margin: 8px 5px;
            background-color: transparent;
            border: none;
            border-radius: 10px;
            padding-bottom: 100px;
          }

          #bottomNavigationBar div:nth-child(3) {
            height: 100px;
            font-size: 45px;
            border-radius: 10px;
          }

          #bottomNavigationBar div:nth-child(3) button {
            width: 80%;
          }

          .activeTabBtn {
            background-color: #fff !important;
          }
          `;
  document.head.appendChild(stylesheet);
}

window.addEventListener("load", () => {
  if (window.innerWidth > 768) return;
  setMutationObserverResultsViewInTabs();
  addCssResultsViewInTabs();
});

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

// let btn = document.querySelector("#shareAndSaveTabBtn i")
// btn.style.transition = "opacity .6s"
// function toggleIcon() {
// btn.style.opacity = "0";
// setTimeout(() => {
//   if (btn.classList.contains("bx-share-alt")) {
//     btn.classList.remove("bx-share-alt");
// btn.classList.add("bx-save");
//   } else {
//         btn.classList.add("bx-share-alt");
// btn.classList.remove("bx-save");
//   }
//   btn.style.opacity = "1";
//   }, 600)
// }

// setInterval(toggleIcon, 8000)
