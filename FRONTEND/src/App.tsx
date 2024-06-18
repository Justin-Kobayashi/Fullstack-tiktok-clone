import AuthModal from './components/AuthModal';
import EditProfileModal from './components/EditProfileModal';
import { useGeneralStore } from './stores/generalStore';

function App() {
  const isLoginOpen = useGeneralStore((state) => state.isLoginOpen);
  const isEditProfileOpen = useGeneralStore((state) => state.isEditProfileOpen);
  return (
    <div className=" ">
      {isLoginOpen && <AuthModal />}
      {isEditProfileOpen && <EditProfileModal />}
    </div>
  );
}

export default App;
