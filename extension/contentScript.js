// Detect when a word is selected on the webpage
document.addEventListener("mouseup", function () {
  const selectedText = window.getSelection().toString().trim();

  // If a word is selected, send the word to the popup
  if (selectedText) {
    chrome.runtime.sendMessage({ type: "WORD_SELECTED", word: selectedText });
  }
});
