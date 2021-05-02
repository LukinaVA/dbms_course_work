import { useState, useEffect } from 'react';
import axios from 'axios';

const Diagnosis = () => {
    const [diagnosisList, setDiagnosisList] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [name, setName] = useState('');

    const fetchData = async () => {
        let resDiagnosisList = (await axios.get('http://localhost:9095/api/diagnosis')).data;
        setDiagnosisList(resDiagnosisList);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const deleteDiagnosis = async (e) => {
        const id = e.target.parentElement.parentElement.firstChild.textContent;
        await axios.delete(`http://localhost:9095/api/diagnosis/${id}`);
        fetchData();
    };

    const addNewDiagnosis = async () => {
        await axios.post('http://localhost:9095/api/diagnosis', {
            name
        });
        fetchData();
    };

    return (
        <section>
            <h1>List of diagnosis</h1>
            <table>
                <tbody>
                {diagnosisList && diagnosisList.map((diagnosis, index) => (
                    <tr key={index}>
                        <td>{diagnosis.id}</td>
                        <td>{diagnosis.name}</td>
                        <td>
                            <button onClick={deleteDiagnosis}>delete</button>
                        </td>
                    </tr>
                ))
                }
                </tbody>
            </table>
            <button onClick={() => setModalIsOpen(!modalIsOpen)}>
                Add new diagnosis
            </button>
            <div hidden={!modalIsOpen}>
                <form onSubmit={addNewDiagnosis}>
                    <input value={name} onChange={(e) => setName(e.target.value)}/>
                    <button type='submit' onSubmit={addNewDiagnosis}>Add new diagnosis</button>
                </form>
            </div>
        </section>
    );
}

export default Diagnosis;