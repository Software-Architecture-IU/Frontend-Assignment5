const POSTS_URL = "http://tw-posts.stress-testers.ru";
const LIKES_URL = "http://tw-likes.stress-testers.ru";
const POLL_INTERVAL = 1000;
const LIKE_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';

const app = document.getElementById("root");
const sendButton = document.getElementById("send-tw");
const updateButton = document.getElementById("get-tw");

const form = document.getElementById("sender");
function handleForm(event: Event) {
  event.preventDefault();
}
form?.addEventListener("submit", handleForm);

let currentOffset = 0;
const posts: Post[] = [{ id: 0, username: "anonymous", content: "aboba" }];
const likes: Likes = { 0: ["anonymous"] };

interface Post {
  id: number;
  username: string;
  content: string;
}

interface Likes {
  [id: number]: string[];
}

const usernameStorage = window.localStorage.getItem("username");

function pollServer() {
  fetch(`${POSTS_URL}/posts?offset=${currentOffset}`)
    .then((res) => res.json())
    .then((data: Post[]) => {
      if (data && data.length) {
        posts.concat(data);
        const newPost = new CustomEvent("post", {
          detail: { posts: data },
        });
        app!.dispatchEvent(newPost);
        currentOffset = data[data.length - 1].id;
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

function handleSend() {
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

function handleLike(post_id: number) {
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
      const like = document.getElementById("tw-like-" + post_id);
      if (res.body) {
        like!.className = "btn btn-secondary tw-like tw-like-active";
      } else {
        like!.className = "btn btn-secondary tw-like";
      }
    })
    .catch((err) => {
      console.error("Failed to like a post:");
      throw err;
    });
}

sendButton?.addEventListener("click", handleSend);
updateButton?.addEventListener("click", pollServer);

// function formatTime(time: string) {
//   // 12:49 | 12 Jun 2024
//   const months = [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ];
//   const date = new Date(time);
//   const day = String(date.getDate()).padStart(2, "0");
//   const month = months[date.getMonth()];
//   const year = date.getFullYear();
//   return `${date.getHours().toString().padStart(2, "0")}:${date
//     .getMinutes()
//     .toString()
//     .padStart(2, "0")} | ${day} ${month} ${year}`;
// }

// @ts-expect-error addEventListener does not have overload with CustomEvent event type
app!.addEventListener("post", function (event: CustomEvent<{ posts: Post[] }>) {
  const postList = document.getElementById("tw-list");
  for (const post of event.detail.posts) {
    const newPost = document.createElement("div");
    newPost.className = "tw";

    const newPostHeader = document.createElement("div");
    newPostHeader.className = "tw-header";

    const postUsername = document.createElement("span");
    postUsername.appendChild(document.createTextNode(post.username));
    postUsername.className = "tw-username";

    const postContent = document.createElement("span");
    postContent.appendChild(document.createTextNode(post.content));
    postContent.className = "tw-txt";

    const postLike = document.createElement("button");
    postLike.className = "btn btn-secondary tw-like";
    postLike.id = "tw-like-" + post.id;

    const parser = new DOMParser();
    const likeIcon = parser.parseFromString(LIKE_ICON, "image/svg+xml");
    const likeIconSvg = likeIcon.documentElement;
    postLike.appendChild(likeIconSvg);
    postLike.appendChild(
      document.createTextNode(likes[post.id]?.length.toString() || "0")
    );
    postLike.addEventListener("click", () => handleLike(post.id));

    //   const postTime = document.createElement("span");
    //   postTime.appendChild(document.createTextNode(formatTime(post.timestamp)));
    //   postTime.className = "tw-time";

    //newPostHeader.appendChild(postUsername);
    //newPostHeader.appendChild(postTime);

    newPost.appendChild(postUsername);
    newPost.appendChild(postContent);
    newPost.appendChild(postLike);
    postList?.appendChild(newPost);
  }
});

// function checkAuth() {
//   if (!usernameStorage) {
//     window.location.replace("/auth");
//   }
// }

//checkAuth();
pollServer();
setInterval(pollServer, POLL_INTERVAL);
