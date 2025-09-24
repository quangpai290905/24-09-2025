// src/components/Navbar.jsx
import { useSelector } from "react-redux";
//  import hook `useSelector` để đọc dữ liệu từ Redux store

export default function Navbar() {
  // Lấy mảng items từ slice cart
  // `s.cart?.items ?? []` nghĩa là: nếu `s.cart` chưa có hoặc `s.cart.items` bị undefined → trả về []
  const items = useSelector((s) => s.cart?.items ?? []);

  // Tính tổng số lượng sản phẩm trong giỏ
  // Duyệt qua mảng items, cộng dồn qty (nếu qty undefined thì coi là 0)
  const totalItems = items.reduce((sum, it) => sum + (it.qty || 0), 0);

  return (
    <nav className="nav">
      {/* Logo hoặc tên app */}
      <div className="brand">Dương Việt Quang</div>

      {/* Viên hiển thị giỏ hàng */}
      <div
        className="cart-pill" //  class CSS: viên tròn chứa chữ và số
        aria-label={`Giỏ hàng có ${totalItems} sản phẩm`} //  hỗ trợ screen reader
        title="Giỏ hàng" //  Tooltip khi hover
      >
        <span>Giỏ hàng</span>
        {/* Badge hiển thị tổng số lượng sản phẩm */}
        <span className="badge">{totalItems}</span>
      </div>
    </nav>
  );
}
