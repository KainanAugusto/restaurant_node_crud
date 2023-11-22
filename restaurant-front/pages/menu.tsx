import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../Styles/Menu.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alerts } from '@/util/AlertsContainers';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode library
import Cookies from "js-cookie";
import { api } from '@/service/api';
import { isAuth } from '@/util/AuthProvider';


interface MenuItem {
  id: number;
  dishName: string;
  price: number;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const Menu = () => {
  const [customerId, setCustomerId] = useState<number | null>(null);

  useEffect(() => {
    const token = Cookies.get('token'); // Get the JWT token from cookies (similar to what you did in MeusPedidos)

    if (typeof window !== 'undefined' && token) {
      try {
        const decodedToken = jwtDecode<{ sub: string }>(token); // Decode the JWT token
        const userId = decodedToken.sub;
        console.log(userId);
        setCustomerId(Number(userId) || null); // Set the customer ID (parse it to a number)
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
      }
    }
  }, []);


  const [isLogged, setIsLogged] = useState(false)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPaymentButtonEnabled, setIsPaymentButtonEnabled] = useState(false);

  const token = Cookies.get('token');

  const [address, setAddress] = useState({
    street: '',
    city: '',
    district: '',
    number: ''
  });

  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      // interceptador de verificação se esta logado
      const autorizado = await isAuth();
      setIsLogged(autorizado);
    };

    checkAuthStatus();
  }, []);

  
  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await api.get('/menu',{
          headers: {
            Authorization: `Bearer ${token}`
          }});

        if (response.status === 200) {
          const data: MenuItem[] = response.data;
          setMenuItems(data);
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching menu:', error);
      }
      setLoading(false);
    }
  
    fetchMenu();
  }, []);
  

  const addToCart = (menuItem: MenuItem) => {
    setCartItems((prev) => {
      const itemExists = prev.find((item) => item.id === menuItem.id);
      if (itemExists) {
        return prev.map((item) =>
          item.id === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...menuItem, quantity: 1 }];
      }
    });
  };

  useEffect(() => {
    let timer: number;

    if (showPaymentModal) {
      setIsPaymentButtonEnabled(false);
      timer = window.setTimeout(() => {
        setIsPaymentButtonEnabled(true);
      }, 6000); // 6 segundos
    }

    return () => window.clearTimeout(timer);
  }, [showPaymentModal]);

  const removeFromCart = (id: number) => {
    setCartItems((prev) =>
      prev.reduce((acc, item) => {
        if (item.id === id) {
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [] as CartItem[])
    );
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const completeOrder = async () => {
    if (!customerId) {
      console.error('Customer ID is missing.');
      return;
    }
    const jwtToken = Cookies.get('token');

    const fullAddress = `${address.street}, ${address.number}, ${address.district}, ${address.city}`;
    const orderData = {
      customerId,
      address: fullAddress,
      items: cartItems.map((item) => ({
        menuId: item.id,
        quantity: item.quantity,
      })),
    };


    try {
      const response = await api.post(`/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Falha na requisição de pedido');
      }


    } catch (error) {
      console.error('Erro ao criar pedido:', error);
    }
  };

  const handleOpenPaymentModal = () => {
    const isNumberValid = /^\d+$/.test(address.number);
    const isStreetValid = /^[A-Za-z\s]+$/.test(address.street);
    const isDistrictValid = /^[A-Za-z\s]+$/.test(address.district);


    if (!isStreetValid || !isDistrictValid) {
      Alerts.errorDark("Endereço e bairro invalidos.");
      return;
    }
    if (!isNumberValid) {
      Alerts.errorDark("O número do endereço deve ser um número válido.");
      return;
    }
    if (Object.values(address).some(field => field.trim() === '')) {
      Alerts.errorDark("Todos os campos do endereço devem estar preenchidos.");
      return;
    }


    setShowPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
  };

  const finalizePayment = async () => {
    try {
      await completeOrder();

      Alerts.successDark('Pagamento realizado com sucesso!');
      setCartItems([]);

      router.push('/meusPedidos');
    } catch (error) {
      console.error('Erro ao finalizar o pagamento:', error);
      Alerts.errorDark('Erro ao finalizar o pagamento:');
    } finally {
      setShowPaymentModal(false);
    }
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };


  if (!isLogged) {
    return (
      <></>
    )
  } else {
    return (
      <Layout>

        <div className={styles.menuPage}>
          <Head>
            <title>Menu do Restaurante</title>
          </Head>
          <div className={styles.menuGrid}>
            {loading ? (
              <p>Loading...</p>
            ) : (
              menuItems.map((menuItem) => (
                <div key={menuItem.id} className={styles.menuItem}>
                  <h3>{menuItem.dishName}</h3>
                  <p>R${menuItem.price.toFixed(2)}</p>
                  <button onClick={() => addToCart(menuItem)} className={styles.addButton}>
                    Adicionar
                  </button>
                </div>
              ))
            )}
          </div>
          <div className={styles.cartContainer}>
            <h3>Carrinho</h3>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <span>{item.dishName} x {item.quantity}</span>
                <button onClick={() => removeFromCart(item.id)} className={styles.removeItemButton}>Remover</button>
              </div>
            ))}
            {cartItems.length > 0 && (
              <div className={styles.addressContainer}>
                <h3>Endereço de Entrega</h3>
                <input type="text" name="street" placeholder="Rua" value={address.street} onChange={handleAddressChange} />
                <select name="city" value={address.city} onChange={handleAddressChange} className={styles.selectCity}>
                  <option value="">Selecione a Cidade</option>
                  <option value="Cidade A">Cidade A</option>
                  <option value="Cidade B">Cidade B</option>
                </select>            <input type="text" name="district" placeholder="Bairro" value={address.district} onChange={handleAddressChange} />
                <input type="text" name="number" placeholder="Número" value={address.number} onChange={handleAddressChange} />
              </div>
            )}
            <div className={styles.cartTotal}>
              Total: R$ {calculateTotal().toFixed(2)}
            </div>
            <button onClick={handleOpenPaymentModal} className={styles.completeOrderButton} disabled={cartItems.length === 0}>
              Concluir Pedido
            </button>
          </div>
          {/* Modal para finalizar pagamento */}
          {showPaymentModal && (
            <div className="modal show d-block" tabIndex={-1}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Finalizar Pagamento</h5>
                    <button type="button" className="btn-close" onClick={handleClosePaymentModal}></button>
                  </div>
                  <div className="modal-body">
                    <p>Escolha sua forma de pagamento:</p>
                    <p><strong>QR Code</strong> - Escaneie o código com a camera do celular</p>
                    <img className='qrimg' src="/qrcode.png" alt="QR Code" /> {/* Substitua com o caminho da imagem do QR Code */}
                    <p><strong>PIX</strong> - Utilize a chave PIX abaixo</p>
                    <p>Chave PIX: 1234-5678-9101-1121</p>
                    <p>Tem certeza que deseja finalizar o pagamento?</p>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleClosePaymentModal}>Fechar</button>
                    <button type="button" className={`btn btn-primary ${!isPaymentButtonEnabled ? 'disabled' : ''}`} onClick={finalizePayment} disabled={!isPaymentButtonEnabled}>Confirmar Pagamento</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    );
  };
};
export default Menu;
