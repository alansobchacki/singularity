import Post from "./Post";

export default interface TimelinePage {
  posts: Post[];
  nextPage: number | null;
}
