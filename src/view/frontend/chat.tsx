import { useState, useEffect, useRef } from 'react';
import { RootState } from '@/store/index';
import { useSelector } from 'react-redux';
import { ChatMessage, User } from '@/api/chat';

export const WebChat = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [connectionState, setConnectionState] = useState<'initial' | 'connecting' | 'connected' | 'disconnected' | 'reconnecting'>('initial');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
    const [reconnectAttempt, setReconnectAttempt] = useState(0);
    const [reconnectCountdown, setReconnectCountdown] = useState(0);

    const socketRef = useRef<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
    const userInfo = useSelector((state: RootState) => state.web.user.userInfo);

    // 最大重连次数和初始重连延迟
    const MAX_RECONNECT_ATTEMPTS = 5;

    // 连接WebSocket
    useEffect(() => {
        if (userInfo) {
            connectWebSocket();
        } else {
            // 当用户未登录时，直接设置为断开连接状态
            setConnectionState('disconnected');
            setError('请先登录');
            setIsLoading(false);
        }

        // 组件卸载时关闭连接和清理定时器
        return () => {
            cleanupConnection();
        };
    }, [userInfo]); // 当用户信息改变时重新连接

    // 清理连接和定时器
    const cleanupConnection = () => {
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
        }
    };

    // 滚动到最新消息
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 处理输入状态
    useEffect(() => {
        if (inputMessage && connectionState === 'connected') {
            // 清除之前的超时
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

        }
    }, [inputMessage, connectionState]);

    // 连接WebSocket
    const connectWebSocket = () => {
        console.log('连接WebSocket');
        // 如果没有用户信息，直接返回
        if (!userInfo?.token) {
            setConnectionState('disconnected');
            setError('请先登录');
            setIsLoading(false);
            return;
        }

        // 清理之前的连接
        cleanupConnection();

        // 更新状态
        setIsLoading(true);
        setConnectionState(reconnectAttempt > 0 ? 'reconnecting' : 'connecting');
        setError(null);

        // 创建WebSocket连接
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const token = userInfo.token;  // 这里可以直接使用 userInfo.token，因为已经确保它存在
        const wsUrl = `${wsProtocol}//${window.location.host}/api/ws?token=${token}`;

        try {
            // 创建WebSocket实例
            socketRef.current = new WebSocket(wsUrl);

            // 设置连接超时
            const connectionTimeout = setTimeout(() => {
                if (socketRef.current && socketRef.current.readyState !== WebSocket.OPEN) {
                    setConnectionState('disconnected');
                    setIsLoading(false);
                    scheduleReconnect();
                }
            }, 3000);

            // 连接成功时这个函数会被调用
            socketRef.current.onopen = () => {
                console.log('WebSocket连接已建立');
                clearTimeout(connectionTimeout);
                setConnectionState('connected');
                setReconnectAttempt(0);
                setIsLoading(false);
                requestInitialData();
            };

            // 从服务器收到消息时这个函数会被调用
            socketRef.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    handleIncomingMessage(data);
                } catch (err) {
                    console.error('解析消息失败:', err);
                }
            };

            // 当WebSocket发生错误时这个函数会被调用
            socketRef.current.onerror = (err) => {
                clearTimeout(connectionTimeout);
                console.error('WebSocket错误:', err);
                setConnectionState('disconnected');
                setIsLoading(false);
            };

            // 当WebSocket连接关闭时这个函数会被调用
            socketRef.current.onclose = (event) => {
                clearTimeout(connectionTimeout);
                console.log("WebSocket连接已关闭", event.code, event.reason);
                setConnectionState('disconnected');
            };
        } catch (err) {
            console.error('创建WebSocket实例失败:', err);
            setConnectionState('disconnected');
            setIsLoading(false);
            scheduleReconnect();
        }
    };

    // 安排重连
    const scheduleReconnect = () => {
        // 如果超过最大重试次数，停止重连
        if (reconnectAttempt >= MAX_RECONNECT_ATTEMPTS) {
            setError(`已尝试重连${MAX_RECONNECT_ATTEMPTS}次，请手动刷新页面或点击重连按钮`);
            return;
        }

        // 设置重连倒计时
        const countdownInterval = setInterval(() => {
            setReconnectCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(countdownInterval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // 设置重连定时器
        reconnectTimerRef.current = setTimeout(() => {
            clearInterval(countdownInterval);
            setReconnectAttempt(prev => prev + 1);
            connectWebSocket();
        }, 3000);
    };

    // 请求初始数据
    const requestInitialData = () => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            // 请求历史消息
            socketRef.current.send(JSON.stringify({
                type: 'history',
                limit: 50
            }));

            // 请求在线用户列表
            socketRef.current.send(JSON.stringify({
                type: 'users',
            }));
        }
    };

    // 处理收到的消息
    const handleIncomingMessage = (data: any) => {
        console.log('收到消息:', data);
        if (data.type === 'message' && !data.content) {
            return;
        }
        switch (data.type) {
            case 'history':
                // 处理历史消息
                if (Array.isArray(data.messages)) {
                    setMessages(data.messages);
                }
                break;
            case 'message':
                if (Array.isArray(data.messages)) {
                    setMessages(data.messages);
                } else {
                    setMessages(prevMessages => {
                        // 改进去重逻辑，更严格地检查内容和用户ID匹配
                        const messageExists = prevMessages.some(msg =>
                            // 通过ID匹配
                            (msg.id && (msg.id === data.id || msg.id === data.message_id)) ||
                            (msg.message_id && (msg.message_id === data.id || msg.message_id === data.message_id)) ||
                            // 通过内容和发送者匹配（避免时间戳不同导致的重复）
                            (msg.content === data.content &&
                                msg.user_id === data.user_id &&
                                // 只检查内容和发送者，避免因时间戳差异造成的重复
                                (msg.created_at && data.created_at) ?
                                Math.abs(new Date(msg.created_at).getTime() - new Date(data.created_at).getTime()) < 10000 :
                                true)
                        );

                        // 如果消息已存在，不添加
                        if (messageExists) return prevMessages;

                        // 添加新消息
                        return [...prevMessages, data];
                    });
                    // 如果不是自己发的消息，发送已读回执
                    if (!isOwnMessage(data.user_id)) {
                        sendReadReceipt(data.id);
                    }
                }
                break;
            case 'join':
            case 'leave':
                // 处理系统消息、用户加入/离开消息
                setMessages(prevMessages => {
                    return [...prevMessages, data];
                });
                if (data.users) {
                    setOnlineUsers(data.users);
                }
                break;
            case 'users':
                if (data.users) {
                    setOnlineUsers(data.users);
                }
                break;
            case 'receipt':
                // 更新消息状态（已发送/已读）
                if (data.message_id && data.status) {
                    setMessages(prevMessages =>
                        prevMessages.map(msg =>
                            msg.message_id === data.message_id
                                ? { ...msg, status: data.status }
                                : msg
                        )
                    );
                }
                break;
            default:
                console.warn('未知消息类型:', data);
                break;
        }
    };

    // 发送消息
    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim() || !socketRef.current || connectionState !== 'connected') return;

        const id = Date.now();

        const messageObj = {
            type: 'message',
            content: inputMessage.trim(),
        };

        // 先添加到本地消息列表，显示发送中状态
        const tempMessage = {
            ...messageObj,
            id: id,
            user_id: userInfo?.id,
            created_at: new Date().toISOString(),
            status: 'sent' as const
        };

        setMessages(prev => [...prev, tempMessage]);

        // 发送消息
        try {
            socketRef.current.send(JSON.stringify(messageObj));
            setInputMessage('');
        } catch (error) {
            console.error('发送消息失败:', error);
            // 更新消息状态为发送失败
        }
    };

    // 发送已读回执
    const sendReadReceipt = (messageId: number) => {
        if (!socketRef.current || connectionState !== 'connected' || !messageId) return;

        try {
            socketRef.current.send(JSON.stringify({
                type: 'receipt',
                message_id: messageId,
                status: 'read'
            }));
        } catch (error) {
            console.error('发送已读回执失败:', error);
        }
    };

    // 滚动到最新消息
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // 优化判断消息是否是自己发送的
    const isOwnMessage = (userId?: number) => {
        if (!userId || !userInfo) return false;
        return userId === userInfo.id;
    };

    // 优化用户名显示函数
    const getUserDisplay = (userId?: number) => {
        if (!userId) return;

        // 如果是当前用户
        if (isOwnMessage(userId)) {
            return userInfo?.nick_name || `用户${userId}`;
        }

        // 从在线用户列表中查找
        const user = onlineUsers.find(u => u.id === userId);
        if (user) return user.name;

        // 未找到则显示默认名称
        return `用户${userId}`;
    };

    // 显示消息状态图标
    const getStatusIcon = (status?: string) => {
        switch (status) {
            case 'sent': return '✓';
            case 'delivered': return '✓✓';
            case 'read': return '✓✓✓';
            default: return '';
        }
    };

    // 处理重连按钮点击
    const handleReconnect = () => {
        // 重置重连尝试次数
        setReconnectAttempt(0);
        connectWebSocket();
    };

    // 渲染连接状态指示器
    const renderConnectionStatus = () => {
        switch (connectionState) {
            case 'initial':
            case 'connecting':
                return (
                    <div className="flex items-center text-blue-500">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></div>
                        正在连接...
                    </div>
                );
            case 'connected':
                return (
                    <div className="flex items-center text-green-500">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        已连接
                    </div>
                );
            case 'disconnected':
                return (
                    <div className="flex items-center text-red-500">
                        <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                        {error || '未连接'}
                        {!error && (
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-3 rounded transition-colors ml-3"
                                onClick={handleReconnect}
                            >
                                重新连接
                            </button>
                        )}
                    </div>
                );
            case 'reconnecting':
                return (
                    <div className="flex items-center text-yellow-500">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2 animate-pulse"></div>
                        正在重连... ({reconnectCountdown}s)
                    </div>
                );
            default:
                return null;
        }
    };


    return (
        <div className="flex flex-col h-[calc(100vh-170px)] bg-gray-100">
            <div className="flex justify-between items-center p-4 bg-white shadow-md">
                <h2 className="text-xl font-semibold text-gray-800">聊天室</h2>
                <div className="flex items-center">
                    {renderConnectionStatus()}
                </div>
            </div>
            <div className="flex flex-1 overflow-hidden">
                <div className="w-64 bg-white shadow-md overflow-y-auto border-r border-gray-200">
                    <h3 className="p-4 font-medium text-gray-700 border-b border-gray-200">
                        在线用户 ({onlineUsers.length})
                    </h3>
                    <ul className="divide-y divide-gray-100">
                        {userInfo && (
                            <li className="p-3 bg-blue-50 flex items-center">
                                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                <span className="font-medium">{userInfo.nick_name || "我"} (我)</span>
                            </li>
                        )}
                        {onlineUsers
                            .filter(user => !isOwnMessage(user.id))
                            .map(user => (
                                <li key={user.id} className="p-3 hover:bg-gray-50 flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                    <span>{user.name}</span>
                                </li>
                            ))
                        }
                    </ul>
                </div>

                <div className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-full">
                                <div className="text-gray-500 flex flex-col items-center">
                                    <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-2"></div>
                                    加载中...
                                </div>
                            </div>
                        ) : connectionState !== 'connected' && messages.length === 0 ? (
                            <div className="flex justify-center items-center h-full">
                                <div className="text-gray-500 flex flex-col items-center">
                                    <div className="text-5xl mb-3">📡</div>
                                    <div className="mb-3">等待连接服务器...</div>
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
                                        onClick={handleReconnect}
                                    >
                                        重新连接
                                    </button>
                                </div>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex justify-center items-center h-full">
                                <div className="text-gray-500">暂无消息，开始聊天吧！</div>
                            </div>
                        ) : (
                            messages.map((msg, index) => {
                                // 系统相关消息
                                if (msg.type === 'join' || msg.type === 'leave') {
                                    // 系统消息 - 使用单行内联样式
                                    return (
                                        <div key={index} className="flex justify-center items-center my-2">
                                            <div className="flex items-center bg-gray-50 text-xs text-gray-500 rounded-lg border border-gray-100 px-3 py-1">
                                                {msg.content && (
                                                    <>
                                                        {msg.user_id ? (
                                                            <>
                                                                <span className="font-medium mr-1">{getUserDisplay(msg.user_id)}</span>
                                                                <span>{msg.content}</span>
                                                            </>
                                                        ) : (
                                                            <span>{msg.content}</span>
                                                        )}
                                                        <span className="mx-1 text-gray-300">•</span>
                                                        <span className="text-gray-400">{new Date(msg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                } else {
                                    // 聊天消息
                                    const isOwn = isOwnMessage(msg.user_id);
                                    return (
                                        <div key={index} className={`my-2 ${isOwn ? 'flex justify-end' : 'flex justify-start'}`}>
                                            <div className={`max-w-[80%] rounded-lg p-3 ${isOwn ? 'bg-blue-500 text-white' : 'bg-white border border-gray-200'}`}>
                                                <div className="text-xs mb-1" style={{ color: isOwn ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)' }}>
                                                    {getUserDisplay(msg.user_id)}
                                                </div>
                                                <div className={`break-words ${isOwn ? 'text-white' : 'text-gray-800'}`}>
                                                    {msg.content}
                                                </div>
                                                <div className="text-xs mt-1 flex justify-between items-center">
                                                    <span style={{ color: isOwn ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)' }}>
                                                        {new Date(msg.created_at || Date.now()).toLocaleTimeString()}
                                                    </span>
                                                    {isOwn && (
                                                        <span className={`ml-2 ${msg.status === 'error' ? 'text-red-300' : 'text-blue-100'}`}>
                                                            {getStatusIcon(msg.status)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form
                        className="p-3 bg-white border-t border-gray-200 flex items-center"
                        onSubmit={sendMessage}
                    >
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder={connectionState === 'connected' ? "输入消息..." : "等待连接..."}
                            disabled={connectionState !== 'connected'}
                            className={`flex-1 py-2 px-3 border rounded-l-lg focus:outline-none 
                                ${connectionState === 'connected'
                                    ? 'focus:border-blue-500 border-gray-300'
                                    : 'bg-gray-100 text-gray-500 border-gray-200'}`}
                        />
                        <button
                            type="submit"
                            disabled={connectionState !== 'connected' || !inputMessage.trim()}
                            className={`py-2 px-4 rounded-r-lg font-medium ${connectionState === 'connected' && inputMessage.trim()
                                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            发送
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};