'use client';

import { API_BASE_URL } from '@/types/constants';
import { Ticket } from '@/types/types';
import { stripHtml } from '@/utils/stringUtils';
import { useQuery } from '@tanstack/react-query';
import { Spin, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

const TicketTable = () => {
  const { data, isLoading, isError, error } = useQuery<Ticket[]>({
    queryKey: ['tickets'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/ticket`);
      return await response.json();
    },
  });

  const columns: ColumnsType<Ticket> | undefined = [
    { title: 'Cause Code', dataIndex: 'cause_code', key: 'causeCode' },
    { title: 'Priority', dataIndex: 'priority', key: 'priority' },
    {
      title: 'Brief Description',
      dataIndex: 'brief_description',
      key: 'briefDescription',
    },
    { title: 'Assignment', dataIndex: 'assignment', key: 'assignment' },
    {
      title: 'Summarized Issue',
      dataIndex: 'summarized_issue',
      key: 'summarizedIssue',
    },
    { title: 'Reason', dataIndex: 'reason', key: 'reason' },
    { title: 'Raw Email', dataIndex: 'raw_email', key: 'rawEmail', ellipsis: true, render: (text: string) => stripHtml(text) },
  ];

  if (isLoading) return <Spin />;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.cause_code}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default TicketTable;
