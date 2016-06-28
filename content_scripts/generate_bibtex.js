//returned array is guaranteed to not contain null values
function queryStuff(selectorsInnerHTML, selectorsAttribute){

  var result = [];
    
  selectorsInnerHTML.forEach(function(currentValue, index, array){
    var tag = document.querySelector(currentValue);
    if(tag != null){
      if(tag.innerHTML !== "")
        result.push(tag.innerHTML);
    }
  });

  selectorsAttribute.forEach(function(currentValue, index, array){
    var tag = document.querySelector(currentValue[0]);
    if(tag != null){
      var attr = tag.getAttribute(currentValue[1]);
      if(attr != null)
        result.push(attr);
    }
  });

  return result;

}

function getAuthor(){

  var selectorsInnerHTML = [
    '[rel=author] > [itemprop=name]',
    '[itemprop=author] > *',
    '[itemprop=author]'
  ];
  var selectorsAttribute = [['meta[name=author]', 'content']];

  var result = queryStuff(selectorsInnerHTML, selectorsAttribute);

  if(result.length != 0)
    return result;
  else
    return [""];

}

function getTitle(){

  var selectorsInnerHTML = [
    'h1[class*=headline]', 
    'h2[class*=headline]', 
    'h3[class*=headline]', 
    '[itemtype="http://schema.org/CreativeWork"] [itemprop=headline]',
    '[itemtype="http://schema.org/BlogPosting"] [itemprop=name] > *', 
    '[itemtype="http://schema.org/BlogPosting"] [itemprop=name]', 
    'title'
  ];

  var result = queryStuff(selectorsInnerHTML, []);

  if(result.length != 0)
    return result;
  else
    return [""];
  
}

function getYear(){

  var selectorsInnerHTML = [
    '[itemprop=datePublished]',
    '[id*=updated]',
    'time'
  ];
  var selectorsAttribute = [
    ['time[pubdate]','pubdate']
  ];
  var query = queryStuff(selectorsInnerHTML, selectorsAttribute);

  if(query.length != 0){
    var result = [];
    query.forEach(function(currentValue, index, array){
      currentValue.match(/(\D|^)(\d\d\d\d)(\D|$)/g);
      if(RegExp.$2 != null && RegExp.$2 !== "")
        result.push(RegExp.$2); 
    });
    return result;
  }
  else
    return [""];
}

function getURL(){

  return [window.location]

}

function getURLDate(){

  var now = new Date();
  var mon = now.getMonth()+1;

  return [now.getFullYear() + "-" + mon + "-" + now.getDate()];

}

function generateBibtex(request, sender, sendResponse){
  
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
  chrome.runtime.onMessage.removeListener(generateBibtex);

  return true;
}

chrome.runtime.onMessage.addListener(generateBibtex);
