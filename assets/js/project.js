const converter = new showdown.Converter();
const folderPath = '/res/md';

async function loadAllMDProjects() {

  const response = await fetch(folderPath);
  const data = await response.text();
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(data, 'text/html');
  const links = htmlDoc.querySelectorAll('a');
  const projectLiArray = [];

  const promises = Array.from(links).map((link) => {

    const fileNameWithExt = link.getAttribute('href').split('/').pop();
    const fileName = fileNameWithExt.split('.')[0];
    if (fileName !== '' && fileName !== 'res' && fileName !== 'md') {
      const decodedFileName = decodeURIComponent(fileName);
      const li = document.createElement('li');
      const fetchPromise = fetch(folderPath + '/' + fileNameWithExt)
        .then(response => response.text())
        .then(data => {
          const converter = new showdown.Converter();
          const metadata = getMetadataFromMarkdown(data);
          data = removeFirstLines(data, Object.keys(metadata).length + 2);
          const html = converter.makeHtml(data);
          const title = metadata.title;
          const date = metadata.date;
          const month = metadata.month;
          li.innerHTML = '<a><p>' + title + '</p></a>';
          li.style = "order : " + (((month * 30) + (date * 365)) * -1);
          projectLiArray.push(li);
          li.addEventListener('click', function () {
            const container = document.getElementById('ProjectInf');
            container.innerHTML = html;
            alterLinks(container);
            alterText(container);
          });
        })
        .catch(error => console.error(error));

      return fetchPromise;
    }
  });

  await Promise.all(promises);

  projectLiArray.sort(function (a, b) {
    return a.style.order - b.style.order;
  });

  for (let i = 0; i < projectLiArray.length-1; i++) {
    projectLiArray[i].querySelector("a").innerHTML += ' <hr style="border: 0; height: 1px; background-image: linear-gradient(to right, rgba(0, 0, 0, 0)' +
          ', rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0));">'
  }

  document.getElementById('ProjectListTarget').append(...projectLiArray);
}


function removeFirstLines(str, n) {
  const lines = str.split('\n');
  return lines.slice(n).join('\n');
}
function getMetadataFromMarkdown(markdown) {
  const mdWithoutCarriageReturns = markdown.replace(/\r/g, '');
  const lines = mdWithoutCarriageReturns.split('\n');
  const metadata = {};
  if (lines[0] === '---') {
    for (let i = 1; i < lines.length; i++) {
      if (lines[i] === '---') {
        break;
      }
      const parts = lines[i].split(':');
      if (parts.length === 2) {
        metadata[parts[0].trim()] = parts[1].trim();
      }
    }
  }
  return metadata;
}

function alterLinks(container) {
  const allLinks = container.querySelectorAll("a");
  for (let i = 0; i < allLinks.length; i++) {
    const link = allLinks[i];
    const href = link.getAttribute("href");
    if (href.includes('youtube.com') || href.includes('youtube-nocookie.com')) {
      link.classList.add('youtube-link');
      link.addEventListener('click', function (event) {
        event.preventDefault();
        openVideoEmbed(href, link);
      });
    } else {
      link.setAttribute("rel", "noopener noreferrer");
      link.classList.add('external-link');
    }
    link.setAttribute("target", "_blank");
  }
}

function openVideoEmbed(url, container) {
  // remove all children from container
  container.innerHTML = '<iframe width="560" height="315" src="' + url  + '" title="YouTube video player" frameborder="0" allow="accelerometer;' +
  'autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" ' +
  'allowfullscreen></iframe>"';
}

function closeVideoEmbed() {

}

function alterText(container) {
  const textElements = container.querySelectorAll('p, h1, h2, h3, h4, h5, h6, ul, ol, li');

  textElements.forEach(el => {
    const containsLinkOrImage = el.querySelector('a, img');
    if (!containsLinkOrImage) {
        el.classList.add('text');
    }
  });
}

// OnPageLoad
window.addEventListener('load', function () {
  loadAllMDProjects();
});