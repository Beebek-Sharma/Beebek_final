from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import UserProfile, University, Course
import random

class Command(BaseCommand):
    help = 'Populate the database with sample data'

    def handle(self, *args, **options):
        self.stdout.write('Populating database...')
        
    # Default admin and student user creation removed. Use Django's createsuperuser command to create a superuser.
        
        # Create universities
        universities_data = [
            {
                'name': 'Harvard University',
                'description': 'Prestigious Ivy League university in Cambridge, MA.',
                'location': 'Cambridge, MA',
                'ranking': 1,
                'website': 'https://www.harvard.edu',
                'image': 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Harvard_University_logo.png',
            },
            {
                'name': 'Stanford University',
                'description': 'Leading research university in California.',
                'location': 'Stanford, CA',
                'ranking': 2,
                'website': 'https://www.stanford.edu',
                'image': 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Stanford_University_seal_2003.svg',
            },
            {
                'name': 'MIT',
                'description': 'Massachusetts Institute of Technology, world leader in STEM.',
                'location': 'Cambridge, MA',
                'ranking': 3,
                'website': 'https://web.mit.edu',
                'image': 'https://upload.wikimedia.org/wikipedia/commons/0/0c/MIT_logo.svg',
            },
            {
                'name': 'University of Technology',
                'description': 'A leading university focused on technology and innovation.',
                'location': 'San Francisco, CA',
                'ranking': 5,
                'website': 'https://www.uot.edu',
                'image': 'https://via.placeholder.com/500'
            },
            {
                'name': 'National Science University',
                'description': 'Renowned for research in science and engineering.',
                'location': 'Boston, MA',
                'ranking': 8,
                'website': 'https://www.nsu.edu',
                'image': 'https://via.placeholder.com/500'
            },
            {
                'name': 'Global Business School',
                'description': 'A premier institution for business education.',
                'location': 'New York, NY',
                'ranking': 3,
                'website': 'https://www.gbs.edu',
                'image': 'https://via.placeholder.com/500'
            },
            {
                'name': 'Arts and Humanities College',
                'description': 'Focusing on liberal arts and humanities education.',
                'location': 'Chicago, IL',
                'ranking': 12,
                'website': 'https://www.ahc.edu',
                'image': 'https://via.placeholder.com/500'
            },
            {
                'name': 'Medical Sciences Institute',
                'description': 'Leading education in medical and health sciences.',
                'location': 'Houston, TX',
                'ranking': 7,
                'website': 'https://www.msi.edu',
                'image': 'https://via.placeholder.com/500'
            }
        ]
        
        universities = []
        for uni_data in universities_data:
            uni, created = University.objects.get_or_create(
                name=uni_data['name'],
                defaults={
                    'description': uni_data['description'],
                    'location': uni_data['location'],
                    'ranking': uni_data['ranking'],
                    'website': uni_data['website'],
                    'image': uni_data['image']
                }
            )
            universities.append(uni)
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created university: {uni.name}'))
        
        # Create courses
        courses_data = [
            # University of Technology
            {
                'university': 0,
                'name': 'Computer Science',
                'description': 'A comprehensive program covering algorithms, programming, and computer systems.',
                'duration': '4 years',
                'fees': 12000,
                'level': 'Undergraduate'
            },
            {
                'university': 0,
                'name': 'Data Science',
                'description': 'Learn to analyze and interpret complex data using statistical methods and programming.',
                'duration': '2 years',
                'fees': 15000,
                'level': 'Postgraduate'
            },
            {
                'university': 0,
                'name': 'Artificial Intelligence',
                'description': 'Study machine learning, neural networks, and AI applications.',
                'duration': '2 years',
                'fees': 16000,
                'level': 'Postgraduate'
            },
            # National Science University
            {
                'university': 1,
                'name': 'Physics',
                'description': 'Explore the fundamental laws of nature through theoretical and experimental physics.',
                'duration': '4 years',
                'fees': 11000,
                'level': 'Undergraduate'
            },
            {
                'university': 1,
                'name': 'Quantum Computing',
                'description': 'Advanced study of quantum mechanics and its application to computing.',
                'duration': '2 years',
                'fees': 17000,
                'level': 'Postgraduate'
            },
            {
                'university': 1,
                'name': 'Biotechnology',
                'description': 'Study of biological processes applied to technology and product development.',
                'duration': '4 years',
                'fees': 13000,
                'level': 'Undergraduate'
            },
            # Global Business School
            {
                'university': 2,
                'name': 'Business Administration',
                'description': 'Learn management principles, finance, marketing, and business strategy.',
                'duration': '4 years',
                'fees': 14000,
                'level': 'Undergraduate'
            },
            {
                'university': 2,
                'name': 'MBA',
                'description': 'Master of Business Administration with focus on leadership and global business.',
                'duration': '2 years',
                'fees': 20000,
                'level': 'Postgraduate'
            },
            {
                'university': 2,
                'name': 'Finance',
                'description': 'Study of financial markets, investment strategies, and corporate finance.',
                'duration': '4 years',
                'fees': 13500,
                'level': 'Undergraduate'
            },
            # Arts and Humanities College
            {
                'university': 3,
                'name': 'English Literature',
                'description': 'Study of literary texts, critical theory, and writing.',
                'duration': '3 years',
                'fees': 9000,
                'level': 'Undergraduate'
            },
            {
                'university': 3,
                'name': 'Philosophy',
                'description': 'Exploration of philosophical ideas, ethics, and logic.',
                'duration': '3 years',
                'fees': 8500,
                'level': 'Undergraduate'
            },
            {
                'university': 3,
                'name': 'Creative Writing',
                'description': 'Develop skills in fiction, poetry, and creative non-fiction writing.',
                'duration': '2 years',
                'fees': 10000,
                'level': 'Postgraduate'
            },
            # Medical Sciences Institute
            {
                'university': 4,
                'name': 'Medicine',
                'description': 'Comprehensive medical education leading to becoming a doctor.',
                'duration': '6 years',
                'fees': 25000,
                'level': 'Undergraduate'
            },
            {
                'university': 4,
                'name': 'Nursing',
                'description': 'Training in patient care, medical procedures, and healthcare.',
                'duration': '4 years',
                'fees': 12000,
                'level': 'Undergraduate'
            },
            {
                'university': 4,
                'name': 'Pharmacology',
                'description': 'Study of drugs and their effects on biological systems.',
                'duration': '2 years',
                'fees': 14000,
                'level': 'Postgraduate'
            }
        ]

        # Create courses
        for course_data in courses_data:
            university = universities[course_data['university']]
            course, created = Course.objects.get_or_create(
                name=course_data['name'],
                university=university,
                defaults={
                    'description': course_data['description'],
                    'duration': course_data['duration'],
                    'fees': course_data['fees'],
                    'level': course_data['level']
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created course: {course.name} at {university.name}'))
        self.stdout.write(self.style.SUCCESS('Database population completed!'))
