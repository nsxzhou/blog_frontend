import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CloseOutlined,
    PlusOutlined,
    CheckOutlined,
    LinkOutlined,
    CalendarOutlined,
} from '@ant-design/icons';
import { modalVariants, overlayVariants, fadeInUp } from '@/constants/animations';

interface Author {
    name: string;
    avatar: string;
    bio?: string;
    followers?: number;
    following?: number;
    articles?: number;
    joinDate?: string;
    location?: string;
    website?: string;
}

interface AuthorModalProps {
    author: Author;
    isOpen: boolean;
    onClose: () => void;
}

const AuthorModal: React.FC<AuthorModalProps> = ({ author, isOpen, onClose }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleFollow = async () => {
        setIsLoading(true);
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsFollowing(!isFollowing);
        setIsLoading(false);
    };

    // 扩展作者信息（模拟数据）
    const extendedAuthor = {
        ...author,
        bio: author.bio || "热爱技术分享的前端开发者，专注于 React 生态系统和现代 Web 开发技术。",
        followers: author.followers || 1234,
        following: author.following || 567,
        articles: author.articles || 89,
        joinDate: author.joinDate || "2022-03-15",
        location: author.location || "北京",
        website: author.website || "https://example.com",
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* 背景遮罩 */}
                    <motion.div
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* 弹窗内容 */}
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 关闭按钮 */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            <CloseOutlined className="text-gray-600" />
                        </button>

                        {/* 头部背景 */}
                        <div className="relative h-24 bg-gradient-to-r from-blue-500 to-purple-600">
                            <div className="absolute inset-0 bg-black/10" />
                        </div>

                        {/* 作者头像 */}
                        <div className="relative px-6 pb-6">
                            <div className="flex justify-center -mt-12 mb-4">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                    className="relative"
                                >
                                    <img
                                        src={extendedAuthor.avatar}
                                        alt={extendedAuthor.name}
                                        className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white" />
                                </motion.div>
                            </div>

                            {/* 作者基本信息 */}
                            <div className="text-center mb-6">
                                <motion.h2
                                    {...fadeInUp}
                                    transition={{ delay: 0.3 }}
                                    className="text-xl font-bold text-gray-900 mb-1"
                                >
                                    {extendedAuthor.name}
                                </motion.h2>
                                <motion.p
                                    {...fadeInUp}
                                    transition={{ delay: 0.4 }}
                                    className="text-gray-600 text-sm mb-3"
                                >
                                    {extendedAuthor.location}
                                </motion.p>
                                <motion.p
                                    {...fadeInUp}
                                    transition={{ delay: 0.5 }}
                                    className="text-gray-700 text-sm leading-relaxed"
                                >
                                    {extendedAuthor.bio}
                                </motion.p>
                            </div>

                            {/* 统计数据 */}
                            <motion.div
                                {...fadeInUp}
                                transition={{ delay: 0.6 }}
                                className="grid grid-cols-3 gap-4 mb-6"
                            >
                                <div className="text-center">
                                    <div className="text-lg font-bold text-gray-900">
                                        {extendedAuthor.articles}
                                    </div>
                                    <div className="text-xs text-gray-500">文章</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-gray-900">
                                        {extendedAuthor.followers.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-gray-500">关注者</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-gray-900">
                                        {extendedAuthor.following}
                                    </div>
                                    <div className="text-xs text-gray-500">关注中</div>
                                </div>
                            </motion.div>

                            {/* 关注按钮 */}
                            <motion.button
                                {...fadeInUp}
                                transition={{ delay: 0.7 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleFollow}
                                disabled={isLoading}
                                className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${isFollowing
                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                                    }`}
                            >
                                {isLoading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                                    />
                                ) : (
                                    <>
                                        {isFollowing ? (
                                            <>
                                                <CheckOutlined />
                                                已关注
                                            </>
                                        ) : (
                                            <>
                                                <PlusOutlined />
                                                关注
                                            </>
                                        )}
                                    </>
                                )}
                            </motion.button>

                            {/* 额外信息 */}
                            <motion.div
                                {...fadeInUp}
                                transition={{ delay: 0.8 }}
                                className="mt-6 pt-6 border-t border-gray-100 space-y-3"
                            >
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <CalendarOutlined />
                                    <span>加入于 {new Date(extendedAuthor.joinDate).toLocaleDateString()}</span>
                                </div>
                                {extendedAuthor.website && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <LinkOutlined />
                                        <a
                                            href={extendedAuthor.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-700 truncate"
                                        >
                                            {extendedAuthor.website}
                                        </a>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AuthorModal; 