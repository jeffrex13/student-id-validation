'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface ValidationChartProps {
  validationData: any[] | null;
}

export default function ValidationChart({
  validationData,
}: ValidationChartProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Student Validation Status by Course</CardTitle>
        <CardDescription>
          Number of validated and not validated students per course
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            validated: {
              label: 'Validated Students',
              color: 'hsl(345, 100%, 28%)', // New color for validated students
            },
            notValidated: {
              label: 'Not Validated Students ',
              color: 'hsl(350, 100%, 60%)', // Lighter shade for not validated
            },
          }}
          className="h-[400px]"
        >
          <BarChart
            data={validationData || []}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="course"
              tickLine={false}
              axisLine={false}
              padding={{ left: 20, right: 20 }}
            />
            <YAxis
              label={{
                value: 'Number of Students',
                angle: -90,
                position: 'insideLeft',
              }}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="validated"
              fill="var(--color-validated)"
              radius={[4, 4, 0, 0]}
              maxBarSize={30}
            />
            <Bar
              dataKey="notValidated"
              fill="var(--color-notValidated)"
              radius={[4, 4, 0, 0]}
              maxBarSize={30}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
