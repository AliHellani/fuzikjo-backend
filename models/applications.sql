CREATE TABLE applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_offer_id INT NOT NULL,
    user_id INT NOT NULL,
    resume_url VARCHAR(255) NOT NULL,
    cover_url VARCHAR(255),
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    FOREIGN KEY (job_offer_id) REFERENCES job_offers(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);