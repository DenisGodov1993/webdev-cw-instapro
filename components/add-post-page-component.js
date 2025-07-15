import { renderUploadImageComponent } from "./upload-image-component.js";
import { renderHeaderComponent } from "./header-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {

  const render = () => {
    const appHtml = `
      <div class="page-container">
        <div class="header-container"></div>
        <div class="form">
          <h3 class="form-title">Добавить пост</h3>
          <div class="form-inputs">
            <div class="upload-image-container"></div>
            <label>
              Опишите фотографию:
              <textarea class="input textarea" rows="4" id="description-input"></textarea>
            </label>
            <button class="button" id="add-button">Добавить</button>
          </div>
        </div>
      </div>
    `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    let previewUrl = null;

    const uploadImageContainer = appEl.querySelector(".upload-image-container");
    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: uploadImageContainer,
        onImageUrlChange(newImageUrl) {
          previewUrl = newImageUrl;
        },
      });
    }

    document.getElementById("add-button").addEventListener("click", () => {
      const description = document
        .getElementById("description-input")
        .value.trim();

      if (!previewUrl) {
        alert("Пожалуйста, выберите фото");
        return;
      }

      if (!description) {
        alert("Пожалуйста, добавьте описание");
        return;
      }

      onAddPostClick({ description, imageUrl: previewUrl });
    });
  };

  render();
}


// ТО, ЧТО БЫЛО ИЗНАЧАЛЬНО!
// export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
//   const render = () => {
//     // @TODO: Реализовать страницу добавления поста
//     const appHtml = `
//     <div class="page-container">
//       <div class="header-container"></div>
//       Cтраница добавления поста
//       <button class="button" id="add-button">Добавить</button>
//     </div>
//   `;

//     appEl.innerHTML = appHtml;

//     document.getElementById("add-button").addEventListener("click", () => {
//       onAddPostClick({
//         description: "Описание картинки",
//         imageUrl: "https://image.png",
//       });
//     });
//   };

//   render();
// }
