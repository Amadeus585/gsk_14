import React, { useState } from 'react';
import './SearchForm.css';

function SearchForm({ setTableData, allTableData }) {
  const [fio, setFio] = useState('');
  const [isButtonActive, setIsButtonActive] = useState(false);

  const handleSearchClick = () => {
    // Фильтруем allTableData по ФИО (не регистрозависимо)
    const filteredData = allTableData.filter(item =>
      item.ФИО.toLowerCase().includes(fio.toLowerCase())
    );

    //  Обновляем состояние tableData с помощью функции, переданной из App.js
    setTableData(filteredData);
  };

  const handleFioChange = (e) => {
    const value = e.target.value;
    setFio(value);
    setIsButtonActive(value.trim() !== '');
  };

  return (
    <div className="search-container">
      <h2>Потребление электроэнергии</h2>
      <input
        type="text"
        placeholder="Введите ФИО"
        value={fio}
        onChange={handleFioChange}
        className="search-input"
      />
      <button
        onClick={handleSearchClick} // Изменили название функции
        disabled={!isButtonActive}
        className={`search-button ${isButtonActive ? 'active' : ''}`}
      >
        Ввод показаний
      </button>
    </div>
  );
}

export default SearchForm;