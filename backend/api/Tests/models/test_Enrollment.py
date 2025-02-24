from api.models import Enrollment, Athlete, SwimMeet
from django.test import TestCase
from django.db.utils import IntegrityError

class EnrollmentTestCase(TestCase):
    fixtures = ['setup_data.json', 'enrollment.json', 'athlete_data.json', 'swim_meet.json']

    def test_enrollment_unique_constraint(self):
        swim_meet = SwimMeet.objects.get(id=1)
        athlete = Athlete.objects.get(id=1)

        with self.assertRaises(IntegrityError):
            Enrollment.objects.create(swim_meet=swim_meet, athlete=athlete)