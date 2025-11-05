"""
Custom middleware to handle CORS preflight requests before CommonMiddleware.
"""
from django.http import HttpResponse


class CorsPreflightMiddleware:
    """
    Middleware to handle OPTIONS requests for CORS preflight before CommonMiddleware.
    This prevents 301 redirects on OPTIONS requests.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Handle OPTIONS requests immediately for API endpoints
        # This prevents CommonMiddleware from redirecting preflight requests
        if request.method == 'OPTIONS' and request.path.startswith('/api/'):
            response = HttpResponse()
            # Get allowed origins from request
            origin = request.META.get('HTTP_ORIGIN', '*')
            # Check if origin is in allowed list (for security)
            from django.conf import settings
            allowed_origins = getattr(settings, 'CORS_ALLOWED_ORIGINS', [])
            if origin in allowed_origins or '*' in allowed_origins:
                response['Access-Control-Allow-Origin'] = origin
            else:
                response['Access-Control-Allow-Origin'] = '*'
            response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH'
            response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With, Accept'
            response['Access-Control-Allow-Credentials'] = 'true'
            response['Access-Control-Max-Age'] = '86400'
            return response
        return self.get_response(request)

