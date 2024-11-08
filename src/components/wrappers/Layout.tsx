'use client';

import { Layout, Menu, ConfigProvider, theme } from 'antd';
import { Header, Content } from 'antd/es/layout/layout';
import {
  FileGifOutlined,
  MailOutlined,
  FileExcelOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import TSystemsLogo from '../../../public/images/T-SYSTEMS-LOGO2013.svg';

const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = usePathname();

  const getSelectedKey = () => {
    switch (pathname) {
      case '/email':
        return '1';
      case '/ticket':
        return '2';
      case '/cause-code':
        return '3';
      default:
        return '1';
    }
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#e20074',
        },
        components: {
          Layout: {
            headerBg: '#e20074',
          },
          Menu: {
            itemBg: '#e20074',
            colorText: '#fff',
            horizontalItemSelectedBg: '#ff4d9e',
            horizontalItemSelectedColor: '#fff',
          },
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/">
            <Image
              src={TSystemsLogo}
              alt="logo"
              width={120}
              height={70}
              style={{ filter: 'invert(1) brightness(100) contrast(1)' }}
            />
          </Link>

          <Menu
            mode="horizontal"
            selectedKeys={[getSelectedKey()]}
            style={{ width: '100%' }}
            items={[
              {
                key: '1',
                icon: <MailOutlined />,
                label: <Link href="/email">Emails</Link>,
              },
              {
                key: '2',
                icon: <FileGifOutlined />,
                label: <Link href="/ticket">Tickets</Link>,
              },
              {
                key: '3',
                icon: <FileExcelOutlined />,
                label: <Link href="/cause-code">Cause Codes</Link>,
              },
            ]}
          />
        </Header>
        <Content style={{ padding: '30px 50px' }}>
          <div className="site-layout-content">{children}</div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default MainLayout;

