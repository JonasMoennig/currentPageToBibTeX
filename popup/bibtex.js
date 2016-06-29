chrome.tabs.executeScript(null, {
  file: "/content_scripts/extract_data.js"
});

var data;

chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
  chrome.tabs.sendMessage(tabs[0].id, {}, {}, function(result){
    data = result;
    document.getElementById('bibtex').innerHTML = generateBibtex(data);
    return true;
  });
});

function displayMenu(e){
  var div = document.createElement("div");
  var ul = document.createElement("ul");
  ul.classList.add("menu");
  div.id = 'container';
  div.style.display = 'block';
  div.style.left = e.pageX + 'px';
  div.style.top = e.pageY + 'px';
  div.appendChild(ul);
  ul.innerHTML = "<li>test</li>" +
    "<li>test</li>" +
    "<li>test</li>" +
    "<li>jonas</li>";
  ul.addEventListener("click", function(e){
    div.remove();
  });
  document.body.appendChild(div);
}

function generateBibtex(data){
 
  var bibtex = "@online{cite_key, <br>" +
    "$indent$author = {<span id=author>$author$</span>},<br>" + 
    "$indent$title = {<span id=title>$title$</span>},<br>" + 
    "$indent$year = <span id=year>$year$</span>,<br>" + 
    "$indent$url = {<span id=url>$url$</span>},<br>" +
    "$indent$urldate = {<span id=urldate>$urldate$</span>}<br>" +
    "}";

  bibtex = bibtex.replace("$author$", data.author[0]);
  bibtex = bibtex.replace("$title$", data.title[0]);
  bibtex = bibtex.replace("$year$", data.year[0]);
  bibtex = bibtex.replace("$url$", data.url[0]);
  bibtex = bibtex.replace("$urldate$", data.urldate[0]);

  bibtex = bibtex.replace(/\$indent\$/g, "&nbsp;&nbsp");

  return bibtex;

}

document.getElementById("test").addEventListener('click', displayMenu);
