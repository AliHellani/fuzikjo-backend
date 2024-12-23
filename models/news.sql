CREATE TABLE news (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    content_ar TEXT NOT NULL,
    content_en TEXT NOT NULL,
    author_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
);