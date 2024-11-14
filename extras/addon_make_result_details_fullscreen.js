function setMutationObserverFullscreenResultDetails() {
  const target = document.querySelector("#resultsHeading");
  var observer = new MutationObserver(addEventListenersFullscreenResultDetails);
  var config = {
    attributes: true,
    childList: true,
    subtree: true,
  };
  observer.observe(target, config);
}

function addCssFullscreenResultDetails() {
  const stylesheet = document.createElement("style");
  stylesheet.setAttribute("id", "resultDetailsFullPageCSS");
  stylesheet.textContent = `.fullscreen-result-details-overlay {
          min-height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          background-color: #fff;
          z-index: 1000;
  
        }
        .fullscreen-result-details-content {
          max-height: calc(100vh - 50px);        /* Restricts content height to viewport */
          overflow-y: auto; 
          padding-bottom: 40px;
        }
        
        .fullscreen-result-details-close {
          width: 100%;
          position: fixed;
          bottom: 0;
          left: 0;
          height: 50px;
          font-size: 1.1rem;
          background: var(--primary-color);
          color: var(--text-on-primary);
          transition: transform 3s;
          transform: translateY(0);
          
        }
        .fullscreen-result-details-close-out-of-screen {
          transform: translateY(50px) !important;
        }

        `;
  if (HIDE_TABLE_resultsByPartyAnswers)
    stylesheet.textContent += `
        [id^="resultsShortPartyDetails"] .nonexpanded {
          display: none;
        }`;
  document.head.appendChild(stylesheet);
}

function addEventListenersFullscreenResultDetails() {
  if (!document.querySelector("#resultsHeading").textContent) return;
  document
    .querySelectorAll("[id^='resultsShortPartyDescriptionButton']")
    .forEach((btnExpand) => {
      btnExpand.addEventListener("click", () => {
        function makeResultDetailsFullscreen() {
          function addClosingButton() {
            const btnClose = document.createElement("button");
            btnClose.innerHTML = TEXT_BUTTON_CLOSE_FULLSCREEN_EVENT_DETAILS;
            btnClose.addEventListener("click", () => {
              btnExpand.click();
            });
            sectionResult.parentNode.appendChild(btnClose);
            btnClose.classList.add(
              "fullscreen-result-details-close",
              "fullscreen-result-details-close-out-of-screen"
            );
            setTimeout(() => {
              btnClose.classList.remove(
                "fullscreen-result-details-close-out-of-screen"
              );
            }, 10);
          }
          if (btnExpand.classList.contains("expanded")) {
            sectionResult.scrollIntoView({ behavior: "smooth" });
            const wrapperDiv = document.createElement("div");
            wrapperDiv.classList.add("fullscreen-result-details-overlay");
            sectionResult.classList.add("fullscreen-result-details-content");
            setTimeout(() => {
              sectionResult.parentNode.insertBefore(wrapperDiv, sectionResult);
              wrapperDiv.appendChild(sectionResult);
              document.body.style.overflow = "hidden";
              addClosingButton();
            }, 500);
          } else {
            const wrapperDiv = sectionResult.parentNode;
            wrapperDiv.parentNode.insertBefore(sectionResult, wrapperDiv);
            wrapperDiv.remove();
            sectionResult.classList.remove("fullscreen-result-details-content");
            document.body.style.overflow = "unset";
            sectionResult.scrollIntoView({ behavior: "smooth" });
          }
        }

        const sectionResult = btnExpand.parentNode.parentNode.parentNode;
        makeResultDetailsFullscreen();
      });
    });
}

window.addEventListener("load", () => {
  if (window.innerWidth > 768) return;
  setMutationObserverFullscreenResultDetails();
  addCssFullscreenResultDetails();
});
