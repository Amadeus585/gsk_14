// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import DataTable from './components/DataTable';
import { loadGoogleSheet } from './utils/googleSheets'; // Исправленный импорт

function App() {
  const [tableData, setTableData] = useState([]); // Данные, отображаемые в таблице
  const [allTableData, setAllTableData] = useState([]); // Все данные из Google Sheets
  const [error, setError] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isSearchPerformed, setIsSearchPerformed] = useState(false); // Добавляем состояние для отслеживания, был ли выполнен поиск

  const handleAuthorizeClick = async () => {
    try {
      const data = await loadGoogleSheet();
      if (data) {
        // Форматируем данные
        const headers = data[0];
        const rows = data.slice(1);

        const formattedData = rows.map(row => {
          const rowObject = {};
          headers.forEach((header, index) => {
            rowObject[header] = row[index];
          });
          return rowObject;
        });

        setAllTableData(formattedData); // Сохраняем все данные
        setTableData([]); // Изначально НЕ показываем все данные
        setError(null);
        setIsAuthorized(true);
        setIsSearchPerformed(false); // Сбрасываем состояние поиска при авторизации
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message || "Произошла ошибка при загрузке данных.");
      setTableData([]);
      setAllTableData([]);
      setIsAuthorized(false);
      setIsSearchPerformed(false); // Сбрасываем состояние поиска при ошибке
    }
  };

  useEffect(() => {
    // Не загружаем данные при первом рендере, ждем авторизации
  }, [isAuthorized]);

  const handleSearch = (filteredData) => {
    setTableData(filteredData);
    setIsSearchPerformed(true); // Устанавливаем состояние поиска в true
  };

  return (
    <div className="App">
      <Header />
      {!isAuthorized && (
        <button onClick={handleAuthorizeClick}>Авторизоваться в Google Sheets</button>
      )}
      {error && <div className="error-message">{error}</div>}
      {isAuthorized && (
        <>
          <SearchForm setTableData={handleSearch} allTableData={allTableData} /> {/* Передаем handleSearch */}
          {isSearchPerformed && <DataTable tableData={tableData} setTableData={setTableData} allTableData={allTableData} />} {/* Отображаем таблицу только после поиска и передаем setTableData */}
        </>
      )}
    </div>
  );
}

export default App;