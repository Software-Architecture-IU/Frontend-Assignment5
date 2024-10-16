export const POSTS_URL = "https://tw-posts.stress-testers.ru";
export const LIKES_URL = "https://tw-likes.stress-testers.ru";
export const AUTH_URL = "https://tw-users.stress-testers.ru";
export const POLL_POSTS_INTERVAL = 1000;
export const POLL_LIKES_INTERVAL = 1000;
export const LIKE_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';

export interface Post {
  id: number;
  username: string;
  content: string;
}

export interface Like {
  post_id: number;
  usernames: string[];
}
