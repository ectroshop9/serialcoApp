import { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './ChatBot.css';

const API = 'https://serialcotv.onrender.com';

// ✅ أنواع TypeScript
interface Message {
  id: number;
  type: 'bot' | 'user';
  text: string;
  buttons?: string[] | null;
}

interface PackageData {
  id: number;
  name: string;
  tokens_limit: number;
  price: string;
}

const BUTTON_STYLES: Array<{ prefix: string; bg: string; color: string; border: string }> = [
  { prefix: '🛍️', bg: '#dbeafe', color: '#1d4ed8', border: '1px solid #93c5fd' },
  { prefix: '🔑', bg: '#fef3c7', color: '#b45309', border: '1px solid #fcd34d' },
  { prefix: '💰', bg: '#d1fae5', color: '#047857', border: '1px solid #6ee7b7' },
  { prefix: '❓', bg: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' },
  { prefix: '🔙', bg: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }
];

const getButtonStyle = (btnText: string): { bg: string; color: string; border: string } => {
  const match = BUTTON_STYLES.find(style => btnText.includes(style.prefix));
  return match || { bg: '#3b82f6', color: '#fff', border: 'none' };
};

const MAIN_MENU: Message = {
  id: 1,
  type: 'bot',
  text: '👋 أهلاً بك في SerialCo! كيف يمكنني مساعدتك؟',
  buttons: [
    '🛍️ تصفح الباقات',
    '🔑 التحقق من سيريال',
    '💰 رصيدي',
    '❓ مساعدة'
  ]
};

const HELP_MENU: Message = {
  id: 2,
  type: 'bot',
  text: '❓ كيف يمكننا مساعدتك؟',
  buttons: [
    '📞 اتصل بنا',
    '🔙 القائمة الرئيسية'
  ]
};

export default function ChatBot() {
  const { user, isAuthenticated } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([MAIN_MENU]);
  const [input, setInput] = useState<string>('');
  const [typing, setTyping] = useState<boolean>(false);
  const [awaitingState, setAwaitingState] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const addMessage = (type: 'bot' | 'user', text: string, buttons: string[] | null = null): void => {
    setMessages(prev => [...prev, { id: Date.now(), type, text, buttons }]);
  };

  const botTyping = async (delay: number = 800): Promise<void> => {
    setTyping(true);
    await new Promise(r => setTimeout(r, delay));
    setTyping(false);
  };

  const fetchPackages = async (): Promise<PackageData[]> => {
    try {
      const res = await fetch(`${API}/api/serials/packages/`);
      const data = await res.json();
      return data.packages || [];
    } catch {
      return [];
    }
  };

  const checkSerial = async (serialNumber: string, pin: string): Promise<any> => {
    try {
      const res = await fetch(`${API}/api/serials/check/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serial_number: serialNumber, pin })
      });
      return await res.json();
    } catch {
      return { success: false, message: 'خطأ في الاتصال' };
    }
  };

  const activateSerial = async (serialNumber: string, pin: string): Promise<any> => {
    if (!user) return { success: false, message: 'يجب تسجيل الدخول أولاً' };
    
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(`${API}/api/serials/activate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ serial_number: serialNumber, pin, customer_id: user.id })
      });
      return await res.json();
    } catch {
      return { success: false, message: 'خطأ في الاتصال' };
    }
  };

  const showMainMenu = async (): Promise<void> => {
    setAwaitingState(null);
    await botTyping(400);
    addMessage('bot', MAIN_MENU.text, MAIN_MENU.buttons || null);
  };

  const showHelpMenu = async (): Promise<void> => {
    await botTyping(400);
    addMessage('bot', HELP_MENU.text, HELP_MENU.buttons || null);
  };

  const handleSend = async (text: string): Promise<void> => {
    const messageText = text || input.trim();
    if (!messageText) return;

    addMessage('user', messageText);
    setInput('');

    if (awaitingState === 'serial_check') {
      const parts = messageText.trim().split(/[\s-]+/);
      if (parts.length < 2) {
        await botTyping();
        addMessage('bot', '❌ يرجى إرسال السيريال والبين هكذا:\nSC12345678901234 1234', ['🔙 القائمة الرئيسية']);
        setAwaitingState(null);
        return;
      }
      
      const serialNumber = parts[0];
      const pin = parts[parts.length - 1];
      
      await botTyping();
      const data = await checkSerial(serialNumber, pin);
      
      if (data.success) {
        addMessage('bot', `✅ السيريال صحيح!\n\n📦 الباقة: ${data.serial?.package || 'غير معروف'}\n💰 التوكنز المتبقية: ${data.serial?.tokens_remaining || 0}`, ['🔑 تفعيل السيريال', '🔙 القائمة الرئيسية']);
      } else {
        addMessage('bot', `❌ ${data.message || 'سيريال غير صحيح'}`, ['🔑 التحقق من سيريال', '🔙 القائمة الرئيسية']);
      }
      setAwaitingState(null);
      return;
    }

    if (awaitingState === 'serial_activate') {
      const parts = messageText.trim().split(/[\s-]+/);
      if (parts.length < 2) {
        await botTyping();
        addMessage('bot', '❌ يرجى إرسال السيريال والبين', ['🔙 القائمة الرئيسية']);
        setAwaitingState(null);
        return;
      }
      
      const serialNumber = parts[0];
      const pin = parts[parts.length - 1];
      
      await botTyping();
      const data = await activateSerial(serialNumber, pin);
      
      if (data.success) {
        addMessage('bot', `✅ تم تفعيل السيريال!\n💰 التوكنز: ${data.serial?.tokens_remaining || 0}`, ['💰 رصيدي', '🔙 القائمة الرئيسية']);
      } else {
        addMessage('bot', `❌ ${data.message || 'فشل التفعيل'}`, ['🔙 القائمة الرئيسية']);
      }
      setAwaitingState(null);
      return;
    }

    if (messageText.includes('تصفح الباقات')) {
      await botTyping();
      const packages = await fetchPackages();
      
      if (packages.length > 0) {
        let pkgText = '🛍️ الباقات المتاحة:\n\n';
        packages.forEach(p => {
          pkgText += `📦 ${p.name}\n💰 ${p.price} دج\n🔑 ${p.tokens_limit} توكن\n\n`;
        });
        addMessage('bot', pkgText, ['🔑 التحقق من سيريال', '🔙 القائمة الرئيسية']);
      } else {
        addMessage('bot', '❌ لا توجد باقات متاحة حالياً', ['🔙 القائمة الرئيسية']);
      }
      return;
    }

    if (messageText.includes('التحقق من سيريال')) {
      setAwaitingState('serial_check');
      await botTyping();
      addMessage('bot', '🔑 أرسل السيريال والبين هكذا:\nSC12345678901234 1234');
      return;
    }

    if (messageText.includes('تفعيل السيريال')) {
      if (!isAuthenticated) {
        await botTyping();
        addMessage('bot', '❌ يجب تسجيل الدخول أولاً لتفعيل السيريال', ['🔙 القائمة الرئيسية']);
        return;
      }
      setAwaitingState('serial_activate');
      await botTyping();
      addMessage('bot', '🔑 أرسل السيريال والبين للتفعيل:');
      return;
    }

    if (messageText.includes('رصيدي')) {
      if (!isAuthenticated || !user) {
        await botTyping();
        addMessage('bot', '❌ يجب تسجيل الدخول لعرض رصيدك', ['🔙 القائمة الرئيسية']);
        return;
      }
      await botTyping();
      addMessage('bot', `💰 رصيدك الحالي:\n\n👤 ${user.name}`, ['🔙 القائمة الرئيسية']);
      return;
    }

    if (messageText.includes('مساعدة')) {
      await showHelpMenu();
      return;
    }

    if (messageText.includes('اتصل بنا')) {
      await botTyping();
      addMessage('bot', '📞 تواصل معنا:\n📱 الهاتف: 0673310066\n📧 الإيميل: contact@serialco.tv', ['🔙 القائمة الرئيسية']);
      return;
    }

    if (messageText.includes('القائمة الرئيسية')) {
      await showMainMenu();
      return;
    }

    if (['سلام', 'مرحبا', 'اهلا', 'hi', 'hello'].some(g => messageText.toLowerCase().includes(g))) {
      await showMainMenu();
      return;
    }
  };

  const clearChat = (): void => {
    setAwaitingState(null);
    setMessages([MAIN_MENU]);
  };

  return (
    <div dir="rtl" className="serialco-chatbot-wrapper">
      <button onClick={() => setOpen(!open)} className="chatbot-toggle" aria-label="افتح الشات بوت">
        {open ? <X size={26} /> : <Bot size={26} />}
      </button>

      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <Bot size={24} />
            <div className="header-info">
              <span className="bot-title">SerialCo Bot</span>
              <span className="bot-status">🟢 متصل الآن</span>
            </div>
            <button onClick={clearChat} className="clear-btn" title="مسح المحادثة">
              <Trash2 size={14} />
            </button>
          </div>

          <div className="chatbot-body">
            {messages.map(msg => (
              <div key={msg.id} className="message-row">
                {msg.text && <div className={`msg-bubble ${msg.type}`}>{msg.text}</div>}
                {msg.buttons && msg.buttons.length > 0 && (
                  <div className="buttons-group">
                    {msg.buttons.map((btn, i) => {
                      const style = getButtonStyle(btn);
                      return (
                        <button key={i} onClick={() => handleSend(btn)} style={{ backgroundColor: style.bg, color: style.color, border: style.border }}>
                          {btn}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
            {typing && <div className="typing-indicator">...</div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-footer">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend(input)} placeholder="اكتب رسالتك..." />
            <button onClick={() => handleSend(input)} aria-label="إرسال"><Send size={18} /></button>
          </div>
        </div>
      )}
    </div>
  );
}