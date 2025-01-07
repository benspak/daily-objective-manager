document.addEventListener('DOMContentLoaded', () => {
  const backButton = document.getElementById('back-button');
  if (backButton) {
    backButton.addEventListener('click', () => {
      window.close();
    });
  }

  async function loadHistory() {
    const storage = await chrome.storage.local.get(['objectives']);
    const objectives = storage.objectives || {};

    const historyList = document.getElementById('history-list');
    if (!historyList) {
      console.error('History list element not found.');
      return;
    }
    historyList.innerHTML = '';

    for (const [date, objs] of Object.entries(objectives)) {
      // Handle non-array data gracefully
      if (!Array.isArray(objs)) {
        console.warn(`Skipping invalid data format for date ${date}:`, objs);
        continue;
      }

      const listItem = document.createElement('li');
      listItem.innerHTML = `<strong>${date}</strong><ul>${objs.map(obj => `<li>${obj}</li>`).join('')}</ul>`;
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', async () => {
        delete objectives[date];
        await chrome.storage.local.set({ objectives });
        loadHistory();
      });
      listItem.appendChild(deleteButton);
      historyList.appendChild(listItem);
    }
  }

  loadHistory();
});
