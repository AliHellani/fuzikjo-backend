CREATE TABLE messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    subject_ar VARCHAR(255) NOT NULL,
    subject_en VARCHAR(255) NOT NULL,
    message_ar TEXT NOT NULL,
    message_en TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);