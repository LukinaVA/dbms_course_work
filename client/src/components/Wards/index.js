import { useState, useEffect } from 'react';
import axios from 'axios';

const Wards = () => {
    const [wardList, setWardList] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);

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
        fetchData();
    };

    const addNewWard = async () => {
        await axios.post('http://localhost:9095/api/wards', {
            name,
            max_count
        });
        fetchData();
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
                    </tr>
                ))
                }
                </tbody>
            </table>
            <button onClick={() => setModalIsOpen(!modalIsOpen)}>
                Add new ward
            </button>
            <div hidden={!modalIsOpen}>
                <form onSubmit={addNewWard}>
                    <input value={name} onChange={(e) => setName(e.target.value)}/>
                    <input value={max_count} onChange={(e) => setMaxCount(e.target.value)}/>
                    <button type='submit' onSubmit={addNewWard}>Add new ward</button>
                </form>
            </div>
        </section>
    );
}

export default Wards;