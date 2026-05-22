import { useState, useCallback } from 'react';
import Layout from './components/Layout/Layout';
import UserForm from './components/UserForm/UserForm';
import UserTable from './components/UserTable/UserTable';
import { ToastContainer } from './components/common/Toast';

const App = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [toasts, setToasts] = useState([]);

  const handleUserCreated = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <Layout>
      <UserForm onUserCreated={handleUserCreated} showToast={showToast} />
      <UserTable refreshTrigger={refreshTrigger} />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </Layout>
  );
};

export default App;
