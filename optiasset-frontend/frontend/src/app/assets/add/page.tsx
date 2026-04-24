import { AssetForm } from "@/components/AssetForm"

export default function AddAsset() {
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
          <a href="/assets" className="block px-6 py-3 bg-gray-100 text-gray-900 border-l-4 border-blue-500">
            Assets
          </a>
          <a href="/users" className="block px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900">
            Users
          </a>
          <a href="/reports" className="block px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900">
            Reports
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Add New Asset</h1>
          <p className="text-gray-600">Enter asset details to add to inventory</p>
        </div>

        <div className="flex justify-center">
          <AssetForm />
        </div>
      </div>
    </div>
  )
}
