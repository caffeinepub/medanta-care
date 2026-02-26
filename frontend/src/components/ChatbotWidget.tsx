import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

interface Message {
  id: number;
  type: 'user' | 'bot';
  text: string;
}

const FAQ_ITEMS = [
  {
    question: 'How fast is delivery?',
    answer: '⚡ We deliver in 30–60 minutes across all areas of Varanasi! For emergency medicines, we prioritize your order.',
  },
  {
    question: 'How do I upload a prescription?',
    answer: '📋 During checkout, Step 2 allows you to upload your prescription image. Simply click "Upload Prescription" and select your file. Our pharmacist will verify it before confirming your order.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: '💳 We accept Cash on Delivery (COD), UPI payments, and Card payments. All transactions are secure.',
  },
  {
    question: 'Which areas do you serve?',
    answer: '📍 We serve all major areas of Varanasi including Lanka, Sigra, Bhelupur, Cantt, Assi, Mahmoorganj, and Godowlia.',
  },
  {
    question: 'Are your medicines genuine?',
    answer: '✅ Yes! All medicines are 100% genuine, sourced directly from licensed distributors. We are a registered pharmacy with verified pharmacists.',
  },
];

let msgCounter = 0;

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: ++msgCounter,
      type: 'bot',
      text: '👋 Hi! I\'m MEDANTA CARE\'s assistant. How can I help you today? Choose a question below or type your query.',
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleFAQ = (item: typeof FAQ_ITEMS[0]) => {
    const userMsg: Message = { id: ++msgCounter, type: 'user', text: item.question };
    const botMsg: Message = { id: ++msgCounter, type: 'bot', text: item.answer };
    setMessages(prev => [...prev, userMsg, botMsg]);
  };

  return (
    <>
      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-card-hover border border-gray-100 flex flex-col overflow-hidden animate-slide-in">
          {/* Header */}
          <div className="bg-medanta-navy px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-medanta-orange flex items-center justify-center">
                <MessageCircle size={16} className="text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">MEDANTA CARE</p>
                <p className="text-white/60 text-xs">Support Assistant</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-72 bg-gray-50">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.type === 'user'
                      ? 'bg-medanta-orange text-white rounded-br-sm'
                      : 'bg-white text-gray-700 shadow-xs border border-gray-100 rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* FAQ Buttons */}
          <div className="p-3 border-t border-gray-100 bg-white">
            <p className="text-xs text-gray-500 mb-2 font-medium">Quick Questions:</p>
            <div className="space-y-1.5">
              {FAQ_ITEMS.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleFAQ(item)}
                  className="w-full text-left text-xs px-3 py-2 rounded-lg bg-medanta-grey hover:bg-medanta-navy hover:text-white text-gray-700 transition-all duration-150 border border-gray-100"
                >
                  {item.question}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chat Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-medanta-purple hover:bg-purple-700 text-white rounded-full flex items-center justify-center shadow-purple hover:shadow-xl transition-all duration-200 hover:scale-110"
        aria-label="Open chat support"
        style={{ bottom: '5.5rem' }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </>
  );
}
