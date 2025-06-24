"use client"

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { type Deal, type DealStage } from '@/store/pipelineStore'
import { XIcon } from 'lucide-react'

interface ClientFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (client: Deal) => Promise<void>
  initialData?: Deal
}

const STAGES: DealStage[] = [
  'First Contact',
  'Discovery',
  'Validation',
  'Commitment',
  'Conversion',
  'Won',
  'Lost'
]

const URGENCY_OPTIONS = ['Hot', 'Watch', 'Cold', 'Stalled']

interface FormErrors {
  [key: string]: string
}

export default function ClientForm({ open, onClose, onSubmit, initialData }: ClientFormProps) {
  const [formData, setFormData] = useState<Partial<Deal>>(
    initialData || {
      stage: 'First Contact',
      urgency: 'Watch',
      signals: [],
      momentum: 50,
    }
  )

  useEffect(() => {
    console.log('ClientForm mounted/updated:', { 
      open, 
      initialData,
      formData
    });
  }, [open, initialData, formData]);

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!formData.name?.trim()) {
      newErrors.name = 'Client name is required'
    }

    if (!formData.company?.trim()) {
      newErrors.company = 'Company name is required'
    }

    if (!formData.value || formData.value <= 0) {
      newErrors.value = 'Deal value must be greater than 0'
    }

    if (!formData.closeDate) {
      newErrors.closeDate = 'Close date is required'
    }

    if (!formData.repName?.trim()) {
      newErrors.repName = 'Representative name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const clientData: Deal = {
        id: initialData?.id || Date.now().toString(),
        name: formData.name!,
        value: formData.value!,
        stage: formData.stage as DealStage,
        closeDate: formData.closeDate!,
        momentum: formData.momentum || 50,
        repId: initialData?.repId || 'rep1',
        repName: formData.repName!,
        company: formData.company!,
        urgency: formData.urgency as 'Hot' | 'Watch' | 'Cold' | 'Stalled',
        signals: formData.signals || [],
        lastActivity: new Date().toISOString(),
      }

      await onSubmit(clientData)
      onClose()
    } catch (error) {
      console.error('Error submitting form:', error)
      setErrors({ submit: 'Failed to save client. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof Deal, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  console.log('ClientForm render:', { open, initialData });

  if (!open) {
    console.log('ClientForm not open, returning null');
    return null;
  }

  console.log('ClientForm rendering modal');
  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          console.log('Clicked overlay');
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-[600px] shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Edit Client' : 'Add New Client'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="grid gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Client Name</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={e => handleChange('name', e.target.value)}
                  placeholder="Enter client name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company || ''}
                  onChange={e => handleChange('company', e.target.value)}
                  placeholder="Enter company name"
                  className={errors.company ? 'border-red-500' : ''}
                />
                {errors.company && <p className="text-sm text-red-500">{errors.company}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">Deal Value ($)</Label>
                <Input
                  id="value"
                  type="number"
                  value={formData.value || ''}
                  onChange={e => handleChange('value', Number(e.target.value))}
                  placeholder="Enter deal value"
                  className={errors.value ? 'border-red-500' : ''}
                />
                {errors.value && <p className="text-sm text-red-500">{errors.value}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="closeDate">Close Date</Label>
                <Input
                  id="closeDate"
                  type="date"
                  value={formData.closeDate || ''}
                  onChange={e => handleChange('closeDate', e.target.value)}
                  className={errors.closeDate ? 'border-red-500' : ''}
                />
                {errors.closeDate && <p className="text-sm text-red-500">{errors.closeDate}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stage">Stage</Label>
                <Select
                  value={formData.stage}
                  onValueChange={value => handleChange('stage', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {STAGES.map(stage => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency</Label>
                <Select
                  value={formData.urgency}
                  onValueChange={value => handleChange('urgency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    {URGENCY_OPTIONS.map(urgency => (
                      <SelectItem key={urgency} value={urgency}>
                        {urgency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="repName">Representative Name</Label>
              <Input
                id="repName"
                value={formData.repName || ''}
                onChange={e => handleChange('repName', e.target.value)}
                placeholder="Enter representative name"
                className={errors.repName ? 'border-red-500' : ''}
              />
              {errors.repName && <p className="text-sm text-red-500">{errors.repName}</p>}
            </div>
          </div>

          {errors.submit && (
            <p className="text-sm text-red-500 text-center">{errors.submit}</p>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Add Client'}
          </Button>
        </div>
      </div>
    </div>
  );
}
