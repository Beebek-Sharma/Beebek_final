"""
Demo script for the Chat Widget with fallback mode.
This script shows how the chat widget works in development mode.
"""
import os
import sys
import time
import json
from dotenv import load_dotenv

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load environment variables from .env
load_dotenv()

# Import Django settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
import django
django.setup()

# Import the models and client
from api.models import ChatSession, ChatMessage
from api.grok_client import grok_client

def create_test_session():
    """Create a test chat session with messages"""
    # Create a new session
    session = ChatSession.objects.create(session_id="test-session-123")
    
    # Add some messages
    messages = [
        {"role": "user", "content": "Hello, can you help me find a good university?"},
        {"role": "assistant", "content": "Of course! I'd be happy to help you find a university. What are you interested in studying?"},
        {"role": "user", "content": "I'm interested in computer science"},
    ]
    
    for msg in messages:
        ChatMessage.objects.create(
            session=session,
            role=msg["role"],
            content=msg["content"]
        )
    
    return session

def test_chat_with_fallback():
    """Test the chat functionality with fallback mode"""
    print("Testing chat with fallback mode...")
    
    # Create a test session
    session = create_test_session()
    print(f"Created test session with ID: {session.session_id}")
    
    # Get messages from the session
    history = list(session.messages.values('role', 'content'))
    print(f"Session has {len(history)} messages")
    
    # User message to send
    user_message = "What are the top universities for computer science?"
    print(f"\nSending user message: '{user_message}'")
    
    # Send to Grok client
    response = grok_client.send_message(history, user_message)
    
    # Print the response
    print("\nGot response:")
    print("-" * 60)
    print(response["reply"])
    print("-" * 60)
    
    # Check if we're in development mode
    is_dev_mode = 'development' in response.get('metadata', {}).get('model', '')
    print(f"Development mode: {'Yes' if is_dev_mode else 'No'}")
    
    # Store the response
    ChatMessage.objects.create(
        session=session,
        role='user',
        content=user_message
    )
    
    ChatMessage.objects.create(
        session=session,
        role='assistant',
        content=response["reply"]
    )
    
    # Verify the session was updated
    updated_history = list(session.messages.values_list('content', flat=True))
    print(f"\nFinal session has {len(updated_history)} messages")

if __name__ == "__main__":
    print("=" * 60)
    print("CHAT WIDGET FALLBACK MODE DEMO")
    print("=" * 60)
    print("This demo shows how the chat works in development mode")
    print("without requiring a valid Groq API key\n")
    
    # Run the test
    test_chat_with_fallback()
    
    print("\nDemo completed successfully!")
    print("=" * 60)