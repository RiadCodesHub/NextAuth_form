'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


const Dashboard = () => {
  
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading ]  = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    const sessionExpiry = localStorage.getItem('sessionExpiry');

    if(!token || !userData || !sessionExpiry) {
        router.push('/login');
        return;
    }

     try {
      const parseUser = JSON.parse(userData);
      setUser(parseUser);
    } catch(error) {
      console.error('error parsing user data:', error);
      router.push('/login')
    }
    

    if (new Date(sessionExpiry) < new Date()) {
        localStorage.clear();
        router.push('/login');
      return;        
    }

    setIsLoading(false);
  }, [router]);

   if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }


  return (
    <div className="min-h-screen py-20">

       <div className="container mx-auto px-8 flex flex-col gap-10">
        <div className="bg-gray-300/10 rounded-lg shadow-xl p-8">
            <div>
            <h2 className="text-3xl font-bold text-white">Welcome, {user?.username}!</h2>
            <p className="text-gray-400">{user?.email}</p>
            </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-300/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Account Info</h3>
            <p className="text-gray-300">Username: {user?.username}</p>
            <p className="text-gray-300">Age: {user?.age}</p>
            <p className="text-gray-300">Phone: {user?.phoneNumber}</p>
          </div>

          <div className="bg-gray-300/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Address</h3>
            <p className="text-gray-300">{user?.address?.street || 'Not provided'}</p>
            <p className="text-gray-300">{user?.address?.city}</p>
            <p className="text-gray-300">ZIP: {user?.address?.zipCode}</p>
          </div>

          <div className="bg-gray-300/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Preferences</h3>
            <p className="text-gray-300">Newsletter: {user?.newsletter ? 'Subscribed' : 'Not subcribed' }</p>
            <p className="text-gray-300">Member since: {new Date(user?.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
       </div>
       
    </div>
  )
}

export default Dashboard