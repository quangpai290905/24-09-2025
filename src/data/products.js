// src/data/products.js
import { jsonAxios } from "../api/jsonAxios";

// Ảnh local (để fallback)
import xiaomi17promax from "../assets/xiaomi17promax.jpg";
import xiaomi17       from "../assets/xiaomi17.jpg";
import xiaomi15ultra  from "../assets/xiaomi15ultra.jpg";
import xiaomi15       from "../assets/xiaomi15.jpg";

// Fallback local chắc chắn hiển thị được
const localFallback = [
  { id: "p1", name: "Xiaomi 17 Promax", price: 19990000, image: xiaomi17promax },
  { id: "p2", name: "Xiaomi 17",       price: 15000000, image: xiaomi17 },
  { id: "p3", name: "Xiaomi 15 Ultra", price: 34000000, image: xiaomi15ultra },
  { id: "p4", name: "Xiaomi 15",       price: 22000000, image: xiaomi15 },
];

/**
 * Gọi API theo baseURL:
 * - Nếu là DummyJSON: /products/search?q=xiaomi&limit=8 (có thumbnail)
 * - Nếu là JSONPlaceholder: /posts (không có ảnh/giá) -> gắn ảnh/giá local
 * - Nếu lỗi hoặc rỗng => trả về localFallback
 */
export async function fetchProducts() {
  try {
    const base = (import.meta.env.VITE_API_URL || "").toLowerCase();

    // 1) DummyJSON (khuyên dùng vì có dữ liệu thật)
    if (base.includes("dummyjson")) {
      const { data } = await jsonAxios.get("/products/search", {
        params: { q: "xiaomi", limit: 8 },
      });
      const list = (data?.products || []).map((p) => ({
        id: String(p.id),
        name: p.title,
        // DummyJSON có giá USD (hoặc số đơn vị), convert nhẹ sang VND cho đẹp
        price: Math.round(Number(p.price) * 24000),
        image: p.thumbnail || p.images?.[0] || xiaomi17,
      }));
      return list.length ? list : localFallback;
    }

    // 2) JSONPlaceholder (chỉ là API demo -> phải gắn ảnh/giá tay)
    if (base.includes("jsonplaceholder")) {
      const { data } = await jsonAxios.get("/posts");
      const imgs = [xiaomi17promax, xiaomi17, xiaomi15ultra, xiaomi15];
      const list = (data || [])
        .slice(0, 4)
        .map((p, idx) => ({
          id: String(p.id),
          name: p.title,
          price: 10_000_000 + idx * 5_000_000,
          image: imgs[idx] || imgs[0],
        }));
      return list.length ? list : localFallback;
    }

    // 3) Không xác định baseURL: thử DummyJSON mặc định
    const { data } = await jsonAxios.get("/products/search", {
      params: { q: "xiaomi", limit: 8 },
    });
    const list = (data?.products || []).map((p) => ({
      id: String(p.id),
      name: p.title,
      price: Math.round(Number(p.price) * 24000),
      image: p.thumbnail || p.images?.[0] || xiaomi17,
    }));
    return list.length ? list : localFallback;
  } catch (err) {
    console.error("❌ fetchProducts error:", err);
    return localFallback; // FAIL-SAFE
  }
}
