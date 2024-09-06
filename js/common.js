const baseUrl = `https://u-company.cdn.newt.so/v1/blog-547919/post`;
const recruitUrl = `https://u-company.cdn.newt.so/v1/blog-547919/recruit`;
const order = "&order=-dateTime";

async function displayData() {
  const { html, data } = await getPostData(5);
  document.getElementById("result").innerHTML += html;

  const max_page = data.total && data.limit ? Math.ceil(Number(data.total) / Number(data.limit)) : 1;

  const content = `<div class="news-top">
	<nav aria-label="Page navigation example">
	<ul class="pagination">
	<li class="page-item">
	${page > 1 ? `<li class="page-item"><a class="page-link" href="news.html?page=${page - 1}" aria-label="Previous"><span aria-hidden="true">&laquo; 前へ　</span></a></li>` : ""}
	</a>
	</li>
	
	<li class="page-item">
	${page < max_page ? `<li class="page-item"><a class="page-link" href="news.html?page=${page + 1}" aria-label="Next"><span aria-hidden="true">　次へ &raquo;</span></a></li>` : ""}
	</a>
	</li>
	</ul>
	</nav>`;
  document.getElementById("result").innerHTML += content;
}

function customFormat(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const week = date.getDay();
  const weekItems = ["(日)", "(月)", "(火)", "(水)", "(木)", "(金)", "(土)"];
  const dayOfWeek = weekItems[week];

  return `${year}/${month}/${day}${dayOfWeek}`;
}

async function fetchData(url) {
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: "Bearer JhOWeg9Xp1lXjsUp-asOWwnKLjrhYgSZdeJf5gvOZko",
      },
    });
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        window.location.href = "index.html";
        return;
      } else {
        const errorLog = data.message;
        let url = `error.html?message=${errorLog}`;
        window.location.href = url;
        return false;
      }
    }
    return data;
  } catch (error) {
    console.error("エラー:", error);
  }
}

function display(data) {
  let html = "";
  data.items.forEach((blog) => {
    const date = new Date(blog.dateTime);
    const formattedDate = customFormat(date);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const isNew = date >= sevenDaysAgo;
    const newTag = isNew ? `<div class="bg-white text-danger rounded-pill m-3 h6">new!</div>` : "";

    const content = `
		<a class="list-item" href="detail.html?id=${blog._id}">
			<div class="news-date">
				<p>${formattedDate}</p>
			</div>
			<div class="center-item">
				<p>${blog.title}</p>
				${newTag}			
			</div>
			<div class="button-img">					
				<img src="img/button.webp" class="button-icon" />						
			</div>
		</a>`;
    html += content;
  });
  return html;
}

async function getPostData(_limit) {
  const skip = (page - 1) * Number(_limit);
  let url = `${baseUrl}?limit=${Number(_limit)}${order}&skip=${skip}&page=${page}`;
  const data = await fetchData(url);
  const html = await display(data);
  return { html, data };
}

async function allArticles() {
  var resultList = [];
  let processA = await fetchData(`${baseUrl}?limit=5${order}`);
  let processB = await fetchData(`${baseUrl}?limit=5${order}`);
  let processC = await fetchData(`${baseUrl}?limit=5${order}`);
  let processD = await fetchData(`${baseUrl}?limit=5${order}`);

  resultList.push(processA);
  resultList.push(processB);
  resultList.push(processC);
  resultList.push(processD);

  return resultList;
}

async function newPost() {
  document.getElementById("result").innerHTML = "";
  const limit = 5;
  let url = `${baseUrl}?limit=${limit}${order}`;
  const data = await fetchData(url);
  const html = await display(data);
  document.getElementById("result").innerHTML += html;
}

async function catchEndUrl() {
  const params = new URLSearchParams(window.location.search);
  return params;
}

let page;

async function startCatchUrl() {
  catchEndUrl().then((params) => {
    page = params.get("page") ? Number(params.get("page")) : 1;
    displayData();
  });
}

//お知らせ詳細

async function getChooseArticle() {
  const paramsData = await catchEndUrl();
  const value = paramsData.get("id");
  const url = `${baseUrl}/${value}`;
  const data = await fetchData(url);
  displayPost(data);
}

async function displayPost(data) {
  getTitle(data);
  const date = new Date(data.dateTime);
  const formattedDate = customFormat(date);

  let recruitContents = "";
  if (data.category == "Recruitment") {
    recruitContents = `<a href="recruitment.html?id=${data._id}">採用情報詳細はこちら <i class="bi bi-box-arrow-up-right"></i></a>`;
  }

  let html = "";
  const content = `
	<div class="container">
		<div class="news-title">
			<h3>${data.title}</h3>
		</div>
		<div>
			<div class="h5-font">${formattedDate}</div>
		</div>
		<div>
			<p>${data.content}</p>
			${recruitContents}
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

//採用情報

async function getRecruitData() {
  let url = `${baseUrl}?${order}`;
  const recruitData = await fetchData(url);
  displayRecruit(recruitData);
  RecruitTitle(recruitData);
}

async function RecruitTitle(recruitData) {
  let html = "";

  recruitData.items.forEach((post) => {
    if (post.Recruitment.Title) {
      const content = `
				<section class="recruit-title">
					<div class="recruit-bar">
						<a href="recruitment.html?id=${post._id}">${post.Recruitment.Title}</a>
					</div>
				</section>
						`;
      html += content;
    }
  });
  document.getElementById("recruitTitleResult").innerHTML = html;
}

async function displayRecruit(recruitData) {
  let html = "";

  recruitData.items.forEach((post) => {
    if (post.Recruitment.Title) {
      const content = `
				<section class="recruit-block">
					<div class="container">
						<table class="recruit-detail">
							<div id="id${post._id}">
								<caption id="number2">${post.Recruitment.Title}</caption>
								</div>
								<tbody>
								<tr>
									<th>職種</th>
									<td>${post.Recruitment.Occupation}</td>
								</tr>
								<tr>
									<th>募集人員</th>
								<td>${post.Recruitment.Number}</td>
								</tr>
								<tr>
									<th>応募資格</th>
									<td><pre>${post.Recruitment.Qualification}</pre></td>
								</tr>
								<tr>
									<th>勤務場所</th>
									<td><pre>${post.Recruitment.WorkPlace}</pre></td>
								</tr>
								<tr>
									<th>処遇</th>
									<td><pre>${post.Recruitment.Treatment}</pre></td>
								</tr>
								<tr>
									<th>採用日</th>
									<td>${post.Recruitment.RecruitDate}</pre></td>
								</tr>
								<tr>
									<th>選考日</th>
									<td>${post.Recruitment.Selection}</td>
								</tr>
								<tr>
									<th>選考場所</th>
									<td><pre>${post.Recruitment.SelectionPlace}</pre></td>
								</tr>
								<tr>
									<th>問い合わせ先</th>
									<td><pre>${post.Recruitment.Inquiry}</pre></td>
								</tr>
								<tr>
									<th>締め切り</th>
									<td>${post.Recruitment.Deadline}</pre></td>
								</tr>
							</tbody>
						</table>
						<div class="btn">
						<a href="form.html"> <span class="regular-font">ご応募はこちらから</span> <span class="arrow">→</span> </a>
					</div>
					</div>
				</section>
			`;
      html += content;
    }
  });
  document.getElementById("recruitResult").innerHTML = html;
  catchId();
}

async function catchId() {
  const paramsData = await catchEndUrl();
  const hash = paramsData.get("id");
  console.log(hash);
  scroll(hash);
}

async function scroll(hash) {
  let targetElement = document.getElementById("id" + hash);
  if (targetElement) {
    setTimeout(function () {
      scrollTo(0, 0);
      let locationOffset = targetElement.getBoundingClientRect().top - 100;
      scrollTo(0, locationOffset);
    }, 100);
  }
}
