import axios from 'axios';
import { useEffect, useState } from 'react';

import WardsState from '../WardsState';
import './style.scss';

const People = () => {
    const [peopleList, setPeopleList] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalWithParams, setModalWithParams] = useState(false);

    const [id, setId] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [father_name, setFatherName] = useState('');
    const [diagnosis_id, setDiagnosisId] = useState('');
    const [ward_id, setWardId] = useState('');

    const fetchData = async () => {
        let resPeopleList = (await axios.get('http://localhost:9095/api/people')).data;
        setPeopleList(resPeopleList);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const deletePerson = async (e) => {
        const id = e.target.parentElement.parentElement.firstChild.textContent;
        await axios.delete(`http://localhost:9095/api/people/${id}`);
        await fetchData();
    };

    const addNewPatient = async () => {
        await axios.post('http://localhost:9095/api/people', {
            first_name,
            last_name,
            father_name,
            diagnosis_id,
            ward_id
        });
        await fetchData();
    };

    const updatePersonInfo = async () => {
        await axios.put(`http://localhost:9095/api/people/${id}`, {
            first_name,
            last_name,
            father_name,
            diagnosis_id,
            ward_id
        });
        await fetchData();
        setModalWithParams(false);
        setModalIsOpen(false);
    };

    const openModalWithParams = async (person) => {
        setId(person.id);
        setFirstName(person.first_name);
        setLastName(person.last_name);
        setFatherName(person.father_name);
        setDiagnosisId(person.diagnosis_id);
        setWardId(person.ward_id);
        setModalWithParams(true);
        setModalIsOpen(true);
    };

    return (
        <section>
            <h1>List of patients</h1>
            <table>
                <tbody>
                    {peopleList && peopleList.map((person, index) => (
                        <tr key={index}>
                            <td>{person.id}</td>
                            <td>{person.first_name}</td>
                            <td>{person.last_name}</td>
                            <td>{person.father_name}</td>
                            <td>{person.diagnosis_id}</td>
                            <td>{person.ward_id}</td>
                            <td>
                                <button onClick={deletePerson}>delete</button>
                            </td>
                            <td>
                                <button onClick={openModalWithParams.bind(null, person)}>update</button>
                            </td>
                        </tr>
                    ))
                    }
                </tbody>
            </table>

            <WardsState />

            <button onClick={() => setModalIsOpen(!modalIsOpen)}>
                Add new patient
            </button>

            <div hidden={!modalIsOpen}>
                <form>
                    <input value={first_name} onChange={(e) => setFirstName(e.target.value)}/>
                    <input value={last_name} onChange={(e) => setLastName(e.target.value)}/>
                    <input value={father_name} onChange={(e) => setFatherName(e.target.value)}/>
                    <input value={diagnosis_id} onChange={(e) => setDiagnosisId(e.target.value)}/>
                    <input value={ward_id} onChange={(e) => setWardId(e.target.value)}/>

                    {!modalWithParams &&
                    <button onClick={addNewPatient}>Add new patient</button>}

                    {modalWithParams &&
                    <button onClick={updatePersonInfo}>Update patient info</button>}

                </form>
            </div>
        </section>
    );
}

export default People;