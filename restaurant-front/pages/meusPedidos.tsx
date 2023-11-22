import Layout from '../components/Layout';

import React, { useEffect, useState, useRef } from 'react';
import styles from '../styles/MeusPedidos.module.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { api } from '@/service/api';
import { Alerts } from '@/util/AlertsContainers';
import { useRouter } from 'next/router';
import { isAuth } from '@/util/AuthProvider';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

interface Pedido {
  id: number;
  dateTime: string;
  customerId: number;
  address: string;
  deleted: boolean;
  OrderItems: {
    id: number;
    menuId: number;
    quantity: number;
    Menu: {
      id: number;
      dishName: string;
      price: number;
    };
  }[];
}


const MeusPedidos: React.FC = () => {

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [originalPedido, setOriginalPedido] = useState<Pedido | null>(null);
  const [bootstrapModal, setBootstrapModal] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [pedidoToCancel, setPedidoToCancel] = useState<Pedido | null>(null);

  const token = Cookies.get('token');

  const [sub, setSub] = useState('customerID');
  const [isLogged, setIsLogged] = useState(false)

  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [address, setAddress] = useState({
    street: '',
    city: '',
    district: '',
    number: ''
  });

  useEffect(() => {
    const checkAuthStatus = async () => {
      // interceptador de verificação se esta logado
      const autorizado = await isAuth();
      setIsLogged(autorizado);
    };

    checkAuthStatus();
  }, []);



  useEffect(() => {
    if (typeof window !== 'undefined' && token) {
      try {
        const decodedToken = jwtDecode<{ sub: string }>(token);
        const customerID = decodedToken.sub;
        setSub(customerID);
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
      }
    }
  }, [token]);

  

  useEffect(() => {
    const fetchPedidos = async () => {
      console.log(sub);
      try {
        
        const response = await api.get(`/orders/customer/${sub}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }});

        if (response.status === 200) {
          const data: Pedido[] = response.data;
          const sortedData = data.sort((a: Pedido, b: Pedido) => a.id - b.id);
          setPedidos(sortedData);
        } else {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
      }
    };

    if (sub !== 'customerID') {
      fetchPedidos();
    }
  }, [sub]);


  const reloadPedidos = async () => {
    const customerID = sub;

    console.log('reloadPedidos', customerID);
    
    try {
      const response = await api.get(`/orders/customer/${customerID}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }});

      if (response.status === 200) {
        const data: Pedido[] = response.data;
        const sortedData = data.sort((a: Pedido, b: Pedido) => a.id - b.id); // Ordena os pedidos pelo ID
        setPedidos(sortedData);
      }

    } catch (error: any) {
      console.error('Erro ao buscar pedidos:', error.message);
    }
  };


  useEffect(() => {
    const modalElement = modalRef.current;
    if (modalElement) {
      const handleModalClose = () => {
        if (originalPedido) {
          setSelectedPedido({ ...originalPedido });
        }
        setIsEditing(false);
        reloadPedidos(); // Recarregar os dados após fechar o modal

      };

      modalElement.addEventListener('hidden.bs.modal', handleModalClose);

      return () => {
        modalElement.removeEventListener('hidden.bs.modal', handleModalClose);
      };
    }
  }, [originalPedido, reloadPedidos]);



  const handleRowClick = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setOriginalPedido(pedido);
    setIsEditing(false);

    // Decompor o endereço e atualizar o estado
    const parts = pedido.address.split(', ');
    setAddress({
      street: parts[0],
      city: parts[3],
      district: parts[2],
      number: parts[1]
    });

    if (!bootstrapModal && modalRef.current) {
      // @ts-ignore: Unresolved type issue with Bootstrap

      import('bootstrap/dist/js/bootstrap.bundle.min').then(({ Modal }) => {
        const modalInstance = new Modal(modalRef.current);
        setBootstrapModal(modalInstance);
        modalInstance.show();
      });
    } else if (bootstrapModal) {
      bootstrapModal.show();
    } else {
      console.error("Modal instance not found");
    }
  };


  const toggleEditing = () => {
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    if (bootstrapModal) {
      bootstrapModal.hide(); // Usar a instância do modal para fechar
    }
    reloadPedidos(); // Recarrega os dados da página
  };



  const incrementQuantity = (itemIndex: number) => {
    if (!selectedPedido) return;

    // Cria uma cópia do pedido selecionado
    const updatedPedido = { ...selectedPedido };

    // Incrementa a quantidade do item específico
    updatedPedido.OrderItems[itemIndex].quantity += 1;

    // Atualiza o estado do pedido selecionado
    setSelectedPedido(updatedPedido);
  };

  // Função para remover um prato do pedido
  const removeOrderItem = (itemIndex: number) => {
    if (!selectedPedido) return;

    const updatedPedido = { ...selectedPedido };
    updatedPedido.OrderItems.splice(itemIndex, 1);
    setSelectedPedido(updatedPedido);
  };

  // Função para decrementar a quantidade ou remover um item
  const handleDecrementQuantity = (itemIndex: number) => {
    if (!selectedPedido) return;

    const updatedPedido = { ...selectedPedido };

    if (updatedPedido.OrderItems[itemIndex].quantity > 1) {
      updatedPedido.OrderItems[itemIndex].quantity -= 1;
    } else {
      removeOrderItem(itemIndex);
    }

    setSelectedPedido(updatedPedido);
  };

  const handleSaveChanges = async () => {
    if (isEditing) {
      const success = await updatePedido();
      if (success) {
        reloadPedidos();
        setIsEditing(false);
        if (bootstrapModal) {
          bootstrapModal.hide();
        }
      }
    }
  };

  const updatePedido = async () => {
    if (!selectedPedido) return false;

    // Construir o novo endereço
    const updatedAddress = `${address.street}, ${address.number}, ${address.district}, ${address.city}`;

    const payload = {
      ...selectedPedido,
      address: updatedAddress,
      items: selectedPedido.OrderItems.map(item => ({
        menuId: item.menuId,
        quantity: item.quantity
      })),
    };

    try {
      const response = await api.put(`/orders/${selectedPedido.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.status === 200; // Retorna true se a atualização foi bem-sucedida
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      return false; // Retorna false se ocorrer um erro
    }
  };




  const openConfirmationModal = (pedido: Pedido, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation(); // Impede a propagação do evento de clique para a linha da tabela
    setPedidoToCancel(pedido);
    setShowConfirmationModal(true);
  };


  const handleCancelPedido = async () => {
    try {

      if (pedidoToCancel) {
        await api.delete(`/orders/${pedidoToCancel.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        Alerts.successDark("Pedido cancelado com sucesso!");
        setShowConfirmationModal(false);
        reloadPedidos();
      }
    } catch (error) {
      Alerts.errorDark("Erro ao cancelar o pedido.");
    }
  };

  const formatAddress = (address: string) => {
    // Função para formatar o endereço
    const parts = address.split(', ');
    return {
      rua: parts[0],
      numero: parts[1],
      bairro: parts[2],
      cidade: parts[3],
    };
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };






  if (!isLogged) {
    return (
      <></>
    )
  } else {
    return (
      <Layout>

      <div className="container my-4">
        <h1 className="text-center mb-4">Meus Pedidos</h1>
        <div className="text-end mb-2">
          <button
            className="btn btn-primary"
            onClick={() => router.push('/menu')}
          >
            Adicionar Pedido
          </button>
        </div>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Pedido ID</th>
                <th>Data e Hora</th>
                <th>Endereço</th>
                <th>Pratos e Valores</th>
                <th>Total</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pedidos
                .filter((pedido) => !pedido.deleted) // Filtra os pedidos que não estão deletados
                .map((pedido) => {
                  const { rua, numero, bairro, cidade } = formatAddress(pedido.address);
                  return (
                    <tr key={pedido.id} onClick={() => handleRowClick(pedido)}>
                      <td>{pedido.id}</td>
                      <td>{new Date(pedido.dateTime).toLocaleString()}</td>
                      <td>
                        <div>
                          <div>Rua: {rua}</div>
                          <div>Número: {numero}</div>
                          <div>Bairro: {bairro}</div>
                          <div>Cidade: {cidade}</div>
                        </div>
                      </td>
                      <td>
                        <div>
                          {pedido.OrderItems.map((item, index) => (
                            <div key={index} className={styles.pedidoItem}>
                              <span>{item.Menu.dishName} - {item.quantity}x - ${item.Menu.price.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td>
                        ${pedido.OrderItems.reduce((total, item) => total + item.quantity * item.Menu.price, 0).toFixed(2)}
                      </td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={(e) => openConfirmationModal(pedido, e)}
                        >
                          Cancelar Pedido
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>

          </table>
        </div>

        {/* Modal para exibir detalhes do pedido */}
        <div ref={modalRef} className="modal fade" id="pedidoModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Detalhes do Pedido</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {selectedPedido && (
                  <div>
                    <h6>ID do Pedido: {selectedPedido.id}</h6>
                    <h6>Data e Hora: {new Date(selectedPedido.dateTime).toLocaleString()}</h6>
                    <hr />

                    {selectedPedido.OrderItems.map((item, index) => (
                      <div key={index} className="mb-2">
                        <div className="input-group mb-2">
                          <span className="input-group-text">Prato</span>
                          <input
                            type="text"
                            value={item.Menu.dishName}
                            disabled={!isEditing}
                            className="form-control"
                            style={{ maxWidth: '30%' }}
                          />
                          <button
                            className="btn btn-outline-danger"
                            type="button"
                            disabled={!isEditing}
                            onClick={() => handleDecrementQuantity(index)}
                          >-</button>
                          <input
                            type="number"
                            value={item.quantity}
                            disabled={!isEditing}
                            className="form-control"
                            style={{ maxWidth: '8%' }}
                          />
                          <button
                            className="btn btn-outline-success"
                            type="button"
                            disabled={!isEditing}
                            onClick={() => incrementQuantity(index)}
                          >+</button>
                        </div>
                        <div className="input-group mb-2">
                          <span className="input-group-text">Preço</span>
                          <input
                            type="text"
                            value={`$${item.Menu.price.toFixed(2)}`}
                            disabled={!isEditing}
                            className="form-control"
                            style={{ maxWidth: '10%' }}
                          />
                        </div>
                      </div>
                    ))}
                    {isEditing ? (
                        <div className="mb-3">
                          <h3>Editar Endereço de Entrega</h3>
                          <div className="row g-3">
                            <div className="col-md-6">
                              <label htmlFor="street" className="form-label">Rua</label>
                              <input type="text" className="form-control" id="street" name="street" placeholder="Rua" value={address.street} onChange={handleAddressChange} />
                            </div>
                            <div className="col-md-6">
                              <label htmlFor="number" className="form-label">Número</label>
                              <input type="text" className="form-control" id="number" name="number" placeholder="Número" value={address.number} onChange={handleAddressChange} />
                            </div>
                            <div className="col-md-6">
                              <label htmlFor="district" className="form-label">Bairro</label>
                              <input type="text" className="form-control" id="district" name="district" placeholder="Bairro" value={address.district} onChange={handleAddressChange} />
                            </div>
                            <div className="col-md-6">
                              <label htmlFor="city" className="form-label">Cidade</label>
                              <select id="city" name="city" className="form-select" value={address.city} onChange={handleAddressChange}>
                                <option value="">Selecione a Cidade</option>
                                <option value="Cidade A">Cidade A</option>
                                <option value="Cidade B">Cidade B</option>
                              </select>
                            </div>
                          </div>
                        </div>
                    ) : (
                      <div className="col-md-4">
                        <h6>Endereço de Entrega</h6>
                        <p>{selectedPedido.address}</p>
                      </div>
                    )}
                    <hr />
                    <p className="text-end fw-bold">Total: ${selectedPedido.OrderItems.reduce((total, item) => total + item.quantity * item.Menu.price, 0).toFixed(2)}</p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                {isEditing ? (
                  <>
                    <button type="button" className="btn btn-danger" onClick={cancelEditing}>Cancelar Edição</button>
                    <button type="button" className="btn btn-warning" onClick={handleSaveChanges}>Salvar Alterações</button>
                  </>
                ) : (
                  <button type="button" className="btn btn-warning" onClick={toggleEditing}>Editar Pedido</button>
                )}
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de cancelamento de pedido */}
        <div className={`modal fade ${showConfirmationModal ? 'show' : ''}`} style={{ display: showConfirmationModal ? 'block' : 'none', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar Cancelamento</h5>
                <button type="button" className="btn-close" onClick={() => setShowConfirmationModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Tem certeza de que deseja cancelar o pedido {pedidoToCancel?.id}?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowConfirmationModal(false)}>Fechar</button>
                <button type="button" className="btn btn-danger" onClick={handleCancelPedido}>Cancelar Pedido</button>
              </div>
            </div>
          </div>
        </div>




      </div>
            </Layout>

    );
  };
}

export default MeusPedidos;