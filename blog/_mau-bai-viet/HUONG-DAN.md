# Hướng dẫn đăng bài blog

## Cấu trúc
- `/blog/index.html`: trang danh sách. Tự đọc `/blog/posts.json`, không sửa tay danh sách.
- `/blog/posts.json`: **nguồn duy nhất** của danh sách bài (trang Blog, mục "Kiến thức theo chủ đề" và nút menu trên trang chủ đều đọc file này).
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
    "n": 35,
    "topic": "A",
    "minutes": 6,
    "title":   { "vi": "Tiêu đề tiếng Việt" },
    "summary": { "vi": "Tóm tắt 1–2 câu." },
    "lastmod": "2026-11-28"
  }
]
```
   - **Không hiển thị ngày đăng** ở bất kỳ đâu (trang bài, thẻ, OG, JSON-LD). `lastmod` chỉ dùng cho `sitemap.xml`.
   - `topic` là một trong 6 chủ đề (trang chủ và `/blog/` nhóm bài theo trường này, sắp theo `n` trong từng chủ đề):
     `A` Contact Center & vòng đời · `B` CRM & Omnichannel · `C` AI trong CSKH · `D` WFM & QM · `E` Campaign & Autodialer · `F` Tích hợp & lựa chọn giải pháp.
   - `n` là số thứ tự bài trong kế hoạch (1–34 đã dùng); bài mới lấy số kế tiếp.
   - Bài chỉ có tiếng Việt: bỏ `en` trong title/summary (thẻ sẽ ghi "Vietnamese only" khi xem bằng EN).
   - `"draft": true` để tạm ẩn bài khỏi danh sách mà không xoá.
5. Chạy `python3 _scripts/build-sitemap.py` ở thư mục gốc repo để cập nhật `/sitemap.xml` (đọc `posts.json`, bỏ bài `draft`). Commit cả `sitemap.xml` cùng bài.
6. Kiểm tra desktop, mobile, dark mode, cả VI và EN, rồi push.

## Nguyên tắc nội dung
- Có nguồn cho mọi số liệu, quy định, mốc thời gian; ghi ở mục "Nguồn tham khảo".
- Không nêu giá, chiết khấu, thông tin dự án hay tên khách hàng chưa được phép công bố.
- Bài nói về sản phẩm/chính sách BaseBS: kiểm tra với BaseBS trước khi đăng.
- Giữ dòng miễn trừ "góc nhìn cá nhân" cuối bài.
