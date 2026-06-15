'use client'
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const Header = () => {
 const router = useRouter();
 const pathname = usePathname();
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [userName, setUserName] = useState('');

 useEffect(() => {
    const checkAuth = () => {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('user');
        const sessionExpiry = localStorage.getItem('sessionExpiry');

        if(token && user && sessionExpiry) {
            if(new Date(sessionExpiry) > new Date()) {
                setIsAuthenticated(true);
                const userData = JSON.parse(user);
                setUserName(userData.fullName || userData.username); 
            } else {
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                localStorage.removeItem('sessionExpiry');
                localStorage.removeItem('rememberedEmail');
                setIsAuthenticated(false);
            }
        } else {
            setIsAuthenticated(false);
        }
    };
    checkAuth();
    window.addEventListener('authChange', checkAuth);
    return () => window.removeEventListener('authChange', checkAuth);
 }, [])

 const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('sessionExpiry');
    localStorage.removeItem('rememberedEmail');
    setIsAuthenticated(false);
    window.dispatchEvent(new Event('authChange'));
    router.push('/');
 }

  return (
    <nav className="sticky top-0 z-50 bg-gray-300/10 shadow-2xl backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href='/' className="text-2xl font-bold text-white hover:text-white/80 transition">My Project</Link>
          <div className="space-x-4">
            <Link href='/' className="text-white/80 hover:text-white transition">Home</Link>

            {isAuthenticated ? (
                <>
                <Link href='/dashboard' className="text-white/80 hover:text-white transition">Dashboard</Link>
                <button onClick={handleLogout} 
                       className="text-red-400 hover:text-red-300 transition"
                       >Logout</button>
                </>
            ) : (
                <>
              <Link href="/login" className="text-white/80 hover:text-white transition">
                Login
              </Link>
              <Link 
                href="/register" 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
            )}
          </div>
        </div>
    </nav>
  )
}

export default Header