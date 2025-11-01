# Course Data Loader

This directory contains scripts to load course data from JSON files into the EduConnect database.

## 📁 Available JSON Data Files

- `mit.json` - MIT courses
- `harvard_courses.json` - Harvard courses
- `stanford.json` - Stanford courses
- `ioe_programs.json` - IOE programs
- `ku_programs.json` - KU programs

## 🚀 How to Load Course Data

### Method 1: Using Python Script (Recommended)

**Windows:**
```bash
# Run the batch file
run_load_courses.bat

# OR run Python directly
python load_courses.py
```

**Linux/Mac:**
```bash
# Make sure virtual environment is activated
source .venv/bin/activate

# Run the Python script
python load_courses.py
```

### Method 2: Using Django Management Command

If you prefer to use Django's management command system:

```bash
cd backend
python manage.py loaddata courses
```

## 📊 What Gets Loaded

The script will:
1. ✅ Create universities if they don't exist
2. ✅ Create new courses
3. 🔄 Update existing courses (if name matches)
4. 📈 Show a summary of what was created/updated

## 🗑️ Clearing Existing Data

When you run `load_courses.py`, you'll be prompted:
```
🗑️  Clear existing courses before loading? (y/N):
```

- Type `y` to delete all existing courses before loading
- Type `n` (or just press Enter) to keep existing courses and update/add new ones

## 📝 Course Data Format

Each JSON file should contain an array of course objects with this structure:

```json
[
  {
    "Course Name": "Course Title",
    "description": "Course description",
    "university": "University Name",
    "Fees": "$50,000",
    "Duration": "4 years",
    "Level": "Undergraduate"
  }
]
```

**Supported field names:**
- Course Name / name
- Fees / fees
- Duration / duration
- Level / level

## ✅ Recent Load Results

Last successful load:
- ✅ Created: 96 courses
- 🔄 Updated: 2 courses
- 🏛️  Total Universities: 10
- 📖 Total Courses: 96

## 🛠️ Troubleshooting

### Virtual Environment Not Found
```bash
# Create a virtual environment
python -m venv .venv

# Activate it (Windows)
.venv\Scripts\activate

# Activate it (Linux/Mac)
source .venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt
```

### Django Import Error
```bash
cd backend
pip install -r requirements.txt
```

### File Not Found
Make sure all JSON files are in the root directory (same level as `load_courses.py`)

## 📚 Adding New Course Data

1. Create a new JSON file in the root directory
2. Follow the course data format above
3. Add the filename to `load_courses.py` in the `json_files` list:

```python
json_files = [
    'mit.json',
    'harvard_courses.json',
    'stanford.json',
    'ioe_programs.json',
    'ku_programs.json',
    'your_new_file.json',  # Add here
]
```

4. Run the loader script again

## 📞 Support

If you encounter any issues, check:
- Virtual environment is activated
- Django is properly installed
- Database migrations are up to date (`python manage.py migrate`)
- JSON files are valid (use a JSON validator)
