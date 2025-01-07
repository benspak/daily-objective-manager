document.getElementById('submit-button').addEventListener('click', async (e) => {
  e.preventDefault();

  const objectivesInput = document.getElementById('objectives-input').value.trim();
  if (!objectivesInput) return alert('Please enter at least one objective.');

  const objectives = objectivesInput.split('\n').map(obj => obj.trim()).filter(obj => obj);

  if (objectives.length !== 5) {
    return alert('Please enter exactly 5 objectives.');
  }

  const today = new Date().toISOString().split('T')[0];
  const storage = await chrome.storage.local.get(['objectives']);

  const updatedObjectives = storage.objectives || {};

  // Save objectives only as an array
  if (Array.isArray(updatedObjectives[today])) {
    return alert('Objectives for today are already submitted.');
  }

  updatedObjectives[today] = objectives; // Ensure it's an array
  await chrome.storage.local.set({ objectives: updatedObjectives });

  alert('Objectives saved successfully!');
  document.getElementById('objectives-input').value = '';
});

document.getElementById('history-button').addEventListener('click', () => {
  window.open('history.html');
});
