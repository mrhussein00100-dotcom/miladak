'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Loader2,
  Plus,
  Trash2,
  Shield,
  UserCheck,
  UserX,
  RefreshCw,
  Edit,
  Users,
  Search,
  X,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';

type AdminUser = {
  id: number;
  username: string;
  role: string;
  active: number;
  created_at: string;
  updated_at: string;
};

const ROLES = [
  {
    value: 'admin',
    label: 'مدير',
    color: 'bg-red-600/30 text-red-300 border-red-500/50',
    bgColor: 'bg-red-600/20',
  },
  {
    value: 'content_manager',
    label: 'مدير محتوى',
    color: 'bg-purple-600/30 text-purple-300 border-purple-500/50',
    bgColor: 'bg-purple-600/20',
  },
  {
    value: 'editor',
    label: 'محرر',
    color: 'bg-blue-600/30 text-blue-300 border-blue-500/50',
    bgColor: 'bg-blue-600/20',
  },
  {
    value: 'writer',
    label: 'كاتب',
    color: 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50',
    bgColor: 'bg-emerald-600/20',
  },
  {
    value: 'support',
    label: 'دعم فني',
    color: 'bg-amber-600/30 text-amber-300 border-amber-500/50',
    bgColor: 'bg-amber-600/20',
  },
];

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // نموذج إضافة مستخدم
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('editor');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // نموذج تعديل مستخدم
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [showEditPassword, setShowEditPassword] = useState(false);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) setUsers(json.users || []);
    } catch (error) {
      showMessage('error', 'فشل في تحميل المستخدمين');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAdd = async () => {
    if (!newUsername || !newPassword) {
      showMessage('error', 'يرجى إدخال اسم مستخدم وكلمة مرور');
      return;
    }
    if (newPassword.length < 6) {
      showMessage('error', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    try {
      setSaving(true);
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: newUsername,
          password: newPassword,
          role: newRole,
        }),
      });
      const json = await res.json();
      if (!json.success) {
        showMessage('error', json.error || 'فشل الإضافة');
        return;
      }
      setNewUsername('');
      setNewPassword('');
      setNewRole('editor');
      setShowAddModal(false);
      showMessage('success', 'تم إضافة المستخدم بنجاح');
      await loadUsers();
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (u: AdminUser) => {
    setEditingUser(u);
    setEditUsername(u.username);
    setEditPassword('');
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    try {
      setEditSaving(true);
      const updates: Record<string, string> = {};

      if (editUsername && editUsername !== editingUser.username) {
        updates.username = editUsername;
      }
      if (editPassword && editPassword.trim().length > 0) {
        if (editPassword.length < 6) {
          showMessage('error', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
          setEditSaving(false);
          return;
        }
        updates.password = editPassword;
      }

      if (Object.keys(updates).length > 0) {
        await fetch(`/api/admin/users/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
      }

      setShowEditModal(false);
      setEditingUser(null);
      setEditPassword('');
      showMessage('success', 'تم تحديث المستخدم بنجاح');
      await loadUsers();
    } finally {
      setEditSaving(false);
    }
  };

  const handleToggleActive = async (u: AdminUser) => {
    await fetch(`/api/admin/users/${u.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: u.active === 1 ? false : true }),
    });
    showMessage(
      'success',
      u.active === 1 ? 'تم تعطيل المستخدم' : 'تم تفعيل المستخدم'
    );
    await loadUsers();
  };

  const handleChangeRole = async (u: AdminUser, role: string) => {
    await fetch(`/api/admin/users/${u.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    showMessage('success', 'تم تغيير الدور بنجاح');
    await loadUsers();
  };

  const handleDelete = async (u: AdminUser) => {
    if (!confirm(`هل أنت متأكد من حذف المستخدم "${u.username}"؟`)) return;
    await fetch(`/api/admin/users/${u.id}`, { method: 'DELETE' });
    showMessage('success', 'تم حذف المستخدم');
    await loadUsers();
  };

  const getRoleInfo = (role: string) => {
    return ROLES.find((r) => r.value === role) || ROLES[2];
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
          <p className="text-gray-400">جاري تحميل المستخدمين...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* رسالة التنبيه */}
      {message && (
        <div
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg ${
            message.type === 'success'
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {message.text}
        </div>
      )}

      {/* زر الرجوع */}
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm transition-colors border border-gray-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">العودة للوحة التحكم</span>
          <span className="sm:hidden">رجوع</span>
        </Link>
      </div>

      {/* الهيدر */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2.5 sm:p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shrink-0">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-2xl font-bold text-white truncate">
              إدارة المستخدمين
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm">
              إضافة وتعديل صلاحيات المستخدمين
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={loadUsers}
            className="p-2.5 sm:p-3 rounded-xl bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 transition-all shrink-0"
            title="تحديث"
          >
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all text-sm"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            إضافة مستخدم
          </button>
        </div>
      </div>

      {/* البحث والإحصائيات */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="col-span-2 relative">
          <Search className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="البحث عن مستخدم..."
            className="w-full pr-10 sm:pr-12 pl-3 sm:pl-4 py-2.5 sm:py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none text-sm"
          />
        </div>
        <div className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700">
          <p className="text-gray-400 text-xs sm:text-sm">إجمالي المستخدمين</p>
          <p className="text-xl sm:text-2xl font-bold text-white">
            {users.length}
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700">
          <p className="text-gray-400 text-xs sm:text-sm">المستخدمون النشطون</p>
          <p className="text-xl sm:text-2xl font-bold text-green-400">
            {users.filter((u) => u.active === 1).length}
          </p>
        </div>
      </div>

      {/* جدول المستخدمين - عرض بطاقات للموبايل */}
      <div className="bg-gray-900 rounded-xl sm:rounded-2xl border border-gray-800 overflow-hidden">
        {/* Mobile Cards View */}
        <div className="block lg:hidden divide-y divide-gray-800">
          {filteredUsers.map((u) => {
            const roleInfo = getRoleInfo(u.role);
            return (
              <div key={u.id} className="p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                      <span className="text-white font-bold text-sm">
                        {u.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <span className="text-white font-medium text-sm block truncate">
                        {u.username}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {new Date(u.created_at).toLocaleDateString('ar-EG')}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      u.active === 1
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        u.active === 1 ? 'bg-green-400' : 'bg-gray-400'
                      }`}
                    ></span>
                    {u.active === 1 ? 'نشط' : 'معطل'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <select
                    value={u.role}
                    onChange={(e) => handleChangeRole(u, e.target.value)}
                    className={`px-2 py-1 rounded-lg border text-xs font-medium ${roleInfo.color} bg-transparent cursor-pointer focus:outline-none`}
                  >
                    {ROLES.map((r) => (
                      <option
                        key={r.value}
                        value={r.value}
                        className="bg-gray-800 text-white"
                      >
                        {r.label}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleActive(u)}
                      className={`p-2 rounded-lg transition-colors ${
                        u.active === 1
                          ? 'text-yellow-400 hover:bg-yellow-500/20'
                          : 'text-green-400 hover:bg-green-500/20'
                      }`}
                    >
                      {u.active === 1 ? (
                        <UserX className="w-4 h-4" />
                      ) : (
                        <UserCheck className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => openEditModal(u)}
                      className="p-2 rounded-lg text-blue-400 hover:bg-blue-500/20 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(u)}
                      className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800/50">
                <th className="text-right py-4 px-6 text-gray-400 font-medium">
                  #
                </th>
                <th className="text-right py-4 px-6 text-gray-400 font-medium">
                  المستخدم
                </th>
                <th className="text-right py-4 px-6 text-gray-400 font-medium">
                  الدور
                </th>
                <th className="text-right py-4 px-6 text-gray-400 font-medium">
                  الحالة
                </th>
                <th className="text-right py-4 px-6 text-gray-400 font-medium">
                  تاريخ الإنشاء
                </th>
                <th className="text-right py-4 px-6 text-gray-400 font-medium">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredUsers.map((u) => {
                const roleInfo = getRoleInfo(u.role);
                return (
                  <tr
                    key={u.id}
                    className="hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="py-4 px-6 text-gray-500">{u.id}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <span className="text-white font-bold">
                            {u.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-white font-medium">
                          {u.username}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={u.role}
                        onChange={(e) => handleChangeRole(u, e.target.value)}
                        className={`px-3 py-1.5 rounded-lg border text-sm font-medium ${roleInfo.color} bg-transparent cursor-pointer focus:outline-none`}
                      >
                        {ROLES.map((r) => (
                          <option
                            key={r.value}
                            value={r.value}
                            className="bg-gray-800 text-white"
                          >
                            {r.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                          u.active === 1
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            u.active === 1 ? 'bg-green-400' : 'bg-gray-400'
                          }`}
                        ></span>
                        {u.active === 1 ? 'نشط' : 'معطل'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-400 text-sm">
                      {new Date(u.created_at).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleActive(u)}
                          className={`p-2 rounded-lg transition-colors ${
                            u.active === 1
                              ? 'text-yellow-400 hover:bg-yellow-500/20'
                              : 'text-green-400 hover:bg-green-500/20'
                          }`}
                          title={u.active === 1 ? 'تعطيل' : 'تفعيل'}
                        >
                          {u.active === 1 ? (
                            <UserX className="w-5 h-5" />
                          ) : (
                            <UserCheck className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-2 rounded-lg text-blue-400 hover:bg-blue-500/20 transition-colors"
                          title="تعديل"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(u)}
                          className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            لا يوجد مستخدمون مطابقون للبحث
          </div>
        )}
      </div>

      {/* شرح الصلاحيات */}
      <div className="bg-gray-900 rounded-xl sm:rounded-2xl border border-gray-800 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
          شرح الصلاحيات
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {ROLES.map((role) => (
            <div
              key={role.value}
              className={`p-3 sm:p-4 rounded-xl border ${role.bgColor} border-gray-700`}
            >
              <h4
                className={`font-bold mb-1 sm:mb-2 text-sm sm:text-base ${
                  role.color.split(' ')[1]
                }`}
              >
                {role.label}
              </h4>
              <p className="text-xs sm:text-sm text-gray-300">
                {role.value === 'admin' && 'صلاحيات كاملة - إدارة كل شيء'}
                {role.value === 'content_manager' &&
                  'إدارة المحتوى والمقالات والتصنيفات'}
                {role.value === 'editor' && 'تعديل ونشر المقالات'}
                {role.value === 'writer' && 'كتابة المقالات فقط'}
                {role.value === 'support' && 'الدعم الفني والرسائل'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* نافذة إضافة مستخدم */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => !saving && setShowAddModal(false)}
          />
          <div className="relative z-10 w-full max-w-md bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                إضافة مستخدم جديد
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  اسم المستخدم
                </label>
                <input
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="أدخل اسم المستخدم"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="أدخل كلمة المرور"
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-purple-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  الدور
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-purple-500 focus:outline-none"
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                disabled={saving}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                onClick={handleAdd}
                disabled={saving}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
                إضافة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة تعديل مستخدم */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => !editSaving && setShowEditModal(false)}
          />
          <div className="relative z-10 w-full max-w-md bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">تعديل المستخدم</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  اسم المستخدم
                </label>
                <input
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  placeholder="اسم المستخدم"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  كلمة المرور الجديدة{' '}
                  <span className="text-gray-600">(اختياري)</span>
                </label>
                <div className="relative">
                  <input
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    type={showEditPassword ? 'text' : 'password'}
                    placeholder="اتركه فارغاً للإبقاء على كلمة المرور الحالية"
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-purple-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showEditPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                disabled={editSaving}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={editSaving}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {editSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : null}
                حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
