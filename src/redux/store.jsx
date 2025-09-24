// src/redux/store.jsx
import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cart/cartSlice'

// ⬇️ (Tuỳ chọn) Nếu bạn đã tạo slice bài viết:
// import postsReducer from './posts/postSlice'

/* ===================== PERSIST (localStorage) ===================== */
/** Đọc state từ localStorage để khi reload không mất dữ liệu */
function loadState() {
  try {
    const raw = localStorage.getItem('reduxState')
    if (!raw) return undefined              // không có -> dùng initialState mặc định
    return JSON.parse(raw)                  // parse JSON -> object
  } catch {
    return undefined                        // lỗi parse/quyền -> bỏ qua
  }
}

/** Ghi state xuống localStorage (chỉ ghi phần cần thiết) */
function saveState(state) {
  try {
    localStorage.setItem('reduxState', JSON.stringify(state))
  } catch {
    // quota đầy / private mode... -> bỏ qua
  }
}

/** Giới hạn tần suất gọi 1 hàm (ở đây là saveState) để tránh ghi quá dày */
function throttle(fn, wait = 500) {
  let last = 0
  let timer
  let lastArgs
  return (...args) => {
    const now = Date.now()
    const remain = wait - (now - last)
    lastArgs = args
    if (remain <= 0) {
      last = now
      fn(...args)                           // gọi ngay nếu đã đủ thời gian
    } else {
      clearTimeout(timer)
      timer = setTimeout(() => {
        last = Date.now()
        fn(...lastArgs)                     // gọi 1 lần cuối sau khi user dừng thao tác
      }, remain)
    }
  }
}
/* =================== /PERSIST (localStorage) ====================== */

// 1) Nạp state đã lưu (nếu có). Không có -> undefined để slice tự dùng initialState
const preloadedState = loadState() || undefined

// 2) Tạo store
export const store = configureStore({
  reducer: {
    cart: cartReducer,          // state.cart do cartSlice quản lý
    // posts: postsReducer,      // (tuỳ chọn) bật nếu bạn đã có posts slice
  },
  preloadedState,               // nạp state để reload không mất dữ liệu giỏ
  // middleware: (getDefault) => getDefault(), // giữ mặc định là đủ
  // devTools: process.env.NODE_ENV !== 'production', // mặc định đã bật ở dev
})

// 3) Mỗi lần store thay đổi -> lưu lại CHỈ phần cart (được throttle)
store.subscribe(
  throttle(() => {
    const { cart } = store.getState()
    // Nếu có thêm slice khác cũng cần persist, gom vào đây:
    // const { posts } = store.getState()
    // saveState({ cart, posts })
    saveState({ cart })
  }, 500)
)

// (tuỳ chọn) selector nhanh
export const selectCartState = (state) => state.cart
