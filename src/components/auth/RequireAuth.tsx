
/*
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

//const { token, isAuth } = useAuthStore.getState();

export function RequireAuth() {
  const token = useAuthStore((state) => state.token);
  const isAuth = useAuthStore((state) => state.isAuth);

  // Estado de carga opcional
  if (token === null || token === undefined) {
    return <div>Cargando...</div>;
  }
  // Si no hay auth, redirige solo si NO estás ya en login
  if (!token || !isAuth) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
*/

/*
  if (token) {
  //Si no hay token o no está autenticado, mandamos a home
  if (isAuth == false) {
    return <Navigate to="/" replace />;
  } else {
    // Si pasa la validación, renderiza los hijos (Outlet)
    return <Outlet />;
  }

   } */