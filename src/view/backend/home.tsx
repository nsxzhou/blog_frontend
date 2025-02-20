import {
  dataType,
  getStatistics,
  getUserDistribution,
  getVisitTrend,
  userDistributionType,
  visitTrendType,
} from "@/api/data";
import {
  CommentOutlined,
  EyeOutlined,
  FileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";
import ReactECharts from "echarts-for-react";
import { useEffect, useMemo, useState } from "react";

// 1. 抽取统计卡片组件
const StatisticCard = ({
  title,
  value,
  prefix,
  suffix,
  icon,
  color,
  loading,
}: {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: React.ReactNode;
  color: string;
  loading: boolean;
}) => (
  <Card bordered={false}>
    <Statistic
      title={
        <div className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </div>
      }
      value={loading ? "Loading..." : value}
      prefix={prefix}
      suffix={suffix}
      valueStyle={{ color: `var(--ant-${color}-6)` }}
    />
  </Card>
);

export const AdminHome = () => {
  // 定义状态
  const [statisticsData, setStatisticsData] = useState<dataType>({
    total_articles: 0,
    total_comments: 0,
    total_views: 0,
    total_users: 0,
  });
  const [visitTrendData, setVisitTrendData] = useState<visitTrendType>({
    dates: [],
    values: [],
  });
  const [distributionData, setDistributionData] = useState<
    userDistributionType[]
  >([]);
  const [loading, setLoading] = useState(true);

  // 获取数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statistics, visitTrend, distribution] = await Promise.all([
          getStatistics(),
          getVisitTrend(),
          getUserDistribution(),
        ]);
        setStatisticsData(statistics.data);
        setVisitTrendData(visitTrend.data);
        setDistributionData(distribution.data);
      } catch (error) {
        console.error("获取数据失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 统计卡片数据
  const statistics = useMemo(
    () => [
      {
        title: "总用户数",
        value: statisticsData.total_users || 0,
        icon: <UserOutlined className="text-blue-500 text-2xl" />,
        color: "blue",
      },
      {
        title: "文章总数",
        value: statisticsData.total_articles || 0,
        icon: <FileOutlined className="text-green-500 text-2xl" />,
        color: "green",
      },
      {
        title: "评论总数",
        value: statisticsData.total_comments || 0,
        icon: <CommentOutlined className="text-yellow-500 text-2xl" />,
        color: "yellow",
      },
      {
        title: "浏览总数",
        value: statisticsData.total_views || 0,
        icon: <EyeOutlined className="text-purple-500 text-2xl" />,
        color: "purple",
      },
    ],
    [statisticsData]
  );

  // 图表配置
  const { visitOption, userDistributionOption } = useMemo(
    () => ({
      visitOption: {
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: visitTrendData.dates,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "访问量",
            type: "line",
            smooth: true,
            areaStyle: {
              opacity: 0.3,
            },
            data: visitTrendData.values,
          },
        ],
      },
      userDistributionOption: {
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          bottom: 0,
          left: "center",
        },
        series: [
          {
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: true,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "outside",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "20",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: distributionData,
          },
        ],
      },
    }),
    [visitTrendData, distributionData]
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="mb-6">
        {statistics.map((stat, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <StatisticCard {...stat} loading={loading} />
          </Col>
        ))}
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="访问趋势" bordered={false}>
            <ReactECharts option={visitOption} style={{ height: "400px" }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="用户分布" bordered={false}>
            <ReactECharts
              option={userDistributionOption}
              style={{ height: "400px" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
