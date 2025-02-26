from api.models import MeetEvent, SwimMeet, Group, EventType
from django.test import TestCase
from django.db.utils import IntegrityError

class EventTypeTestCase(TestCase):
    fixtures = ['setup_data.json', 'meetevent_data.json', 'swim_meet.json']

    @classmethod
    def setUpTestData(cls):
        cls._swim_meet = SwimMeet.objects.get(id=1)
        cls._group = Group.objects.create(gender="F", min_age=1, max_age=20)
        cls._group1 = Group.objects.get(id=2)
        cls._event_type1 = EventType.objects.get(id=3)
        cls._event_type = EventType.objects.create(distance=400, stroke="M", type="RELAY")

    def test_return_str_name(self):
        meet_event = MeetEvent.objects.get(id=1)
        self.assertEqual(meet_event.name, '#1 Girls 50 FLY')

    def test_unique_constraint_swimmeet_numevent(self):
        with self.assertRaises(IntegrityError):
            MeetEvent.objects.create(swim_meet=self._swim_meet, group=self._group,
                                     event_type=self._event_type, num_event=1)

    def test_unique_constraint_swimmeet_eventtype_group(self):
        with self.assertRaises(IntegrityError):
            MeetEvent.objects.create(swim_meet=self._swim_meet, group=self._group1,
                                     event_type=self._event_type1, num_event=44)

