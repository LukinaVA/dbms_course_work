import axios from 'axios';
import { useEffect, useState } from 'react';

import './style.scss';

const People = () => {
    const [peopleList, setPeopleList] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);

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
        fetchData();
    };

    const addNewPatient = async () => {
        await axios.post('http://localhost:9095/api/people', {
            first_name,
            last_name,
            father_name,
            diagnosis_id,
            ward_id
        });
        fetchData();
    };

    const updatePersonInfo = async ({id, first_name}) => {

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
                        </tr>
                    ))
                    }
                </tbody>
            </table>
            <button onClick={() => setModalIsOpen(!modalIsOpen)}>
                Add new patient
            </button>
            <div hidden={!modalIsOpen}>
                <form onSubmit={addNewPatient}>
                    <input value={first_name} onChange={(e) => setFirstName(e.target.value)}/>
                    <input value={last_name} onChange={(e) => setLastName(e.target.value)}/>
                    <input value={father_name} onChange={(e) => setFatherName(e.target.value)}/>
                    <input value={diagnosis_id} onChange={(e) => setDiagnosisId(e.target.value)}/>
                    <input value={ward_id} onChange={(e) => setWardId(e.target.value)}/>
                    <button type='submit' onSubmit={addNewPatient}>Add new patient</button>
                </form>
            </div>
        </section>
    );
}

export default People;