const MAX_NEWS_ITEMS = 5;

async function displayNews() {
    const response = await fetch(API_URL + 'news/posts/');
    const data = await response.json();

    const newsTable = document.getElementById('newsTable');

    let newsTableHeader = document.createElement('th');
    newsTableHeader.innerText = 'Latest News';
    newsTable.appendChild(newsTableHeader);

    console.log(data);

    let newsItems = 0;
    for(let news of data.results) {
        if(newsItems >= MAX_NEWS_ITEMS) break;
        let newsTableRow = document.createElement('tr');
        let newsHeadline = document.createElement('td');

        newsHeadline.innerText= news.title;
        newsHeadline.onclick = () => {
            window.open("https://" + news.domain);
        }
        newsTableRow.appendChild(newsHeadline);
        newsTable.appendChild(newsTableRow);

        newsItems++;
    }
}

displayNews();