from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import UserProfile


class Command(BaseCommand):
    help = 'List all users and their roles'

    def handle(self, *args, **kwargs):
        users = User.objects.all()
        
        if not users.exists():
            self.stdout.write(self.style.WARNING('No users found in the database'))
            return
        
        self.stdout.write(self.style.SUCCESS(f'Found {users.count()} users:\n'))
        
        for user in users:
            profile = None
            try:
                profile = user.profile
            except UserProfile.DoesNotExist:
                pass
            
            self.stdout.write(f'Username: {user.username}')
            self.stdout.write(f'  Email: {user.email}')
            self.stdout.write(f'  Name: {user.first_name} {user.last_name}')
            self.stdout.write(f'  Is superuser: {user.is_superuser}')
            self.stdout.write(f'  Is staff: {user.is_staff}')
            self.stdout.write(f'  Has profile: {profile is not None}')
            if profile:
                self.stdout.write(f'  Profile role: {profile.role}')
            self.stdout.write('')
