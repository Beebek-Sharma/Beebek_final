from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import UserProfile


class Command(BaseCommand):
    help = 'Show all users and their roles'

    def handle(self, *args, **kwargs):
        users = User.objects.all()
        
        if not users.exists():
            self.stdout.write(self.style.WARNING('No users found in the database'))
            return
        
        self.stdout.write(self.style.SUCCESS(f'\nFound {users.count()} users:\n'))
        self.stdout.write('-' * 100)
        self.stdout.write(f'{"Username":<40} {"Email":<35} {"Role":<10} {"Superuser":<10}')
        self.stdout.write('-' * 100)
        
        for user in users:
            # Get or create profile
            profile, created = UserProfile.objects.get_or_create(
                user=user,
                defaults={'role': 'admin' if user.is_superuser else 'student'}
            )
            
            username = user.username[:38] + '..' if len(user.username) > 40 else user.username
            email = user.email[:33] + '..' if len(user.email) > 35 else user.email
            role = profile.role
            is_super = 'Yes' if user.is_superuser else 'No'
            
            # Color code the output
            if role == 'admin':
                self.stdout.write(self.style.SUCCESS(
                    f'{username:<40} {email:<35} {role:<10} {is_super:<10}'
                ))
            else:
                self.stdout.write(
                    f'{username:<40} {email:<35} {role:<10} {is_super:<10}'
                )
        
        self.stdout.write('-' * 100)
        self.stdout.write(f'\nTo make a user admin, run: python manage.py make_admin <username>\n')
