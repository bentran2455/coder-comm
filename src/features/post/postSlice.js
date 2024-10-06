import { createSlice } from "@reduxjs/toolkit";
import apiService from "../../app/apiService";
import { POSTS_PER_PAGE } from "../../app/config";
import { toast } from "react-toastify";
import { cloudinaryUpload } from "../../utils/cloudinary";

const initialState = {
  isLoading: false,
  error: null,
  postsById: {},
  currentPagePosts: [],
};

const slice = createSlice({
  name: "post",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    createPostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      if (state.currentPagePosts.length % POSTS_PER_PAGE === 0)
        state.currentPagePosts.pop();
      const newPost = action.payload.data;
      state.postsById[newPost._id] = newPost;
      state.currentPagePosts.unshift(newPost._id);
    },
    deletePostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const deletedPostId = action.payload;
      state.currentPagePosts.forEach((postId, index) => {
        if (postId === deletedPostId) {
          state.currentPagePosts.splice(index, 1);
        }
      });
      delete state.postsById[deletedPostId];
    },
    editPostSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const newPost = action.payload.data;
      state.postsById[newPost._id] = newPost;
    },
    getPostsSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { count, posts } = action.payload.data;
      posts.forEach((post) => {
        state.postsById[post._id] = post;
        if (!state.currentPagePosts.includes(post._id)) {
          state.currentPagePosts.push(post._id);
        }
      });
      state.totalPosts = count;
    },
    sendPostReactionSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { postId, reaction } = action.payload;
      state.postsById[postId].reactions = reaction.data;
    },
    resetPosts(state, action) {
      state.postsById = {};
      state.currentPagePosts = [];
    },
  },
});

export const createPost =
  ({ content, image }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      //upload to cloudinary
      const imageUrl = await cloudinaryUpload(image);
      const response = await apiService.post("/posts", {
        content,
        image: imageUrl,
      });
      dispatch(slice.actions.createPostSuccess(response.data));
      toast.success("Your post has been created");
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const deletePost = (postId) => async (dispatch) => {
  dispatch(slice.actions.startLoading());
  try {
    await apiService.delete(`/posts/${postId}`);

    dispatch(slice.actions.deletePostSuccess(postId));
    toast.success("Your post has been deleted");
  } catch (error) {
    dispatch(slice.actions.hasError(error.message));
    toast.error(error.message);
  }
};

export const editPost =
  ({ postId, data }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const { content, image } = data;
      const imageUrl = await cloudinaryUpload(image);
      const response = await apiService.put(`/posts/${postId}`, {
        content,
        image: imageUrl,
      });

      dispatch(slice.actions.editPostSuccess(response.data));
      toast.success("Your post has been changed");
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const getPosts =
  ({ userId, page, limit = POSTS_PER_PAGE }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {
        page,
        limit,
      };
      const response = await apiService.get(`/posts/user/${userId}`, {
        params,
      });
      if (page === 1) dispatch(slice.actions.resetPosts());
      dispatch(slice.actions.getPostsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export const sendPostReaction =
  ({ postId, emoji }) =>
  async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await apiService.post(`/reactions`, {
        targetType: "Post",
        targetId: postId,
        emoji,
      });
      dispatch(
        slice.actions.sendPostReactionSuccess({
          postId,
          reaction: response.data,
        })
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      toast.error(error.message);
    }
  };

export default slice.reducer;
