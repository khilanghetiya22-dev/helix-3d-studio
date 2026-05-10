import React from 'react';

export const metadata = { title: 'Profile — FORMIQ' };

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold mb-1 text-[#F5F4F0]">My Profile</h1>
      <p className="text-sm mb-8 text-[#6B6B6B]">Manage your account settings and addresses.</p>
      
      <div className="p-8 rounded-xl border border-[rgba(201,146,10,0.2)] bg-[#111111] text-center">
        <p className="text-[#C9920A] font-medium">Profile management coming soon.</p>
      </div>
    </div>
  );
}
