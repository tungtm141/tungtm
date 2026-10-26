# Hướng dẫn đăng bài blog

## Cấu trúc
- `/blog/index.html`: trang danh sách. Tự đọc `/blog/posts.json`, không sửa tay danh sách.
- `/blog/posts.json`: **nguồn duy nhất** của danh sách bài (trang Blog, mục "Bài viết mới" và nút menu trên trang chủ đều đọc file này).
- `/blog/<slug>/index.html`: một bài viết → URL `https://truongmanhtung.com/blog/<slug>/`.
- `/blog/<slug>/og.jpg`: ảnh chia sẻ 1200×630 (khuyến nghị). Chưa có thì trỏ og:image về `/og-image.jpg`.
- `/assets/blog.css`, `/assets/blog.js`: giao diện và logic dùng chung.
- Thư mục `_mau-bai-viet` là mẫu, không link tới.

## Đăng một bài mới
1. Sao chép `blog/_mau-bai-viet/index.html` thành `blog/<slug>/index.html`.
   - slug: chữ thường, không dấu, nối bằng gạch ngang, ngắn gọn. Ví dụ `cisco-12-5-het-ho-tro`.
2. Thay mọi chỗ `{{...}}`. **Xoá dòng `<meta name="robots" content="noindex">`.**
3. Bài chỉ có tiếng Việt: giữ `<p class="lang-note" data-l="en">`, bỏ khối `<div data-l="en">` trong bài.
   Bài đủ hai thứ tiếng: xoá `lang-note`.
4. Thêm một mục vào `blog/posts.json`:

```json
[
  {
    "slug": "cisco-12-5-het-ho-tro",
    "date": "2026-11-02",
    "minutes": 6,
    "title":   { "vi": "Tiêu đề tiếng Việt", "en": "English title" },
    "summary": { "vi": "Tóm tắt 1–2 câu.", "en": "One or two sentence summary." },
    "tags": [ { "vi": "Contact Center", "en": "Contact Center" } ]
  }
]
```
   - Bài chỉ có tiếng Việt: bỏ `en` trong title/summary (thẻ sẽ ghi "Vietnamese only" khi xem bằng EN).
   - `"draft": true` để tạm ẩn bài khỏi danh sách mà không xoá.
5. Kiểm tra desktop, mobile, dark mode, cả VI và EN, rồi push.

## Nguyên tắc nội dung
- Có nguồn cho mọi số liệu, quy định, mốc thời gian; ghi ở mục "Nguồn tham khảo".
- Không nêu giá, chiết khấu, thông tin dự án hay tên khách hàng chưa được phép công bố.
- Bài nói về sản phẩm/chính sách BaseBS: kiểm tra với BaseBS trước khi đăng.
- Giữ dòng miễn trừ "góc nhìn cá nhân" cuối bài.
