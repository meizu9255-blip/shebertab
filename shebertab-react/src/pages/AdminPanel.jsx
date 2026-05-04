import React, { useState, useEffect } from 'react';
import API_URL from '../config';
import './AdminPanel.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'workers'
  const [users, setUsers] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Service form states
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    // Check if user is actually admin
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/auth';
      return;
    }

    fetch(`${API_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (!data.user || data.user.role !== 'admin') {
          setError('Access denied. Сіздің бұл парақшаға кіруге рұқсатыңыз жоқ.');
          setLoading(false);
          return;
        }
        setUserRole(data.user.role);
        fetchUsers(token);
        fetchWorkers(token);
        fetchServices();
      })
      .catch(err => {
        setError('Қате орын алды');
        setLoading(false);
      });
  }, []);

  const fetchUsers = (token) => {
    fetch(`${API_URL}/api/admin/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Рұқсат жоқ');
        return res.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  const fetchWorkers = (token) => {
    fetch(`${API_URL}/api/admin/workers`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Рұқсат жоқ');
        return res.json();
      })
      .then(data => {
        setWorkers(data);
      })
      .catch(err => console.error(err));
  };

  const fetchServices = () => {
    fetch(`${API_URL}/api/services`)
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(err => console.error(err));
  };
  const handleRoleChange = async (id, newRole) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/users/${id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(users.map(u => u.id === id ? { ...u, role: data.role } : u));
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Қате орын алды');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Пайдаланушыны өшіруге сенімдісіз бе?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Қате орын алды');
    }
  };

  const handleDeleteWorker = async (id) => {
    if (!window.confirm('Бұл маманды платформадан өшіруге сенімдісіз бе? (Ол қайтадан жай клиент болады)')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/workers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setWorkers(workers.filter(w => w.id !== id));
        fetchUsers(token); // Refresh users to see the role change
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Қате орын алды');
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title: newServiceTitle, description: newServiceDesc })
      });
      if (res.ok) {
        const newService = await res.json();
        setServices([...services, newService]);
        setNewServiceTitle('');
        setNewServiceDesc('');
      }
    } catch (err) {
      alert('Қате орын алды');
    }
  };

  const handleEditService = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/services/${editingService.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title: editingService.title, description: editingService.description })
      });
      if (res.ok) {
        const updated = await res.json();
        setServices(services.map(s => s.id === updated.id ? updated : s));
        setEditingService(null);
      }
    } catch (err) {
      alert('Қате орын алды');
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Бұл қызмет түрін өшіруге сенімдісіз бе?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setServices(services.filter(s => s.id !== id));
      }
    } catch (err) {
      alert('Қате орын алды');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter ? u.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  if (loading) return <div className="admin-container"><h2>Жүктелуде...</h2></div>;

  if (error) {
    return (
      <div className="admin-container">
        <div className="admin-error">
          <h2>Access Denied</h2>
          <p>{error}</p>
          <a href="/" className="admin-btn">Басты бетке қайту</a>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Әкімшілік (Admin) Панель</h1>
        <p>Платформаны басқару жүйесі</p>
      </div>

      <div className="admin-tabs">
        <button 
          className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Пайдаланушылар
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'workers' ? 'active' : ''}`}
          onClick={() => setActiveTab('workers')}
        >
          Мамандарды тексеру
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => setActiveTab('services')}
        >
          Қызмет түрлері (Категориялар)
        </button>
      </div>

      <div className="admin-card">
        {activeTab === 'users' && (
          <div className="admin-table-responsive">
            <div style={{ padding: '15px', display: 'flex', gap: '15px', borderBottom: '1px solid var(--border)' }}>
              <input 
                type="text" 
                placeholder="Аты немесе Email бойынша іздеу..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', flex: 1 }}
              />
              <select 
                value={roleFilter} 
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}
              >
                <option value="">Барлық рөлдер</option>
                <option value="admin">Admin</option>
                <option value="worker">Worker</option>
                <option value="client">Client</option>
              </select>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Аты-жөні</th>
                  <th>Email</th>
                  <th>Телефон</th>
                  <th>Рөл (Role)</th>
                  <th>Тіркелген күні</th>
                  <th>Әрекеттер</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.full_name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone || '-'}</td>
                    <td>
                      <select 
                        value={u.role} 
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className={`role-select role-${u.role}`}
                      >
                        <option value="admin">Admin</option>
                        <option value="worker">Worker</option>
                        <option value="client">Client</option>
                      </select>
                    </td>
                    <td>{new Date(u.created_at).toLocaleDateString('kk-KZ')}</td>
                    <td>
                      <button onClick={() => handleDeleteUser(u.id)} className="admin-btn-delete">
                        Өшіру
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Табылмады</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'workers' && (
          <div className="admin-table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Жұмысшы ID</th>
                  <th>Маман аты</th>
                  <th>Email</th>
                  <th>Қызмет түрі</th>
                  <th>Бағасы</th>
                  <th>Рейтинг</th>
                  <th>Модерация</th>
                </tr>
              </thead>
              <tbody>
                {workers.map(w => (
                  <tr key={w.id}>
                    <td>#{w.id}</td>
                    <td>{w.full_name}</td>
                    <td>{w.email}</td>
                    <td><span style={{ padding: '4px 8px', background: 'var(--border)', borderRadius: '6px', fontSize: '13px' }}>{w.service_name}</span></td>
                    <td>{w.price_range}</td>
                    <td>{w.rating} ⭐</td>
                    <td>
                      <button onClick={() => handleDeleteWorker(w.id)} className="admin-btn-delete">
                        Бұғаттау (Өшіру)
                      </button>
                    </td>
                  </tr>
                ))}
                {workers.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>Мамандар жоқ</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="admin-services-tab">
            <div className="admin-service-form-card">
              <h3>{editingService ? 'Қызметті өңдеу' : 'Жаңа қызмет түрін қосу'}</h3>
              <form onSubmit={editingService ? handleEditService : handleAddService} className="admin-service-form">
                <div className="admin-service-inputs">
                  <input 
                    type="text" 
                    placeholder="Атауы (мысалы: Электрик)" 
                    value={editingService ? editingService.title : newServiceTitle}
                    onChange={(e) => editingService ? setEditingService({...editingService, title: e.target.value}) : setNewServiceTitle(e.target.value)}
                    required
                    className="admin-input"
                  />
                  <input 
                    type="text" 
                    placeholder="Сипаттамасы (Description)" 
                    value={editingService ? editingService.description : newServiceDesc}
                    onChange={(e) => editingService ? setEditingService({...editingService, description: e.target.value}) : setNewServiceDesc(e.target.value)}
                    className="admin-input"
                  />
                </div>
                <div className="admin-service-actions">
                  <button type="submit" className="admin-btn-primary">
                    {editingService ? 'Сақтау' : 'Қосу'}
                  </button>
                  {editingService && (
                    <button type="button" onClick={() => setEditingService(null)} className="admin-btn-cancel">
                      Болдырмау
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="admin-table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Атауы</th>
                    <th>Сипаттамасы</th>
                    <th>Әрекеттер</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map(s => (
                    <tr key={s.id}>
                      <td>{s.id}</td>
                      <td><strong>{s.title}</strong></td>
                      <td>{s.description || '-'}</td>
                      <td>
                        <button onClick={() => setEditingService(s)} className="admin-btn-edit">
                          Өңдеу
                        </button>
                        <button onClick={() => handleDeleteService(s.id)} className="admin-btn-delete">
                          Өшіру
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
