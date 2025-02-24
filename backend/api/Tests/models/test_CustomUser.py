from api.models import CustomUser
from django.test import TestCase

class CustomUserTestCase(TestCase):
    fixtures = ['setup_data.json']
    _coach = None

    def setUp(self):
        self._coach = CustomUser.objects.get(email='coach@email.com')

    def test_returns_email(self):
        self.assertEqual(str(self._coach), 'coach@email.com')
