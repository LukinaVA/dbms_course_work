import { Link } from 'react-router-dom';
import './style.scss';

const Header = () => {
    return (
        <header className='header'>
            <nav className='header_nav'>
                <ul className='header_list'>
                    <li><Link to='/' className='header_link'>People</Link></li>
                    <li><Link to='/wards' className='header_link'>Wards</Link></li>
                    <li><Link to='/diagnosis' className='header_link'>Diagnosis</Link></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;