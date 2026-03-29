from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import datetime

from ...models import Team, Activity, LeaderboardEntry, Workout

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Delete all data
        LeaderboardEntry.objects.all().delete()
        Activity.objects.all().delete()
        Workout.objects.all().delete()
        Team.objects.all().delete()
        User.objects.all().delete()

        # Create teams
        marvel = Team.objects.create(name='Marvel')
        dc = Team.objects.create(name='DC')

        # Create users (superheroes) and associate with teams
        marvel_users = []
        dc_users = []

        marvel_data = [
            {'username': 'ironman', 'email': 'ironman@marvel.com'},
            {'username': 'captainamerica', 'email': 'cap@marvel.com'},
            {'username': 'spiderman', 'email': 'spiderman@marvel.com'},
        ]
        dc_data = [
            {'username': 'batman', 'email': 'batman@dc.com'},
            {'username': 'superman', 'email': 'superman@dc.com'},
            {'username': 'wonderwoman', 'email': 'wonderwoman@dc.com'},
        ]

        for u in marvel_data:
            user = User.objects.create_user(username=u['username'], email=u['email'], password='password123')
            marvel_users.append(user)
        marvel.members.set(marvel_users)

        for u in dc_data:
            user = User.objects.create_user(username=u['username'], email=u['email'], password='password123')
            dc_users.append(user)
        dc.members.set(dc_users)

        # Create activities
        Activity.objects.create(user=marvel_users[0], team=marvel, type='Running', duration=30, date=datetime.date(2024, 1, 1))
        Activity.objects.create(user=dc_users[0], team=dc, type='Cycling', duration=45, date=datetime.date(2024, 1, 2))
        Activity.objects.create(user=marvel_users[2], team=marvel, type='Swimming', duration=25, date=datetime.date(2024, 1, 3))
        Activity.objects.create(user=dc_users[1], team=dc, type='Running', duration=60, date=datetime.date(2024, 1, 4))

        # Create leaderboard entries
        LeaderboardEntry.objects.create(user=marvel_users[0], team=marvel, score=100, rank=2)
        LeaderboardEntry.objects.create(user=dc_users[0], team=dc, score=120, rank=1)

        # Create workouts
        Workout.objects.create(user=marvel_users[0], name='Hero HIIT', description='High intensity interval training for heroes.')
        Workout.objects.create(user=dc_users[0], name='Power Circuit', description='Strength and endurance for DC heroes.')

        self.stdout.write(self.style.SUCCESS('octofit_db database populated with test data.'))
