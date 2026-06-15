'use client';

import { useState, useEffect } from 'react';
import RegisterForm from "@/src/components/forms/RegisterForm";
import Link from "next/link";
import { motion } from "framer-motion";
import LoginPage from './login/page';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    const sessionExpiry = localStorage.getItem('sessionExpiry');
    
    if (token && user && sessionExpiry) {
      if (new Date(sessionExpiry) > new Date()) {
        setIsAuthenticated(true);
        const userData = JSON.parse(user);
        setUserName(userData.userName);
      } else {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('sessionExpiry');
        localStorage.removeItem('rememberedEmail');
        setIsAuthenticated(false);
      }
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-y-auto">
      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero Text */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Hello! This is my new project
          </h1>
          <p className="text-xl text-white/80">
            {isAuthenticated 
              ? `Welcome back, ${userName}!` 
              : "Join us and start your journey today"}
          </p>
        </motion.div>

        {/* Conditional Rendering based on Auth Status */}
        {!isAuthenticated ? (
          // Show Registration Form for non-authenticated users
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <LoginPage />
          </motion.div>
        ) : (
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">Dashboard Preview</h2>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Welcome!</h3>
                  <p className="text-white/70">You are successfully logged in</p>
                </div>
                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Quick Actions</h3>
                  <p className="text-white/70">Manage your account settings</p>
                </div>
                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Support</h3>
                  <p className="text-white/70">24/7 customer support</p>
                </div>
              </div>
              <div className="text-center">
                <Link href="/dashboard">
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Go to Full Dashboard →
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}