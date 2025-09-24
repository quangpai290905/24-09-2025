// src/redux/cart/cartSlice.jsx

// Import hàm createSlice từ Redux Toolkit
// 👉 createSlice giúp định nghĩa state + reducer + action nhanh gọn, không cần viết switch-case dài dòng
import { createSlice } from "@reduxjs/toolkit" 

// ------------------- STATE KHỞI TẠO -------------------
// Đây là trạng thái mặc định ban đầu của giỏ hàng
const initialState = {
  items: [],        // Mảng sản phẩm trong giỏ [{id, name, price, image, qty}]
  totalItems: 0,    // Tổng số lượng sản phẩm (cộng tất cả qty)
  totalPrice: 0,    // Tổng số tiền (cộng price * qty)
}

// ------------------- HÀM TIỆN ÍCH -------------------
// Tìm vị trí sản phẩm trong giỏ theo id, trả về index hoặc -1 nếu chưa có
const findIndex = (state, id) => state.items.findIndex(i => i.id === id)

// ------------------- SLICE GIỎ HÀNG -------------------
const cartSlice = createSlice({
  name: "cart",          // Tên slice => state.cart
  initialState,          // State mặc định
  reducers: {
    // ✅ Thêm sản phẩm vào giỏ (nếu chưa có thì thêm mới, nếu có rồi thì +1)
    addToCart: (state, action) => {
      const { id, name, price, image } = action.payload
      const idx = findIndex(state, id)
      if (idx === -1) {
        // Nếu sản phẩm chưa có -> thêm mới với qty = 1
        state.items.push({ id, name, price, image, qty: 1 })
      } else {
        // Nếu đã có -> tăng số lượng thêm 1
        state.items[idx].qty += 1
      }
      // Cập nhật tổng số lượng và tổng tiền
      state.totalItems += 1
      state.totalPrice += price
    },

    // ✅ Alias cho addToCart (giữ lại nếu code cũ dùng addItem)
    addItem: (state, action) => {
      const { id, name, price, image } = action.payload
      const idx = findIndex(state, id)
      if (idx === -1) {
        state.items.push({ id, name, price, image, qty: 1 })
      } else {
        state.items[idx].qty += 1
      }
      state.totalItems += 1
      state.totalPrice += price
    },

    // ✅ Tăng số lượng 1 sản phẩm trong giỏ theo id
    increase: (state, action) => {
      const id = action.payload
      const idx = findIndex(state, id)
      if (idx !== -1) {
        state.items[idx].qty += 1
        state.totalItems += 1
        state.totalPrice += state.items[idx].price
      }
    },

    // ✅ Giảm số lượng 1 sản phẩm (chỉ giảm nếu qty > 1, không để về 0 ở đây)
    decrease: (state, action) => {
      const id = action.payload
      const idx = findIndex(state, id)
      if (idx !== -1 && state.items[idx].qty > 1) {
        state.items[idx].qty -= 1
        state.totalItems -= 1
        state.totalPrice -= state.items[idx].price
      }
    },

    // ✅ Đặt lại số lượng sản phẩm theo input của user
    setQuantity: (state, action) => {
      const { id, qty } = action.payload
      const idx = findIndex(state, id)
      if (idx !== -1) {
        const current = state.items[idx]
        const diff = qty - current.qty // chênh lệch số lượng
        current.qty = qty
        state.totalItems += diff
        state.totalPrice += diff * current.price
      }
    },

    // ✅ Xóa hoàn toàn 1 sản phẩm khỏi giỏ
    removeItem: (state, action) => {
      const id = action.payload
      const idx = findIndex(state, id)
      if (idx !== -1) {
        const removed = state.items[idx]
        // Trừ đi số lượng và tiền tương ứng
        state.totalItems -= removed.qty
        state.totalPrice -= removed.qty * removed.price
        // Xóa khỏi mảng items
        state.items.splice(idx, 1)
      }
    },

    // ✅ Xóa toàn bộ giỏ hàng (reset về mặc định)
    clearCart: (state) => {
      state.items = []
      state.totalItems = 0
      state.totalPrice = 0
    },
  },
})

// ------------------- EXPORT -------------------
// Xuất action để gọi trong component
export const {
  addToCart,
  addItem,
  increase,
  decrease,
  setQuantity,
  removeItem,
  clearCart,
} = cartSlice.actions

// Xuất reducer để khai báo trong store
export default cartSlice.reducer
