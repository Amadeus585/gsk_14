// src/components/Header.js
import React, { useState } from 'react';
import './Header.css'; // Импортируем Header.css

function Header() {
  const [isAboutUsVisible, setIsAboutUsVisible] = useState(false);

  return (
    <header className="Header">
      <div className="header-container">
        <div className="logo">ГСК-14</div>
        <div className="header-links">
          <div
            className="about-us"
            onMouseEnter={() => setIsAboutUsVisible(true)}
            onMouseLeave={() => setIsAboutUsVisible(false)}
          >
            О нас
            {isAboutUsVisible && (
              <div className="about-us-popup">
                <p>
                  ГСК-14 - это гаражно-строительный кооператив, созданный для
                  объединения автовладельцев и обеспечения удобного и
                  безопасного хранения их транспортных средств.
                </p>
              </div>
            )}
          </div>
          <div className="responsible-number">
            Номер ответственного: <span className="phone-number">123-456-7890</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;