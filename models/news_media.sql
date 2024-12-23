CREATE TABLE news_media (
    id INT PRIMARY KEY AUTO_INCREMENT,
    news_id INT NOT NULL,
    media_type ENUM('image', 'video') NOT NULL,
    media_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (news_id) REFERENCES news(id)
);