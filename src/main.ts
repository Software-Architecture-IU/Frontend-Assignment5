import {
  LIKES_URL,
  POLL_POSTS_INTERVAL,
  POLL_LIKES_INTERVAL,
  Post,
  POSTS_URL,
  AUTH_URL,
  Like,
} from "./const";
import { buildPost } from "./utils/buildPost";
import { sendMessage } from "./utils/sendMessage";

const app = document.getElementById("root");
const sendButton = document.getElementById("send-tw");
const updateButton = document.getElementById("get-tw");
const logoutButton = document.getElementById("logout-tw");

const form = document.getElementById("sender");
function handleForm(event: Event) {
  event.preventDefault();
}
form?.addEventListener("submit", handleForm);

let posts: Post[] = [];

function pollPostsServer() {
  const usernameStorage = window.localStorage.getItem("username");
  fetch(`${POSTS_URL}/posts?username=${usernameStorage!}`)
    .then((res) => res.json())
    .then((data: Post[]) => {
      if (data && data.length) {
        const postsToRemove = posts.filter(
          (x) => !data.some((y) => y.id == x.id)
        );
        for (const post of postsToRemove) {
          const oldPost = document.getElementById(`tw-post-${post.id}`);
          oldPost?.remove();
        }
        const newPosts = data.filter((x) => !posts.some((y) => y.id == x.id));
        const newPost = new CustomEvent("post", {
          detail: { posts: newPosts },
        });
        posts = data;
        app!.dispatchEvent(newPost);
      }
    })
    .catch((err) => {
      console.error("Failed to poll posts:");
      const newPost = new CustomEvent("post", {
        detail: { posts },
      });
      app!.dispatchEvent(newPost);
      throw err;
    });
}

function pollLikesServer() {
  const usernameStorage = window.localStorage.getItem("username");
  fetch(
    `${LIKES_URL}/likes?${new URLSearchParams({
      username: usernameStorage!,
    })}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        post_ids: posts.map((x) => x.id),
      }),
    }
  )
    .then((res) => res.json())
    .then((data: { items: Like[] }) => {
      console.log(data.items);
      data.items.forEach((x) => {
        console.log(x);
        const curLike = document.getElementById(`tw-like-${x.post_id}`);
        if (x.usernames.includes(usernameStorage!)) {
          curLike!.className = `btn btn-secondary tw-like tw-like-active`;
        } else {
          curLike!.className = `btn btn-secondary tw-like`;
        }

        const curLikeCount = document.getElementById(
          `tw-like-${x.post_id}-count`
        );
        console.log(curLikeCount);
        if (x.usernames.length !== parseInt(curLikeCount!.innerText)) {
          //curLike?.removeChild(curLikeCount!);
          curLikeCount!.innerText = x.usernames.length.toString();
          //curLike?.appendChild(curLikeCount!);
        }
      });
    });
}

sendButton?.addEventListener("click", sendMessage);
updateButton?.addEventListener("click", pollPostsServer);
logoutButton?.addEventListener("click", () => {
  window.localStorage.removeItem("username");
  window.location.replace("/auth");
});

// @ts-expect-error addEventListener does not have overload with CustomEvent event type
app!.addEventListener(
  "like",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function (_event: CustomEvent<{ post_id: number }>) {
    pollLikesServer();
  }
);

// @ts-expect-error addEventListener does not have overload with CustomEvent event type
app!.addEventListener("post", function (event: CustomEvent<{ posts: Post[] }>) {
  const postList = document.getElementById("tw-list");
  for (const post of event.detail.posts) {
    const newPost = buildPost(post);
    postList?.appendChild(newPost);
  }
});

function checkAuth() {
  const usernameStorage = window.localStorage.getItem("username");
  if (!usernameStorage) {
    window.location.replace("/auth");
  }
}

if (
  !window.location.pathname.includes("/auth") &&
  !window.location.pathname.includes("/register")
) {
  const usernameStorage = window.localStorage.getItem("username");
  const usernameHeader = document.getElementById("tw-username-header");
  usernameHeader!.innerText = `Welcome, ${usernameStorage}!`;
  checkAuth();
  pollPostsServer();
  pollLikesServer();
  setInterval(pollPostsServer, POLL_POSTS_INTERVAL);
  setInterval(pollLikesServer, POLL_LIKES_INTERVAL);
}

// Auth
const sendAuthButton = document.getElementById("send-auth-tw");
const usernameAuthInput = document.getElementById("tw-input-auth-username");

function handleAuth(e: MouseEvent) {
  e.preventDefault();
  const username = (usernameAuthInput as HTMLInputElement).value;
  if (username) {
    fetch(`${AUTH_URL}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
      }),
    })
      .then((res) => {
        if (res.status >= 500) {
          alert("Internal Server Error. Sorry for inconvenience.");
          throw new Error("Internal Server Error.");
        }
        if (res.status >= 400) {
          alert("Incorrect username. Please specify another one.");
          throw new Error("Incorrect username.");
        }
      })
      .then(() => {
        window.localStorage.setItem("username", username);
        window.location.replace("/");
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

if (sendAuthButton) {
  sendAuthButton.addEventListener("click", (e) => handleAuth(e));
}

// Register
const sendRegisterButton = document.getElementById("send-register-tw");
const usernameRegisterInput = document.getElementById(
  "tw-input-register-username"
);

function handleRegister(e: MouseEvent) {
  e.preventDefault();
  const username = (usernameRegisterInput as HTMLInputElement).value;
  if (username) {
    fetch(`${AUTH_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
      }),
    })
      .then((res) => {
        if (res.status >= 500) {
          alert("Internal Server Error. Sorry for inconvenience.");
          throw new Error("Internal Server Error.");
        }
        if (res.status >= 400) {
          alert("Incorrect username. Please specify another one.");
          throw new Error("Incorrect username.");
        }
      })
      .then(() => {
        window.location.replace("/auth");
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

if (sendRegisterButton) {
  sendRegisterButton.addEventListener("click", (e) => handleRegister(e));
}
