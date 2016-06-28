function bibtex(request, sender, sendResponse){
  
  var bibtex = "@online{cite_key, \n" +
    "author = {$author$},\n" + 
    "title = {$title$},\n" + 
    "year = $year$,\n" + 
    "url = {$url$},\n" +
    "urldate = {$urldate$}\n" +
    "}";

  sendResponse(bibtex);
  chrome.runtime.onMessage.removeListener(bibtex);

  return true;
}

chrome.runtime.onMessage.addListener(bibtex);
