import { Button, Modal, Typography, message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Email, TicketRequest } from '@/types/types';
import { API_BASE_URL } from '@/types/constants';
import { stripHtml } from '@/utils/stringUtils';
const { Title, Text } = Typography;

interface EmailModalProps {
  email: Email | null;
  isOpen: boolean;
  onClose: () => void;
}

const EmailModal = ({ email, isOpen, onClose }: EmailModalProps) => {
  const queryClient = useQueryClient();
  const createTicket = useMutation({
    mutationFn: async (data: TicketRequest) => {
      const response = await fetch(`${API_BASE_URL}/ticket/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      message.success('Ticket created successfully');
      onClose();
    },
    onError: (error) => {
      message.error('Failed to create ticket: ' + error.message);
    },
  });

  const handleCreateTicket = () => {
    if (email) {
      createTicket.mutate({ subject: email.subject, body: email.body });
    }
  };

  return (
    <Modal
      title="Email Details"
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
        email?.status === 'unprocessed' && (
          <Button
            key="create-ticket"
            type="primary"
            onClick={handleCreateTicket}
            loading={createTicket.isPending}
          >
            Create Ticket
          </Button>
        ),
      ]}
      width={700}
    >
      {email && (
        <div className="space-y-4">
          <div>
            <Title level={5}>ID</Title>
            <Text>{email.id}</Text>
          </div>
          <div>
            <Title level={5}>From</Title>
            <Text>{email.from_}</Text>
          </div>
          <div>
            <Title level={5}>Subject</Title>
            <Text>{email.subject}</Text>
          </div>
          <div>
            <Title level={5}>Body</Title>
            <Text style={{ whiteSpace: 'pre-wrap' }}>{stripHtml(email.body)}</Text>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default EmailModal;

