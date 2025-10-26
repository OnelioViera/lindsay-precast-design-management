
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Project, Customer } from '@/types';

interface Structure {
  id: string;
  type: string;
  customName?: string;
}

interface EditProjectModalProps {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditProjectModal({ isOpen, project, onClose, onSuccess }: EditProjectModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [structures, setStructures] = useState<Structure[]>([]);
  const [newStructure, setNewStructure] = useState({
    type: 'SSMH' as Structure['type'],
    customName: '',
  });
  const [formData, setFormData] = useState({
    customerId: '',
    projectName: '',
    projectNumber: '',
    customerName: '',
    startDate: '',
    customNotes: '',
  });
  const [showStructureDropdown, setShowStructureDropdown] = useState(false);
  const [newStructureType, setNewStructureType] = useState('');
  const [baseStructureTypes, setBaseStructureTypes] = useState(['SSMH', 'SDMH', 'Inlets', 'Vaults', 'Meter Pits', 'Air Vacuum Pits']);
  const [customStructureTypes, setCustomStructureTypes] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
      // Load custom structure types from localStorage
      const saved = localStorage.getItem('customStructureTypes');
      if (saved) {
        setCustomStructureTypes(JSON.parse(saved));
      }
      // Load base structure types from localStorage
      const savedBase = localStorage.getItem('baseStructureTypes');
      if (savedBase) {
        setBaseStructureTypes(JSON.parse(savedBase));
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (project) {
      setFormData({
        customerId: project.customerId,
        projectName: project.projectName || '',
        projectNumber: project.projectNumber,
        customerName: project.customerName,
        startDate: project.startDate 
          ? typeof project.startDate === 'string' 
            ? project.startDate.split('T')[0] 
            : new Date(project.startDate).toISOString().split('T')[0]
          : '',
        customNotes: project.specifications.customNotes || '',
      });
      
      // Initialize structures from project
      if (project.structures && project.structures.length > 0) {
        const structuresWithIds = project.structures.map((s, index) => ({
          id: index.toString(),
          type: s.type,
          customName: s.customName,
        }));
        setStructures(structuresWithIds);
      } else {
        setStructures([]);
      }
      
      setError('');
      setNewStructure({
        type: 'SSMH',
        customName: '',
      });
    }
  }, [project, isOpen]);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/customers');
      const data = await res.json();
      if (data.success) {
        setCustomers(data.data.customers);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  const handleRemoveStructure = (id: string) => {
    setStructures(structures.filter(s => s.id !== id));
  };

  const handleAddStructureType = () => {
    const typeName = newStructureType.trim();
    if (!typeName) {
      setError('Please enter a structure type name');
      return;
    }

    if (customStructureTypes.includes(typeName)) {
      setError('This structure type already exists');
      return;
    }

    const updated = [...customStructureTypes, typeName];
    setCustomStructureTypes(updated);
    localStorage.setItem('customStructureTypes', JSON.stringify(updated));
    setNewStructureType('');
    setError('');
  };

  const handleDeleteStructureType = (type: string, isBase: boolean = false) => {
    if (isBase) {
      const updated = baseStructureTypes.filter(t => t !== type);
      setBaseStructureTypes(updated);
      localStorage.setItem('baseStructureTypes', JSON.stringify(updated));
    } else {
      const updated = customStructureTypes.filter(t => t !== type);
      setCustomStructureTypes(updated);
      localStorage.setItem('customStructureTypes', JSON.stringify(updated));
    }
  };

  const handleAddStructure = (selectedType?: string) => {
    const typeToAdd = selectedType || newStructure.type;
    if (!typeToAdd) {
      setError('Please select a structure type');
      return;
    }

    const structure: Structure = {
      id: Date.now().toString(),
      type: typeToAdd,
    };

    setStructures([...structures, structure]);
    setNewStructure({
      type: 'SSMH',
      customName: '',
    });
    setNewStructureType('');
    setError('');
  };

  const handleMoveStructureUp = (id: string) => {
    const index = structures.findIndex(s => s.id === id);
    if (index > 0) {
      const newStructures = [...structures];
      [newStructures[index], newStructures[index - 1]] = [newStructures[index - 1], newStructures[index]];
      setStructures(newStructures);
    }
  };

  const handleMoveStructureDown = (id: string) => {
    const index = structures.findIndex(s => s.id === id);
    if (index < structures.length - 1) {
      const newStructures = [...structures];
      [newStructures[index], newStructures[index + 1]] = [newStructures[index + 1], newStructures[index]];
      setStructures(newStructures);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/projects/${project?._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectNumber: formData.projectNumber,
          projectName: formData.projectName,
          startDate: formData.startDate ? new Date(formData.startDate) : undefined,
          structures: structures.map(s => ({
            type: s.type,
            customName: s.customName || s.type,
          })),
          'specifications.customNotes': formData.customNotes || '',
        }),
      });

      const data = await res.json();

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        console.error('Update error response:', data);
        setError(data.message || 'Failed to update project');
      }
    } catch (error: any) {
      console.error('Update error:', error);
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-gray-400 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-400 sticky top-0 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Project</h2>
            <p className="text-sm text-gray-700 mt-1">Update project information</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition p-1"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="customer">Customer *</Label>
                    <Select
                      value={formData.customerId}
                      onValueChange={(value) => {
                        const selected = customers.find(c => c._id === value);
                        setFormData({
                          ...formData,
                          customerId: value,
                          customerName: selected?.name || '',
                        });
                      }}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer._id} value={customer._id!}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="projectName">Project Name</Label>
                    <Input
                      id="projectName"
                      value={formData.projectName}
                      onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                      placeholder="Enter project name"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="projectNumber">Project Number *</Label>
                    <Input
                      id="projectNumber"
                      value={formData.projectNumber}
                      onChange={(e) => setFormData({ ...formData, projectNumber: e.target.value })}
                      placeholder="Enter project number"
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="mt-2"
                    />
                  </div>

                  {/* Removed Product Type */}
                </div>

                {/* Structures Section */}
                <div className="border-t border-gray-300 pt-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Structures</h3>
                  
                  {/* Add New Structure - Button with Dropdown */}
                  <div className="bg-gray-100 p-6 mb-6 border border-gray-300">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => setShowStructureDropdown(!showStructureDropdown)}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Structure Type
                    </Button>

                    {showStructureDropdown && (
                      <div className="mt-4 space-y-3 border border-gray-300 bg-white p-4">
                        {/* Add New Structure Type */}
                        <div className="space-y-2 pb-3 border-b border-gray-300">
                          <label className="text-sm font-medium text-gray-800">Create New Type:</label>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Type name..."
                              value={newStructureType}
                              onChange={(e) => setNewStructureType(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddStructureType();
                                }
                              }}
                              className="text-sm"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                handleAddStructureType();
                              }}
                              className="px-3 py-2 bg-gray-700 text-white text-sm hover:bg-gray-800 border border-gray-900 whitespace-nowrap"
                              title="Add new structure type"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Select Structure Type */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-800">Select Type to Add:</label>
                          <div className="space-y-1 max-h-48 overflow-y-auto">
                            {/* Base Structure Types */}
                            {baseStructureTypes.map((type) => (
                              <div
                                key={`base-${type}`}
                                className="flex items-center justify-between px-2 py-1.5 hover:bg-gray-100 text-sm text-gray-800 border border-gray-300 group cursor-pointer"
                                onClick={() => {
                                  handleAddStructure(type);
                                  setShowStructureDropdown(false);
                                }}
                              >
                                <span>{type}</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    handleDeleteStructureType(type, true);
                                  }}
                                  className="p-1 hover:bg-red-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Delete this structure type"
                                >
                                  <Trash2 className="h-3.5 w-3.5 text-red-600" />
                                </button>
                              </div>
                            ))}

                            {/* Custom Structure Types */}
                            {customStructureTypes.map((type) => (
                              <div
                                key={`custom-${type}`}
                                className="flex items-center justify-between px-2 py-1.5 hover:bg-gray-100 text-sm text-gray-800 border border-gray-300 group cursor-pointer"
                                onClick={() => {
                                  handleAddStructure(type);
                                  setShowStructureDropdown(false);
                                }}
                              >
                                <span>{type}</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    handleDeleteStructureType(type, false);
                                  }}
                                  className="p-1 hover:bg-red-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Delete this structure type"
                                >
                                  <Trash2 className="h-3.5 w-3.5 text-red-600" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Structures List */}
                  {structures.length > 0 && (
                    <div className="space-y-3 mb-6">
                      <h4 className="font-semibold text-gray-700">Added Structures ({structures.length})</h4>
                      {structures.map((structure, index) => (
                        <div
                          key={structure.id}
                          className="flex items-center justify-between p-4 bg-white border-2 border-gray-400 group hover:border-gray-600"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">
                              {structure.customName || structure.type}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              type="button"
                              onClick={() => handleMoveStructureUp(structure.id)}
                              disabled={index === 0}
                              className="p-2 hover:bg-blue-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Move up"
                            >
                              <ArrowUp className="h-4 w-4 text-blue-600" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveStructureDown(structure.id)}
                              disabled={index === structures.length - 1}
                              className="p-2 hover:bg-blue-100 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Move down"
                            >
                              <ArrowDown className="h-4 w-4 text-blue-600" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveStructure(structure.id)}
                              className="p-2 hover:bg-red-100 rounded transition-colors"
                              title="Delete this structure"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {structures.length === 0 && (
                    <div className="p-4 bg-gray-200 border border-gray-400 text-gray-800 text-sm mb-6">
                      ℹ️ No structures added yet. Add at least one structure to continue.
                    </div>
                  )}
                </div>

                {/* Custom Notes */}
                <div>
                  <Label htmlFor="customNotes">Custom Notes</Label>
                  <Textarea
                    id="customNotes"
                    value={formData.customNotes}
                    onChange={(e) => setFormData({ ...formData, customNotes: e.target.value })}
                    placeholder="Enter any custom notes for this project"
                    className="mt-2"
                    rows={4}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-100 text-red-800 border border-red-400 p-3 text-sm">
                    {error}
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex gap-3 pt-6">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                    className="flex-1"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    disabled={loading || structures.length === 0}
                  >
                    {loading ? 'Updating...' : 'Update Project'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
