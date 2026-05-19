'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RiArrowLeftLine, RiAddLine, RiDeleteBinLine, RiToggleLine } from 'react-icons/ri';
import { adminAPI } from '@/lib/api';
import { useAuthStore } from '@/context/AuthStore';
import { Badge, Modal, Button, Input, Skeleton } from '@/components/ui';
import toast from 'react-hot-toast';

export function AdminUsersPage() {
  const router = useRouter();
  const { isAdmin } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin()) { router.push('/'); return; }
    adminAPI.getUsers().then(({ data }) => setUsers(data.data)).finally(() => setLoading(false));
  }, []);

  const handleToggle = async (id) => {
    try {
      const { data } = await adminAPI.toggleUser(id);
      setUsers(us => us.map(u => u._id === id ? data.data.user : u));
      toast.success('User status updated');
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="p-2 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-colors">
          <RiArrowLeftLine className="text-xl" />
        </Link>
        <h1 className="font-display font-bold text-3xl text-white">Users</h1>
      </div>

      <div className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full admin-table">
            <thead><tr className="border-b border-white/[0.06]">
              <th>User</th><th>Role</th><th>Status</th><th>Joined</th><th>Action</th>
            </tr></thead>
            <tbody>
              {loading ? Array(5).fill(0).map((_, i) => (
                <tr key={i}><td colSpan={5}><Skeleton className="h-14 w-full my-1" /></td></tr>
              )) : users.map(user => (
                <tr key={user._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{user.name?.[0]}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{user.name}</p>
                        <p className="text-white/30 text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td><Badge variant={user.role === 'admin' ? 'orange' : 'blue'}>{user.role}</Badge></td>
                  <td><Badge variant={user.isActive ? 'green' : 'red'}>{user.isActive ? 'Active' : 'Inactive'}</Badge></td>
                  <td><span className="text-white/40 text-xs">{new Date(user.createdAt).toLocaleDateString('en-IN')}</span></td>
                  <td>
                    {user.role !== 'admin' && (
                      <button onClick={() => handleToggle(user._id)}
                        className={`text-xs px-3 py-1.5 rounded-lg transition-all ${user.isActive ? 'text-red-400 hover:bg-red-500/10' : 'text-green-400 hover:bg-green-500/10'}`}>
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminUsersPage;
