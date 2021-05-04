import { useState, useEffect } from 'react';
import axios from 'axios';

const Diagnosis = () => {
    const [diagnosisList, setDiagnosisList] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalWithParams, setModalWithParams] = useState(false);

    const [id, setId] = useState('');
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
        await fetchData();
    };

    const addNewDiagnosis = async () => {
        await axios.post('http://localhost:9095/api/diagnosis', {
            name
        });
        await fetchData();
    };

    const updateDiagnosisInfo = async () => {
        await axios.put(`http://localhost:9095/api/diagnosis/${id}`, {
            name
        });
        await fetchData();
        setModalWithParams(false);
        setModalIsOpen(false);
    };

    const openModalWithParams = async (diagnosis) => {
        setId(diagnosis.id);
        setName(diagnosis.name);
        setModalWithParams(true);
        setModalIsOpen(true);
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
                        <td>
                            <button onClick={openModalWithParams.bind(null, diagnosis)}>delete</button>
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
                    {!modalWithParams &&
                    <button onClick={addNewDiagnosis}>Add new diagnosis</button>}

                    {modalWithParams &&
                    <button onClick={updateDiagnosisInfo}>Update diagnosis info</button>}
                </form>
            </div>
        </section>
    );
}

export default Diagnosis;