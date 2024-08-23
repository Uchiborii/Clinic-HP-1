document.addEventListener("DOMContentLoaded", function () {
  fetch("header.html")
    .then((response) => response.text())
    .then((data) => (document.querySelector("#header").innerHTML = data));

  fetch("footer.html")
    .then((response) => response.text())
    .then((data) => (document.querySelector("#footer").innerHTML = data));
});

function toggleNav() {
  var body = document.body;
  body.classList.toggle("nav-open");
}
var hamburger = document.getElementById("js-hamburger");
var blackBg = document.getElementById("js-black-bg");

async function getChooseArticle() {
  const paramsData = await catchEndUrl();
  console.log("paramsデータ" + paramsData);
  const value = paramsData.get("id");
  const url = `${baseUrl}/${value}`;
  const data = await fetchData(url);
  displayPost(data);
}

async function displayPost(data) {
  getTitle(data);
  const date = new Date(data.dateTime);
  const formattedDate = customFormat(date);

  let html = "";
  const content = `<div class="container">
	<div class="news-title">
	<h3>${data.title}</h3>
	</div>
	<div>
	<div class="h5-font">${formattedDate}</div>
	</div>
	<div>
	<p>${data.content}</p>
	</div>
	</div>`;
  html += content;
  document.getElementById("result").innerHTML = html;
}

async function getTitle(data) {
  let html = "";
  const contents = `<div class="a-font">${data.title}</div>`;
  html += contents;
  document.getElementById("title").innerHTML = html;
}