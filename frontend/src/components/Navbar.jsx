
import { useAuthStore } from '../store/useAuthStore';

const Navbar = () => {
  const authUser=useAuthStore((state) => state.authUser);
  return (
    <div>
      navbar
    </div>
  )
}

export default Navbar;
