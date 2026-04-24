'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserForm } from "@/components/UserForm"

export default function Users() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">OptiAsset</h2>
          <p className="text-sm text-gray-600">Asset Management</p>
        </div>
        <nav className="mt-6">
          <a href="/dashboard" className="block px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900">
            Dashboard
          </a>
          <a href="/assets" className="block px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900">
            Assets
          </a>
          <a href="/users" className="block px-6 py-3 bg-gray-100 text-gray-900 border-l-4 border-blue-500">
            Users
          </a>
          <a href="/reports" className="block px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900">
            Reports
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Users</h1>
            <p className="text-gray-600">Manage user accounts and permissions</p>
          </div>
          <Button>Add New User</Button>
        </div>

        {/* Users Form */}
        <div className="flex justify-center">
          <UserForm />
        </div>
      </div>
    </div>
  )
}
