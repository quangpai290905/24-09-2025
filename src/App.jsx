// src/App.jsx
import Navbar from "./components/Navbar.jsx"      // Import Navbar
import Cart from "./components/Cart.jsx"          // Import Cart (giỏ hàng)
import ProductList from "./components/Productlist.jsx"


export default function App() {
  return (
    <div className="app"> {/* Bao bọc toàn bộ ứng dụng */}
      
      {/* Thanh điều hướng luôn ở trên cùng */}
      <Navbar />

      {/* Khu vực nội dung chính */}
      <main className="container">
        <div className="grid">
          
          {/* Cột trái: hiển thị danh sách sản phẩm */}
          <ProductList />

          {/* Cột phải: hiển thị giỏ hàng */}
          <Cart />
        </div>
      </main>
    </div>
  )
}
