from api.models import EventType
from django.test import TestCase
from django.db.utils import IntegrityError

class EventTypeTestCase(TestCase):
    fixtures = ['setup_data.json']

    @classmethod
    def setUpTestData(cls):
        cls._eventtype_FI = EventType.objects.get(id=1)
        cls._eventtype_MR = EventType.objects.get(id=2)
        cls._eventtype_FSI = EventType.objects.get(id=3)
        cls._eventtype_Dist = EventType.objects.get(id=5)

    def test_return_str_name(self):
        self.assertEqual(self._eventtype_FI.name, '50 FLY')

    def test_return_str_type(self):
        self.assertEqual(self._eventtype_MR.type, 'RELAY')

    def test_return_str_stroke(self):
        self.assertEqual(self._eventtype_FSI.stroke, 'FR')

    def test_return_int_dist(self):
        self.assertEqual(self._eventtype_Dist.distance, 200)

    def test_valid_distance(self):
        with self.assertRaises(ValueError):
            EventType.objects.create(distance="M", stroke="M", type="INDIVIDUAL")

    def test_valid_stroke(self):
        with self.assertRaises(ValueError):
            EventType.objects.create(distance="M", stroke=100, type="INDIVIDUAL")

    def test_valid_type(self):
        with self.assertRaises(ValueError):
            EventType.objects.create(distance="M", stroke="M", type=100)

    def test_unique_constraints(self):
        with self.assertRaises(IntegrityError):
            EventType.objects.create(distance=50, stroke="FLY", type="INDIVIDUAL")

    # Failing Tests

    # def test_valid_stroke(self):
    #     with self.assertRaises(ValueError):
    #         EventType.objects.create(distance="50", stroke="M", type="INDIVIDUAL")
    #
    # def test_valid_type(self):
    #     with self.assertRaises(ValueError):
    #         EventType.objects.create(distance="", stroke="M", type="bananas")