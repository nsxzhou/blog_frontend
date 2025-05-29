import qqQR from '@/assets/qq.jpg';
import wechatQR from '@/assets/wechat.jpg';
import { fadeInUp, scaleIn } from '@/constants/animations';
import { Modal } from 'antd';
import { motion } from 'framer-motion';
import React from 'react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'wechat' | 'qq' | null;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, type }) => {
  const getQRInfo = () => {
    switch (type) {
      case 'wechat':
        return {
          title: '微信二维码',
          image: wechatQR,
          description: '扫一扫上面的二维码图案，加我为好友',
        };
      case 'qq':
        return {
          title: 'QQ二维码',
          image: qqQR,
          description: '扫一扫上面的二维码图案，加我为好友',
        };
      default:
        return null;
    }
  };

  const qrInfo = getQRInfo();

  if (!qrInfo) return null;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={400}
      className="qr-modal"
      styles={{
        body: { padding: 0 },
      }}
    >
      <motion.div {...scaleIn} className="p-6 text-center">
        <motion.h3
          {...fadeInUp}
          className="text-xl font-semibold text-gray-800 mb-4"
        >
          {qrInfo.title}
        </motion.h3>

        <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="mb-4">
          <img
            src={qrInfo.image}
            alt={qrInfo.title}
            className="w-full max-w-xs mx-auto rounded-lg shadow-lg"
          />
        </motion.div>

        <motion.p
          {...fadeInUp}
          transition={{ delay: 0.2 }}
          className="text-gray-600 text-sm"
        >
          {qrInfo.description}
        </motion.p>
      </motion.div>
    </Modal>
  );
};

export default QRCodeModal;
