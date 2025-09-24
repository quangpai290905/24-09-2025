// Import các hook & hàm cần dùng từ React và React-Redux
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Import thunk và các selector từ slice posts
import {
  fetchPosts,          // Thunk async: gọi API -> dispatch pending/fulfilled/rejected
  selectPosts,         // Selector: lấy danh sách posts từ state
  selectPostsStatus,   // Selector: lấy trạng thái tải dữ liệu: 'idle' | 'loading' | 'succeeded' | 'failed'
  selectPostsError,    // Selector: lấy thông tin lỗi nếu có
} from '../redux/posts/postSlice';

// Component hiển thị danh sách bài viết
export default function PostList() {
  // Lấy hàm dispatch để gửi action/thunk lên store
  const dispatch = useDispatch();

  // Đọc dữ liệu từ Redux store bằng các selector (đã tách logic truy cập state)
  const posts = useSelector(selectPosts);               // Mảng bài viết
  const status = useSelector(selectPostsStatus);        // Trạng thái tải dữ liệu
  const error = useSelector(selectPostsError);          // Thông điệp lỗi (nếu có)

  // useEffect chạy sau khi render:
  // - Khi status === 'idle' (chưa load), ta trigger fetchPosts() để gọi API lấy dữ liệu.
  // - Thêm 'status' và 'dispatch' vào deps để giữ đúng chuẩn hook rules & eslint.
  useEffect(() => {
    if (status === 'idle') dispatch(fetchPosts());
  }, [status, dispatch]);

  // UI hiển thị theo trạng thái:
  // - loading: hiện text "Đang tải…"
  // - failed: hiện lỗi
  // - succeeded: map 10 bài viết đầu tiên -> card
  return (
    <section style={{ marginTop: 24 }}>
      <h2 className="section-title">Bài viết</h2>

      {/* Đang tải dữ liệu */}
      {status === 'loading' && <div className="muted">Đang tải…</div>}

      {/* Tải thất bại */}
      {status === 'failed' && <div className="muted">Lỗi: {error}</div>}

      {/* Tải thành công */}
      {status === 'succeeded' && (
        <div className="stack">
          {posts.slice(0, 10).map((p) => (
            // key nên là p.id để React tối ưu render list
            <div key={p.id} className="card">
              {/* Tiêu đề bài viết */}
              <div className="title">{p.title}</div>

              {/* Nội dung mô tả/ngắn gọn */}
              <div className="muted">{p.body}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
