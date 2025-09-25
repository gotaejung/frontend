import { useState } from 'react';
import { chatApi } from '../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadset } from '@fortawesome/free-solid-svg-icons';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: '안녕하세요! 네이버 클로바 챗봇입니다. 무엇을 도와드릴까요?', sender: 'bot' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = { id: Date.now(), text: inputMessage, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await chatApi.post('/chat', { message: messageToSend });
      const botMessage = {
        id: Date.now() + 1,
        text: response.data.reply || '응답을 받을 수 없습니다.',
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('챗봇 API 오류:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: '죄송합니다. 현재 챗봇 서비스에 문제가 있습니다. 잠시 후 다시 시도해주세요.',
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-yellow-500 text-black rounded-full shadow-lg z-50 flex items-center justify-center hover:bg-yellow-600 transition-colors duration-300"
      >
        <FontAwesomeIcon icon={faHeadset} size="lg" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-xl z-50 flex flex-col">
          <div className="bg-yellow-500 text-black p-4 rounded-t-lg">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">GOFLIX 챗봇</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-black hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] px-3 py-2 rounded-lg ${message.sender === 'user'
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-100 text-gray-800'
                  }`}>
                  <div className="text-sm leading-relaxed">
                    {message.text}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg">
                  <div className="flex items-center space-x-1">
                    <span>응답 중</span>
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-gray-600 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1 h-1 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="메시지를 입력하세요..."
                disabled={isLoading}
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-100"
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 font-medium">전송
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}