// import { renderHeaderComponent } from "./header-component.js";
// import { posts } from "../index.js";
// import { likePost, dislikePost } from "../api.js";
// import { getToken } from "../index.js";
// import { formatDistanceToNow } from 'date-fns';
// import { ru } from 'date-fns/locale';

// export function renderUserPostsPageComponent({ appEl }) {
//   const postsHtml = posts.length
//     ? posts
//     .map((post) => {
//       const formattedDate = post.createdAt
//           ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ru })
//           : "";
//           return `
//             <li class="post">
//               <div class="post-image-container">
//                 <img class="post-image" src="${post.imageUrl}" alt="Пост">
//               </div>
//               <div class="post-likes">
//                 <button data-post-id="${post.id}" class="like-button">
//                     <img src="${
//                       post.isLiked
//                         ? "./assets/images/like-active.svg"
//                         : "./assets/images/like-not-active.svg"
//                     }">
//                 </button>
//                 <p class="post-likes-text">
//                   Нравится: <strong>${
//                     Array.isArray(post.likes) ? post.likes.length : post.likes
//                   }</strong>
//                 </p>
//               </div>
//               <p class="post-text">${post.description}</p>
//               <p class="post-date">${formattedDate}</p>
//             </li>
//           `;
//         })
//         .join("")
//     : "<p>Нет постов</p>";

//   const userImageUrl =
//     posts.length > 0 ? posts[0].user.imageUrl : "default-avatar.png";
//   const userName =
//     posts.length > 0 ? posts[0].user.name : "Неизвестный пользователь";

//   const appHtml = `
//     <div class="page-container">
//       <div class="header-container"></div>
//       <div class="posts-user-header">
//         <img src="${userImageUrl}" class="posts-user-header__user-image" alt="${userName}">
//         <p class="posts-user-header__user-name">${userName}</p>
//       </div>
//       <ul class="posts">
//         ${postsHtml}
//       </ul>
//     </div>
//   `;

//   appEl.innerHTML = appHtml;

//   document.querySelectorAll(".like-button").forEach((button) => {
//     button.addEventListener("click", () => {
//       const postId = button.dataset.postId;
//       const post = posts.find((p) => p.id === postId);
//       if (!post) return;

//       const action = post.isLiked ? dislikePost : likePost;

//       action({ postId, token: getToken() })
//         .then((updatedPost) => {
//           const index = posts.findIndex((p) => p.id === postId);
//           posts[index] = updatedPost.post;
//           renderUserPostsPageComponent({ appEl });
//         })
//         .catch((error) => {
//           console.error("Ошибка при обновлении лайка:", error);
//         });
//     });
//   });

//   renderHeaderComponent({
//     element: document.querySelector(".header-container"),
//   });
// }


import { renderHeaderComponent } from "./header-component.js";
import { posts } from "../index.js";
import { likePost, dislikePost, deletePost } from "../api.js";
import { getToken } from "../index.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

export function renderUserPostsPageComponent({ appEl }) {
  const postsHtml = posts.length
    ? posts
        .map((post) => {
          const formattedDate = post.createdAt
            ? formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
                locale: ru,
              })
            : "";

          return `
            <li class="post">
              <div class="post-image-container">
                <img class="post-image" src="${post.imageUrl}" alt="Пост">
              </div>
              <div class="post-likes">
                <button data-post-id="${post.id}" class="like-button">
                  <img src="${
                    post.isLiked
                      ? "./assets/images/like-active.svg"
                      : "./assets/images/like-not-active.svg"
                  }">
                </button>
                <p class="post-likes-text">
                  Нравится: <strong>${
                    Array.isArray(post.likes) ? post.likes.length : post.likes
                  }</strong>
                </p>
              </div>
              <p class="post-text">${post.description}</p>
              <p class="post-date">${formattedDate}</p>
              <button data-post-id="${post.id}" class="delete-button">Удалить</button>
            </li>
          `;
        })
        .join("")
    : "<p>Нет постов</p>";

  const userImageUrl =
    posts.length > 0 ? posts[0].user.imageUrl : "default-avatar.png";
  const userName =
    posts.length > 0 ? posts[0].user.name : "Неизвестный пользователь";

  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="posts-user-header">
        <img src="${userImageUrl}" class="posts-user-header__user-image" alt="${userName}">
        <p class="posts-user-header__user-name">${userName}</p>
      </div>
      <ul class="posts">
        ${postsHtml}
      </ul>
    </div>
  `;

  appEl.innerHTML = appHtml;

  // Обработка лайков
  document.querySelectorAll(".like-button").forEach((button) => {
    button.addEventListener("click", () => {
      const postId = button.dataset.postId;
      const post = posts.find((p) => p.id === postId);
      if (!post) return;

      const action = post.isLiked ? dislikePost : likePost;

      action({ postId, token: getToken() })
        .then((updatedPost) => {
          const index = posts.findIndex((p) => p.id === postId);
          posts[index] = updatedPost.post;
          renderUserPostsPageComponent({ appEl });
        })
        .catch((error) => {
          console.error("Ошибка при обновлении лайка:", error);
          alert("Не удалось обновить лайк");
        });
    });
  });

  // Обработка удаления постов
  document.querySelectorAll(".delete-button").forEach((button) => {
    button.addEventListener("click", () => {
      const postId = button.dataset.postId;
      if (!confirm("Удалить этот пост?")) return;

      deletePost({ token: getToken(), postId })
        .then(() => {
          const updatedPosts = posts.filter((p) => p.id !== postId);
          posts.splice(0, posts.length, ...updatedPosts);
          renderUserPostsPageComponent({ appEl });
        })
        .catch((error) => {
          console.error("Ошибка при удалении поста:", error);
          alert("Не удалось удалить пост");
        });
    });
  });

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });
}
