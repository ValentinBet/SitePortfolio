const converter = new showdown.Converter();
const folderPath = '/res/md';

async function loadAllMDProjects() {

  const response = await fetch(folderPath);
  const data = await response.text();
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(data, 'text/html');
  const links = htmlDoc.querySelectorAll('a');
  const buttonArray = [];

  const promises = Array.from(links).map((link) => {

    const fileNameWithExt = link.getAttribute('href').split('/').pop();
    const fileName = fileNameWithExt.split('.')[0];

    if (fileName !== '' && fileName !== 'res' && fileName !== 'md') {
      const decodedFileName = decodeURIComponent(fileName);
      const button = document.createElement('button');
      button.classList.add('projectButton');

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
          button.innerHTML = '<p>' + title + '</p>';
          button.style = "order : " + (((month * 30) + (date * 365)) * -1);
          buttonArray.push(button);
          button.addEventListener('click', function () {
            document.getElementById('ProjectInf').innerHTML = html;
            document.getElementById('ProjectInf').scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
            addBlankAttributeToLinks();
          });
        })
        .catch(error => console.error(error));

      return fetchPromise;
    }
  });

  await Promise.all(promises);

  buttonArray.sort(function (a, b) {
    return a.style.order - b.style.order;
  });

  document.getElementById('ProjectList').append(...buttonArray);
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

function addBlankAttributeToLinks() {
  const allLinks = document.getElementsByTagName("a");
  for (let i = 0; i < allLinks.length; i++) {
    allLinks[i].setAttribute("target", "_blank");
  }
}

// OnPageLoad
window.addEventListener('load', function () {
  loadAllMDProjects();
});