from api.models import Heat, Athlete, MeetEvent
from django.test import TestCase
from django.db.utils import IntegrityError

class HeatTestCase(TestCase):
    fixtures = ['setup_data.json', 'meetevent_data.json', 'athlete_data.json', 'swim_meet.json']

    def test_heat_unique_constraint(self):
        meet_event = MeetEvent.objects.get(id=1)
        athlete = Athlete.objects.get(id=1)
        athlete2 = Athlete.objects.get(id=2)

        Heat.objects.create(event=meet_event, athlete=athlete, lane_num=1, num_heat=1)
        with self.assertRaises(IntegrityError):
            Heat.objects.create(event=meet_event, athlete=athlete2, lane_num=1, num_heat=1)
