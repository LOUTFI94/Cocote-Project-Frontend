import { createSlice } from "@reduxjs/toolkit";

// Initial state containing posts, each with `likes` and `dislikes` arrays
const initialState = {
  posts: [{ id: 1, likes: [], dislikes: [], likeCount: 0, dislikeCount: 0 }],
};

const likesSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    toggleLike: (state, action) => {
      const { id, userId } = action.payload;
      const post = state.posts.find((p) => p.id === id);

      if (post) {
        // If the user is already in the likes list, remove them and decrement by 2
        if (post.likes.includes(userId)) {
          post.likes = post.likes.filter((uid) => uid !== userId);
          post.likeCount = Math.max(0, post.likeCount - 2);
        } else {
          // Add user to likes, remove from dislikes, and increment by 2
          post.likes.push(userId);
          post.likeCount += 2;

          // Remove user from dislikes if they are already present
          if (post.dislikes.includes(userId)) {
            post.dislikes = post.dislikes.filter((uid) => uid !== userId);
            post.dislikeCount = Math.max(0, post.dislikeCount - 2);
          }
        }
      } else {
        // Add new post entry if not present
        state.posts.push({
          id,
          likes: [userId],
          dislikes: [],
          likeCount: 2,
          dislikeCount: 0,
        });
      }
    },
    toggleDislike: (state, action) => {
      const { id, userId } = action.payload;
      const post = state.posts.find((p) => p.id === id);

      if (post) {
        // If the user is already in the dislikes list, remove them and decrement by 2
        if (post.dislikes.includes(userId)) {
          post.dislikes = post.dislikes.filter((uid) => uid !== userId);
          post.dislikeCount = Math.max(0, post.dislikeCount - 2);
        } else {
          // Add user to dislikes, remove from likes, and increment by 2
          post.dislikes.push(userId);
          post.dislikeCount += 2;

          // Remove user from likes if they are already present
          if (post.likes.includes(userId)) {
            post.likes = post.likes.filter((uid) => uid !== userId);
            post.likeCount = Math.max(0, post.likeCount - 2);
          }
        }
      } else {
        // Add new post entry if not present
        state.posts.push({
          id,
          likes: [],
          dislikes: [userId],
          likeCount: 0,
          dislikeCount: 2,
        });
      }
    },
  },
});

export const { toggleLike, toggleDislike } = likesSlice.actions;
export default likesSlice.reducer;
