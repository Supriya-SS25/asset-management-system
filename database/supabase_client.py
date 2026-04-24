"""
Supabase Database Client for AssetTrack Pro
Handles database operations with Supabase
"""

import os
from typing import Dict, List, Optional, Any
from supabase import create_client, Client
from config.environment import config

class SupabaseClient:
    """Supabase database client wrapper"""
    
    def __init__(self):
        self.client: Client = self._create_client()
    
    def _create_client(self) -> Client:
        """Create Supabase client with environment configuration"""
        return create_client(
            supabase_url=config.supabase_url,
            supabase_key=config.supabase_key
        )
    
    # Asset Operations
    async def get_assets(self) -> List[Dict]:
        """Get all assets"""
        try:
            response = self.client.table('assets').select('*').execute()
            return response.data if response.data else []
        except Exception as e:
            print(f"Error fetching assets: {e}")
            return []
    
    async def get_asset_by_id(self, asset_id: int) -> Optional[Dict]:
        """Get asset by ID"""
        try:
            response = self.client.table('assets').select('*').eq('id', asset_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error fetching asset {asset_id}: {e}")
            return None
    
    async def create_asset(self, asset_data: Dict) -> Optional[Dict]:
        """Create new asset"""
        try:
            response = self.client.table('assets').insert(asset_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error creating asset: {e}")
            return None
    
    async def update_asset(self, asset_id: int, asset_data: Dict) -> Optional[Dict]:
        """Update asset"""
        try:
            response = self.client.table('assets').update(asset_data).eq('id', asset_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error updating asset {asset_id}: {e}")
            return None
    
    async def delete_asset(self, asset_id: int) -> bool:
        """Delete asset"""
        try:
            response = self.client.table('assets').delete().eq('id', asset_id).execute()
            return len(response.data) > 0 if response.data else False
        except Exception as e:
            print(f"Error deleting asset {asset_id}: {e}")
            return False
    
    async def get_employee_assets(self, user_id: int) -> List[Dict]:
        """Get assets assigned to specific employee"""
        try:
            response = self.client.table('assets').select('*').eq('assigned_to', user_id).execute()
            return response.data if response.data else []
        except Exception as e:
            print(f"Error fetching employee assets: {e}")
            return []
    
    # User Operations
    async def get_users(self) -> List[Dict]:
        """Get all users"""
        try:
            response = self.client.table('users').select('*').execute()
            return response.data if response.data else []
        except Exception as e:
            print(f"Error fetching users: {e}")
            return []
    
    async def get_user_by_id(self, user_id: int) -> Optional[Dict]:
        """Get user by ID"""
        try:
            response = self.client.table('users').select('*').eq('id', user_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error fetching user {user_id}: {e}")
            return None
    
    async def create_user(self, user_data: Dict) -> Optional[Dict]:
        """Create new user"""
        try:
            response = self.client.table('users').insert(user_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error creating user: {e}")
            return None
    
    async def update_user(self, user_id: int, user_data: Dict) -> Optional[Dict]:
        """Update user"""
        try:
            response = self.client.table('users').update(user_data).eq('id', user_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"Error updating user {user_id}: {e}")
            return None
    
    async def delete_user(self, user_id: int) -> bool:
        """Delete user"""
        try:
            response = self.client.table('users').delete().eq('id', user_id).execute()
            return len(response.data) > 0 if response.data else False
        except Exception as e:
            print(f"Error deleting user {user_id}: {e}")
            return False
    
    # Authentication Operations
    async def authenticate_user(self, email: str, password: str) -> Optional[Dict]:
        """Authenticate user with Supabase Auth"""
        try:
            response = self.client.auth.sign_in_with_password({
                'email': email,
                'password': password
            })
            return response.user if response.user else None
        except Exception as e:
            print(f"Authentication error: {e}")
            return None
    
    async def logout_user(self) -> bool:
        """Logout user"""
        try:
            response = self.client.auth.sign_out()
            return True
        except Exception as e:
            print(f"Logout error: {e}")
            return False
    
    # Dashboard Statistics
    async def get_dashboard_stats(self) -> Dict[str, Any]:
        """Get dashboard statistics"""
        try:
            # Get total assets
            assets_response = self.client.table('assets').select('id').execute()
            total_assets = len(assets_response.data) if assets_response.data else 0
            
            # Get total users
            users_response = self.client.table('users').select('id').execute()
            total_users = len(users_response.data) if users_response.data else 0
            
            # Get assigned assets
            assigned_response = self.client.table('assets').select('id').eq('status', 'Assigned').execute()
            assigned_assets = len(assigned_response.data) if assigned_response.data else 0
            
            # Get available assets
            available_response = self.client.table('assets').select('id').eq('status', 'Available').execute()
            available_assets = len(available_response.data) if available_response.data else 0
            
            return {
                'total_assets': total_assets,
                'total_users': total_users,
                'assigned_assets': assigned_assets,
                'available_assets': available_assets,
                'broken_assets': total_assets - assigned_assets - available_assets,
            }
        except Exception as e:
            print(f"Error fetching dashboard stats: {e}")
            return {
                'total_assets': 0,
                'total_users': 0,
                'assigned_assets': 0,
                'available_assets': 0,
                'broken_assets': 0,
            }

# Global Supabase client instance
supabase_client = SupabaseClient()
