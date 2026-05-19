'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { RiUser3Line, RiLockLine, RiSaveLine } from 'react-icons/ri';
import ShopLayout from '@/components/layout/ShopLayout';
import { useAuthStore } from '@/context/AuthStore';
import { Input, Button } from '@/components/ui';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, isAuthenticated, updateProfile } = useAuthStore();
  const router = useRouter();
  const [tab, setTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({ name: '', phone: '', address: { street: '', city: '', state: '', zipCode: '', country: 'India' } });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/login'); return; }
    if (user) {
      setProfile({ name: user.name || '', phone: user.phone || '', address: { street: user.address?.street || '', city: user.address?.city || '', state: user.address?.state || '', zipCode: user.address?.zipCode || '', country: user.address?.country || 'India' } });
    }
  }, [user]);

  const handleProfileSave = async () => {
    setSaving(true);
    const result = await updateProfile(profile);
    setSaving(false);
    if (result.success) toast.success('Profile updated!');
    else toast.error(result.message);
  };

  const handlePasswordChange = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (passwords.newPassword.length < 6) { toast.error('Password too short'); return; }
    setSaving(true);
    try {
      await authAPI.changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password changed!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } finally { setSaving(false); }
  };

  return (
    <ShopLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-purple-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-2xl">{user?.name?.[0]}</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-white">{user?.name}</h1>
            <p className="text-white/40 text-sm">{user?.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-white/10 mb-8">
          {[{ id: 'profile', icon: RiUser3Line, label: 'Profile' }, { id: 'password', icon: RiLockLine, label: 'Password' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all relative ${tab === t.id ? 'text-orange-400' : 'text-white/40 hover:text-white/70'}`}>
              <t.icon />{t.label}
              {tab === t.id && <motion.div layoutId="profile-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
            </button>
          ))}
        </div>

        {tab === 'profile' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl border border-white/[0.06] p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Full Name" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
              <Input label="Phone" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="+91 9876543210" />
            </div>
            <Input label="Street Address" value={profile.address.street} onChange={e => setProfile(p => ({ ...p, address: { ...p.address, street: e.target.value } }))} />
            <div className="grid sm:grid-cols-3 gap-4">
              <Input label="City" value={profile.address.city} onChange={e => setProfile(p => ({ ...p, address: { ...p.address, city: e.target.value } }))} />
              <Input label="State" value={profile.address.state} onChange={e => setProfile(p => ({ ...p, address: { ...p.address, state: e.target.value } }))} />
              <Input label="PIN Code" value={profile.address.zipCode} onChange={e => setProfile(p => ({ ...p, address: { ...p.address, zipCode: e.target.value } }))} />
            </div>
            <Button onClick={handleProfileSave} loading={saving} variant="primary" className="flex items-center gap-2">
              <RiSaveLine /> Save Changes
            </Button>
          </motion.div>
        )}

        {tab === 'password' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl border border-white/[0.06] p-6 space-y-4">
            <Input label="Current Password" type="password" value={passwords.currentPassword}
              onChange={e => setPasswords(p => ({ ...p, currentPassword: e.target.value }))} placeholder="••••••••" />
            <Input label="New Password" type="password" value={passwords.newPassword}
              onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))} placeholder="Min. 6 characters" />
            <Input label="Confirm New Password" type="password" value={passwords.confirmPassword}
              onChange={e => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))} placeholder="Repeat password" />
            <Button onClick={handlePasswordChange} loading={saving} variant="primary">Change Password</Button>
          </motion.div>
        )}
      </div>
    </ShopLayout>
  );
}
