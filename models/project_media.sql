CREATE TABLE project_media (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    media_type ENUM('image', 'video') NOT NULL,
    media_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);