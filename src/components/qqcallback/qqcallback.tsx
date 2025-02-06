import { message, Spin } from "antd";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { QQLogin, userInfo } from "../../api/user";
import { login } from "../../store/slice";

export const QQCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    handleQQCallback();
  }, []);

  const handleQQCallback = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      if (!code) {
        message.error("QQ登录失败");
        navigate("/login", { replace: true });
        return;
      }
      const response = await QQLogin(code);
      if (response.code === 0) {
        // 登录成功，更新用户状态
        const userRes = await userInfo({
          headers: { Authorization: `Bearer ${response.data}` },
        });
        dispatch(login(userRes.data));
        message.success("QQ登录成功");

        // 返回之前的页面或首页
        const prevPath = sessionStorage.getItem("prevPath") || "/";
        sessionStorage.removeItem("prevPath"); // 使用完毕后清除
        navigate(prevPath, { replace: true });
      } else {
        message.error(response.message || "QQ登录失败");
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.error("QQ登录回调处理失败:", error);
      message.error("QQ登录失败");
      navigate("/login", { replace: true });
    }
  };

  return (
    <Spin
      size="large"
      className="flex justify-center min-h-[80vh] items-center"
    />
  );
};
