CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    job_title_ar VARCHAR(255) NOT NULL,
    job_title_en VARCHAR(255) NOT NULL,
    profile_image_url VARCHAR(255),
    bio_ar TEXT,
    bio_en TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);