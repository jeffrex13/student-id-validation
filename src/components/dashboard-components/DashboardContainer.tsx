'use client';
import React, { useEffect, useState } from 'react';
import ValidationChart from './validationChart';
import { ValidationStats } from '@/types';
import { CustomCard } from './statCard';

const DashboardContainer = () => {
  const [validationData, setValidationData] = useState<any[] | null>(null);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [totalValidStudents, setTotalValidStudents] = useState<number>(0);
  const [totalInvalidStudents, setTotalInvalidStudents] = useState<number>(0);

  const fetchValidationData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/student/validation-stats`,
      );
      const data: ValidationStats = await response.json();

      // Add null check and provide empty object as fallback
      const courseStats = data?.courseStats || {};

      // Transform the data with safety checks
      const transformedData = Object.entries(courseStats).map(
        ([course, stats]) => ({
          course: course.toUpperCase(),
          validated: stats?.valid || 0,
          notValidated: (stats?.invalid || 0) + (stats?.noValidationField || 0),
        }),
      );

      const invalidStudents =
        (data?.invalid || 0) + (data?.noValidationField || 0);

      setValidationData(transformedData);
      setTotalStudents(data?.total || 0);
      setTotalValidStudents(data?.valid || 0);
      setTotalInvalidStudents(invalidStudents);
    } catch (error) {
      console.error('Error fetching validation data:', error);
      // Set default values in case of error
      setValidationData([]);
      setTotalStudents(0);
      setTotalValidStudents(0);
      setTotalInvalidStudents(0);
    }
  };

  useEffect(() => {
    fetchValidationData();
  }, []);

  return (
    <div className="space-y-8 rounded-xl bg-white p-6 shadow-sm">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">Dashboard</h1>

      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <CustomCard
            title="Total Students"
            value={`${totalStudents} students`}
            className="bg-white hover:bg-gray-50 transition-colors"
          />
          <CustomCard
            title="Validated"
            value={`${totalValidStudents} students`}
            className="bg-white hover:bg-gray-50 transition-colors"
          />
          <CustomCard
            title="Not Validated"
            value={`${totalInvalidStudents} students`}
            className="bg-white hover:bg-gray-50 transition-colors"
          />
        </div>

        {/* Chart Section */}
        <div>
          <ValidationChart validationData={validationData} />
        </div>
      </div>
    </div>
  );
};

export default DashboardContainer;
