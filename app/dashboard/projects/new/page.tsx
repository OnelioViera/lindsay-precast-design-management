'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Customer } from '@/types';
import { ArrowLeft, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/lib/toast-context';

interface Structure {
  id: string;
  type: string;
  customName?: string;
}

export default function NewProjectPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [structures, setStructures] = useState<Structure[]>([]);
  const [baseStructureTypes, setBaseStructureTypes] = useState(['SSMH', 'SDMH', 'Inlets', 'Vaults', 'Meter Pits', 'Air Vacuum Pits']);
  const [customStructureTypes, setCustomStructureTypes] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    customerId: '',
    projectName: '',
    projectNumber: '',
    startDate: '',
    notes: '',
  });
  const [newStructure, setNewStructure] = useState({
    type: 'SSMH',
    customName: '',
  });
  const [newStructureType, setNewStructureType] = useState('');
  const [showStructureDropdown, setShowStructureDropdown] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    customerId?: string;
    projectName?: string;
    projectNumber?: string;
    structures?: string;
  }>({});

  useEffect(() => {
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
  }, []);

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

  const handleAddStructure = (selectedType?: string) => {
    const typeToAdd = selectedType || newStructure.type;
    
    if (!typeToAdd) {
      addToast({
        title: 'Error',
        message: 'Please select a structure type',
        type: 'error',
      });
      return;
    }

    const structure: Structure = {
      id: Date.now().toString(),
      type: typeToAdd,
      customName: newStructure.customName.trim() ? newStructure.customName.trim() : undefined,
    };

    setStructures([...structures, structure]);
    setNewStructure({
      type: 'SSMH',
      customName: '',
    });
  };

  const handleRemoveStructure = (id: string) => {
    setStructures(structures.filter(s => s.id !== id));
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
    addToast({
      title: 'Structure Type Removed',
      message: `"${type}" has been removed from structure types`,
      type: 'success',
    });
  };

  const handleAddStructureType = () => {
    const typeName = newStructureType.trim();
    if (!typeName) {
      addToast({
        title: 'Error',
        message: 'Please enter a structure type name',
        type: 'error',
      });
      return;
    }

    if (customStructureTypes.includes(typeName)) {
      addToast({
        title: 'Error',
        message: 'This structure type already exists',
        type: 'error',
      });
      return;
    }

    const updated = [...customStructureTypes, typeName];
    setCustomStructureTypes(updated);
    localStorage.setItem('customStructureTypes', JSON.stringify(updated));
    setNewStructureType('');
    addToast({
      title: 'Structure Type Added',
      message: `"${typeName}" has been added to structure types`,
      type: 'success',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    const errors: typeof fieldErrors = {};
    let firstErrorField: string | null = null;

    // Validate each field individually
    if (!formData.customerId) {
      errors.customerId = 'Please select a customer';
      if (!firstErrorField) firstErrorField = 'customerId';
    }

    if (!formData.projectName) {
      errors.projectName = 'Please enter a project name';
      if (!firstErrorField) firstErrorField = 'projectName';
    }

    if (!formData.projectNumber) {
      errors.projectNumber = 'Please enter a project number';
      if (!firstErrorField) firstErrorField = 'projectNumber';
    }

    if (structures.length === 0) {
      errors.structures = 'Please add at least one structure';
      if (!firstErrorField) firstErrorField = 'structures';
    }

    // If there are errors, set them and show toast for first error
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      
      // Show toast for the first error field
      if (firstErrorField === 'customerId') {
        addToast({
          title: 'Customer Required',
          message: 'Please select a customer',
          type: 'error',
        });
      } else if (firstErrorField === 'projectName') {
        addToast({
          title: 'Project Name Required',
          message: 'Please enter a project name',
          type: 'error',
        });
      } else if (firstErrorField === 'projectNumber') {
        addToast({
          title: 'Project Number Required',
          message: 'Please enter a project number',
          type: 'error',
        });
      } else if (firstErrorField === 'structures') {
        addToast({
          title: 'Structures Required',
          message: 'Please add at least one structure',
          type: 'error',
        });
      }
      return;
    }

    setLoading(true);

    try {
      // Find the customer name
      const selectedCustomer = customers.find(c => c._id === formData.customerId);
      const customerName = selectedCustomer?.name || '';

      const projectData = {
        customerId: formData.customerId,
        projectNumber: formData.projectNumber,
        projectName: formData.projectName,
        startDate: formData.startDate || undefined,
        productType: 'storm', // Default type
        specifications: {
          length: 1, // Default to 1 ft to pass validation
          width: 1,
          height: 1,
          customNotes: formData.notes,
        },
        structures: structures.map(s => ({
          type: s.customName || s.type,
          customName: s.customName || s.type,
        })),
      };

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/dashboard/projects');
      } else {
        // Handle duplicate project number error
        if (data.existingProject) {
          addToast({
            title: 'Project Number Already Exists',
            message: `Job #${data.existingProject.projectNumber} is already taken by "${data.existingProject.projectName || data.existingProject.customerName}"`,
            type: 'error',
          });
        } else {
          addToast({
            title: 'Error',
            message: data.message || 'Failed to create project',
            type: 'error',
          });
        }
      }
    } catch (error) {
      console.error('Failed to create project:', error);
      addToast({
        title: 'Error',
        message: 'An error occurred. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const allStructureTypes = [...baseStructureTypes, ...customStructureTypes];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Button
          variant="default"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
        <p className="text-gray-700 mt-1">Fill in the project details below</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Project Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="customer">Customer *</Label>
                <Select
                  value={formData.customerId}
                  onValueChange={(value) => {
                    setFormData({ ...formData, customerId: value });
                    setFieldErrors({ ...fieldErrors, customerId: undefined });
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
                {fieldErrors.customerId && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.customerId}</p>
                )}
              </div>

              <div>
                <Label htmlFor="projectName">Project Name *</Label>
                <Input
                  id="projectName"
                  value={formData.projectName}
                  onChange={(e) => {
                    setFormData({ ...formData, projectName: e.target.value });
                    setFieldErrors({ ...fieldErrors, projectName: undefined });
                  }}
                  placeholder="Enter project name"
                  className="mt-2"
                  required
                />
                {fieldErrors.projectName && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.projectName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="projectNumber">Project Number *</Label>
                <Input
                  id="projectNumber"
                  value={formData.projectNumber}
                  onChange={(e) => {
                    setFormData({ ...formData, projectNumber: e.target.value });
                    setFieldErrors({ ...fieldErrors, projectNumber: undefined });
                  }}
                  placeholder="Enter project number"
                  className="mt-2"
                  required
                />
                {fieldErrors.projectNumber && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.projectNumber}</p>
                )}
              </div>

              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="mt-2"
                  required
                />
              </div>
            </div>

            {/* Structures Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Structures</h3>
              
              {/* Add New Structure */}
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

                {/* Structure Selection Dropdown */}
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
                            className="flex items-center justify-between p-2 hover:bg-gray-100 text-sm text-gray-800 border border-gray-300 group cursor-pointer"
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
                            className="flex items-center justify-between p-2 hover:bg-gray-100 text-sm text-gray-800 border border-gray-300 group cursor-pointer"
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
                  {structures.map((structure, index) => {
                    return (
                      <div
                        key={structure.id}
                        className="flex items-center justify-between p-4 bg-white border-2 border-gray-400 group hover:border-gray-600"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
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
                    );
                  })}
                </div>
              )}

              {structures.length === 0 && (
                <div className={`p-4 border text-sm mb-6 ${
                  fieldErrors.structures
                    ? 'bg-red-100 border-red-400 text-red-800'
                    : 'bg-gray-200 border-gray-400 text-gray-800'
                }`}>
                  {fieldErrors.structures ? (
                    <span>⚠️ {fieldErrors.structures}</span>
                  ) : (
                    <span>ℹ️ No structures added yet. Add at least one structure to continue.</span>
                  )}
                </div>
              )}
            </div>

            {/* Notes Section */}
            <div className="border-t pt-6">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any additional notes or special requirements..."
                rows={4}
                className="mt-2"
              />
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6 border-t">
              <Button
                type="submit"
                variant="primary"
                disabled={loading || structures.length === 0}
                className="flex-1"
              >
                {loading ? 'Creating...' : 'Create Project'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


