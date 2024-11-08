'use client';

import EmailModal from '@/components/email-modal/EmailModal';
import { API_BASE_URL } from '@/types/constants';
import { Email, TicketRequest } from '@/types/types';
import { stripHtml } from '@/utils/stringUtils';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, message, Space, Spin, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
const { Text } = Typography;
import { useState } from 'react';

const EmailTable = () => {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError, error } = useQuery<Email[]>({
    queryKey: ['emails'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/email`);
      return await response.json();
    },
  });

  const queryClient = useQueryClient();
  const createTicket = useMutation({
    mutationFn: async (data: TicketRequest) => {
      const response = await fetch(`${API_BASE_URL}/ticket/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      message.success('Ticket created successfully');
    },
    onError: (error) => {
      message.error('Failed to create ticket: ' + error.message);
    },
  });

  const handleCreateTicket = async (email: Email) => {
    createTicket.mutate({ subject: email.subject, body: email.body });
  };

  const showEmailDetails = (email: Email) => {
    setSelectedEmail(email);
    setIsModalOpen(true);
  };

  const columns: ColumnsType<Email> | undefined = [
    { title: 'Subject', dataIndex: 'subject', key: 'subject', ellipsis: true },
    { title: 'Body', dataIndex: 'body', key: 'body', ellipsis: true, render: (text: string) => stripHtml(text) },
    {
      title: 'Status',
      key: 'status',
      render: (_: unknown, record: Email) =>
        record.status === 'processed' ? (
          <Space>
            <CheckCircleOutlined style={{ color: 'green' }} />
            <Text type="success">Processed</Text>
          </Space>
        ) : (
          <Space>
            <ExclamationCircleOutlined style={{ color: 'red' }} />
            <Text type="danger">Pending</Text>
          </Space>
        ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Email) => (
        <Space>
          <Button onClick={() => showEmailDetails(record)} type="default">
            View Details
          </Button>
          {record.status === 'unprocessed' && (
            <Button
              onClick={() => handleCreateTicket(record)}
              loading={
                createTicket.isPending &&
                createTicket.variables?.subject === record.subject
              }
              type="primary"
            >
              Create Ticket
            </Button>
          )}
        </Space>
      ),
    },
  ];

  if (isLoading) return <Spin />;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.id}
        pagination={{ pageSize: 10 }}
      />

      <EmailModal
        email={selectedEmail}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default EmailTable;

