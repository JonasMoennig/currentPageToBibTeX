//returned array is guaranteed to not contain null values
function queryStuff(selectors){

  var result = new Set();
    
  selectors.forEach(function(currentValue, index, array){
    if(currentValue.constructor === Array){
      var tag = document.querySelector(currentValue[0]);
      if(tag != null){
        var attr = tag.getAttribute(currentValue[1]);
        if(attr != null)
          result.add(attr.trim());
      }
    }else {
      var tag = document.querySelector(currentValue);
      if(tag != null){
        if(tag.innerHTML !== "")
          result.add(tag.textContent.trim());
      }
    }
  });

  return Array.from(result);

}

function getAuthor(){

  var selectors = [
    ['meta[name=author]', 'content'],
    '[rel=author] > [itemprop=name]',
    '[rel=author]',
    '[itemprop=author] > *',
    '[itemprop=author]',
    '.author'
  ];

  var result = queryStuff(selectors);

  if(result.length != 0)
    return result;
  else
    return [""];

}

function getTitle(){

  var selectors = [
    ['meta[name="DC.Title"', 'content'],
    'h1[class*=headline] > *', 
    'h1[class*=headline]', 
    'h2[class*=headline] > *', 
    'h2[class*=headline]', 
    'h3[class*=headline] > *', 
    'h3[class*=headline]', 
    'h1[class*=header] > *', 
    'h1[class*=header]', 
    'h2[class*=header] > *', 
    'h2[class*=header]', 
    'h3[class*=header] > *', 
    'h3[class*=header]', 
    'h1[class*=title] > *', 
    'h1[class*=title]', 
    'h2[class*=title] > *', 
    'h2[class*=title]', 
    'h3[class*=title] > *', 
    'h3[class*=title]', 
    '[itemtype="http://schema.org/CreativeWork"] [itemprop=headline]',
    '[itemtype="http://schema.org/NewsArticle"] [itemprop=headline]',
    'main [itemtype="http://schema.org/Article"] [itemprop=headline]',
    '[itemtype="http://schema.org/BlogPosting"] [itemprop=name] > *', 
    '[itemtype="http://schema.org/BlogPosting"] [itemprop=name]', 
    '[itemtype="http://schema.org/Question"] [itemprop=name] > *', 
    '[itemtype="http://schema.org/Question"] [itemprop=name]', 
    'title'
  ];

  var result = queryStuff(selectors);

  if(result.length != 0)
    return result;
  else
    return [""];
  
}

function getYear(){

  var selectors = [
    '[itemprop=dateModified]',
    '[itemprop=datePublished]',
    ['[itemprop=dateModified]', 'content'],
    ['[itemprop=datePublished]', 'content'],
    '[id*=updated]',
    ['time[pubdate]','pubdate'],
    '.post_date',
    'time'
  ];

  var query = queryStuff(selectors);

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

  return [window.location.toString()]

}

function getURLDate(){

  var now = new Date();
  var mon = now.getMonth()+1;
  var day = now.getDate();

  if(mon < 10)
    mon = "0" + mon;

  if(day < 10)
    day = "0" + day;

  return [now.getFullYear() + "-" + mon + "-" + day];

}

function getCiteKey(){
  //this works because getAuthor() and get Title always return a non-empty array
  var author_array = getAuthor()[0].split(" ");
  var title_array = getTitle()[0].split(" ");
  return [author_array[author_array.length - 1] + getYear() + title_array[0]];
}

function extractData(request, sender, sendResponse){

  var data = {'author': getAuthor(),
    'title': getTitle(),
    'year': getYear(),
    'url': getURL(),
    'urldate': getURLDate(),
    'cite_key': getCiteKey()
  }

  sendResponse(data);
  chrome.runtime.onMessage.removeListener(extractData);

  return true;
}

chrome.runtime.onMessage.addListener(extractData);
