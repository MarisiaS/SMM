"""delete this file not needed"""

from api.models import CustomUser
from django.core.exceptions import ValidationError
from django.test import TransactionTestCase, TestCase

class CustomUserTestCase(TransactionTestCase):
    reset_sequences = True
    fixtures = ['setup_data.json']
    _coach = None

    def setUp(self):
        self._coach = CustomUser.objects.get(email='coach@email.com')

    def test_name_max_length(self):
        test_name = 'a'
