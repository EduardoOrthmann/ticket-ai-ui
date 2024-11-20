'use client';

import TicketModal from '@/components/ticket-modal/TicketModal';
import { api } from '@/lib/axios';
import { Ticket } from '@/types/types';
import { useQuery } from '@tanstack/react-query';
import { Button, Space, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

const TicketTable = () => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, isError, error } = useQuery<Ticket[]>({
    queryKey: ['tickets'],
    queryFn: async () => {
      const response = await api.get<Ticket[]>('/ticket');
      return response.data;
    },
  });

  const showTicketDetails = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const columns: ColumnsType<Ticket> | undefined = [
    { title: 'Cause Code', dataIndex: 'cause_code', key: 'causeCode' },
    { title: 'Priority', dataIndex: 'priority', key: 'priority' },
    {
      title: 'Brief Description',
      dataIndex: 'brief_description',
      key: 'briefDescription',
    },
    {
      title: 'Summarized Issue',
      dataIndex: 'summarized_issue',
      key: 'summarizedIssue',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Ticket) => (
        <Space>
          <Button onClick={() => showTicketDetails(record)} type="default">
            View Details
          </Button>
        </Space>
      ),
    },
  ];

  if (isLoading) return <Spin />;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.raw_email}
        pagination={{ pageSize: 10 }}
      />

      <TicketModal
        ticket={selectedTicket}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default TicketTable;

