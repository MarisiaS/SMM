from api.models import Athlete
from django.test import TestCase

class AthleteTestCase(TestCase):
    fixtures = ['setup_data.json', 'athlete_data.json']

    @classmethod
    def setUpTestData(cls):
        cls._athlete2 = Athlete.objects.get(id=2)

    def test_return_athlete_name(self):
        self.assertEqual(self._athlete2.full_name, 'Ana Gomez')

    def test_return_athlete(self):
        self.assertEqual(str(self._athlete2), 'Ana Gomez')
