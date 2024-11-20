import { Ticket } from '@/types/types';
import { stripHtml } from '@/utils/stringUtils';
import { Button, Modal, Typography } from 'antd';
const { Title, Text } = Typography;

interface TicketModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
}

const TicketModal = ({ ticket, isOpen, onClose }: TicketModalProps) => {
  return (
    <Modal
      title="Ticket Details"
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      width={700}
    >
      {ticket && (
        <div className="space-y-4">
          <div>
            <Title level={5}>Cause Code</Title>
            <Text>{ticket.cause_code}</Text>
          </div>
          <div>
            <Title level={5}>Priority</Title>
            <Text>{ticket.priority}</Text>
          </div>
          <div>
            <Title level={5}>Brief Description</Title>
            <Text>{ticket.brief_description}</Text>
          </div>
          <div>
            <Title level={5}>Assignment</Title>
            <Text>{ticket.assignment}</Text>
          </div>
          <div>
            <Title level={5}>Summarized Issue</Title>
            <Text>{ticket.summarized_issue}</Text>
          </div>
          <div>
            <Title level={5}>Reason</Title>
            <Text>{ticket.reason}</Text>
          </div>
          <div>
            <Title level={5}>Raw Email</Title>
            <Text style={{ whiteSpace: 'pre-wrap' }}>
              {stripHtml(ticket.raw_email)}
            </Text>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default TicketModal;

