'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function UserForm() {
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'Employee',
    department_id: '1'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // API call to create user
      console.log('Creating user:', formData)
      alert('User created successfully!')
      // Reset form with new sample data
      setFormData({
        name: 'Jane Smith',
        email: 'jane.smith@company.com',
        role: 'Manager',
        department_id: '2'
      })
    } catch (error) {
      alert('Error creating user')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Add New User</CardTitle>
        <CardDescription>Enter user details to create account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="Employee">Employee</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div>
              <Label htmlFor="department_id">Department ID</Label>
              <Input
                id="department_id"
                name="department_id"
                value={formData.department_id}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Add User
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
