import { Converter } from 'showdown';

import './palette.scss';
import './styles.scss';


console.log(PAGES);

// const rootElement = document.createElement('div');
// const asideElement = document.createElement('aside');
// asideElement.setAttribute('id', 'main-sidebar');

// const contentElement = document.createElement('div');
// contentElement.setAttribute('id', 'content-container');

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


PAGES.forEach((page, pageIndex) => {
  fetch(`pages/${page}`).then((response) => {
    return response.blob();
  }).then((blob) => {
    const reader = new FileReader();
    reader.readAsText(blob);
    reader.onloadend = () => {
      const converter = new Converter();
      converter.setFlavor('github');

      const html = converter.makeHtml(reader.result);
      
      const pageSection = document.createElement('section');
      pageSection.setAttribute('class', 'page');
      pageSection.setAttribute('id', `page-${pageIndex}`);
      pageSection.innerHTML = html;

      // console.log(pageContainer.getElementsByTagName('h1'));
      console.log(`page ${page} has index ${pageIndex}`);

      const container = document.getElementById('content-container');
      const existingSections = container.getElementsByTagName('section');

      if (existingSections && existingSections.length !== 0) {
        console.log('existingSections', existingSections);
        const adjecentSection = document.getElementById(`page-${pageIndex + 1}`);

        if (adjecentSection) {
          console.log('adjecentSection', adjecentSection);
          container.insertBefore(pageSection, adjecentSection);
          console.log(`page ${page} inserted before ${adjecentSection.id}`);
        } else {
          container.appendChild(pageSection);
          console.log(`page ${page} is appended`);
        }
      } else {
        container.appendChild(pageSection);
        console.log(`page ${page} is appended`);
      }
    };
  });
});
