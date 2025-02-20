import { Col, message, Row } from "antd";
import { useEffect, useMemo, useState } from "react";
import { articleList, articleParamsType, articleType, dateType } from "../../api/article";
import { ArticleList } from "../../components/articlelist/articlelist";
import { FriendLinkList } from "../../components/friendlink/friendlink";
import { ArticleFilter } from "../../components/search/articlefilter";

// 定义分页状态接口
interface PaginationState extends articleParamsType {
  total: number;
}

// 默认分页配置
const DEFAULT_PAGINATION: PaginationState = {
  page: 1,
  page_size: 10,
  total: 0,
  category: undefined,
  sort_field: "created_at",
  sort_order: "desc",
  key: undefined,
  date: undefined,
};

export const WebHome: React.FC = () => {
  // 状态定义
  const [articles, setArticles] = useState<articleType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>(DEFAULT_PAGINATION);
  const [selectedCategory, setSelectedCategory] = useState<string[]>(["All"]);

  const fetchArticles = async (
    page = pagination.page,
    pageSize = pagination.page_size,
    categories?: string[],
    sortField?: string,
    sortOrder?: string,
    date?: dateType
  ): Promise<void> => {
    setLoading(true);
    try {
      const params: articleParamsType = {
        ...pagination,
        page,
        page_size: pageSize,
        category: categories?.includes("All") ? undefined : categories,
        sort_field: sortField || pagination.sort_field,
        sort_order: sortOrder || pagination.sort_order,
        date,
      };

      const res = await articleList(params);
      if (res.code === 0) {
        setArticles(res.data.list);
        setPagination((prev) => ({
          ...prev,
          total: res.data.total,
          page,
          category: categories?.includes("All") ? undefined : categories,
          sort_field: sortField || prev.sort_field,
          sort_order: sortOrder || prev.sort_order,
          date,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch articles:", error);
      message.error("获取文章列表失败");
    } finally {
      setLoading(false);
    }
  };


  const handlePageChange = (page: number, pageSize: number = pagination.page_size): void => {
    setPagination((prev) => ({
      ...prev,
      page,
      page_size: pageSize,
    }));
    fetchArticles(page, pageSize);
  };

  // 初始化加载
  useEffect(() => {
    fetchArticles();
  }, []);

  // 侧边栏组件
  const sidebar = useMemo(
    () => (
      <div className="space-y-8">
        <div className="bg-white shadow-sm border border-gray-100/80">
          <ArticleFilter
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            onSearch={({ category, sort_field, sort_order, date }) => {
              fetchArticles(1, pagination.page_size, category, sort_field, sort_order, date);
            }}
          />
        </div>
        <div className="bg-white shadow-sm border border-gray-100/80">
          <FriendLinkList />
        </div>
      </div>
    ),
    [selectedCategory, pagination.page_size]
  );

  return (
    <div className="flex justify-center w-full bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-[1500px] w-full px-4">
        <Row gutter={24}>
          <Col span={19}>
            <ArticleList
              articles={articles}
              loading={loading}
              pagination={{
                current: pagination.page || 1,
                pageSize: pagination.page_size || 10,
                total: pagination.total,
                onChange: handlePageChange,
              }}
            />
          </Col>
          <Col span={5}>{sidebar}</Col>
        </Row>
      </div>
    </div>
  );
};
