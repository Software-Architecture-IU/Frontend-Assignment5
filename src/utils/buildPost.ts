import { LIKE_ICON, Post } from "../const";
import { handleLike } from "./handleLike";

function getIcon() {
  const parser = new DOMParser();
  const likeIcon = parser.parseFromString(LIKE_ICON, "image/svg+xml");
  const likeIconSvg = likeIcon.documentElement;

  return likeIconSvg;
}

function buildPostContent(username: string, content: string) {
  // Build username node
  const postUsername = document.createElement("span");
  postUsername.appendChild(document.createTextNode(username));
  postUsername.className = "tw-username";

  // Build content node
  const postContent = document.createElement("span");
  postContent.appendChild(document.createTextNode(content));
  postContent.className = "tw-txt";

  return { postUsername, postContent };
}

function buildLike(id: number) {
  // Build like button
  const postLike = document.createElement("button");
  postLike.className = "btn btn-secondary tw-like";
  postLike.id = "tw-like-" + id;

  // Build like count
  const likeCount = document.createElement("span");
  likeCount.id = `tw-like-${id}-count`;
  likeCount.appendChild(document.createTextNode("0"));

  postLike.appendChild(getIcon());
  postLike.append(likeCount);
  postLike.addEventListener("click", () => handleLike(id));

  return postLike;
}

export function buildPost(post: Post) {
  // Build a new post element
  const newPost = document.createElement("div");
  newPost.className = "tw";
  newPost.id = `tw-post-${post.id}`;

  const { postUsername, postContent } = buildPostContent(
    post.username,
    post.content
  );

  const postLike = buildLike(post.id);

  newPost.appendChild(postUsername);
  newPost.appendChild(postContent);
  newPost.appendChild(postLike);

  return newPost;
}
