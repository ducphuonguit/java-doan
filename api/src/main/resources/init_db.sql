DROP DATABASE IF EXISTS class_ecommerce;
CREATE
DATABASE IF NOT EXISTS class_ecommerce;
USE
class_ecommerce;

CREATE TABLE users
(
    id                INT AUTO_INCREMENT PRIMARY KEY,
    full_name         VARCHAR(255),
    username          VARCHAR(255) UNIQUE NOT NULL,
    email             VARCHAR(255) UNIQUE,
    phone_number      VARCHAR(20) UNIQUE,
    password          VARCHAR(255),
    avatar_url        VARCHAR(255),
    role              ENUM('ROLE_USER', 'ROLE_ADMIN') NOT NULL DEFAULT 'ROLE_USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    CONSTRAINT fk__users__created_by FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT fk__users__updated_by FOREIGN KEY (updated_by) REFERENCES users(id)
);

CREATE TABLE refresh_token
(
    token              VARCHAR(255) NOT NULL PRIMARY KEY,
    user_id            INT          NOT NULL,
    expiration_time    TIMESTAMP    NOT NULL,
    created_at         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk__refresh_token__user_id
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE
);

CREATE TABLE product
(
    id          INT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(255)   NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    CONSTRAINT fk__product__created_by FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT fk__product__updated_by FOREIGN KEY (updated_by) REFERENCES users(id)
);

CREATE TABLE product_variant (
                                 id INT PRIMARY KEY AUTO_INCREMENT,
                                 product_id INT NOT NULL,
                                 variant_name VARCHAR(100) NOT NULL,
                                 quantity_per_unit INT NOT NULL, -- e.g., 1 for single apple, 12 for a box
                                 unit_type VARCHAR(50) NOT NULL, -- e.g., 'apple', 'box'
                                 CONSTRAINT fk__product_variant__product_id FOREIGN KEY (product_id) REFERENCES product(id)
);

CREATE TABLE sku (
                     id INT PRIMARY KEY AUTO_INCREMENT,
                     variant_id INT NOT NULL,
--                       sku_code VARCHAR(50) UNIQUE NOT NULL, -- Unique SKU code for tracking
                     stock_quantity INT NOT NULL DEFAULT 0,
                     price DECIMAL(10, 2) NOT NULL, -- Price per variant
                     CONSTRAINT fk__sku__variant_id FOREIGN KEY (variant_id) REFERENCES product_variant(id)
);

-- Giả sử bạn đã có bảng `users` với user ID là 1 để dùng cho created_by / updated_by
-- Nếu chưa có, bạn cần tạo bảng users và insert trước

-- Thêm 30 sản phẩm bằng tiếng Việt
INSERT INTO product (name, description, created_by, updated_by)
VALUES
    ('Táo đỏ', 'Táo đỏ tươi ngon từ Đà Lạt', 1, 1),
    ('Cam sành', 'Cam mọng nước, nhiều vitamin C', 1, 1),
    ('Chuối tiêu', 'Chuối chín cây, thơm ngọt', 1, 1),
    ('Dưa hấu', 'Dưa hấu ruột đỏ, ngọt mát', 1, 1),
    ('Nho xanh', 'Nho không hạt, vỏ mỏng', 1, 1),
    ('Xoài cát', 'Xoài cát chín cây, dẻo và ngọt', 1, 1),
    ('Ổi lê', 'Ổi lê giòn, thơm mát', 1, 1),
    ('Dứa (thơm)', 'Dứa chín, mọng nước', 1, 1),
    ('Mận hậu', 'Mận hậu Bắc Hà, vị chua nhẹ', 1, 1),
    ('Lê Hàn Quốc', 'Lê nhập khẩu Hàn Quốc, giòn và ngọt', 1, 1),
    ('Táo xanh', 'Táo xanh chua nhẹ, dùng cho salad', 1, 1),
    ('Cam mật', 'Cam ngọt, dùng để ép nước', 1, 1),
    ('Thanh long ruột đỏ', 'Thanh long tươi, ngọt và đẹp mắt', 1, 1),
    ('Dưa lưới', 'Dưa lưới giòn, vị ngọt thanh', 1, 1),
    ('Sầu riêng', 'Sầu riêng Ri6, cơm vàng hạt lép', 1, 1),
    ('Bưởi da xanh', 'Bưởi ít hạt, múi to', 1, 1),
    ('Chôm chôm', 'Chôm chôm lông nhọn, ngọt', 1, 1),
    ('Mít Thái', 'Mít Thái siêu ngọt, ít xơ', 1, 1),
    ('Na dai', 'Na dai ngọt, nhiều thịt', 1, 1),
    ('Me chua ngọt', 'Me chín, vừa chua vừa ngọt', 1, 1),
    ('Măng cụt', 'Măng cụt chín cây, vỏ mềm', 1, 1),
    ('Vải thiều', 'Vải thiều Lục Ngạn, mọng nước', 1, 1),
    ('Dâu tây', 'Dâu tây Đà Lạt, tươi mới', 1, 1),
    ('Khế chua', 'Khế chua dùng để nấu canh', 1, 1),
    ('Cóc non', 'Cóc non chua nhẹ, ăn kèm muối ớt', 1, 1),
    ('Cà rốt', 'Cà rốt Đà Lạt, ngọt và giòn', 1, 1),
    ('Cà chua', 'Cà chua bi, chín mọng', 1, 1),
    ('Rau cải ngọt', 'Cải ngọt tươi sạch mỗi ngày', 1, 1),
    ('Khoai lang', 'Khoai lang mật, dẻo và ngọt', 1, 1),
    ('Khoai tây', 'Khoai tây Đà Lạt, vàng ruột', 1, 1);

-- Thêm biến thể cho mỗi sản phẩm
INSERT INTO product_variant (product_id, variant_name, quantity_per_unit, unit_type)
SELECT id, CONCAT('Gói ', name), 1, 'kg'
FROM product;

-- Thêm SKU cho mỗi biến thể
INSERT INTO sku (variant_id, stock_quantity, price)
SELECT id, FLOOR(RAND() * 100) + 10, ROUND(RAND() * 50 + 10, 2)
FROM product_variant;
