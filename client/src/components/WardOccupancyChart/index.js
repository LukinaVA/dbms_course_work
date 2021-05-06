import { useState, useEffect } from 'react';
import axios from 'axios';

import './style.scss';

const WardOccupancyChart = () => {
    const [wardsState, setWardsState] = useState({});

    const fetchData = async () => {
      let result = {};
      const wardsInfo = (await axios.get('http://localhost:9095/api/wards-state')).data;
      wardsInfo.forEach((ward) => {
          result[ward.ward_name] = (ward.occupied_num / ward.capacity) * 100;
      });
      setWardsState(result);
    };

    const drawChart = () => {
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');
        ctx.fillStyle = "black"; // Задаём чёрный цвет для линий
        ctx.lineWidth = 2.0; // Ширина линии
        ctx.beginPath(); // Запускает путь
        ctx.moveTo(30, 10); // Указываем начальный путь
        ctx.lineTo(30, 460); // Перемешаем указатель
        ctx.lineTo(500, 460); // Ещё раз перемешаем указатель
        ctx.stroke(); // Делаем контур

        // Цвет для рисования
        ctx.fillStyle = "black";
        // Цикл для отображения значений по Y
        for(let i = 0; i < 6; i++) {
            ctx.fillText((5 - i) * 20 + "", 4, i * 80 + 60);
            ctx.beginPath();
            ctx.moveTo(25, i * 80 + 60);
            ctx.lineTo(30, i * 80 + 60);
            ctx.stroke();
        }

        // Массив с меткам палат
        const labels = Object.keys(wardsState);

        // Выводим меток
        for(let i = 0; i < labels.length; i++) {
            ctx.fillText(labels[i], 50+ i*100, 475);
        }

        console.log(wardsState);
        // Назначаем зелёный цвет для графика
        ctx.fillStyle = "green";
        // Цикл для от рисовки графиков
        for(let i = 0; i < labels.length; i++) {
            const dp = wardsState[labels[i]];
            ctx.fillRect(40 + i*100, 460-dp*5 , 50, dp*5);
        }
    };

    useEffect(() => {
        fetchData().then(drawChart);
    }, []);

    return (
        <section>
            <h2>Ward Occupancy Chart</h2>
            <canvas width='500' height='500' id='canvas'/>
        </section>
    );
}

export default WardOccupancyChart;