import { ReactNode, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';
import { useGeneralStore } from '../stores/generalStore';

const ProtectedRoutes = ({ children }: { children: ReactNode }) => {
  const user = useUserStore((state) => state);
  const navigate = useNavigate();
  const setLoginIsOpen = useGeneralStore((state) => state.setLoginIsOpen);
  useEffect(() => {
    console.log(user);
    if (!user.id) {
      navigate('/');
      setLoginIsOpen(true);
    }
  }, [user.id, navigate, setLoginIsOpen]);

  if (!user.id) {
    return <>No Upload Access</>;
  }

  return <>{children}</>;
};

export default ProtectedRoutes;
