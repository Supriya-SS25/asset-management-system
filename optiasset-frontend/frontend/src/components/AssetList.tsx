'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api } from '@/lib/api'

interface Asset {
  id: number
  name: string
  serial_number: string
  category: string
  status: string
  location: string
  purchase_date: string
  purchase_cost: number
}

export function AssetList() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAssets()
  }, [])

  const loadAssets = async () => {
    try {
      const data = await api.getAssets()
      console.log('Raw API response:', data)
      
      // Handle different response formats
      let assetsArray = []
      if (Array.isArray(data)) {
        assetsArray = data
      } else if (data && typeof data === 'object') {
        // If API returns object with data property
        if (Array.isArray(data.data)) {
          assetsArray = data.data
        } else if (Array.isArray(data.assets)) {
          assetsArray = data.assets
        } else {
          // Single asset object, convert to array
          assetsArray = [data]
        }
      }
      
      console.log('Processed assets array:', assetsArray)
      setAssets(assetsArray)
    } catch (error) {
      console.error('Error loading assets:', error)
      // Show sample data if backend not available
      const sampleAssets = [
        {
          id: 1,
          name: "Dell Latitude 5420",
          serial_number: "DL5420-001",
          category: "Laptop",
          status: "Active",
          location: "Office A",
          purchase_date: "2024-03-06",
          purchase_cost: 1200
        },
        {
          id: 2,
          name: "LG Monitor 27\"",
          serial_number: "LG27M001",
          category: "Display",
          status: "Active",
          location: "Office B",
          purchase_date: "2024-02-20",
          purchase_cost: 300
        },
        {
          id: 3,
          name: "HP LaserJet Pro",
          serial_number: "HPLJ-003",
          category: "Printer",
          status: "Active",
          location: "Office A",
          purchase_date: "2024-01-15",
          purchase_cost: 450
        },
        {
          id: 4,
          name: "Cisco Router 2921",
          serial_number: "CISCO2921-004",
          category: "Network",
          status: "Active",
          location: "Server Room",
          purchase_date: "2023-12-10",
          purchase_cost: 800
        },
        {
          id: 5,
          name: "iPad Pro 12.9",
          serial_number: "IPAD129-005",
          category: "Tablet",
          status: "Active",
          location: "Conference Room",
          purchase_date: "2024-02-01",
          purchase_cost: 999
        },
        {
          id: 6,
          name: "Logitech MX Master 3",
          serial_number: "LOGMX3-006",
          category: "Mouse",
          status: "Active",
          location: "Office C",
          purchase_date: "2024-03-01",
          purchase_cost: 99
        },
        {
          id: 7,
          name: "Microsoft Surface Pro 9",
          serial_number: "MSP9-007",
          category: "Laptop",
          status: "Maintenance",
          location: "Office B",
          purchase_date: "2023-11-20",
          purchase_cost: 1500
        },
        {
          id: 8,
          name: "Samsung 55\" Smart TV",
          serial_number: "SAM55TV-008",
          category: "Display",
          status: "Active",
          location: "Reception Area",
          purchase_date: "2024-01-25",
          purchase_cost: 650
        }
      ]
      setAssets(sampleAssets)
      console.log('Showing sample assets:', sampleAssets)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this asset?')) {
      try {
        await api.deleteAsset(id)
        setAssets(assets.filter(asset => asset.id !== id))
      } catch (error) {
        console.error('Error deleting asset:', error)
        alert('Error deleting asset')
      }
    }
  }

  if (loading) {
    return <div>Loading assets...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Assets</CardTitle>
        <CardDescription>Complete list of assets in your organization</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Serial Number</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id}>
                <TableCell className="font-medium">{asset.name}</TableCell>
                <TableCell>{asset.serial_number}</TableCell>
                <TableCell>{asset.category}</TableCell>
                <TableCell>
                  <Badge variant={asset.status === 'Active' ? 'default' : 'secondary'}>
                    {asset.status}
                  </Badge>
                </TableCell>
                <TableCell>{asset.location}</TableCell>
                <TableCell>${asset.purchase_cost}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDelete(asset.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
