chrome.tabs.executeScript(null, {
  file: "/content_scripts/generate_bibtex.js"
});

chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
  chrome.tabs.sendMessage(tabs[0].id, {}, {}, function(result){
    document.getElementById("bibtex").innerHTML = result;
    return true;
  });
});
