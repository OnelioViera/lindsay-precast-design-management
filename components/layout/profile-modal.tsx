'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const roleDisplayNames: { [key: string]: string } = {
  designer: 'CAD Designer',
  manager: 'Project Manager',
  production: 'Production Specialist',
  other: 'Other',
};

function formatRole(role: string): string {
  return roleDisplayNames[role] || role;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'designer',
  });

  // Update form data when modal opens or session changes
  useEffect(() => {
    if (isOpen && session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        role: (session.user as any).role || 'designer',
      });
      setMessage('');
    }
  }, [isOpen, session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Profile updated successfully!');
        setTimeout(() => {
          // Refresh the page to reload session data
          window.location.reload();
        }, 1000);
      } else {
        setMessage(data.message || 'Failed to update profile');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-gray-400 shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-400">
          <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-900">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your full name"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-900">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              placeholder="Enter your email"
              disabled
              className="mt-1 bg-gray-200 cursor-not-allowed text-gray-700"
            />
            <p className="text-xs text-gray-600 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <Label htmlFor="role" className="text-sm font-medium text-gray-900">Role</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue>{formatRole(formData.role)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="designer">CAD Designer</SelectItem>
                <SelectItem value="manager">Project Manager</SelectItem>
                <SelectItem value="production">Production Specialist</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {message && (
            <div className={`p-3 text-sm flex items-center gap-2 border ${
              message.includes('successfully')
                ? 'bg-gray-100 text-gray-800 border-gray-400'
                : 'bg-red-100 text-red-800 border-red-400'
            }`}>
              {message.includes('successfully') && <CheckCircle className="h-4 w-4" />}
              {message}
            </div>
          )}

          <div className="flex gap-3 pt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1 text-gray-900"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gray-700 text-white hover:bg-gray-800 border-gray-900"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

