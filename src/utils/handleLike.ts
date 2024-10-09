import { LIKES_URL } from "../const";

const app = document.getElementById("root");

export function handleLike(post_id: number) {
  const usernameStorage = window.localStorage.getItem("username");
  fetch(
    `${LIKES_URL}/like?${new URLSearchParams({ username: usernameStorage! })}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post_id }),
    }
  )
    .then((res) => {
      const event = new CustomEvent("like", {
        detail: { post_id },
      });
      app!.dispatchEvent(event);
      return res;
    })
    .catch((err) => {
      console.error("Failed to like a post:");
      throw err;
    });
}
