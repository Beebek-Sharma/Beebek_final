"""
Grok AI Client for integration with the Django backend.
This module encapsulates the logic for communicating with the Groq AI API.
"""
import os
import time
import random
from typing import List, Dict, Any
from django.conf import settings

# Use the official Groq client
try:
    from groq import Groq
except ImportError:
    Groq = None

class GrokClient:
    """Client for interacting with the Groq AI API using official Groq client"""
    def __init__(self):
        self.api_key = os.environ.get('GROK_API_KEY')
        self.model = os.environ.get('GROK_MODEL_NAME', 'llama-3.1-8b-instant')
        
        if not self.api_key:
            print("Warning: GROK_API_KEY not found in environment, using development mode")
        if Groq:
            # Initialize Groq client with API key from environment
            self.client = Groq(api_key=self.api_key)
        else:
            self.client = None
            
        self.system_prompt = (
            "You are a friendly and helpful assistant for the educational platform. "
            "Be professional, concise, and helpful. You can answer questions about "
            "educational topics, universities, courses, and the website itself. "
            "If you don't know something, be honest and suggest contacting support."
        )

    def _build_messages(self, session_history: List[Dict[str, str]], user_message: str) -> List[Dict[str, str]]:
        """
        Build the messages array to send to the Grok API.
        
        Args:
            session_history: List of previous messages in the conversation
            user_message: The current user message
            
        Returns:
            List of formatted messages for the API
        """
        # Start with system prompt
        messages = [{"role": "system", "content": self.system_prompt}]
        
        # Add conversation history (limit to last 10 messages to avoid context overflow)
        for msg in session_history[-10:]:
            messages.append({"role": msg["role"], "content": msg["content"]})
            
        # Add the current user message
        messages.append({"role": "user", "content": user_message})
        
        return messages

    def send_message(self, session_history: List[Dict[str, str]], user_message: str) -> Dict[str, Any]:
        """
        Send a message to the Grok API and get the response.
        
        Args:
            session_history: List of previous messages in the conversation
            user_message: The current user message
            
        Returns:
            Dictionary with the assistant's reply and metadata
        """
        messages = self._build_messages(session_history, user_message)
        if not self.api_key or not self.client or not Groq:
            # Fallback for development mode
            import time, random
            print(f"Using fallback response (API key: {'present' if self.api_key else 'missing'}, Client: {'initialized' if self.client else 'not initialized'})")
            mock_replies = [
                "This is a development mode response. In production, this would come from the Groq AI API.",
                "I'm running in development mode. When deployed with a valid API key, I'll provide real AI responses.",
                "Since we're in development mode without an API key, I'm returning this placeholder response.",
                "Hello! I'm the chat assistant (in development mode). I'll be powered by Groq AI in production."
            ]
            return {
                "reply": random.choice(mock_replies),
                "metadata": {
                    "model": "development-mode",
                    "usage": {},
                    "created": int(time.time())
                }
            }
        try:
            # Try to use the Groq API
            print(f"Attempting to use Groq API with model: {self.model}")
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=1000,
            )
            return {
                "reply": completion.choices[0].message.content,
                "metadata": {
                    "model": self.model,
                    "usage": getattr(completion, "usage", {}),
                    "created": getattr(completion, "created", None)
                }
            }
        except Exception as e:
            print(f"Error communicating with Groq API: {str(e)}")
            print("Falling back to development mode response")
            
            # Enhanced fallback with context-aware responses
            import time, random
            
            # Generate a more contextual response based on the user's question
            question_keywords = {
                "course": ["We offer various courses across different disciplines. In production, I could provide specific course details."],
                "university": ["Our platform features information about top universities. With a working API, I could provide details about specific institutions."],
                "how": ["I'd be happy to explain that in detail when my API connection is working. For now, this is a placeholder response."],
                "what": ["That's a great question! When connected to the Groq API, I'll provide a detailed answer."],
                "help": ["I'm here to help! Once my API connection is working, I'll be able to provide more specific assistance."],
            }
            
            # Check if any keywords match the user message
            for keyword, responses in question_keywords.items():
                if keyword.lower() in user_message.lower():
                    return {
                        "reply": random.choice(responses),
                        "metadata": {
                            "model": "development-fallback",
                            "usage": {},
                            "created": int(time.time())
                        }
                    }
            
            # Default fallback responses
            fallback_replies = [
                "I'm sorry, I'm having trouble connecting to my knowledge source. Please try again in a moment.",
                "My AI services are currently in development mode. In production, I'll provide detailed responses to your questions.",
                "I'm running with limited capabilities right now. Once the API connection is working, I'll be able to answer that properly.",
            ]
            
            return {
                "reply": random.choice(fallback_replies),
                "metadata": {"error": "connection_error", "model": "development-fallback"}
            }

# Singleton instance
grok_client = GrokClient()