import React, { useState, useEffect } from 'react';
import './DataTable.css';
import { updateGoogleSheetData } from '../utils/googleSheets'; // Импортируем функцию

function DataTable({ tableData, setTableData, allTableData }) { // Добавлено allTableData
  const [readings, setReadings] = useState({});
  const [isCalculateButtonActive, setIsCalculateButtonActive] = useState({});

  useEffect(() => {
    // Обновляем состояние активности кнопки при изменении показаний
    const initialButtonState = {};
    tableData.forEach(row => {
      initialButtonState[row.Гараж] = readings[row.Гараж] !== undefined && readings[row.Гараж] !== '';
    });
    setIsCalculateButtonActive(initialButtonState);
  }, [readings, tableData]);

  const handleReadingChange = (garage, value) => {
    setReadings({ ...readings, [garage]: value });
  };

  const handleCalculateClick = async (garage) => {
    const newReading = readings[garage];
    if (!newReading) return;

    const rowData = tableData.find((row) => row.Гараж === garage);

    if (!rowData) {
      console.error(`Data not found for garage: ${garage}`);
      return;
    }

    // Рассчитываем новые значения
    const previousReadings = parseInt(rowData['Прошлые показания счётчика'], 10) || 0;
    const currentReadings = parseInt(newReading, 10) || 0;

    // **ДОБАВЛЕННАЯ ПРОВЕРКА**
    if (currentReadings < previousReadings) {
      alert("Измените текущие показания. Они не могут быть меньше предыдущих.");
      return; // Прерываем выполнение функции, если проверка не прошла
    }

    // Получаем тариф из столбца G
    const tariff = parseFloat(rowData['Тариф']) || 6.3; // Берем тариф из таблицы, если есть, иначе 6.3

    const consumption = currentReadings - previousReadings;
    const cost = consumption * tariff;

    // Определяем range (диапазон ячеек для обновления)
    const rowIndex = allTableData.findIndex((row) => row.Гараж === garage) + 2; // +2, потому что первая строка - заголовки
    const readingColumn = 'D'; // Показания на день оплаты
    const costColumn = 'F'; // К оплате
    const pastReadingsColumn = 'C'; // Прошлые показания

    // Формируем range для обновления столбца "Показания на день оплаты"
    const readingRange = `Sheet1!${readingColumn}${rowIndex}`;
    // Формируем range для обновления столбца "К оплате"
    const costRange = `Sheet1!${costColumn}${rowIndex}`;
    // Формируем range для обновления столбца "Прошлые показания счётчика"
    const pastReadingsRange = `Sheet1!${pastReadingsColumn}${rowIndex}`;

    try {
      // Вызываем функцию для обновления Google Sheets для каждого столбца
      console.log('range:', readingRange, 'values:', [[newReading]]);
      await updateGoogleSheetData(readingRange, [[newReading]]); // "Показания на день оплаты"
      console.log('range:', costRange, 'values:', [[cost.toFixed(2).replace('.', ',')]]);
      await updateGoogleSheetData(costRange, [[cost.toFixed(2).replace('.', ',')]]); // "К оплате"
      console.log('range:', pastReadingsRange, 'values:', [[String(currentReadings)]]);
      await updateGoogleSheetData(pastReadingsRange, [[String(currentReadings)]]); // "Прошлые показания"

      const updatedTableData = tableData.map(row => {
        if (row.Гараж === garage) {
          return {
            ...row,
            'Показания на день оплаты': newReading,
            'К оплате': cost.toFixed(2).replace('.', ','),
            'Прошлые показания счётчика': currentReadings,
          };
        }
        return row;
      });
      setTableData(updatedTableData); // Обновляем tableData

      setReadings({ ...readings, [garage]: '' }); // Очищаем поле ввода

    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Гараж</th>
            <th>ФИО</th>
            <th>Прошлые показания счётчика</th>
            <th>Показания на день оплаты</th>
            <th>Рассчитать</th>
            <th>К оплате</th>
          </tr>
        </thead>
        <tbody>
          {tableData && tableData.map((row, index) => (
            <tr key={index}>
              <td>{row.Гараж}</td>
              <td>{row.ФИО}</td>
              <td>{row['Прошлые показания счётчика']}</td>
              <td>
                {/* Поле для ввода показаний */}
                <input
                  type="number"
                  value={readings[row.Гараж] || ''}
                  onChange={(e) => handleReadingChange(row.Гараж, e.target.value)}
                  className="reading-input"
                />
              </td>
              <td>
                <button
                  onClick={() => handleCalculateClick(row.Гараж)}
                  disabled={!isCalculateButtonActive[row.Гараж]} // Отключаем кнопку, если она не активна
                  className={`calculate-button ${isCalculateButtonActive[row.Гараж] ? 'active' : ''}`}
                >
                  Рассчитать
                </button>
              </td>
              <td>{row['К оплате']}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
