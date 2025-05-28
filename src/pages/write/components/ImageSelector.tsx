import React, { useState, useEffect } from 'react';
import { Modal, Input, Empty, Spin, Pagination } from 'antd';
import { SearchOutlined, CheckOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { GetImageList, type ImageInfo } from '@/api/image';
import { fadeInUp, hoverScale } from '@/constants/animations';

const { Search } = Input;

interface ImageSelectorProps {
    open: boolean;
    onCancel: () => void;
    onSelect: (image: ImageInfo) => void;
    selectedImageUrl?: string;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
    open,
    onCancel,
    onSelect,
    selectedImageUrl
}) => {
    const [images, setImages] = useState<ImageInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(12);
    const [searchKeyword, setSearchKeyword] = useState('');

    // 加载图片列表
    const loadImages = async (page = 1) => {
        setLoading(true);
        try {
            const response = await GetImageList({
                page,
                page_size: pageSize,
            });

            if (response.code === 0) {
                console.log(response.data);
                let imageList = response.data.items;

                setImages(imageList);
                setTotal(response.data.total);
            }
        } catch (error) {
            console.error('加载图片失败:', error);
        } finally {
            setLoading(false);
        }
    };

    // 初始化加载
    useEffect(() => {
        if (open) {
            setCurrentPage(1);
            loadImages(1);
        }
    }, [open]);

    // 页面变化
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        loadImages(page);
    };

    return (
        <Modal
            title="选择封面图片"
            open={open}
            onCancel={onCancel}
            width={800}
            footer={null}
            className="image-selector-modal"
        >
            <div className="space-y-4">

                {/* 图片网格 */}
                <div className="min-h-[400px]">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Spin size="large" />
                        </div>
                    ) : images.length === 0 ? (
                        <Empty
                            description="暂无图片"
                            className="py-16"
                        />
                    ) : (
                        <motion.div
                            variants={fadeInUp}
                            initial="initial"
                            animate="animate"
                            className="grid grid-cols-3 gap-4"
                        >
                            {images.map((image) => (
                                <motion.div
                                    key={image.id}
                                    variants={hoverScale}
                                    whileHover="whileHover"
                                    whileTap="whileTap"
                                    className={`
                                        relative aspect-square rounded-lg overflow-hidden cursor-pointer
                                        border-2 transition-all duration-200
                                        ${selectedImageUrl === image.url
                                            ? 'border-blue-500 shadow-lg'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }
                                    `}
                                    onClick={() => onSelect(image)}
                                >
                                    <img
                                        src={image.url}
                                        alt={image.filename}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />

                                    {/* 选中状态 */}
                                    {selectedImageUrl === image.url && (
                                        <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                                            <div className="bg-blue-500 text-white rounded-full p-2">
                                                <CheckOutlined className="text-lg" />
                                            </div>
                                        </div>
                                    )}

                                    {/* 图片信息 */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                        <p className="text-white text-xs truncate">
                                            {image.filename}
                                        </p>
                                        <p className="text-gray-300 text-xs">
                                            {(image.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>

                {/* 分页 */}
                {total > pageSize && (
                    <div className="flex justify-center pt-4">
                        <Pagination
                            current={currentPage}
                            total={total}
                            pageSize={pageSize}
                            onChange={handlePageChange}
                            showSizeChanger={false}
                            showQuickJumper
                            showTotal={(total, range) =>
                                `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                            }
                        />
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ImageSelector; 