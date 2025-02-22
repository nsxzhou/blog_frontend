import { logout } from "@/store/slice";
import { HomeOutlined, LogoutOutlined } from "@ant-design/icons";
import { Button, Layout, Modal } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { Logout } from "@/api/user";

const { Header } = Layout;

export const NavbarBackend = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const confirmLogout = () => {
    Modal.confirm({
      title: "确认注销",
      content: "您确定要注销登录吗？",
      onOk: handleLogout,
    });
  };

  return (
    <Header
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 100,
        padding: "0 24px",
        backgroundColor: "#fff",
        borderBottom: "2px solid #f0f0f0",
        height: "64px",
      }}>
      <div
        style={{
          height: "100%",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <div
          style={{
            fontSize: "20px",
            fontWeight: "500",
            color: "#001529",
          }}>
          <a href="/admin" style={{ color: "inherit" }}>
            NSXZ 后台管理
          </a>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            type="link"
            icon={<HomeOutlined />}
            onClick={() => {
              navigate("/");
              window.location.reload();
            }}
            style={{
              color: "#001529",
              marginRight: "16px",
            }}>
            返回首页
          </Button>
          <Button
            type="link"
            icon={<LogoutOutlined />}
            onClick={() => {
              confirmLogout();
            }}
            style={{
              color: "#001529",
              marginRight: "16px",
            }}>
            注销
          </Button>
        </div>
      </div>
    </Header>
  );
};
