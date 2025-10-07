from django.test import TestCase, override_settings
from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory
from unittest.mock import patch
from .authentication import ClerkJWTAuthentication
import jwt
import datetime

User = get_user_model()

class ClerkJWTAuthenticationTests(TestCase):
	def setUp(self):
		self.factory = APIRequestFactory()
		self.auth = ClerkJWTAuthentication()

	def test_authenticate_with_valid_token(self):
		token = 'header.payload.signature'
		# Patch get_user_from_token to simulate successful auth
		fake_user = User.objects.create_user(username='user_123', email='u@example.com')
		with patch.object(ClerkJWTAuthentication, 'get_user_from_token', return_value=fake_user):
			request = self.factory.get('/api/me/', HTTP_AUTHORIZATION=f'Bearer {token}')
			user, returned_token = self.auth.authenticate(request)
			self.assertEqual(user.username, 'user_123')
			self.assertEqual(returned_token, token)

	def test_authenticate_no_header(self):
		request = self.factory.get('/api/me/')
		result = self.auth.authenticate(request)
		self.assertIsNone(result)
