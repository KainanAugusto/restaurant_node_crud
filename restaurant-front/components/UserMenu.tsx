// components/UserMenu.tsx
import React, { useEffect, useState } from 'react';
import styles from '../styles/UserMenu.module.css';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { FaUser, FaAngleDown, FaSignOutAlt  } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

interface MyTokenPayload {
  username: string; 
}

const UserMenu: React.FC = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [username, setUsername] = useState('Usuário');
    const { logout } = useAuth();
    const router = useRouter();
    const token = Cookies.get('token');

    useEffect(() => {
        if (typeof window !== 'undefined' && token) {
            try {
                const decodedToken = jwtDecode<MyTokenPayload>(token);
                setUsername(decodedToken.username || 'Usuário'); // Use a propriedade 'username' do token
            } catch (error) {
                console.error('Erro ao decodificar o token:', error);
            }
        }
    }, [token]);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const handleLogout = () => {
        Cookies.remove('token');
        logout();
        router.push('/').then(() => window.location.reload());
    };


    return (
        <div className={styles.userMenu}>
            <FaUser className={styles.icon} onClick={toggleDropdown} />
            <span className={styles.username} onClick={toggleDropdown}>{username}</span>
            <FaAngleDown className={`${styles.arrow} ${dropdownOpen ? styles.arrowOpen : ''}`} onClick={toggleDropdown} />

            {dropdownOpen && (
                <div className={styles.dropdown}>
                    <a href="/meusPedidos" className={styles.dropdownItem}>Meus Pedidos</a>
                    <a href="/my-account" className={styles.dropdownItem}>Minha Conta</a>
                    <button onClick={handleLogout} className={styles.dropdownItemLogout}>
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
