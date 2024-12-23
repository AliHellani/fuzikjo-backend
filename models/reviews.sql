CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    rating INT NOT NULL,
    comment_ar TEXT,
    comment_en TEXT,
    status ENUM('Pending', 'Confirmed') DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);