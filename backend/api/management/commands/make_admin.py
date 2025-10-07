from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import UserProfile


class Command(BaseCommand):
    help = 'Make a user an admin by username'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Username to make admin')

    def handle(self, *args, **kwargs):
        username = kwargs['username']
        
        try:
            user = User.objects.get(username=username)
            profile, created = UserProfile.objects.get_or_create(user=user)
            profile.role = 'admin'
            profile.save()
            
            user.is_superuser = True
            user.is_staff = True
            user.save()
            
            self.stdout.write(self.style.SUCCESS(f'Successfully made {username} an admin'))
            self.stdout.write(f'Profile role: {profile.role}')
            self.stdout.write(f'Is superuser: {user.is_superuser}')
            self.stdout.write(f'Is staff: {user.is_staff}')
            
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'User {username} does not exist'))
            self.stdout.write(self.style.WARNING('Available users:'))
            for u in User.objects.all():
                self.stdout.write(f'  - {u.username}')
