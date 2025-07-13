import {
  Area,
  AreaChart as AreaChartRecharts,
  CartesianGrid,
  XAxis,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/frontend/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/frontend/ui/chart';
import {formatDate} from '@/frontend/lib/date';
import {CHART_DEFAULT_COLORS} from '@/frontend/lib/colours';
import {
  ChartConfig,
  ChartDataPoint,
} from '@/frontend/components/charts/chart.types';

interface AreaChartProps {
  data: ChartDataPoint[];
  title?: string;
  description?: string;
  height?: number;
  dataKeys: string[];
  colors?: string[];
}

export const AreaChart = (props: AreaChartProps) => {
  const {
    data,
    title = 'Chart',
    description = '',
    height = 250,
    dataKeys,
    colors = CHART_DEFAULT_COLORS,
  } = props;

  // Configure chart series
  const chartConfig: ChartConfig = {};
  dataKeys.forEach((key, index) => {
    chartConfig[key] = {
      label: key.charAt(0).toUpperCase() + key.slice(1),
      color: colors[index % colors.length],
    };
  });

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle className="text-muted-foreground">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div style={{height}} className="w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <AreaChartRecharts
              data={data}
              margin={{top: 10, right: 30, left: 0, bottom: 0}}
            >
              <defs>
                {dataKeys.map((key, index) => (
                  <linearGradient
                    key={key}
                    id={`fill${key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={colors[index % colors.length]}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={colors[index % colors.length]}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={formatDate}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={formatDate}
                    indicator="dot"
                  />
                }
              />
              {dataKeys.map((key, index) => (
                <Area
                  key={key}
                  dataKey={key}
                  type="monotone"
                  fill={`url(#fill${key})`}
                  stroke={colors[index % colors.length]}
                  stackId="a"
                  isAnimationActive={false}
                />
              ))}
              {dataKeys.length > 1 && (
                <ChartLegend content={<ChartLegendContent />} />
              )}
            </AreaChartRecharts>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};
