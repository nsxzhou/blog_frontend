import { paramsType } from "@/api";
import { visitDelete, visitList, visitType } from "@/api/visit";
import { Button, message, Modal, Space, Spin, Table, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { useCallback, useEffect, useMemo, useState } from "react";

interface PaginationState extends paramsType {
  total: number;
}

// 分页 Hook
const usePagination = (defaultPageSize = 10) => {
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    page_size: defaultPageSize,
    total: 0,
  });

  const handlePageChange = (page: number, pageSize?: number) => {
    setPagination((prev) => ({
      ...prev,
      page,
      page_size: pageSize || prev.page_size,
    }));
  };

  return { pagination, setPagination, handlePageChange };
};

// 表格列配置
const getVisitColumns = (
  handleDelete: (id: number) => void
): ColumnsType<visitType> => [
    {
      title: "访问者ID",
      dataIndex: "visitor_id",
      key: "visitor_id",
    },
    {
      title: "公网IP",
      dataIndex: "public_ip",
      key: "public_ip",
    },
    {
      title: "内网IP",
      dataIndex: "internal_ip",
      key: "internal_ip",
    },
    {
      title: "User Agent",
      dataIndex: "user_agent",
      key: "user_agent",
      ellipsis: true,
      width: 200,
      render: (text: string) => (
        <Tooltip placement="topLeft" title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "地区",
      dataIndex: "distribution",
      key: "distribution",
    },

    {
      title: "访问时间",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

export const AdminVisit = () => {
  // 状态管理
  const [state, setState] = useState({
    loading: false,
    data: [] as visitType[],
  });

  const { pagination, setPagination, handlePageChange } = usePagination();

  // 获取数据
  const fetchData = useCallback(
    async (page = pagination.page, page_size = pagination.page_size) => {
      try {
        setState((prev) => ({ ...prev, loading: true }));
        const res = await visitList({ page, page_size });

        if (res.code === 0) {
          setState((prev) => ({ ...prev, data: res.data.list }));
          setPagination((prev) => ({ ...prev, total: res.data.total }));
        } else {
          message.error(res.message);
        }
      } catch (error) {
        message.error("获取访问记录失败");
        console.error("获取访问记录失败:", error);
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    []
  );

  // 删除记录
  const handleDelete = useCallback(
    (id: number) => {
      Modal.confirm({
        title: "确认删除",
        content: "确定要删除这条访问记录吗？删除后不可恢复。",
        okText: "确认",
        cancelText: "取消",
        onOk: async () => {
          try {
            const response = await visitDelete(id);
            if (response.code === 0) {
              message.success("删除成功");
              fetchData(pagination.page, pagination.page_size);
            } else {
              message.error(response.message);
            }
          } catch (error) {
            message.error("删除失败");
            console.error("删除失败:", error);
          }
        },
      });
    },
    [pagination]
  );

  const columns = useMemo(() => getVisitColumns(handleDelete), [handleDelete]);

  useEffect(() => {
    fetchData(pagination.page, pagination.page_size);
  }, [pagination.page, pagination.page_size, fetchData]);

  if (state.loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-60px)]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="flex justify-between items-center px-8 py-6 border-b border-gray-200">
        <h2 className="m-0">访问记录管理</h2>
      </div>

      <div className="p-6">
        <Table
          columns={columns}
          dataSource={state.data}
          rowKey="id"
          pagination={{
            position: ["bottomCenter"],
            current: pagination.page,
            pageSize: pagination.page_size,
            total: pagination.total,
            onChange: handlePageChange,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            className: "py-8",
          }}
          loading={state.loading}
        />
      </div>
    </div>
  );
};
