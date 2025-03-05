import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import '../Admin.scss';

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  createdAt?: string;
}

const AdminUsers: FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    isAdmin: false,
  });

  useEffect(() => {
    if (!user || !user.isAdmin) {
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:1972';
        const response = await fetch(`${apiUrl}/api/users`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`Failed to fetch users: ${errorData.message || response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Users fetched successfully:', data);
        setUsers(data);
      } catch (err: any) {
        setError(`Failed to fetch users: ${err.message}`);
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  const handleToggleAdmin = async (userId: string, isAdmin: boolean) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:1972';
      console.log(`Updating user ${userId} admin status to ${isAdmin}`);
      
      const response = await fetch(`${apiUrl}/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ isAdmin }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API response error:', errorData);
        throw new Error(`Failed to update user: ${errorData.message || response.statusText}`);
      }
      
      const updatedUser = await response.json();
      console.log('User updated successfully:', updatedUser);
      
      // Update local state
      setUsers(
        users.map((u) =>
          u._id === updatedUser._id ? updatedUser : u
        )
      );
      
      if (selectedUser && selectedUser._id === updatedUser._id) {
        setSelectedUser(updatedUser);
      }
      
      // Show success message
      alert(`User admin status updated to ${isAdmin ? 'Admin' : 'User'} successfully!`);
    } catch (err: any) {
      console.error('Error updating user:', err);
      alert(`Failed to update user: ${err.message}`);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
    setEditMode(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) return;
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:1972';
      console.log(`Updating user ${selectedUser._id} with data:`, formData);
      
      const response = await fetch(`${apiUrl}/api/users/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API response error:', errorData);
        throw new Error(`Failed to update user: ${errorData.message || response.statusText}`);
      }
      
      const updatedUser = await response.json();
      console.log('User updated successfully:', updatedUser);
      
      // Update local state
      setUsers(users.map((u) => (u._id === updatedUser._id ? updatedUser : u)));
      setSelectedUser(null);
      setEditMode(false);
      
      // Show success message
      alert('User updated successfully!');
    } catch (err: any) {
      console.error('Error updating user:', err);
      alert(`Failed to update user: ${err.message}`);
    }
  };

  return (
    <div className="admin-users">
      <div className="admin-section-header">
        <h2>User Management</h2>
        <p>View and manage user accounts and permissions</p>
      </div>

      <div className="admin-content-section">
        {loading ? (
          <div className="admin-dashboard__loading">Loading users...</div>
        ) : error ? (
          <div className="admin-dashboard__error">{error}</div>
        ) : users.length === 0 ? (
          <div className="admin-dashboard__empty">No users found</div>
        ) : (
          <div className="admin-dashboard__users">
            <table className="admin-dashboard__table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Admin</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id.substring(user._id.length - 8)}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <div className="admin-dashboard__toggle">
                        <input
                          type="checkbox"
                          checked={user.isAdmin}
                          onChange={(e) => handleToggleAdmin(user._id, e.target.checked)}
                          id={`admin-toggle-${user._id}`}
                          className="admin-dashboard__toggle-checkbox"
                        />
                        <label 
                          htmlFor={`admin-toggle-${user._id}`}
                          className="admin-dashboard__toggle-label"
                        ></label>
                      </div>
                    </td>
                    <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                    <td className="admin-dashboard__actions">
                      <button
                        className="admin-dashboard__action-btn admin-dashboard__action-btn--view"
                        onClick={() => setSelectedUser(user)}
                      >
                        View
                      </button>
                      <button
                        className="admin-dashboard__action-btn admin-dashboard__action-btn--edit"
                        onClick={() => handleEditUser(user)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedUser && !editMode && (
        <div className="admin-dashboard__modal">
          <div className="admin-dashboard__modal-content">
            <div className="admin-dashboard__modal-header">
              <h2>User Details</h2>
              <button
                className="admin-dashboard__modal-close"
                onClick={() => setSelectedUser(null)}
              >
                ×
              </button>
            </div>
            <div className="admin-dashboard__modal-body">
              <div className="admin-dashboard__user-info">
                <div className="admin-dashboard__user-section">
                  <h3>Basic Information</h3>
                  <p><strong>Name:</strong> {selectedUser.name}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Admin:</strong> {selectedUser.isAdmin ? 'Yes' : 'No'}</p>
                  <p><strong>Joined:</strong> {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : 'N/A'}</p>
                </div>
                
                <div className="admin-dashboard__user-section">
                  <h3>Contact Information</h3>
                  <p><strong>Address:</strong> {selectedUser.address || 'N/A'}</p>
                  <p><strong>City:</strong> {selectedUser.city || 'N/A'}</p>
                  <p><strong>Postal Code:</strong> {selectedUser.postalCode || 'N/A'}</p>
                  <p><strong>Country:</strong> {selectedUser.country || 'N/A'}</p>
                  <p><strong>Phone:</strong> {selectedUser.phone || 'N/A'}</p>
                </div>
              </div>
              
              <div className="admin-dashboard__modal-actions">
                <button
                  className="admin-dashboard__action-btn admin-dashboard__action-btn--edit"
                  onClick={() => handleEditUser(selectedUser)}
                >
                  Edit User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editMode && selectedUser && (
        <div className="admin-dashboard__modal">
          <div className="admin-dashboard__modal-content">
            <div className="admin-dashboard__modal-header">
              <h2>Edit User</h2>
              <button
                className="admin-dashboard__modal-close"
                onClick={() => {
                  setEditMode(false);
                  setSelectedUser(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="admin-dashboard__modal-body">
              <form onSubmit={handleSubmit} className="admin-dashboard__form">
                <div className="admin-dashboard__form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="admin-dashboard__form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="admin-dashboard__form-group admin-dashboard__form-group--checkbox">
                  <label>
                    <input
                      type="checkbox"
                      name="isAdmin"
                      checked={formData.isAdmin}
                      onChange={handleChange}
                    />
                    Admin
                  </label>
                </div>
                
                <div className="admin-dashboard__form-actions">
                  <button
                    type="button"
                    className="admin-dashboard__action-btn admin-dashboard__action-btn--cancel"
                    onClick={() => {
                      setEditMode(false);
                      setSelectedUser(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="admin-dashboard__action-btn admin-dashboard__action-btn--save"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;