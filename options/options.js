function saveSettings(){

  var template = document.getElementById("template").value;
  chrome.storage.local.set({template: template}, function(){
    if(!chrome.runtime.lastError){
      document.getElementById("fieldset").style.border = "solid green";
      window.setTimeout(function(){
        document.getElementById("fieldset").style.border = "solid black";
      }, 1000);
    }
  });

}

function clearStorage(){
  chrome.storage.local.remove("template");
}

function displayCurrentTemplate(){
  chrome.storage.local.get("template", function(result){
    var textarea = document.createElement("textarea");
    textarea.id = "template";
    textarea.appendChild(document.createTextNode(result.template));
    var textareaOld = document.getElementById("template");
    textareaOld.parentNode.replaceChild(textarea, textareaOld);
    return true;
  });
}

chrome.storage.onChanged.addListener(displayCurrentTemplate);

document.getElementById("save").addEventListener("click", saveSettings);
document.getElementById("reset").addEventListener("click", clearStorage);
displayCurrentTemplate();
