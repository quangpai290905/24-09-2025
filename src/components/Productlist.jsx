// src/components/ProductList.jsx

// Import hook React để quản lý state & lifecycle
import { useEffect, useState, useCallback, useMemo } from "react";

// Import từ react-redux
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cart/cartSlice"; 
//   addToCart: action để thêm sản phẩm vào giỏ

// Import hàm fetchProducts để lấy danh sách sản phẩm từ API
import { fetchProducts } from "../data/products"; 
//   API này đã map sẵn dữ liệu (ảnh, giá, name, id...)

// Hàm tiện ích format tiền sang VND
const formatVND = (v) =>
  Number(v || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 });

export default function ProductList() {
  const dispatch = useDispatch();

  // State quản lý danh sách sản phẩm
  const [products, setProducts] = useState([]);   

  // State quản lý trạng thái tải
  const [loading, setLoading] = useState(true);   

  // State quản lý lỗi
  const [error, setError] = useState(null);       

  // useEffect: gọi API khi component mount
  useEffect(() => {
    let mounted = true;                // flag để kiểm tra còn mounted không
    const ac = new AbortController();  // để hủy request khi unmount

    (async () => {
      try {
        setLoading(true);
        setError(null);
        // gọi API lấy danh sách sản phẩm
        const list = await fetchProducts({ signal: ac.signal }); 
        if (!mounted) return;          // nếu unmount thì không set state
        // nếu kết quả là mảng thì setProducts, ngược lại set []
        setProducts(Array.isArray(list) ? list : []);
      } catch (e) {
        if (!mounted) return;
        // Nếu lỗi không phải do Abort thì log + setError
        if (e?.name !== "AbortError") {
          console.error("❌ Lỗi tải sản phẩm:", e);
          setError("Không tải được danh sách sản phẩm.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    // cleanup khi component unmount
    return () => {
      mounted = false;
      ac.abort(); // hủy request nếu còn chạy
    };
  }, []);

  // Hàm xử lý thêm sản phẩm vào giỏ
  const handleAdd = useCallback(
    (p) => {
      dispatch(addToCart(p)); 
      // cartSlice sẽ tự kiểm tra: 
      // nếu chưa có thì thêm với qty=1, 
      // nếu đã có thì tăng qty
    },
    [dispatch]
  );

  // Hàm fallback ảnh khi ảnh lỗi
  const onImgError = useCallback((e) => {
    e.currentTarget.src = "https://via.placeholder.com/300x300?text=No+Image";
  }, []);

  // Memo hóa UI danh sách sản phẩm để tránh render lại không cần thiết
  const listUI = useMemo(() => {
    if (products.length === 0) {
      return <div className="muted">Chưa có sản phẩm để hiển thị.</div>;
    }
    return products.map((p) => (
      <div key={p.id} className="card">
        {/* Hình sản phẩm */}
        <img 
          src={p.image} 
          alt={p.name} 
          loading="lazy"         // lazy load cho tối ưu
          onError={onImgError}   // fallback khi lỗi ảnh
        />
        {/* Tên sản phẩm */}
        <div className="title">{p.name}</div>
        {/* Giá sản phẩm */}
        <div className="price">
          {formatVND(p.price)} <span className="currency">đ</span>
        </div>
        {/* Nút thêm vào giỏ */}
        <button
          type="button"
          className="btn btn-primary"
          aria-label={`Thêm ${p.name} vào giỏ`}
          onClick={() => handleAdd(p)}
        >
          Thêm vào giỏ
        </button>
      </div>
    ));
  }, [products, handleAdd, onImgError]);

  // Nếu đang tải thì hiển thị "Đang tải"
  if (loading) return <p className="muted">Đang tải sản phẩm...</p>;
  // Nếu có lỗi thì hiển thị thông báo lỗi
  if (error) return <p className="muted">{error}</p>;

  // UI chính của component
  return (
    <section aria-labelledby="product-list-title">
      <h2 id="product-list-title" className="section-title">
        Danh sách sản phẩm
      </h2>
      {/* Danh sách sản phẩm hiển thị ở đây */}
      <div className="products">{listUI}</div>
    </section>
  );
}
