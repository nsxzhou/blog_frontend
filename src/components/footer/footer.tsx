export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-6 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          {/* 版权信息 */}
          <div className="text-gray-600 text-sm">
            <p className="flex items-center space-x-1">
              <span>©</span>
              <span>{currentYear}</span>
              <span>NSXZ 溺水寻舟的博客</span>
              <span className="hidden md:inline">|</span>
              <span>All rights reserved</span>
            </p>
          </div>

          {/* ICP备案信息 */}
          <div className="text-gray-500 text-sm">
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-700 transition-colors">
              备案号：赣ICP备2025054533号-1
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
