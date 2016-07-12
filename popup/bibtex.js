chrome.tabs.executeScript(null, {
  file: "/content_scripts/extract_data.js"
});

var data;

chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
  chrome.tabs.sendMessage(tabs[0].id, {}, {}, function(result){
    data = result;
    var bibtex = document.getElementById('bibtex');
    bibtex.parentElement.replaceChild(buildFromTemplate(getTemplate()), bibtex);
    ["author", "title", "year", "url", "urldate"].forEach(function(currentValue, index, array){
      document.getElementById(currentValue).appendChild(document.createTextNode(data[currentValue][0]));
    });
    return true;
  });
});

function getTemplate(){

  return "@online{cite_key,$newline$" +
    "$indent$author = {$author$},$newline$" + 
    "$indent$title = {$title$},$newline$" + 
    "$indent$year = $year$,$newline$" + 
    "$indent$url = {$url$},$newline$" +
    "$indent$urldate = {$urldate$}$newline$" +
    "}";

}

function displayMenu(e){
  var div = document.createElement("div");
  var ul = document.createElement("ul");
  ul.classList.add("menu");
  div.id = 'container';
  div.style.left = e.pageX + 'px';
  div.style.top = e.pageY + 'px';
  div.appendChild(ul);

  //populate menu
  var id = e.target.id;
  data[id].forEach(function(currentElement, index, array){
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(currentElement));
    ul.appendChild(li);
  });

  ul.addEventListener("click", function(e){
    if(e.target.tagName == "LI"){
      var li = document.getElementById(id);
      li.replaceChild(document.createTextNode(e.target.textContent), li.childNodes[0]);
    }
    div.remove();
  });
  document.body.appendChild(div);
}

function buildFromTemplate(template){

  var p = document.createElement("p");
  p.addEventListener('click', displayMenu);

  templateSplit = template.split("$");
  templateSplit.forEach(function(currentValue, index, array){
    if(["author", "title", "year", "url", "urldate"].includes(currentValue)){
      var span = document.createElement("span");
      span.id = currentValue;
      p.appendChild(span);
    }
    else if(currentValue == "indent"){
      p.appendChild(document.createTextNode("\u00A0\u00A0\u00A0\u00A0"));
    }
    else if(currentValue == "newline"){
      p.appendChild(document.createElement("br"));
    }
    else {
      p.appendChild(document.createTextNode(currentValue));
    }
  });

  return p;

}

