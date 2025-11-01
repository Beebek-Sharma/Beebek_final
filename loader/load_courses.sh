#!/bin/bash

# Course Data Loader Script
# This script loads course data from JSON files into the Django database

echo "=========================================="
echo "  Course Data Loader for EduConnect"
echo "=========================================="
echo ""

# Change to backend directory
cd backend

# Check if virtual environment exists
if [ ! -d "../.venv" ]; then
    echo "❌ Virtual environment not found at ../.venv"
    echo "Please create a virtual environment first"
    exit 1
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source ../.venv/Scripts/activate

# Check if Django is installed
if ! python -c "import django" 2>/dev/null; then
    echo "❌ Django is not installed in the virtual environment"
    echo "Please run: pip install -r requirements.txt"
    exit 1
fi

echo "✅ Virtual environment activated"
echo ""

# Create a custom Django management command to load JSON data
echo "📝 Creating course data loader command..."

cat > api/management/commands/load_courses_json.py << 'PYEOF'
import json
import os
from django.core.management.base import BaseCommand
from api.models import University, Course

class Command(BaseCommand):
    help = 'Load course data from JSON files in the root directory'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing courses before loading',
        )

    def handle(self, *args, **options):
        # Path to root directory (where JSON files are located)
        root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
        
        # JSON files to process
        json_files = [
            'mit.json',
            'harvard_courses.json',
            'stanford.json',
            'ioe_programs.json',
            'ku_programs.json'
        ]
        
        if options['clear']:
            self.stdout.write(self.style.WARNING('🗑️  Clearing existing courses...'))
            Course.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('✅ Courses cleared'))
        
        total_created = 0
        total_updated = 0
        total_skipped = 0
        
        for json_file in json_files:
            file_path = os.path.join(root_dir, json_file)
            
            if not os.path.exists(file_path):
                self.stdout.write(self.style.WARNING(f'⚠️  File not found: {json_file}'))
                continue
            
            self.stdout.write(f'\n📂 Processing {json_file}...')
            
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    courses_data = json.load(f)
                
                for course_data in courses_data:
                    # Extract data from JSON
                    university_name = course_data.get('university', '')
                    course_name = course_data.get('Course Name', course_data.get('name', ''))
                    description = course_data.get('description', '')
                    duration = course_data.get('Duration', course_data.get('duration', ''))
                    fees_str = course_data.get('Fees', course_data.get('fees', '0'))
                    level = course_data.get('Level', course_data.get('level', 'Undergraduate'))
                    
                    # Clean fees data (remove $ and commas)
                    if isinstance(fees_str, str):
                        fees = float(fees_str.replace('$', '').replace(',', ''))
                    else:
                        fees = float(fees_str)
                    
                    # Get or create university
                    university, _ = University.objects.get_or_create(
                        name=university_name,
                        defaults={
                            'description': f'{university_name} - A prestigious institution',
                            'location': 'United States',
                            'ranking': 1,
                            'website': f'https://www.{university_name.lower().replace(" ", "")}.edu',
                        }
                    )
                    
                    # Create or update course
                    course, created = Course.objects.update_or_create(
                        name=course_name,
                        university=university,
                        defaults={
                            'description': description,
                            'duration': duration,
                            'fees': fees,
                            'level': level,
                        }
                    )
                    
                    if created:
                        total_created += 1
                        self.stdout.write(self.style.SUCCESS(f'  ✅ Created: {course_name}'))
                    else:
                        total_updated += 1
                        self.stdout.write(f'  🔄 Updated: {course_name}')
                        
            except json.JSONDecodeError as e:
                self.stdout.write(self.style.ERROR(f'  ❌ JSON Error in {json_file}: {e}'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'  ❌ Error processing {json_file}: {e}'))
        
        # Summary
        self.stdout.write('\n' + '='*50)
        self.stdout.write(self.style.SUCCESS(f'📊 SUMMARY:'))
        self.stdout.write(self.style.SUCCESS(f'   ✅ Created: {total_created} courses'))
        self.stdout.write(f'   🔄 Updated: {total_updated} courses')
        self.stdout.write(f'   📚 Total Universities: {University.objects.count()}')
        self.stdout.write(f'   📖 Total Courses: {Course.objects.count()}')
        self.stdout.write('='*50)
PYEOF

echo "✅ Course loader command created"
echo ""

# Run the Django command
echo "🚀 Loading course data from JSON files..."
echo ""
python manage.py load_courses_json

echo ""
echo "=========================================="
echo "  ✅ Course Data Loading Complete!"
echo "=========================================="
