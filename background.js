// Service worker setup
chrome.runtime.onInstalled.addListener(() => {
  console.log("Daily Objectives plugin installed!");

  // Create a daily alarm
  chrome.alarms.create("dailyReminder", {
    delayInMinutes: 1, // 1 minute after installation
    periodInMinutes: 1440 // Repeat every 24 hours
  });
});

// Handle the alarm when triggered
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "dailyReminder") {
    console.log("Daily reminder triggered!");
    chrome.storage.local.set({ newDay: true });
  }
});
