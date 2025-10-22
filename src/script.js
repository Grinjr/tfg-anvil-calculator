const darkModeIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#cccccc" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M20.958 15.325c.204-.486-.379-.9-.868-.684a7.684 7.684 0 0 1-3.101.648c-4.185 0-7.577-3.324-7.577-7.425a7.28 7.28 0 0 1 1.134-3.91c.284-.448-.057-1.068-.577-.936C5.96 4.041 3 7.613 3 11.862C3 16.909 7.175 21 12.326 21c3.9 0 7.24-2.345 8.632-5.675Z"/><path fill="currentColor" d="M15.611 3.103c-.53-.354-1.162.278-.809.808l.63.945a2.332 2.332 0 0 1 0 2.588l-.63.945c-.353.53.28 1.162.81.808l.944-.63a2.332 2.332 0 0 1 2.588 0l.945.63c.53.354 1.162-.278.808-.808l-.63-.945a2.332 2.332 0 0 1 0-2.588l.63-.945c.354-.53-.278-1.162-.809-.808l-.944.63a2.332 2.332 0 0 1-2.588 0l-.945-.63Z"/></svg>`;

const lightModeIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#333" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12 1.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0V2a.75.75 0 0 1 .75-.75Z"/><path fill="currentColor" fill-rule="evenodd" d="M6.25 12a5.75 5.75 0 1 1 11.5 0a5.75 5.75 0 0 1-11.5 0ZM12 7.75a4.25 4.25 0 1 0 0 8.5a4.25 4.25 0 0 0 0-8.5Z" clip-rule="evenodd"/><path fill="currentColor" d="M5.46 4.399a.75.75 0 0 0-1.061 1.06l.707.707a.75.75 0 1 0 1.06-1.06l-.707-.707ZM22.75 12a.75.75 0 0 1-.75.75h-1a.75.75 0 0 1 0-1.5h1a.75.75 0 0 1 .75.75Zm-3.149-6.54a.75.75 0 1 0-1.06-1.061l-.707.707a.75.75 0 1 0 1.06 1.06l.707-.707ZM12 20.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1a.75.75 0 0 1 .75-.75Zm6.894-2.416a.75.75 0 1 0-1.06 1.06l.707.707a.75.75 0 1 0 1.06-1.06l-.707-.707ZM3.75 12a.75.75 0 0 1-.75.75H2a.75.75 0 0 1 0-1.5h1a.75.75 0 0 1 .75.75Zm2.416 6.894a.75.75 0 0 0-1.06-1.06l-.707.707a.75.75 0 0 0 1.06 1.06l.707-.707Z"/></svg>`;

document.addEventListener('DOMContentLoaded', function() {
  initializeMode();

  document.querySelectorAll('.action-icon').forEach(icon => {
    icon.src = '../res/empty.png';
    icon.setAttribute('data-action', '');
  });

  const defaults = ['last', 'second-last', 'third-last'];
  document.querySelectorAll('.instruction-set').forEach((set, index) => {
    const select = set.querySelector('.priority');
    if (select) {
      select.value = defaults[index] || '';
    }
  });

  document.getElementById('target-value').value = '';
  document.getElementById('result').classList.remove('visible');
});

// Event listener for the dark mode toggle switch
document.getElementById('mode-toggle-checkbox').addEventListener('change', function () {
  if (this.checked) {
    document.body.classList.remove('light-mode');
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'true');
    updateGitHubIconColor(true);
  } else {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    localStorage.setItem('darkMode', 'false');
    updateGitHubIconColor(false);
  }
  updateModeIcon();
});

// Function to update the mode icon
function updateModeIcon() {
  const isDarkMode = document.body.classList.contains('dark-mode');
  const modeIcon = document.getElementById('mode-icon');
  modeIcon.innerHTML = isDarkMode ? darkModeIcon : lightModeIcon;
}

// Set dark mode as default and handle mode persistence
function initializeMode() {
  const storedMode = localStorage.getItem('darkMode');
  const darkModeEnabled = storedMode === null ? true : storedMode === 'true';
  const modeToggle = document.getElementById('mode-toggle-checkbox');

  if (darkModeEnabled) {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    modeToggle.checked = true;
    updateGitHubIconColor(true);
  } else {
    document.body.classList.add('light-mode');
    document.body.classList.remove('dark-mode');
    modeToggle.checked = false;
    updateGitHubIconColor(false);
  }
  updateModeIcon();
}

// Helper function to create an image element for a given action
function createActionImage(action) {
  const img = document.createElement("img");
  img.src = `../res/${action}.png`;  // Assuming all images are named after the action
  img.alt = action;
  const capitalizedAction = action.charAt(0).toUpperCase() + action.slice(1);
  img.title = capitalizedAction;
  img.classList.add("result-icon");
  return img;
}

// Function to apply tooltips to existing action icons in the instruction set and popup
function applyTooltipToIcon(iconElement) {
  const action = iconElement.getAttribute("data-action");
  if (action) {
    const capitalizedAction = action.charAt(0).toUpperCase() + action.slice(1);
    iconElement.title = capitalizedAction;
  } else if (action === "") {
    iconElement.title = "None";
  }
}

document.getElementById("calculate-button").addEventListener("click", function() {
  const targetValue = parseInt(document.getElementById("target-value").value);

  // Collect and filter instructions
  const instructions = [];
  document.querySelectorAll("[class^='instruction-set']").forEach((set) => {
    const actionElement = set.querySelector(".action-icon");
    const action = actionElement.getAttribute("data-action");
    const priority = set.querySelector(".priority").value;
    if (action && priority) {
      instructions.push({ action, priority });
    }
  });

  // Action values
  const actions = {
    punch: 2,
    bend: 7,
    upset: 13,
    shrink: 16,
    hit1: -3,
    hit2: -6,
    hit3: -9,
    draw: -15
  };

  function selectBestHit(preTargetValue, remainingHits) {
    let bestHitAction = null;
    let minActions = Infinity;

    remainingHits.forEach(hit => {
      const hitValue = actions[hit];
      const actionsNeeded = Math.ceil(preTargetValue / hitValue);
      if (actionsNeeded < minActions && (preTargetValue % hitValue === 0 || preTargetValue + hitValue <= targetValue)) {
        minActions = actionsNeeded;
        bestHitAction = hit;
      }
    });

    return bestHitAction;
  }

  function displayGroupedActions(container, actions) {
    let i = 0;
    while (i < actions.length) {
      const current = typeof actions[i] === "string" ? actions[i] : actions[i].action;
      let count = 1;
      while (i + count < actions.length &&
             (typeof actions[i + count] === "string" ? actions[i + count] : actions[i + count].action) === current) {
        count++;
      }

      const wrapper = document.createElement("div");
      wrapper.classList.add("action-with-count");
      const img = createActionImage(current);
      wrapper.appendChild(img);

      if (count > 1) {
        const countText = document.createElement("div");
        countText.classList.add("action-count");
        countText.textContent = `×${count}`;
        wrapper.appendChild(countText);
      }

      container.appendChild(wrapper);
      i += count;
    }
  }


  function calculateSetupActions(targetValue, instructions) {
    // First, apply the instructions that already have actions
    let instructionSum = 0;
    instructions.forEach(instr => {
      if (instr.action === "hit") {
        // Pick best hit for the current remaining target
        const bestHit = selectBestHit(targetValue - instructionSum, ["hit1", "hit2", "hit3"]);
        instructionSum += actions[bestHit];
        instr.action = bestHit;
      } else {
        instructionSum += actions[instr.action];
      }
    });
  
    let preTargetValue = targetValue - instructionSum;
    if (preTargetValue === 0) return [];
  
    // --- BFS First ---
    const queue = [[0, []]]; // [currentValue, path]
    const visited = new Map(); // value => shortest path length
    visited.set(0, 0);
    const MAX_BFS_STEPS = 15;
  
    while (queue.length > 0) {
      const [currentValue, path] = queue.shift();
  
      if (currentValue === preTargetValue) return path;
      if (path.length >= MAX_BFS_STEPS) continue;
  
      // Try moves that get closer first
      const sortedActions = Object.entries(actions)
        .sort(([, value]) => Math.abs(preTargetValue - (currentValue + value)));
  
      for (let [action, value] of sortedActions) {
        const nextValue = currentValue + value;
  
        if (!visited.has(nextValue) || visited.get(nextValue) > path.length + 1) {
          visited.set(nextValue, path.length + 1);
          queue.push([nextValue, [...path, action]]);
        }
      }
    }
  
    // --- BFS failed, fallback to greedy ---
    let greedyValue = 0;
    const greedyPath = [];
    const MAX_GREEDY_STEPS = 20;
  
    for (let i = 0; i < MAX_GREEDY_STEPS && greedyValue !== preTargetValue; i++) {
      let bestAction = null;
      let bestDistance = Math.abs(preTargetValue - greedyValue);
  
      for (let action in actions) {
        const nextValue = greedyValue + actions[action];
        const distance = Math.abs(preTargetValue - nextValue);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestAction = action;
        }
      }
  
      if (!bestAction) break; // no improvement possible
  
      greedyValue += actions[bestAction];
      greedyPath.push(bestAction);
    }
  
    return greedyPath;
  }

  function sortInstructions(instructions) {
    const last = instructions.filter(i => i.priority === 'last');
    const secondLast = instructions.filter(i => i.priority === 'second-last');
    const thirdLast = instructions.filter(i => i.priority === 'third-last');
    const notLast = instructions.filter(i => i.priority === 'not-last');
    const anyPriority = instructions.filter(i => i.priority === 'any');

    let sortedInstructions = [...thirdLast, ...secondLast, ...notLast, ...last];

    if (anyPriority.length > 0) {
      const anyHits = anyPriority.map(i => i);

      let insertionPoint = 0;
      if (last.length > 0 && secondLast.length > 0) {
        insertionPoint = sortedInstructions.length - last.length - secondLast.length;
      } else if (last.length > 0) {
        insertionPoint = sortedInstructions.length - last.length;
      } else {
        insertionPoint = sortedInstructions.length;
      }

      sortedInstructions.splice(insertionPoint, 0, ...anyHits);
    }

    return sortedInstructions;
  }

  const setupActions = calculateSetupActions(targetValue, instructions);
  const sortedInstructions = sortInstructions(instructions);

  // Display results as images
  const setupContainer = document.getElementById("setup-actions");
  const finalContainer = document.getElementById("final-actions");

  // Clear previous results
  setupContainer.innerHTML = "";
  finalContainer.innerHTML = "";

  // Group and append setup actions
  displayGroupedActions(setupContainer, setupActions);

  // Group and append final instructions
  displayGroupedActions(finalContainer, sortedInstructions);

  // Show the result card with a transition
  const resultCard = document.getElementById("result");
  resultCard.classList.add("visible");
});

// Single function to manage icon selection
function setupInstructionListener(selector) {
  const icon = document.querySelector(selector + ' .action-icon');
  const container = document.querySelector('.container');
  const popup = document.getElementById('action-popup');
  const popupContent = document.querySelector('.action-popup-content');
  const header = document.querySelector('.app-header');


  icon.addEventListener('click', function() {
    const currentIcon = this;
    popup.classList.remove('hidden');
    container.classList.add('blurred');

    // Remove all existing listeners on popup icons
    document.querySelectorAll('.popup-action-icon').forEach(popupIcon => {
      popupIcon.onclick = null;
    });

    // Add listener to popup icons for the current selection
    document.querySelectorAll('.popup-action-icon').forEach(popupIcon => {
      // Apply tooltip to each popup icon
      applyTooltipToIcon(popupIcon);

      popupIcon.onclick = function() {
        currentIcon.src = this.src;
        currentIcon.setAttribute('data-action', this.getAttribute('data-action'));
        closePopup();
      };
    });

    // Close popup when clicking outside of it
    function handleOutsideClick(event) {
      if (!popupContent.contains(event.target) &&
          !icon.contains(event.target) &&
          !header.contains(event.target)) {
        closePopup();
      }
    }

    document.addEventListener('click', handleOutsideClick);

    function closePopup() {
      popup.classList.add('hidden');
      container.classList.remove('blurred');
      document.removeEventListener('click', handleOutsideClick);
    }

    document.getElementById('close-popup').onclick = closePopup;
  });

  // Apply tooltip to the instruction set icon on load
  applyTooltipToIcon(icon);
}

function resetPage() {
  // Reset target value input
  document.getElementById('target-value').value = '';

  // Reset instruction sets
  const defaults = ['last', 'second-last', 'third-last'];
  document.querySelectorAll('.instruction-set').forEach((set, index) => {
    const actionIcon = set.querySelector('.action-icon');
    actionIcon.src = '../res/empty.png';
    actionIcon.setAttribute('data-action', '');
    actionIcon.title = 'None';

    const prioritySelect = set.querySelector('.priority');
    if (prioritySelect) {
      prioritySelect.value = defaults[index] || '';
    }
  });

  // Hide result card
  const resultCard = document.getElementById('result');
  resultCard.classList.remove('visible');

  // Clear setup and final actions
  document.getElementById('setup-actions').innerHTML = '';
  document.getElementById('final-actions').innerHTML = '';
}

function updateGitHubIconColor(isDarkMode) {
  const githubIcon = document.getElementById('github-icon');
  if (githubIcon) {
    githubIcon.style.fill = isDarkMode ? '#ffffff' : '#24292f';
  }
}

// Call resetPage on window load
window.addEventListener('load', resetPage);

// Apply listeners to each instruction set
setupInstructionListener('.instruction-set-1');
setupInstructionListener('.instruction-set-2');
setupInstructionListener('.instruction-set-3');

