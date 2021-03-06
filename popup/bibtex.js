chrome.tabs.executeScript(null, {
  file: "/content_scripts/extract_data.js"
});

var data;

chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
  chrome.tabs.sendMessage(tabs[0].id, {}, {}, function(result){
    data = result;
    var bibtex = document.getElementById('bibtex');
    getTemplate(function(template){
      bibtex.parentElement.replaceChild(buildFromTemplate(template), bibtex);
      ["author", "title", "year", "url", "urldate", "cite_key"].forEach(function(currentValue, index, array){
        var span = document.getElementById(currentValue);
        if(span != null){
          span.appendChild(document.createTextNode(data[currentValue][0]));
        }
      });
    });
    return true;
  });
});

function getTemplate(callback){

  chrome.storage.local.get("template", function(result){
    return callback(result.template);
  });

}

function displayMenu(e){
  var div = document.createElement("div");
  var ul = document.createElement("ul");
  ul.classList.add("menu");
  div.id = 'container';
  div.style.left = e.pageX + 'px';
  div.style.top = e.pageY + 'px';
  div.appendChild(ul);

  div.addEventListener("mouseleave", function(e){
    div.remove();
  });

  //populate menu
  var id = e.target.id;
  if(data[id].length == 1){
    return;
  }
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

  var pre = document.createElement("pre");
  pre.addEventListener('click', displayMenu);
  pre.setAttribute("contenteditable", "");

  templateSplit = template.split("$");
  templateSplit.forEach(function(currentValue, index, array){
    if(["author", "title", "year", "url", "urldate", "cite_key"].includes(currentValue)){
      var span = document.createElement("span");
      span.id = currentValue;
      pre.appendChild(span);
    }
    else {
        pre.appendChild(document.createTextNode(currentValue));
    }
  });

  return pre;

}

