import { paramsType } from "@/api";
import { logDelete, logList, logType } from "@/api/log";
import { Button, message, Modal, Spin, Table, Tag, Tooltip } from "antd";
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

// 日志级别对应的颜色
const getLevelColor = (level: string) => {
  const colorMap: Record<string, string> = {
    ERROR: "red",
    WARN: "orange",
    INFO: "green",
    DEBUG: "blue",
  };
  return colorMap[level] || "default";
};

// 表格列配置
const getLogColumns = (
  handleDelete: (id: number) => void
): ColumnsType<logType> => [
    {
      title: "时间",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "级别",
      dataIndex: "level",
      key: "level",
      render: (level) => <Tag color={getLevelColor(level)}>{level}</Tag>,
    },
    {
      title: "调用位置",
      dataIndex: "caller",
      key: "caller",
      ellipsis: true,
      render: (text: string) => (
        <Tooltip placement="topLeft" title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },

    {
      title: "消息",
      dataIndex: "message",
      key: "message",
      ellipsis: true,
      render: (text: string) => (
        <Tooltip placement="topLeft" title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "错误详情",
      key: "error",
      render: (_, record) => {
        if (!record.error_msg) return "-";
        return (
          <Tooltip
            title={
              <div>
                <div>错误信息: {record.error_msg}</div>
              </div>
            }>
            <Button type="link">查看详情</Button>
          </Tooltip>
        );
      },
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Button type="link" danger onClick={() => handleDelete(record.id)}>
          删除
        </Button>
      ),
    },
  ];

export const AdminLog = () => {
  const [state, setState] = useState({
    loading: false,
    data: [] as logType[],
  });

  const { pagination, setPagination, handlePageChange } = usePagination();

  // 获取数据
  const fetchData = useCallback(
    async (page = pagination.page, page_size = pagination.page_size) => {
      try {
        setState((prev) => ({ ...prev, loading: true }));
        const res = await logList({ page, page_size });

        if (res.code === 0) {
          // 限制最大显示100条日志
          const total = Math.min(res.data.total, 100);
          setState((prev) => ({ ...prev, data: res.data.list }));
          setPagination((prev) => ({ ...prev, total }));
        } else {
          message.error(res.message);
        }
      } catch (error) {
        message.error("获取日志记录失败");
        console.error("获取日志记录失败:", error);
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [pagination]
  );

  useEffect(() => {
    fetchData(pagination.page, pagination.page_size);
  }, [pagination.page, pagination.page_size]);

  // 删除记录
  const handleDelete = useCallback(
    (id: number) => {
      Modal.confirm({
        title: "确认删除",
        content: "确定要删除这条日志记录吗？删除后不可恢复。",
        okText: "确认",
        cancelText: "取消",
        onOk: async () => {
          try {
            const response = await logDelete(id);
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

  const columns = useMemo(() => getLogColumns(handleDelete), [handleDelete]);

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
        <h2 className="m-0">系统日志管理</h2>
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
