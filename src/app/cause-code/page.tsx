'use client';

import { API_BASE_URL } from '@/types/constants';
import { useQuery } from '@tanstack/react-query';
import { Alert, Spin, Table } from 'antd';
import { useMemo } from 'react';
import Papa from 'papaparse';

const COLUMNS_TO_EXCLUDE = [
  '',
  'Unnamed: 0',
  'Unnamed: 1',
  'Unnamed: 2',
  'Unnamed: 3',
  'Unnamed: 4',
  'Category 1',
  'Category 2',
  'Category 3',
  'Category 4',
];

const safeToString = (value: string) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

const ExcelScreen = () => {
  const {
    data: csvData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['csvData'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/excel`);
      return await response.text();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { tableColumns, tableData } = useMemo(() => {
    if (!csvData) return { tableColumns: [], tableData: [] };

    // Parse CSV string to array
    const { data: parsedData } = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    });

    if (parsedData.length === 0) {
      return { tableColumns: [], tableData: [] };
    }

    // Create columns configuration for ant-design Table
    const tableColumns = Object.keys(parsedData[0])
      .filter((key) => !COLUMNS_TO_EXCLUDE.includes(key))
      .map((key) => ({
        title: key,
        dataIndex: key,
        key: key,
        ellipsis: true,
        render: (text: string) => {
          const displayText = safeToString(text);
          return (
            <div
              className="whitespace-pre-wrap break-words max-w-xs"
              style={{
                maxHeight: '100px',
                overflow: 'auto',
              }}
            >
              {displayText}
            </div>
          );
        },
        sorter: (a, b) => {
          const valueA = safeToString(a[key]);
          const valueB = safeToString(b[key]);

          if (!isNaN(valueA) && !isNaN(valueB)) {
            return Number(valueA) - Number(valueB);
          }
          return valueA.localeCompare(valueB);
        },
        filters: [...new Set(parsedData.map((item) => item[key]))]
          .filter(Boolean)
          .map((value) => ({
            text: safeToString(value),
            value: safeToString(value),
          })),
        onFilter: (value, record) => {
          const recordValue = safeToString(record[key]);
          return recordValue.toLowerCase() === value.toString().toLowerCase();
        },
      }));

    // Add key property to each row for ant-design Table
    const tableData = parsedData.map((row, index) => {
      const filteredRow = Object.fromEntries(
        Object.entries(row)
          .filter(([key]) => !COLUMNS_TO_EXCLUDE.includes(key))
          .map(([key, value]) => [key, safeToString(value)])
      );
      return {
        ...filteredRow,
        key: index,
      };
    });

    return { tableColumns, tableData };
  }, [csvData]);

  if (isLoading) return <Spin />;
  if (error)
    return (
      <Alert
        message="Error"
        description="Failed to load CSV data. Please try again later."
        type="error"
        showIcon
      />
    );

  return (
    <div className="p-4">
      <Table
        columns={tableColumns}
        dataSource={tableData}
        scroll={{ x: 'max-content' }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        size="middle"
        bordered
      />
    </div>
  );
};

export default ExcelScreen;

