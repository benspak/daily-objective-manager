const objectivesForm = document.getElementById('objectives-form');
const objectivesInput = document.getElementById('objectives');
const viewPastButton = document.getElementById('view-past');
const pastObjectivesDiv = document.getElementById('past-objectives');
const pastObjectivesList = document.getElementById('past-objectives-list');
const closePastButton = document.getElementById('close-past');

const STORAGE_KEY = 'dailyObjectives';

function saveObjectives(objectives) {
    const today = new Date().toISOString().split('T')[0];

    chrome.storage.local.get(STORAGE_KEY, (data) => {
        const allObjectives = Array.isArray(data[STORAGE_KEY]) ? data[STORAGE_KEY] : [];

        if (allObjectives.some(entry => entry.date === today)) {
            alert('You have already submitted objectives for today.');
            return;
        }

        allObjectives.push({
            date: today,
            objectives
        });

        chrome.storage.local.set({ [STORAGE_KEY]: allObjectives }, () => {
            alert('Objectives saved!');
            objectivesInput.value = '';
        });
    });
}

function loadPastObjectives() {
    chrome.storage.local.get(STORAGE_KEY, (data) => {
        const allObjectives = Array.isArray(data[STORAGE_KEY]) ? data[STORAGE_KEY] : []; // Ensure it's an array

        pastObjectivesList.innerHTML = '';

        allObjectives.forEach(entry => {
            const li = document.createElement('li');
            li.textContent = entry.date;
            const ul = document.createElement('ul');
            entry.objectives.forEach(obj => {
                const objLi = document.createElement('li');
                objLi.textContent = obj;
                ul.appendChild(objLi);
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteObjectives(entry.date);

            li.appendChild(ul);
            li.appendChild(deleteButton);
            pastObjectivesList.appendChild(li);
        });
    });
}


function deleteObjectives(date) {
    chrome.storage.local.get(STORAGE_KEY, (data) => {
        const allObjectives = data[STORAGE_KEY] || [];
        const filteredObjectives = allObjectives.filter(entry => entry.date !== date);

        chrome.storage.local.set({ [STORAGE_KEY]: filteredObjectives }, () => {
            loadPastObjectives();
        });
    });
}

objectivesForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const objectives = objectivesInput.value
        .split('\n')
        .map(obj => obj.trim())
        .filter(obj => obj);

    if (objectives.length === 0 || objectives.length > 5) {
        alert('Please enter up to 5 objectives.');
        return;
    }

    saveObjectives(objectives);
});

viewPastButton.addEventListener('click', () => {
    loadPastObjectives();
    pastObjectivesDiv.style.display = 'block';
});

closePastButton.addEventListener('click', () => {
    pastObjectivesDiv.style.display = 'none';
});
