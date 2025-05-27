import React from 'react';
import { Modal, Input, Switch } from 'antd';

interface ArticleSettingsProps {
    visible: boolean;
    onClose: () => void;
}

const ArticleSettings: React.FC<ArticleSettingsProps> = ({
    visible,
    onClose,
}) => {
    return (
        <Modal
            title="文章设置"
            open={visible}
            onCancel={onClose}
            footer={null}
            width={600}
        >
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        SEO关键词
                    </label>
                    <Input placeholder="输入SEO关键词，用逗号分隔" />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        自定义链接
                    </label>
                    <Input placeholder="输入自定义链接（可选）" />
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">允许评论</span>
                    <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">推荐文章</span>
                    <Switch />
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">开启RSS订阅</span>
                    <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">显示阅读时间</span>
                    <Switch defaultChecked />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        文章密码（可选）
                    </label>
                    <Input.Password placeholder="设置文章访问密码，留空表示公开" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        发布时间
                    </label>
                    <Input type="datetime-local" />
                </div>
            </div>
        </Modal>
    );
};

export default ArticleSettings; 