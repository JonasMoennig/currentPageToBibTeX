function resetTemplate(){

  var template = `@online{cite_key,
    author = {$author$},
    title = {$title$},
    year = $year$,
    url = {$url$},
    urldate = {$urldate$}
}`;

  chrome.storage.local.set({template: template});

}

function initializeStorage(){
  chrome.storage.local.get("template", function(result){
    if(result.template == undefined && !chrome.runtime.lastError)
      resetTemplate();
  });
}

initializeStorage();

chrome.storage.onChanged.addListener(initializeStorage);
