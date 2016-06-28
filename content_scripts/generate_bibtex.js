function getAuthor(){

  var selectorsInnerHTML = ['[itemprop=author]'];
  var selectorsAttribute = [['meta[name=author]', 'content']];
  var result = [];
    
  selectorsInnerHTML.forEach(function(currentValue, index, array){
    var tag = document.querySelector(currentValue);
    if(tag != null){
      result.push(tag.innerHTML);
    }
  });

  selectorsAttribute.forEach(function(currentValue, index, array){
    var tag = document.querySelector(currentValue[0]);
    if(tag != null){
      result.push(tag.getAttribute(currentValue[1]));
    }
  });

  return result;

}

function getTitle(){

  return [document.title];

}

function getYear(){

  return document.querySelector('[itemprop=datePublished]').innerHTML.match(/(\D|^)\d\d\d\d(\D|$)/g);

}

function getURL(){

  return [window.location]

}

function getURLDate(){

  var now = new Date();
  var mon = now.getMonth()+1;

  return [now.getFullYear() + "-" + mon + "-" + now.getDate()];

}

function bibtex(request, sender, sendResponse){
  
  var bibtex = "@online{cite_key, <br>" +
    "$indent$author = {$author$},<br>" + 
    "$indent$title = {$title$},<br>" + 
    "$indent$year = $year$,<br>" + 
    "$indent$url = {$url$},<br>" +
    "$indent$urldate = {$urldate$}<br>" +
    "}";

  bibtex = bibtex.replace("$author$", getAuthor()[0]);
  bibtex = bibtex.replace("$title$", getTitle()[0]);
  bibtex = bibtex.replace("$year$", getYear()[0]);
  bibtex = bibtex.replace("$url$", getURL()[0]);
  bibtex = bibtex.replace("$urldate$", getURLDate()[0]);

  bibtex = bibtex.replace(/\$indent\$/g, "&nbsp;&nbsp");

  sendResponse(bibtex);
  chrome.runtime.onMessage.removeListener(bibtex);

  return true;
}

chrome.runtime.onMessage.addListener(bibtex);
