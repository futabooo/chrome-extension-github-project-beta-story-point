const showTableLayoutStoryPoints = () => {
  console.log("showTableLayoutStoryPoints");
};

// FIXME: Unable to calculate the amount of invisible cards
const showBoardLayoutStoryPoints = () => {
  console.log("showBoardLayoutStoryPoints");
  for (const node of document.querySelectorAll(`[data-board-column]`)) {
    const storyPoints = Array.from(
      node.querySelectorAll(`[data-test-id="custom-label-Story Point"]`)
    ).map((el) => parseInt(el.innerText));
    if (storyPoints.length == 0) {
      continue;
    }
    const totalStoryPoint = storyPoints.reduce(reducer);

    const columnCunterNode = node.querySelector(
      '[data-test-id="column-counter"]'
    );
    const columnCunterParentNode = columnCunterNode.parentNode;
    const totalStoryPointNode =
      columnCunterParentNode.querySelector(`.total-story-point`);
    if (totalStoryPointNode !== null) {
      totalStoryPointNode.innerText = `${totalStoryPoint}pt`;
    } else {
      const div = document.createElement("div");
      div.innerHTML = `<span class="total-story-point doGlGu">${totalStoryPoint}pt</span>`;
      columnCunterParentNode.insertBefore(
        div.firstChild,
        columnCunterNode.nextSibling
      );
    }
  }
};

const isBoardLayout = () =>
  document.querySelector(`[data-test-id="board-view"]`) !== null;

const reducer = (previousValue, currentValue) => previousValue + currentValue;

const debounce = (f, ms) => {
  let interval = false;
  return function () {
    if (interval) return;
    f.apply(this, arguments);
    interval = true;
    setTimeout(() => (interval = false), ms);
  };
};

const boardObserver = new MutationObserver(() => {
  console.log("board Changed");
  debounce(showBoardLayoutStoryPoints(), 500);
});

const taleObserver = new MutationObserver(() => {
  console.log("table Changed");
  debounce(showTableLayoutStoryPoints(), 500);
});

const startTargetObserve = () => {
  if (isBoardLayout()) {
    const boardTarget = document.querySelector(`[data-test-id="board-view"]`);
    boardObserver.observe(boardTarget, { attributes: true, subtree: true });
  } else {
    const tableTarget = document.querySelector(
      `[data-test-id="table-scroll-container"]`
    );
    taleObserver.observe(tableTarget, { attributes: true, subtree: true });
  }
};

const stopTargetObserve = () => {
  taleObserver.disconnect();
  boardObserver.disconnect();
};

const viewTarget = document.querySelector(`[aria-label="Select view"]`);

const viewObserver = new MutationObserver(() => {
  console.log("tab changed");
  stopTargetObserve();
  startTargetObserve();
});

viewObserver.observe(viewTarget, { attributes: true, subtree: true });

window.onload = () => {
  if (isBoardLayout()) {
    showBoardLayoutStoryPoints();
  } else {
    showTableLayoutStoryPoints();
  }
  startTargetObserve();
};
