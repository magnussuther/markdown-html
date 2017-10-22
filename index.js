/* global document: false */
/* global fetch: false */
/* global DOMParser: false */
/* global FileReader: false */

/* global PAGES: false */

import { Converter } from 'showdown';

import './palette.scss';
import './styles.scss';


console.log(PAGES);

const parser = new DOMParser();
const doc = parser.parseFromString(`
<div id="root" class="flex-horizontal">
  <aside id="main-sidebar">
    <div id="table-of-contents"></div>
  </aside>
  <div id="content-container"></div>
  <!-- <div id="code-container"></div> -->
</div>
`, 'text/html');
document.getElementsByTagName('body')[0].appendChild(doc.getElementById('root'));

const readMarkdownBlob = (blob, onloadend) => {
  const reader = new FileReader();
  reader.readAsText(blob);
  reader.onloadend = () => onloadend(reader.result);
};

const convertMarkdownToHtml = (markdown) => {
  const converter = new Converter();
  converter.setFlavor('github');
  return converter.makeHtml(markdown);
};

const createSectionForPage = (pageIndex, html) => {
  const pageSection = document.createElement('section');
  pageSection.setAttribute('class', 'page');
  pageSection.setAttribute('id', `page-${pageIndex}`);
  pageSection.innerHTML = html;
  return pageSection;
};

const insertSectionIntoDom = (pageSection, pageIndex) => {
  const container = document.getElementById('content-container');
  const existingSections = container.getElementsByTagName('section');

  if (!existingSections || existingSections.length === 0) {
    // Just append the first section to the page
    container.appendChild(pageSection);
    return;
  }

  const adjecentSection = document.getElementById(`page-${pageIndex + 1}`);

  if (adjecentSection) {
    // The adjecent page arrived before this page,
    // but we need the pages to be in the order defined by PAGES.
    container.insertBefore(pageSection, adjecentSection);
    return;
  }

  // The page arrived in the order defined by PAGES,
  // or happened to be the last page.
  container.appendChild(pageSection);
};

PAGES.forEach((page, pageIndex) =>
  fetch(`${page}`).then(response => response.blob())
    .then((blob) => {
      readMarkdownBlob(blob, (result) => {
        const html = convertMarkdownToHtml(result);
        const pageSection = createSectionForPage(pageIndex, html);

        insertSectionIntoDom(pageSection, pageIndex);
      });
    }));
