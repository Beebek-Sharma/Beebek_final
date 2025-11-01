@echo off
REM Course Data Loader Script for Windows
REM This script loads course data from JSON files into the Django database

echo ==========================================
echo   Course Data Loader for EduConnect
echo ==========================================
echo.

REM Change to backend directory
cd backend

REM Check if virtual environment exists
if not exist "..\\.venv" (
    echo ERROR: Virtual environment not found at ..\.venv
    echo Please create a virtual environment first
    pause
    exit /b 1
)

REM Activate virtual environment
echo Activating virtual environment...
call ..\.venv\Scripts\activate.bat

echo Virtual environment activated
echo.

REM Create the Django management command
echo Creating course data loader command...

(
echo import json
echo import os
echo from django.core.management.base import BaseCommand
echo from api.models import University, Course
echo.
echo class Command^(BaseCommand^):
echo     help = 'Load course data from JSON files in the root directory'
echo.
echo     def add_arguments^(self, parser^):
echo         parser.add_argument^(
echo             '--clear',
echo             action='store_true',
echo             help='Clear existing courses before loading',
echo         ^)
echo.
echo     def handle^(self, *args, **options^):
echo         # Path to root directory ^(where JSON files are located^)
echo         root_dir = os.path.dirname^(os.path.dirname^(os.path.dirname^(os.path.dirname^(os.path.abspath^(__file__^)^)^)^)^)
echo.        
echo         # JSON files to process
echo         json_files = [
echo             'mit.json',
echo             'harvard_courses.json',
echo             'stanford.json',
echo             'ioe_programs.json',
echo             'ku_programs.json'
echo         ]
echo.        
echo         if options['clear']:
echo             self.stdout.write^(self.style.WARNING^('Clearing existing courses...'^^)^)
echo             Course.objects.all^(^).delete^(^)
echo             self.stdout.write^(self.style.SUCCESS^('Courses cleared'^^)^)
echo.        
echo         total_created = 0
echo         total_updated = 0
echo.        
echo         for json_file in json_files:
echo             file_path = os.path.join^(root_dir, json_file^)
echo.            
echo             if not os.path.exists^(file_path^):
echo                 self.stdout.write^(self.style.WARNING^(f'File not found: {json_file}'^^)^)
echo                 continue
echo.            
echo             self.stdout.write^(f'\nProcessing {json_file}...'^^)
echo.            
echo             try:
echo                 with open^(file_path, 'r', encoding='utf-8'^) as f:
echo                     courses_data = json.load^(f^)
echo.                
echo                 for course_data in courses_data:
echo                     # Extract data from JSON
echo                     university_name = course_data.get^('university', ''^^)
echo                     course_name = course_data.get^('Course Name', course_data.get^('name', ''^^)^^)
echo                     description = course_data.get^('description', ''^^)
echo                     duration = course_data.get^('Duration', course_data.get^('duration', ''^^)^^)
echo                     fees_str = course_data.get^('Fees', course_data.get^('fees', '0'^^)^^)
echo                     level = course_data.get^('Level', course_data.get^('level', 'Undergraduate'^^)^^)
echo.                    
echo                     # Clean fees data ^(remove $ and commas^)
echo                     if isinstance^(fees_str, str^):
echo                         fees = float^(fees_str.replace^('$', ''^^).replace^(',', ''^^)^^)
echo                     else:
echo                         fees = float^(fees_str^)
echo.                    
echo                     # Get or create university
echo                     university, _ = University.objects.get_or_create^(
echo                         name=university_name,
echo                         defaults={
echo                             'description': f'{university_name} - A prestigious institution',
echo                             'location': 'United States',
echo                             'ranking': 1,
echo                             'website': f'https://www.{university_name.lower^(^).replace^(" ", ""^^)}.edu',
echo                         }
echo                     ^)
echo.                    
echo                     # Create or update course
echo                     course, created = Course.objects.update_or_create^(
echo                         name=course_name,
echo                         university=university,
echo                         defaults={
echo                             'description': description,
echo                             'duration': duration,
echo                             'fees': fees,
echo                             'level': level,
echo                         }
echo                     ^)
echo.                    
echo                     if created:
echo                         total_created += 1
echo                         self.stdout.write^(self.style.SUCCESS^(f'  Created: {course_name}'^^)^)
echo                     else:
echo                         total_updated += 1
echo                         self.stdout.write^(f'  Updated: {course_name}'^^)
echo.                        
echo             except json.JSONDecodeError as e:
echo                 self.stdout.write^(self.style.ERROR^(f'  JSON Error in {json_file}: {e}'^^)^)
echo             except Exception as e:
echo                 self.stdout.write^(self.style.ERROR^(f'  Error processing {json_file}: {e}'^^)^)
echo.        
echo         # Summary
echo         self.stdout.write^('\n' + '='*50^)
echo         self.stdout.write^(self.style.SUCCESS^(f'SUMMARY:'^^)^)
echo         self.stdout.write^(self.style.SUCCESS^(f'   Created: {total_created} courses'^^)^)
echo         self.stdout.write^(f'   Updated: {total_updated} courses'^^)
echo         self.stdout.write^(f'   Total Universities: {University.objects.count^(^)}'^^)
echo         self.stdout.write^(f'   Total Courses: {Course.objects.count^(^)}'^^)
echo         self.stdout.write^('='*50^)
) > api\management\commands\load_courses_json.py

echo Course loader command created
echo.

REM Run the Django command
echo Loading course data from JSON files...
echo.
python manage.py load_courses_json

echo.
echo ==========================================
echo   Course Data Loading Complete!
echo ==========================================
pause
