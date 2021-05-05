import { useState, useEffect } from 'react';
import axios from 'axios';

const WardsState = () => {
    const [wardsList, setWardsList] = useState([]);

    const getWardsState = async () => {
        const wardsState = (await axios.get('http://localhost:9095/api/wards-state')).data;
        setWardsList(wardsState);
    };

    useEffect(() => {
        getWardsState();
    }, []);

    return (
        <section>
            <h2>Wards state</h2>
            <table>
                <tbody>
                {wardsList &&
                wardsList.map((ward, index) => (
                    <tr key={index}>
                        <td>{ward.ward_name}</td>
                        <td>{ward.diagnosis}</td>
                        <td>{ward.capacity}</td>
                        <td>{ward.occupied_num}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </section>
    );
}

export default WardsState;