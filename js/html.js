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
