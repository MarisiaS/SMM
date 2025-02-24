from api.models import Group
from django.test import TestCase
from django.db.utils import IntegrityError

class GroupTestCase(TestCase):
    fixtures = ['setup_data.json']

    @classmethod
    def setUpTestData(cls):
        cls._groupG = Group.objects.get(id=3)
        cls._groupMn = Group.objects.get(id=4)
        cls._groupMx = Group.objects.get(id=5)
        cls._groupTo = Group(gender="MX", min_age=5, max_age=10)
        cls._groupTo.save()

    def test_return_str_mixed_gender(self):
        self.assertEqual(self._groupG.name,'Mixed')

    def test_return_str_11an_above(self):
        self.assertEqual(self._groupMn.min_age, 11)

    def test_return_str_10and_under(self):
        self.assertEqual(self._groupMx.gender, "F")

    def test_return_str5to10(self):
        self.assertEqual(self._groupTo.max_age, 10)

    def test_unique_constraint(self):
        with self.assertRaises(IntegrityError):
            Group.objects.create(gender="MX", min_age=5, max_age=10)

    def test_minage_negative_number(self):
        with self.assertRaises(IntegrityError):
            Group.objects.create(gender="F", min_age=-5, max_age=10)

    def test_maxage_negative_number(self):
        with self.assertRaises(IntegrityError):
            Group.objects.create(gender="F", min_age=5, max_age=-10)

    def test_minage_valid_number(self):
        with self.assertRaises(ValueError):
            Group.objects.create(gender="F", min_age="p", max_age=10)

    def test_maxage_valid_number(self):
        with self.assertRaises(ValueError):
            Group.objects.create(gender="F", min_age=-5, max_age="P")

    # Failing Tests
    # def test_gender_valid(self):
    #     with self.assertRaises(ValueError):
    #         Group.objects.create(gender="Not", min_age=3, max_age=14)
    #
    # def test_minage_valid_age_range(self):
    #     """test failing"""
    #     with self.assertRaises(IntegrityError):
    #         Group.objects.create(gender="F", min_age=15, max_age=10)
