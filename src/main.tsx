import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { createBrowserRouter, Outlet, RouterProvider, Link } from 'react-router-dom';
import UsersPage from './screens/users.page.tsx';

import {
    AppstoreOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    TeamOutlined,
    SoundOutlined,
    BookOutlined,
    SketchOutlined,
    UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu, Layout, Button, theme } from 'antd';
// import './App.scss';
import TracksPage from './screens/tracks.page.tsx';
import AcceptTrackPage from './screens/acceptTrack.page.tsx';
import UsersVipPage from './screens/usersVip.page.tsx';
const { Header, Sider, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        key: 'dashboard',
        icon: <AppstoreOutlined />,
        label: <Link to="/">Dashboard</Link>,
    },
    {
        key: 'manage-users',
        icon: <UserOutlined />,
        label: 'Manage Users',
        children: [
            {
                label: <Link to="/users">Manage Users</Link>,
                key: 'users',
                icon: <TeamOutlined />,
            },
            {
                key: 'file1',
                icon: <TeamOutlined />,
                label: 'Files1',
            },
        ],
    },
    {
        label: <Link to="/tracks">Manage Tracks</Link>,
        key: 'tracks',
        icon: <SoundOutlined />,
    },
    {
        label: <Link to="/accept-track">Accept Track</Link>,
        key: 'accept-track',
        icon: <BookOutlined />,
    },
    {
        label: <Link to="/users-vip">Manage Users VIP</Link>,
        key: 'users-vip',
        icon: <SketchOutlined />,
    },
];

const LayoutAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    useEffect(() => {
        getData();
        if (window.location.pathname.includes('/users')) {
            setActiveMenu('users');
        }
        if (window.location.pathname.includes('/tracks')) {
            setActiveMenu('tracks');
        }
        if (window.location.pathname.includes('/accept-track')) {
            setActiveMenu('accept-track');
        }
        if (window.location.pathname.includes('/users-vip')) {
            setActiveMenu('users-vip');
        }
    }, []);

    const getData = async () => {
        const res = await fetch('http://localhost:8080/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: 'admin@gmail.com',
                password: '123456',
            }),
        });
        const d = await res.json();
        if (d.data) {
            localStorage.setItem('access_token', d.data.access_token);
        }
    };

    return (
        <Layout className="layout-admin" style={{ minHeight: '100vh' }}>
            <Sider theme="light" trigger={null} collapsible collapsed={collapsed}>
                <div style={{ height: 32, margin: 16, textAlign: 'center' }}>Admin</div>
                <Menu
                    // defaultSelectedKeys={[activeMenu]}
                    selectedKeys={[activeMenu]}
                    mode="inline"
                    items={items}
                    onClick={(e) => setActiveMenu(e.key)}
                />
            </Sider>
            <Layout className="page-layout">
                <Header
                    className="admin-header"
                    style={{
                        background: colorBgContainer,
                        paddingInline: '0',
                    }}
                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>
                <Content className="admin-content">
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

const router = createBrowserRouter([
    {
        path: '/',
        element: <LayoutAdmin />,
        children: [
            { index: true, element: <App /> },
            {
                path: 'users',
                element: <UsersPage />,
            },
            {
                path: 'tracks',
                element: <TracksPage />,
            },
            {
                path: 'accept-track',
                element: <AcceptTrackPage />,
            },
            {
                path: 'users-vip',
                element: <UsersVipPage />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        {/* <App /> */}
        <RouterProvider router={router} />
    </React.StrictMode>
);
