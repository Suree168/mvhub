import { useNavigate } from 'react-router-dom';
import { Film, Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center pt-20">
      <div className="text-center px-4">
        {/* 404 Animation */}
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <Film className="w-32 h-32 text-red-600" />
          </div>
        </div>

        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-4">
          ไม่พบหน้าที่คุณต้องการ
        </h1>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          หน้าที่คุณกำลังค้นหาอาจถูกย้าย ลบ หรือไม่มีอยู่ในระบบ
          ลองค้นหาหนังที่คุณต้องการหรือกลับไปหน้าแรก
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Button
            onClick={() => navigate('/')}
            className="bg-red-600 hover:bg-red-700 text-white px-6"
          >
            <Home className="w-5 h-5 mr-2" />
            กลับหน้าแรก
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/search')}
            className="border-white/30 text-white hover:bg-white/10 px-6"
          >
            <Search className="w-5 h-5 mr-2" />
            ค้นหาหนัง
          </Button>
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 flex justify-center gap-4 opacity-30">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse delay-100" />
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse delay-200" />
        </div>
      </div>
    </div>
  );
}
