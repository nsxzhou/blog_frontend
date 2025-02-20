import { EyeOutlined, MessageOutlined } from "@ant-design/icons";
import { Empty, List, Spin, Tag, Typography } from "antd";
import { memo } from "react";
import { articleType } from "../../api/article";
import { Image } from "antd";

const { Title, Paragraph } = Typography;

interface ArticleListProps {
  articles: articleType[];
  loading: boolean;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize?: number) => void;
  };
}

const ArticleItem = ({ item }: { item: articleType }) => (
  <List.Item className="px-6 py-5 hover:bg-gray-50/40 transition-all duration-300 border-b border-gray-100">
    <div className="flex gap-6">
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <a href={`/article/${item.id}`} className="group">
            <Title
              level={4}
              className="!m-0 !text-gray-800 group-hover:!text-blue-600 transition-colors duration-300">
              {item.title}
            </Title>
          </a>
          <div className="flex gap-2 flex-wrap">
            {Array.isArray(item.category) ? (
              item.category.map((cat, index) => (
                <Tag
                  key={index}
                  className="text-base px-3 py-0.5 bg-blue-50 text-blue-600 border-blue-200 rounded-full">
                  {cat}
                </Tag>
              ))
            ) : (
              <Tag className="text-base px-3 py-0.5 bg-blue-50 text-blue-600 border-blue-200 rounded-full">
                {item.category}
              </Tag>
            )}
          </div>
        </div>

        <Paragraph
          ellipsis={{ rows: 2 }}
          className="!mb-0 text-gray-500 text-base leading-relaxed">
          {item.abstract}
        </Paragraph>

        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{new Date(item.created_at).toLocaleDateString()}</span>

          <div className="flex gap-6">
            <span className="flex items-center gap-1 hover:text-blue-600 transition-colors">
              <EyeOutlined className="text-base" /> {item.look_count}
            </span>
            <span className="flex items-center gap-1 hover:text-blue-600 transition-colors">
              <MessageOutlined className="text-base" /> {item.comment_count}
            </span>
          </div>
        </div>
      </div>

      {item.cover_url && (
        <div className="overflow-hidden  flex-shrink-0">
          <Image
            src={item.cover_url}
            alt={item.title}
            width={195}
            height={128}
            style={{ objectFit: "cover" }}
          />
        </div>
      )}
    </div>
  </List.Item>
);

export const ArticleList = memo(
  ({ articles, loading, pagination }: ArticleListProps) => {
    if (loading) {
      return (
        <Spin
          size="large"
          className="flex justify-center min-h-[80vh] items-center"
        />
      );
    }

    if (articles.length === 0) {
      return (
        <Empty
          description="暂无文章"
          className="min-h-[80vh] flex justify-center items-center"
        />
      );
    }

    return (
      <List
        loading={loading}
        itemLayout="vertical"
        dataSource={articles}
        className="bg-white"
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          position: "bottom",
          className: "flex justify-center py-4",
        }}
        renderItem={(item) => <ArticleItem item={item} />}
      />
    );
  }
);
