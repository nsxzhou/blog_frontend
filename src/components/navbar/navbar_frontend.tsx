import { Layout, Menu, Button } from "antd";
import { useEffect, useState } from "react";
import { message } from "antd";
import { QQLoginUrl } from "../../api/user";
import { QqOutlined } from "@ant-design/icons";
import { Logout } from "../../api/user";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "@/store/slice";
import { useSelector } from "react-redux";
import { LogoutOutlined } from "@ant-design/icons";
import { RootState } from '@/store/index';

const { Header } = Layout;

export const NavbarFrontend = () => {
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.web.user.isLogin);

  // 监听滚动事件，实现导航栏滚动效果
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { label: "首页", key: "/", path: "/" },
    { label: "归档", key: "/archives", path: "/archives" },
    { label: "关于", key: "/about", path: "/about" },
  ];

  const menuItems = navItems.map((item) => ({
    key: item.key,
    label: (
      <a
        href={item.path}
        className={`relative group overflow-hidden px-2 py-1 text-gray-600 hover:text-blue-600 transition-colors duration-300`}>
        <span className="relative z-10 font-mono tracking-wider font-semibold">{item.label}</span>
        <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-300"></span>
        <span className="absolute top-0 right-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-300 delay-100"></span>
      </a>
    ),
  }));

  const handleQQLogin = async () => {
    try {
      sessionStorage.setItem("prevPath", window.location.pathname);
      const response = await QQLoginUrl();
      if (response.code == 0) {
        window.location.href = response.data.url;
      } else {
        message.error("获取QQ登录链接失败");
      }
    } catch (error) {
      console.error("QQ登录请求失败:", error);
      message.error("获取QQ登录链接失败");
    }
  };

  const handleLogout = () => {
    navigate("/");
    setTimeout(async () => {
      const res = await Logout();
      if (res.code === 0) {
        dispatch(logout());
        message.success("注销成功");
      } else {
        message.error(res.message);
      }
    }, 100);
  };

  return (
    <Header
      className={`${scrolled ? 'backdrop-blur-md bg-white/90' : 'bg-white'
        } transition-all duration-300 before:content-[''] before:absolute before:inset-0 before:z-[-1] ${scrolled
          ? 'before:bg-white/90 before:backdrop-blur-md'
          : 'before:bg-white'
        }`}
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 100,
        padding: "0 35px",
        borderBottom: scrolled
          ? "1px solid rgba(230, 230, 230, 0.8)"
          : "1px solid rgba(230, 230, 230, 0.5)",
        height: scrolled ? "80px" : "100px",
        boxShadow: scrolled
          ? "0 4px 20px rgba(0, 0, 0, 0.05)"
          : "none",
        overflow: "hidden",
      }}>
      <div className="absolute inset-0 z-[-1]">
        {/* 光效 */}
        <div className={`absolute top-[-50%] left-[-50%] w-[200%] h-[200%] ${scrolled ? 'opacity-20' : 'opacity-10'
          } transition-opacity duration-300`}
          style={{
            background: "radial-gradient(circle, rgba(30, 64, 175, 0.05) 0%, transparent 70%), " +
              "radial-gradient(circle at 30% 50%, rgba(0, 30, 60, 0.03) 0%, transparent 60%), " +
              "radial-gradient(circle at 70% 80%, rgba(0, 30, 60, 0.03) 0%, transparent 60%)"
          }}
        ></div>

        {/* 顶部边缘光 */}
        <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent ${scrolled ? 'opacity-70' : 'opacity-40'
          } transition-opacity duration-300`}></div>

        {/* 底部边缘光 */}
        <div className={`absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-blue-500/20 via-transparent to-blue-500/20 ${scrolled ? 'opacity-50' : 'opacity-30'
          } transition-opacity duration-300`}></div>

        {/* 左侧装饰线 */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[70%] w-[1px] bg-gradient-to-b from-transparent via-blue-500/20 to-transparent"></div>
      </div>

      <div
        style={{
          height: "100%",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <div
          className="relative group"
          style={{
            fontSize: "28px",
            fontWeight: "600",
          }}>
          <a href="/" className="relative flex items-center">
            <div className="mr-2 w-8 h-8 border border-blue-500/30 flex items-center justify-center rounded-sm overflow-hidden">
              <div className="w-full h-full bg-blue-500/5 flex items-center justify-center">
                <span className="text-blue-600 text-sm font-mono font-bold">NSXZ</span>
              </div>
            </div>
            <span className="text-gray-800 hover:text-blue-600 transition-all duration-500 font-mono tracking-wider font-bold">溺水寻舟</span>
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-300"></span>
          </a>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          {/* 数字时钟 */}
          <div className="hidden md:flex mr-4 text-blue-600 font-mono text-sm border border-blue-500/20 px-2 py-1 rounded-sm bg-blue-500/5 font-semibold">
            {time.toLocaleTimeString('zh-CN', { hour12: false })}
          </div>

          {/* 在大屏幕上显示菜单 */}
          <div className="hidden md:block">
            <Menu
              mode="horizontal"
              selectedKeys={[window.location.pathname]}
              items={menuItems}
              style={{
                border: "none",
                backgroundColor: "transparent",
                fontSize: "16px",
                fontFamily: "monospace",
                fontWeight: "600",
                minWidth: "360px",
              }}
              theme="light"
            />
          </div>

          {isLoggedIn ? (
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className="ml-2 text-blue-600 hover:text-blue-800 transition-colors duration-300 flex items-center"
              style={{
                border: "1px solid rgba(59, 130, 246, 0.2)",
                borderRadius: "4px",
                padding: "4px 12px",
                background: "rgba(59, 130, 246, 0.05)",
                fontFamily: "monospace",
                fontWeight: "600",
              }}
            >
              注销
            </Button>
          ) : (
            <Button
              type="text"
              icon={<QqOutlined />}
              onClick={handleQQLogin}
              className="ml-2 text-blue-600 hover:text-blue-800 transition-colors duration-300 flex items-center"
              style={{
                border: "1px solid rgba(59, 130, 246, 0.2)",
                borderRadius: "4px",
                padding: "4px 12px",
                background: "rgba(59, 130, 246, 0.05)",
                fontFamily: "monospace",
                fontWeight: "600",
              }}
            >
              登录
            </Button>
          )}
        </div>
      </div>
    </Header>
  );
};
