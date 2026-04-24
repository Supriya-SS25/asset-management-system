'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from '@/lib/api'

export function AssetForm() {
  const [formData, setFormData] = useState({
    name: 'Dell Latitude 5420',
    serial_number: 'DL5420-001',
    category: 'Laptop',
    status: 'Active',
    location: 'Office A',
    purchase_date: '2024-03-06',
    purchase_cost: '1200'
  })

  // Sample data for quick testing
  const sampleAssets = [
    {
      name: 'HP LaserJet Pro',
      serial_number: 'HPLJ-003',
      category: 'Printer',
      status: 'Active',
      location: 'Office A',
      purchase_date: '2024-01-15',
      purchase_cost: '450'
    },
    {
      name: 'Cisco Router 2921',
      serial_number: 'CISCO2921-004',
      category: 'Network',
      status: 'Active',
      location: 'Server Room',
      purchase_date: '2023-12-10',
      purchase_cost: '800'
    },
    {
      name: 'iPad Pro 12.9',
      serial_number: 'IPAD129-005',
      category: 'Tablet',
      status: 'Active',
      location: 'Conference Room',
      purchase_date: '2024-02-01',
      purchase_cost: '999'
    },
    {
      name: 'Logitech MX Master 3',
      serial_number: 'LOGMX3-006',
      category: 'Mouse',
      status: 'Active',
      location: 'Office C',
      purchase_date: '2024-03-01',
      purchase_cost: '99'
    }
  ]

  let sampleIndex = 0

  const loadSampleData = () => {
    const sample = sampleAssets[sampleIndex]
    setFormData({
      name: sample.name,
      serial_number: sample.serial_number,
      category: sample.category,
      status: sample.status,
      location: sample.location,
      purchase_date: sample.purchase_date,
      purchase_cost: sample.purchase_cost
    })
    sampleIndex = (sampleIndex + 1) % sampleAssets.length
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🔍 Submitting asset data:', formData)
    
    try {
      const response = await api.createAsset(formData)
      console.log('✅ API Response:', response)
      alert(`✅ Asset Created Successfully!\n\nName: ${formData.name}\nSerial: ${formData.serial_number}\nCategory: ${formData.category}\n\nCheck the Assets page to see your new asset!`)
      // Load next sample data
      loadSampleData()
    } catch (error) {
      console.error('❌ Full Error Details:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      console.error('❌ Error Message:', errorMessage)
      alert(`❌ Error creating asset: ${errorMessage}\n\nCheck console (F12) for full details.`)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Add New Asset</CardTitle>
        <CardDescription>Enter asset details to add to inventory</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Asset Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="serial_number">Serial Number</Label>
              <Input
                id="serial_number"
                name="serial_number"
                value={formData.serial_number}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Input
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="purchase_date">Purchase Date</Label>
              <Input
                id="purchase_date"
                name="purchase_date"
                type="date"
                value={formData.purchase_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="purchase_cost">Purchase Cost</Label>
            <Input
              id="purchase_cost"
              name="purchase_cost"
              type="number"
              value={formData.purchase_cost}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Add Asset
            </Button>
            <Button type="button" variant="outline" className="flex-1" onClick={loadSampleData}>
              Load Sample Data
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
