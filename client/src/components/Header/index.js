import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header>
            <nav>
                <ul>
                    <li><Link to='/'>People</Link></li>
                    <li><Link to='/wards'>Wards</Link></li>
                    <li><Link to='/diagnosis'>Diagnosis</Link></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;