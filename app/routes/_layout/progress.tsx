import {createFileRoute} from '@tanstack/react-router';
import {AppPageLayout} from '@/frontend/layouts/app-page-layout';
import {AreaChart} from '@/frontend/components/charts/area-chart';
import {LineChart} from '@/frontend/components/charts/line-chart';
import {BarChart} from '@/frontend/components/charts/bar-chart';
import {CardTitle} from '@/frontend/ui/card';

export const Route = createFileRoute('/_layout/progress')({
  component: ProgressPage,
});

function ProgressPage() {
  return (
    <AppPageLayout header={<ProgressHeader />}>
      <div className="grid grid-cols-2 grid-rows-2 gap-8 px-4 py-8">
        <AreaChart
          data={CHART_DATA}
          dataKeys={['studied_total']}
          title="Total cards studied"
        />

        <AreaChart
          data={CHART_DATA}
          dataKeys={['studied_new']}
          title="New cards studied"
        />

        <LineChart
          data={CHART_DATA}
          dataKeys={['retention_rate']}
          title="Retention rate"
        />

        <BarChart
          data={CHART_DATA}
          dataKeys={['studied_new']}
          title="Study time"
        />
      </div>
    </AppPageLayout>
  );
}

export default ProgressPage;

const ProgressHeader: React.FC = () => {
  return <CardTitle className="text-sm">Progress</CardTitle>;
};

const CHART_DATA = [
  {
    date: '2024-04-01',
    studied_new: 0,
    studied_total: 12,
    retention_rate: 83,
  },
  {
    date: '2024-04-02',
    studied_new: 2,
    studied_total: 15,
    retention_rate: 87,
  },
  {
    date: '2024-04-03',
    studied_new: 2,
    studied_total: 16,
    retention_rate: 82,
  },
  {
    date: '2024-04-04',
    studied_new: 4,
    studied_total: 25,
    retention_rate: 85,
  },
  {
    date: '2024-04-05',
    studied_new: 1,
    studied_total: 34,
    retention_rate: 89,
  },
  {
    date: '2024-04-06',
    studied_new: 0,
    studied_total: 34,
    retention_rate: 84,
  },
  {
    date: '2024-04-07',
    studied_new: 5,
    studied_total: 32,
    retention_rate: 81,
  },
  {
    date: '2024-04-08',
    studied_new: 3,
    studied_total: 32,
    retention_rate: 86,
  },
  {
    date: '2024-04-09',
    studied_new: 6,
    studied_total: 33,
    retention_rate: 88,
  },
  {
    date: '2024-04-10',
    studied_new: 4,
    studied_total: 35,
    retention_rate: 83,
  },
  {
    date: '2024-04-11',
    studied_new: 7,
    studied_total: 38,
    retention_rate: 85,
  },
  {
    date: '2024-04-12',
    studied_new: 5,
    studied_total: 65,
    retention_rate: 90,
  },
  {
    date: '2024-04-13',
    studied_new: 3,
    studied_total: 68,
    retention_rate: 87,
  },
  {
    date: '2024-04-14',
    studied_new: 2,
    studied_total: 71,
    retention_rate: 84,
  },
  {
    date: '2024-04-15',
    studied_new: 8,
    studied_total: 70,
    retention_rate: 82,
  },
  {
    date: '2024-04-16',
    studied_new: 5,
    studied_total: 78,
    retention_rate: 88,
  },
  {
    date: '2024-04-17',
    studied_new: 4,
    studied_total: 82,
    retention_rate: 91,
  },
  {
    date: '2024-04-18',
    studied_new: 3,
    studied_total: 85,
    retention_rate: 86,
  },
  {
    date: '2024-04-19',
    studied_new: 2,
    studied_total: 87,
    retention_rate: 83,
  },
  {
    date: '2024-04-20',
    studied_new: 0,
    studied_total: 89,
    retention_rate: 85,
  },
  {
    date: '2024-04-21',
    studied_new: 6,
    studied_total: 86,
    retention_rate: 80,
  },
  {
    date: '2024-04-22',
    studied_new: 4,
    studied_total: 92,
    retention_rate: 84,
  },
  {
    date: '2024-04-23',
    studied_new: 3,
    studied_total: 95,
    retention_rate: 89,
  },
  {
    date: '2024-04-24',
    studied_new: 5,
    studied_total: 98,
    retention_rate: 92,
  },
  {
    date: '2024-04-25',
    studied_new: 4,
    studied_total: 102,
    retention_rate: 88,
  },
  {
    date: '2024-04-26',
    studied_new: 3,
    studied_total: 100,
    retention_rate: 85,
  },
  {
    date: '2024-04-27',
    studied_new: 2,
    studied_total: 95,
    retention_rate: 83,
  },
  {
    date: '2024-04-28',
    studied_new: 1,
    studied_total: 94,
    retention_rate: 86,
  },
  {
    date: '2024-04-29',
    studied_new: 7,
    studied_total: 105,
    retention_rate: 90,
  },
  {
    date: '2024-04-30',
    studied_new: 4,
    studied_total: 115,
    retention_rate: 87,
  },
  {
    date: '2024-05-01',
    studied_new: 6,
    studied_total: 119,
    retention_rate: 84,
  },
  {
    date: '2024-05-02',
    studied_new: 5,
    studied_total: 119,
    retention_rate: 88,
  },
  {
    date: '2024-05-03',
    studied_new: 4,
    studied_total: 119,
    retention_rate: 91,
  },
  {
    date: '2024-05-04',
    studied_new: 3,
    studied_total: 119,
    retention_rate: 86,
  },
  {
    date: '2024-05-05',
    studied_new: 8,
    studied_total: 130,
    retention_rate: 89,
  },
  {
    date: '2024-05-06',
    studied_new: 5,
    studied_total: 138,
    retention_rate: 93,
  },
  {
    date: '2024-05-07',
    studied_new: 4,
    studied_total: 142,
    retention_rate: 88,
  },
  {
    date: '2024-05-08',
    studied_new: 3,
    studied_total: 145,
    retention_rate: 85,
  },
  {
    date: '2024-05-09',
    studied_new: 2,
    studied_total: 148,
    retention_rate: 82,
  },
  {
    date: '2024-05-10',
    studied_new: 0,
    studied_total: 150,
    retention_rate: 86,
  },
  {
    date: '2024-05-11',
    studied_new: 7,
    studied_total: 147,
    retention_rate: 83,
  },
  {
    date: '2024-05-12',
    studied_new: 4,
    studied_total: 154,
    retention_rate: 87,
  },
  {
    date: '2024-05-13',
    studied_new: 5,
    studied_total: 158,
    retention_rate: 91,
  },
  {
    date: '2024-05-14',
    studied_new: 4,
    studied_total: 162,
    retention_rate: 88,
  },
  {
    date: '2024-05-15',
    studied_new: 3,
    studied_total: 165,
    retention_rate: 85,
  },
  {
    date: '2024-05-16',
    studied_new: 2,
    studied_total: 168,
    retention_rate: 89,
  },
  {
    date: '2024-05-17',
    studied_new: 1,
    studied_total: 170,
    retention_rate: 92,
  },
  {
    date: '2024-05-18',
    studied_new: 6,
    studied_total: 169,
    retention_rate: 87,
  },
  {
    date: '2024-05-19',
    studied_new: 4,
    studied_total: 175,
    retention_rate: 84,
  },
  {
    date: '2024-05-20',
    studied_new: 3,
    studied_total: 178,
    retention_rate: 88,
  },
  {
    date: '2024-05-21',
    studied_new: 5,
    studied_total: 181,
    retention_rate: 93,
  },
  {
    date: '2024-05-22',
    studied_new: 4,
    studied_total: 185,
    retention_rate: 89,
  },
  {
    date: '2024-05-23',
    studied_new: 3,
    studied_total: 188,
    retention_rate: 86,
  },
  {
    date: '2024-05-24',
    studied_new: 2,
    studied_total: 191,
    retention_rate: 83,
  },
  {
    date: '2024-05-25',
    studied_new: 1,
    studied_total: 192,
    retention_rate: 87,
  },
  {
    date: '2024-05-26',
    studied_new: 8,
    studied_total: 191,
    retention_rate: 84,
  },
  {
    date: '2024-05-27',
    studied_new: 5,
    studied_total: 199,
    retention_rate: 88,
  },
  {
    date: '2024-05-28',
    studied_new: 4,
    studied_total: 203,
    retention_rate: 92,
  },
  {
    date: '2024-05-29',
    studied_new: 3,
    studied_total: 207,
    retention_rate: 89,
  },
  {
    date: '2024-05-30',
    studied_new: 2,
    studied_total: 209,
    retention_rate: 85,
  },
  {
    date: '2024-05-31',
    studied_new: 0,
    studied_total: 211,
    retention_rate: 88,
  },
  {
    date: '2024-06-01',
    studied_new: 7,
    studied_total: 209,
    retention_rate: 83,
  },
  {
    date: '2024-06-02',
    studied_new: 4,
    studied_total: 216,
    retention_rate: 86,
  },
  {
    date: '2024-06-03',
    studied_new: 5,
    studied_total: 220,
    retention_rate: 90,
  },
  {
    date: '2024-06-04',
    studied_new: 4,
    studied_total: 224,
    retention_rate: 94,
  },
  {
    date: '2024-06-05',
    studied_new: 3,
    studied_total: 228,
    retention_rate: 89,
  },
  {
    date: '2024-06-06',
    studied_new: 2,
    studied_total: 231,
    retention_rate: 86,
  },
  {
    date: '2024-06-07',
    studied_new: 1,
    studied_total: 232,
    retention_rate: 83,
  },
  {
    date: '2024-06-08',
    studied_new: 6,
    studied_total: 231,
    retention_rate: 87,
  },
  {
    date: '2024-06-09',
    studied_new: 4,
    studied_total: 237,
    retention_rate: 91,
  },
  {
    date: '2024-06-10',
    studied_new: 3,
    studied_total: 240,
    retention_rate: 88,
  },
  {
    date: '2024-06-11',
    studied_new: 5,
    studied_total: 243,
    retention_rate: 85,
  },
  {
    date: '2024-06-12',
    studied_new: 4,
    studied_total: 247,
    retention_rate: 89,
  },
  {
    date: '2024-06-13',
    studied_new: 3,
    studied_total: 250,
    retention_rate: 93,
  },
  {
    date: '2024-06-14',
    studied_new: 2,
    studied_total: 253,
    retention_rate: 90,
  },
  {
    date: '2024-06-15',
    studied_new: 1,
    studied_total: 254,
    retention_rate: 86,
  },
  {
    date: '2024-06-16',
    studied_new: 8,
    studied_total: 253,
    retention_rate: 83,
  },
  {
    date: '2024-06-17',
    studied_new: 5,
    studied_total: 261,
    retention_rate: 87,
  },
  {
    date: '2024-06-18',
    studied_new: 4,
    studied_total: 265,
    retention_rate: 91,
  },
  {
    date: '2024-06-19',
    studied_new: 3,
    studied_total: 269,
    retention_rate: 95,
  },
  {
    date: '2024-06-20',
    studied_new: 2,
    studied_total: 271,
    retention_rate: 90,
  },
  {
    date: '2024-06-21',
    studied_new: 0,
    studied_total: 273,
    retention_rate: 87,
  },
  {
    date: '2024-06-22',
    studied_new: 7,
    studied_total: 271,
    retention_rate: 84,
  },
  {
    date: '2024-06-23',
    studied_new: 4,
    studied_total: 278,
    retention_rate: 88,
  },
  {
    date: '2024-06-24',
    studied_new: 5,
    studied_total: 282,
    retention_rate: 92,
  },
  {
    date: '2024-06-25',
    studied_new: 4,
    studied_total: 286,
    retention_rate: 89,
  },
  {
    date: '2024-06-26',
    studied_new: 3,
    studied_total: 290,
    retention_rate: 86,
  },
  {
    date: '2024-06-27',
    studied_new: 2,
    studied_total: 293,
    retention_rate: 90,
  },
  {
    date: '2024-06-28',
    studied_new: 1,
    studied_total: 294,
    retention_rate: 94,
  },
  {
    date: '2024-06-29',
    studied_new: 6,
    studied_total: 293,
    retention_rate: 91,
  },
  {
    date: '2024-06-30',
    studied_new: 4,
    studied_total: 299,
    retention_rate: 87,
  },
  {
    date: '2024-07-01',
    studied_new: 3,
    studied_total: 302,
    retention_rate: 84,
  },
  {
    date: '2024-07-02',
    studied_new: 5,
    studied_total: 305,
    retention_rate: 88,
  },
  {
    date: '2024-07-03',
    studied_new: 4,
    studied_total: 309,
    retention_rate: 92,
  },
  {
    date: '2024-07-04',
    studied_new: 3,
    studied_total: 312,
    retention_rate: 95,
  },
  {
    date: '2024-07-05',
    studied_new: 2,
    studied_total: 315,
    retention_rate: 91,
  },
  {
    date: '2024-07-06',
    studied_new: 1,
    studied_total: 316,
    retention_rate: 88,
  },
  {
    date: '2024-07-07',
    studied_new: 8,
    studied_total: 315,
    retention_rate: 85,
  },
  {
    date: '2024-07-08',
    studied_new: 5,
    studied_total: 323,
    retention_rate: 89,
  },
  {
    date: '2024-07-09',
    studied_new: 4,
    studied_total: 327,
    retention_rate: 93,
  },
];
