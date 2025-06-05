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
