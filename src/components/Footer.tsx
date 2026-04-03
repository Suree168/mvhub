import { Link } from 'react-router-dom';
import { Film, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  movies: [
    { name: 'หนังใหม่ 2026', href: '/category/new-2026' },
    { name: 'หนังชนโรง', href: '/category/theaters' },
    { name: 'หนังการ์ตูน', href: '/category/animation' },
    { name: 'หนังไทย', href: '/category/thai' },
    { name: 'หนังฝรั่ง', href: '/category/western' },
  ],
  series: [
    { name: 'ซีรี่ย์เกาหลี', href: '/category/korean' },
    { name: 'ซีรี่ย์จีน', href: '/category/chinese' },
    { name: 'ซีรี่ย์ฝรั่ง', href: '/category/series' },
    { name: 'ซีรี่ย์ญี่ปุ่น', href: '/category/japanese' },
    { name: 'ซีรี่ย์ไทย', href: '/category/thai-series' },
  ],
  support: [
    { name: 'ติดต่อเรา', href: '/contact' },
    { name: 'แจ้งปัญหา', href: '/report' },
    { name: 'คำถามที่พบบ่อย', href: '/faq' },
    { name: 'นโยบายความเป็นส่วนตัว', href: '/privacy' },
    { name: 'เงื่อนไขการใช้งาน', href: '/terms' },
  ],
};

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'YouTube', icon: Youtube, href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
                <Film className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">MovieHub</span>
                <span className="text-xs text-red-500 block -mt-1">ดูหนังออนไลน์</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm mb-6 max-w-sm">
              เว็บดูหนังออนไลน์ฟรี ดูหนังใหม่ ดูหนังชนโรง ดูหนัง Netflix ดูซีรี่ย์ ครบจบในที่เดียว 
              ความคมชัดระดับ HD และ 4K ไม่มีโฆษณากวนใจ
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="w-4 h-4" />
                <span>contact@moviehub.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="w-4 h-4" />
                <span>02-xxx-xxxx</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>กรุงเทพมหานคร, ประเทศไทย</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-white/5 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5 text-gray-400 hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Movies Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">หนังยอดนิยม</h3>
            <ul className="space-y-2">
              {footerLinks.movies.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-red-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Series Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">ซีรี่ย์ยอดนิยม</h3>
            <ul className="space-y-2">
              {footerLinks.series.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-red-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">ช่วยเหลือ</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-red-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 text-center md:text-left">
              © 2026 MovieHub. สงวนลิขสิทธิ์ทั้งหมด
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>เวอร์ชั่น 1.0.0</span>
              <span>|</span>
              <span>Made with ❤️ in Thailand</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
