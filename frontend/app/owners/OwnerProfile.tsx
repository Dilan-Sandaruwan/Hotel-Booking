"use client";

import React, { useState } from "react";

export default function OwnerProfile() {
  const [profile, setProfile] = useState({
    name: "Awantha de Silva",
    email: "partner@luxestay.com",
    phone: "+94 77 987 6543",
    companyName: "LuxeStay Resorts Ltd",
    registrationNo: "PV-98241",
    joinedDate: "October 14, 2025",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState({ ...profile });
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({ ...tempProfile });
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold font-display text-white">Owner Profile</h2>
        <p className="text-slate-500 text-sm mt-1">Manage your business registration and personal contact details</p>
      </div>

      {saved && (
        <div className="mb-5 px-5 py-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm flex items-center gap-2 animate-fade-in">
          <span>✓</span> Owner profile updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="glass p-6 rounded-2xl flex flex-col items-center text-center h-fit">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center text-navy-900 font-black text-3xl shadow-xl shadow-gold-500/35 mb-5 uppercase">
            {profile.name.split(" ").map(n => n[0]).join("")}
          </div>
          <h3 className="text-white font-bold text-lg">{profile.name}</h3>
          <p className="text-gold-500 text-xs font-bold tracking-widest uppercase mt-1">Authorized Partner</p>
          
          <div className="w-full border-t border-gold-500/10 mt-6 pt-6 text-left space-y-4">
            <div>
              <span className="block text-slate-500 text-xs font-bold uppercase tracking-wider">Company</span>
              <span className="text-slate-200 text-sm font-medium">{profile.companyName}</span>
            </div>
            <div>
              <span className="block text-slate-500 text-xs font-bold uppercase tracking-wider">Partner Since</span>
              <span className="text-slate-300 text-sm">{profile.joinedDate}</span>
            </div>
          </div>
        </div>

        {/* Edit/Details Card */}
        <div className="glass p-6 md:p-8 rounded-2xl lg:col-span-2">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase mb-2">Full Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={tempProfile.name}
                  onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 text-sm focus:outline-none focus:border-gold-500/50 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase mb-2">Business Email</label>
                <input
                  type="email"
                  disabled={!isEditing}
                  value={tempProfile.email}
                  onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 text-sm focus:outline-none focus:border-gold-500/50 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase mb-2">Contact Number</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={tempProfile.phone}
                  onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 text-sm focus:outline-none focus:border-gold-500/50 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase mb-2">Company Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={tempProfile.companyName}
                  onChange={(e) => setTempProfile({ ...tempProfile, companyName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 text-sm focus:outline-none focus:border-gold-500/50 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-semibold tracking-widest uppercase mb-2">Company Registration Number</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={tempProfile.registrationNo}
                  onChange={(e) => setTempProfile({ ...tempProfile, registrationNo: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-navy-800/60 border border-gold-500/15 text-slate-100 text-sm focus:outline-none focus:border-gold-500/50 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gold-500/10">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setTempProfile({ ...profile });
                      setIsEditing(false);
                    }}
                    className="px-5 py-2.5 rounded-full border border-gold-500/30 text-slate-400 text-sm font-semibold hover:text-gold-400 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-navy-900 font-bold text-sm shadow-lg shadow-gold-500/20 hover:-translate-y-0.5 transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2.5 rounded-full border border-gold-500 text-gold-400 font-semibold text-sm hover:bg-gold-500/10 transition-all cursor-pointer"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
