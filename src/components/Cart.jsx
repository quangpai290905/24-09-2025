// src/components/Cart.jsx

// Import hook của react-redux
import { useDispatch, useSelector } from "react-redux"; 
//   useDispatch: gửi action lên Redux store
//   useSelector: đọc dữ liệu từ Redux store

// Import component con hiển thị từng sản phẩm trong giỏ
import CartItem from "./CartItem"; 

// Import action xóa giỏ hàng từ slice
import { clearCart } from "../redux/cart/cartSlice"; 

// Component Cart chính
export default function Cart() {
  const dispatch = useDispatch(); 
  //   Lấy hàm dispatch để gửi action lên Redux store

  // Lấy danh sách sản phẩm trong giỏ từ state Redux
  // Nếu state.cart.items không có thì mặc định là []
  const items = useSelector((state) => state.cart.items ?? []);

  // Tính tổng số lượng sản phẩm
  const totalQty = items.reduce((sum, it) => sum + (it.qty || 0), 0);

  // Tính tổng tiền = tổng (số lượng * giá) của từng sản phẩm
  const totalPrice = items.reduce(
    (sum, it) => sum + (it.qty || 0) * (it.price || 0),
    0
  );

  // Hàm format số tiền theo VND (có dấu . ngăn cách hàng nghìn)
  const formatVND = (n) =>
    Number(n || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 });

  return (
    // Khối aside hiển thị giỏ hàng, áp dụng class CSS "sidebar"
    <aside className="sidebar">

      {/* Header giỏ hàng + badge tổng số lượng */}
      <div 
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <h2 className="section-title" style={{ margin: 0 }}>Giỏ hàng</h2>
        <span className="badge" title="Tổng số lượng">{totalQty}</span>
      </div>

      {/* Danh sách sản phẩm trong giỏ */}
      <div className="cart-list">
        {items.length === 0 ? (
          // Nếu giỏ rỗng thì hiển thị chữ "Chưa có sản phẩm."
          <div className="muted">Chưa có sản phẩm.</div>
        ) : (
          // Nếu có sản phẩm thì render ra từng CartItem
          items.map((item) => <CartItem key={item.id} item={item} />)
        )}
      </div>

      {/* Đường kẻ ngang phân cách phần list và footer */}
      <hr className="hr" />

      {/* Phần tổng cộng: số lượng và tổng tiền */}
      <div className="totals">
        <div>Tổng ({totalQty} SP)</div>
        <div>
          {formatVND(totalPrice)} <span className="currency">đ</span>
        </div>
      </div>

      {/* Các nút hành động: Thanh toán và Xóa giỏ */}
      <div className="stack">
        <button
          className="btn btn-primary"
          disabled={items.length === 0} // Nếu giỏ rỗng thì disable
          onClick={() => alert("Chức năng thanh toán đang phát triển 😅")}
        >
          Thanh toán
        </button>
        <button
          className="btn btn-danger"
          disabled={items.length === 0} // Nếu giỏ rỗng thì disable
          onClick={() => dispatch(clearCart())} // Xóa toàn bộ giỏ hàng
        >
          Xóa giỏ
        </button>
      </div>
    </aside>
  );
}
