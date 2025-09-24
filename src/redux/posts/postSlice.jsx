// src/redux/posts/postSlice.jsx

// 👉 import createSlice để tạo slice (state + reducers)
// 👉 import createAsyncThunk để tạo action async (gọi API)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jsonAxios } from '../../api/jsonAxios';

// ------------------- THUNK GỌI API -------------------
// 👉 Tạo async thunk để gọi API posts từ jsonPlaceholder
// Action type = "posts/fetch"
// - pending: khi request bắt đầu
// - fulfilled: khi request thành công
// - rejected: khi request lỗi
export const fetchPosts = createAsyncThunk('posts/fetch', async () => {
  // Gọi API GET /posts
  const res = await jsonAxios.get('/posts');
  // Trả về dữ liệu => sẽ được gắn vào action.payload
  return res.data; // [{id, title, body}, ...]
});

// ------------------- SLICE POSTS -------------------
const postSlice = createSlice({
  name: 'posts',    // slice name => state.posts
  initialState: {
    items: [],      // Danh sách posts [{id, title, body}, ...]
    status: 'idle', // Trạng thái gọi API: idle | loading | succeeded | failed
    error: null,    // Thông báo lỗi (nếu có)
  },
  reducers: {
    // Chưa cần reducer sync vì chỉ load posts từ API
  },
  extraReducers: (builder) => {
    builder
      // Khi fetchPosts.pending chạy (bắt đầu gọi API)
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';   // chuyển state sang "loading"
        state.error = null;         // reset lỗi
      })
      // Khi fetchPosts.fulfilled (API trả về thành công)
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'; // cập nhật trạng thái
        state.items = action.payload; // gán data posts vào state
      })
      // Khi fetchPosts.rejected (API lỗi hoặc bị hủy)
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';    // cập nhật trạng thái
        state.error = action.error?.message || 'Lỗi tải posts';
      });
  },
});

// ------------------- SELECTORS -------------------
// 👉 Hàm tiện ích lấy dữ liệu từ store
export const selectPosts = (s) => s.posts.items;        // Lấy danh sách posts
export const selectPostsStatus = (s) => s.posts.status; // Lấy trạng thái API
export const selectPostsError = (s) => s.posts.error;   // Lấy lỗi (nếu có)

// ------------------- EXPORT -------------------
// 👉 Export reducer để khai báo trong store
export default postSlice.reducer;
