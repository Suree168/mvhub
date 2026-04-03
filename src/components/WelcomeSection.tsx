import { Play, Download, Monitor, Smartphone, Tv, MonitorPlay } from 'lucide-react';

const features = [
  {
    icon: MonitorPlay,
    title: 'ความคมชัดระดับ HD & 4K',
    description: 'ดูหนังด้วยความคมชัดสูงสุด ไม่มีสะดุด',
  },
  {
    icon: Play,
    title: 'ไม่มีโฆษณากวนใจ',
    description: 'สนุกกับการดูหนังแบบไม่มี interruptions',
  },
  {
    icon: Download,
    title: 'ดาวน์โหลดได้',
    description: 'ดาวน์โหลดหนังเก็บไว้ดูออฟไลน์ได้',
  },
  {
    icon: Monitor,
    title: 'รองรับทุกอุปกรณ์',
    description: 'ดูได้ทั้งมือถือ แท็บเล็ต คอมพิวเตอร์ และสมาร์ททีวี',
  },
];

export default function WelcomeSection() {
  return (
    <section className="py-12 lg:py-16 bg-gradient-to-b from-[#0a0a0a] to-[#0f0f0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Text */}
        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            ดูหนังออนไลน์ HD ดูฟรี ชื่อใหม่ MovieHub
          </h1>
          <p className="text-gray-400 max-w-3xl mx-auto mb-6">
            เว็บดูหนังฟรี หนังใหม่เต็มเรื่อง 2026 ท่านสามารถเลือกดูหนังได้หลากหลายรูปแบบ 
            ไม่ว่าจะเป็นหนังจาก Netflix, WeTV, IQIYi, Disney+, HBO, Amazon Prime 
            เรามีให้คุณดูฟรี ไม่ต้องเสียค่าบริการรายเดือน ไม่ต้องสมัครเป็นสมาชิกให้ยุ่งยาก
          </p>
          <p className="text-gray-400 max-w-3xl mx-auto">
            เข้ามาแล้วเซิร์ชชื่อหนังที่คุณต้องการแล้วเลือกดูได้เลย ไม่ว่าจะเป็น 
            หนังไทย หนังฝรั่ง หนังเกาหลี ทั้งเก่าและใหม่ เราก็มีให้ท่านเลือกดูครบ 
            ด้วยความชัดระดับ Full HD และ 4K
          </p>
        </div>

        {/* Device Support */}
        <div className="bg-[#141414] rounded-2xl p-6 lg:p-8 mb-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-lg font-semibold text-white mb-2">
                รองรับการดูบนทุกอุปกรณ์
              </h3>
              <p className="text-gray-400 text-sm">
                สำหรับคนที่ชอบดูหนังออนไลน์ผ่านมือถือ iPhone, Android หรือสมาร์ททีวี 
                เว็บของเราทำตัวเล่นหนังเพื่อมารองรับระบบตรงนี้โดยเฉพาะ
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-red-500" />
                </div>
                <span className="text-xs text-gray-400">มือถือ</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-red-500" />
                </div>
                <span className="text-xs text-gray-400">คอมพิวเตอร์</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                  <Tv className="w-6 h-6 text-red-500" />
                </div>
                <span className="text-xs text-gray-400">สมาร์ททีวี</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-[#141414] rounded-xl p-6 hover:bg-[#1a1a1a] transition-colors"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
