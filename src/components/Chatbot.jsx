import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Bot, User, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserChatbotApi } from '../api/UserApi';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: "Hi! I'm your travel assistant. Select a question below to get started!",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const fixedQuestions = [
    "Find me the best family-friendly vacation spots",
    "What are the best places for adventure travel?",
    "I love beaches, suggest some tropical getaways",
    "Show me destinations known for their food and culture",
    "Help me plan a budget-friendly trip",
    "What is the best way to spend a weekend?",
    "Search for hotels",
    "Find the cheapest flights",
    "What are the best deals on vacation packages?",
    "Show me available resorts with a swimming pool",
    "Book a tour guide",
    "I'm interested in history, plan a historical tour",
    "What are the must-see attractions?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuestionClick = (question) => {
    // Check if question needs date selection
    if (question.toLowerCase().includes('hotel') || question.toLowerCase().includes('flight') || question.toLowerCase().includes('check availability')) {
      setSelectedQuestion(question);
      setShowDatePicker(true);
    } else {
      handleSendMessage(question);
    }
  };

  const handleDateConfirm = () => {
    if (selectedQuestion && selectedDate) {
      const questionWithDate = `${selectedQuestion} on ${selectedDate}`;
      handleSendMessage(questionWithDate);
      setShowDatePicker(false);
      setSelectedDate('');
      setSelectedQuestion(null);
    }
  };

  const handleSendMessage = async (question) => {
    if (!question) return;

    // Add user message
    const userMessage = {
      type: 'user',
      content: question,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Extract location/destination from question - improved regex
      let location = null;
      const locationPatterns = [
        /(?:in|to|for|at)\s+([A-Z][a-zA-Z\s]{2,30}?)(?:\s|$|,|\.|for|with|on)/,
        /(?:destination|location|place|city|country)\s+(?:is\s+)?([A-Z][a-zA-Z\s]{2,30}?)(?:\s|$|,|\.)/i,
        /\[([A-Z][a-zA-Z\s]+?)\]/ // Matches [City/Country] format
      ];
      
      for (const pattern of locationPatterns) {
        const match = question.match(pattern);
        if (match) {
          location = match[1].trim();
          break;
        }
      }
      
      // Extract date if mentioned
      const dateMatch = question.match(/on\s+(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})/i);
      const extractedDate = dateMatch ? dateMatch[1] : null;
      
      // Extract hotel name if mentioned
      const hotelMatch = question.match(/(?:hotel|resort)\s+(?:name\s+)?([A-Z][a-zA-Z\s]{2,30}?)(?:\s|$|,|\.|on|for)/i);
      const hotelName = hotelMatch ? hotelMatch[1].trim() : null;

      // Extract from/to for flights
      const fromMatch = question.match(/from\s+([A-Z][a-zA-Z\s]{2,30}?)(?:\s+to|\s|$|,|\.)/i);
      const toMatch = question.match(/to\s+([A-Z][a-zA-Z\s]{2,30}?)(?:\s|$|,|\.|for)/i);
      const from = fromMatch ? fromMatch[1].trim() : null;
      const to = toMatch ? toMatch[1].trim() : null;

      const response = await UserChatbotApi(
        question,
        location,
        location, // destination
        location, // city
        hotelName,
        from,
        to
      );

      // Add bot response
      const botMessage = {
        type: 'bot',
        content: response.message,
        data: response.data || [],
        dataType: response.type,
        route: response.route,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);

      // If there's data and a route, show option to navigate
      if (response.data && response.data.length > 0 && response.route) {
        const navigateMessage = {
          type: 'bot',
          content: `Found ${response.data.length} result(s). Would you like to view them?`,
          action: 'navigate',
          route: response.route,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, navigateMessage]);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = {
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again or rephrase your question.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (route) => {
    navigate(route);
    setIsOpen(false);
  };

  const handleReset = () => {
    setMessages([
      {
        type: 'bot',
        content: "Hi! I'm your travel assistant. Select a question below to get started!",
        timestamp: new Date()
      }
    ]);
    setShowDatePicker(false);
    setSelectedDate('');
    setSelectedQuestion(null);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 animate-bounce"
        aria-label="Open chatbot"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 w-96 h-[700px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <h3 className="font-semibold">Travel Assistant</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:bg-white/20 rounded-full p-1 transition-colors"
          aria-label="Close chatbot"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-3 ${
                msg.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 shadow-md border border-gray-200'
              }`}
            >
              <div className="flex items-start gap-2">
                {msg.type === 'bot' && <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                {msg.type === 'user' && <User className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                <div className="flex-1">
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  {msg.action === 'navigate' && msg.route && (
                    <button
                      onClick={() => handleNavigate(msg.route)}
                      className="mt-2 text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
                    >
                      View Results →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl p-3 shadow-md border border-gray-200">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <div className="bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full mx-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">Select Date</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">{selectedQuestion}</p>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              min={new Date().toISOString().split('T')[0]}
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowDatePicker(false);
                  setSelectedDate('');
                  setSelectedQuestion(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDateConfirm}
                disabled={!selectedDate}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Questions */}
      <div className="px-4 py-4 bg-gray-50 border-t border-gray-200 overflow-y-auto max-h-64">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-700 font-semibold">Quick Questions:</p>
          {messages.length > 1 && (
            <button
              onClick={handleReset}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Reset
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-2">
          {fixedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleQuestionClick(q)}
              disabled={isLoading}
              className="text-left text-sm bg-white text-gray-700 px-4 py-3 rounded-lg border border-gray-300 hover:bg-blue-50 hover:border-blue-400 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

