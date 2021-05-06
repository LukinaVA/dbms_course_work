import { useState, useEffect } from 'react';
import axios from 'axios';
import WardOccupancyChart from '../WardOccupancyChart';

const Wards = () => {
    const [wardList, setWardList] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalWithParams, setModalWithParams] = useState(false);

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [max_count, setMaxCount] = useState('');

    const fetchData = async () => {
        let resWardList = (await axios.get('http://localhost:9095/api/wards')).data;
        setWardList(resWardList);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const deleteWard = async (e) => {
        const id = e.target.parentElement.parentElement.firstChild.textContent;
        await axios.delete(`http://localhost:9095/api/wards/${id}`);
        await fetchData();
    };

    const addNewWard = async () => {
        await axios.post('http://localhost:9095/api/wards', {
            name,
            max_count
        });
        await fetchData();
    };

    const updateWardInfo = async () => {
        await axios.put(`http://localhost:9095/api/wards/${id}`, {
            name,
            max_count
        });
        await fetchData();
        setModalWithParams(false);
        setModalIsOpen(false);
    };

    const openModalWithParams = async (ward) => {
        setId(ward.id);
        setName(ward.name);
        setMaxCount(ward.max_count);
        setModalWithParams(true);
        setModalIsOpen(true);
    };

    return (
        <section>
            <h1>List of wards</h1>
            <table>
                <tbody>
                {wardList && wardList.map((ward, index) => (
                    <tr key={index}>
                        <td>{ward.id}</td>
                        <td>{ward.name}</td>
                        <td>{ward.max_count}</td>
                        <td>
                            <button onClick={deleteWard}>delete</button>
                        </td>
                        <td>
                            <button onClick={openModalWithParams.bind(null, ward)}>delete</button>
                        </td>
                    </tr>
                ))
                }
                </tbody>
            </table>

            <WardOccupancyChart/>

            <button onClick={() => setModalIsOpen(!modalIsOpen)}>
                Add new ward
            </button>
            <div hidden={!modalIsOpen}>
                <form>
                    <input value={name} onChange={(e) => setName(e.target.value)}/>
                    <input value={max_count} onChange={(e) => setMaxCount(e.target.value)}/>
                    {!modalWithParams &&
                    <button onClick={addNewWard}>Add new ward</button>}
                    {modalWithParams &&
                    <button onClick={updateWardInfo}>Update ward info</button>}
                </form>
            </div>
        </section>
    );
}

export default Wards;