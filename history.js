async function loadHistory() {
  const storage = await chrome.storage.local.get("dailyObjectives");
  const dailyObjectives = storage.dailyObjectives || {};

  const historyDiv = document.getElementById("history");
  historyDiv.innerHTML = "";

  for (const [date, objectives] of Object.entries(dailyObjectives)) {
    const dayEntry = document.createElement("div");
    dayEntry.className = "day-entry";

    const dateTitle = document.createElement("h4");
    dateTitle.textContent = date;

    const objectivesList = document.createElement("ul");
    objectives.forEach((obj) => {
      const listItem = document.createElement("li");
      listItem.textContent = obj;
      objectivesList.appendChild(listItem);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", async () => {
      delete dailyObjectives[date];
      await chrome.storage.local.set({ dailyObjectives });
      loadHistory();
    });

    dayEntry.appendChild(dateTitle);
    dayEntry.appendChild(objectivesList);
    dayEntry.appendChild(deleteBtn);

    historyDiv.appendChild(dayEntry);
  }
}

document.addEventListener("DOMContentLoaded", loadHistory);
