import {Navigate} from 'react-router-dom'

export function PrivateRoute({children}) {
    const token = localStorage.getItem('accessToken')
    return token ? children : <Navigate to={'/login'}/>
}

export function DashboardRoute({children}){
    const token = localStorage.getItem('accessToken')
    const user_role = localStorage.getItem('userRole')
    return token && user_role === "seller" ? children : <Navigate to={'/'}/>
}