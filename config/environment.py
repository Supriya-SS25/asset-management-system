"""
Environment Configuration for AssetTrack Pro
Handles different environments (development, staging, production)
"""

import os
from typing import Dict, Any
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

class EnvironmentConfig:
    """Environment configuration management"""
    
    def __init__(self):
        self.environment = os.getenv('ENVIRONMENT', 'development')
        self.config = self._get_config()
    
    def _get_config(self) -> Dict[str, Any]:
        """Get configuration based on environment"""
        
        base_config = {
            'development': {
                'database_url': os.getenv('DATABASE_URL', 'postgresql://localhost/assettrack_dev'),
                'supabase_url': os.getenv('SUPABASE_URL', ''),
                'supabase_key': os.getenv('SUPABASE_KEY', ''),
                'api_base_url': 'http://localhost:8000',
                'frontend_url': 'http://localhost:3000',
                'debug': True,
                'cors_origins': ['http://localhost:3000', 'http://localhost:3001']
            },
            'staging': {
                'database_url': os.getenv('DATABASE_URL'),
                'supabase_url': os.getenv('SUPABASE_URL'),
                'supabase_key': os.getenv('SUPABASE_KEY'),
                'api_base_url': 'https://assettrack-api-staging.onrender.com',
                'frontend_url': 'https://assettrack-pro-staging.vercel.app',
                'debug': False,
                'cors_origins': ['https://assettrack-pro-staging.vercel.app']
            },
            'production': {
                'database_url': os.getenv('DATABASE_URL'),
                'supabase_url': os.getenv('SUPABASE_URL'),
                'supabase_key': os.getenv('SUPABASE_KEY'),
                'api_base_url': 'https://assettrack-api.onrender.com',
                'frontend_url': 'https://assettrack-pro.vercel.app',
                'debug': False,
                'cors_origins': ['https://assettrack-pro.vercel.app']
            }
        }
        
        return base_config.get(self.environment, base_config['development'])
    
    @property
    def database_url(self) -> str:
        return self.config['database_url']
    
    @property
    def supabase_url(self) -> str:
        return self.config['supabase_url']
    
    @property
    def supabase_key(self) -> str:
        return self.config['supabase_key']
    
    @property
    def api_base_url(self) -> str:
        return self.config['api_base_url']
    
    @property
    def frontend_url(self) -> str:
        return self.config['frontend_url']
    
    @property
    def debug(self) -> bool:
        return self.config['debug']
    
    @property
    def cors_origins(self) -> list:
        return self.config['cors_origins']
    
    def is_development(self) -> bool:
        return self.environment == 'development'
    
    def is_production(self) -> bool:
        return self.environment == 'production'

# Global configuration instance
config = EnvironmentConfig()
