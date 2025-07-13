import {
  Line,
  LineChart as LineChartRecharts,
  CartesianGrid,
  XAxis,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/frontend/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/frontend/ui/chart';
import {TrendingUp} from 'lucide-react';
import {formatDate} from '@/frontend/lib/date';
import {CHART_DEFAULT_COLORS} from '@/frontend/lib/colours';
import {
  ChartConfig,
  ChartDataPoint,
} from '@/frontend/components/charts/chart.types';

interface LineChartProps {
  data: ChartDataPoint[];
  title?: string;
  description?: string;
  height?: number;
  dataKeys: string[];
  colors?: string[];
  trend?: {
    value: number;
    text: string;
  };
  footerText?: string;
}

export const LineChart = (props: LineChartProps) => {
  const {
    data,
    title = 'Chart',
    description = '',
    height = 250,
    dataKeys,
    colors = CHART_DEFAULT_COLORS,
    trend,
    footerText,
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
            <LineChartRecharts
              data={data}
              margin={{top: 10, right: 30, left: 0, bottom: 0}}
            >
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
                  <ChartTooltipContent labelFormatter={formatDate} hideLabel />
                }
              />
              {dataKeys.map((key, index) => (
                <Line
                  key={key}
                  dataKey={key}
                  type="monotone"
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              ))}
              {dataKeys.length > 1 && (
                <ChartLegend content={<ChartLegendContent />} />
              )}
            </LineChartRecharts>
          </ChartContainer>
        </div>
      </CardContent>
      {(trend || footerText) && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          {trend && (
            <div className="flex gap-2 font-medium leading-none">
              {trend.text} {trend.value}% <TrendingUp className="h-4 w-4" />
            </div>
          )}
          {footerText && (
            <div className="leading-none text-muted-foreground">
              {footerText}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
};
