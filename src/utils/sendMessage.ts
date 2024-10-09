import { POSTS_URL } from "../const";

export function sendMessage() {
  const usernameStorage = window.localStorage.getItem("username");
  const postInput = document.getElementById("tw-input") as HTMLInputElement;
  const content = postInput.value;
  fetch(
    `${POSTS_URL}/posts?${new URLSearchParams({ username: usernameStorage! })}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    }
  ).catch((err) => {
    console.error("Failed to create a post:");
    throw err;
  });
  postInput.value = "";
}
