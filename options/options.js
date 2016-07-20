function saveSettings(){

  var template = document.getElementById("template").value;
  chrome.storage.local.set({template: template});

}

function resetTemplate(){

  var template = `@online{cite_key,
    author = {$author$},
    title = {$title$},
    year = $year$,
    url = {$url$},
    urldate = {$urldate$}
}`;

  chrome.storage.local.set({template: template});

  return template;
}

function getTemplate(callback){

  chrome.storage.local.get("template", function(result){
    if(result.template == undefined)
      return callback(resetTemplate());
    return callback(result.template);
  });

}

getTemplate(function(template){
  document.getElementById("template").appendChild(document.createTextNode(template));
});

document.getElementById("save").addEventListener("click", saveSettings);
