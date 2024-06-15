import { useEffect, useState } from 'react';
// import '../../styles/users.css';
import { Table, notification, Select, Form, Row, Col, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import InputSearch from './input.search';
import UserViewDetail from './user.vip.detail';

export interface IUsersVip {
    id: string;
    trangThai: boolean;
    ThanhVienId: number;
    ThanhVien: {
        email: string;
        id: number;
        loaiTk: string;
        quyen: string;
        ten: string;
    };
    createdAt: string;
    updatedAt: string;
}

const UsersVipTable = () => {
    const [listUsers, setListUsers] = useState([]);
    console.log('🚀 ~ UsersVipTable ~ listUsers:', listUsers);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [dataViewDetail, setDataViewDetail] = useState<IUsersVip | null>(null);

    const access_token = localStorage.getItem('access_token') as string;

    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0,
    });

    useEffect(() => {
        //update
        getData();
    }, []);

    //Promise
    const getData = async () => {
        const res = await fetch(
            `http://localhost:8080/api/v1/all-users-vip?current=${meta.current}&pageSize=${meta.pageSize}`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const d = await res.json();
        if (!d.data) {
            notification.error({
                message: JSON.stringify(d.message),
            });
        }
        setListUsers(d.data.result);
        setMeta({
            current: d.data.meta.current,
            pageSize: d.data.meta.pageSize,
            pages: d.data.meta.pages,
            total: d.data.meta.total,
        });
    };

    const handleAcceptTrack = async (value: boolean, data: any) => {
        const res = await fetch(`http://localhost:8080/api/v1/users-vip`, {
            method: 'PATCH',
            body: JSON.stringify({ id: data.id, status: value }),
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
        });

        const d = await res.json();
        if (d.data) {
            notification.success({
                message: 'Updated status user VIP success !',
            });
            await getData();
        } else {
            notification.error({
                message: JSON.stringify(d.message),
            });
        }
    };

    const columns: ColumnsType<IUsersVip> = [
        {
            title: 'Email',
            dataIndex: ['ThanhVien', 'email'],
            render: (text, record, index) => {
                return (
                    <a
                        href="#"
                        onClick={() => {
                            setDataViewDetail(record);
                            setOpenViewDetail(true);
                        }}
                    >
                        {record.ThanhVien.email}
                    </a>
                );
            },
        },
        {
            title: 'Name',
            dataIndex: ['ThanhVien', 'ten'],
        },
        {
            title: 'Role',
            dataIndex: ['ThanhVien', 'quyen'],
        },
        {
            title: 'Actions',
            render: (value, record) => {
                return (
                    <div>
                        <Form.Item
                            style={{ marginBottom: 5 }}
                            name="role"
                            rules={[{ required: true }]}
                        >
                            <Select
                                onChange={(value) => handleAcceptTrack(value, record)}
                                allowClear
                                // defaultValue={false}
                                defaultValue={record.trangThai}
                            >
                                <Select.Option key={'false'} value={false}>
                                    Chờ Duyệt
                                </Select.Option>
                                <Select.Option key={'true'} value={true}>
                                    Đã Duyệt
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                );
            },
        },
    ];

    const handleOnChange = async (page: number, pageSize: number) => {
        const res = await fetch(
            `http://localhost:8080/api/v1/users?current=${page}&pageSize=${pageSize}`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const d = await res.json();
        console.log('🚀 ~ handleOnChange ~ d:', d);
        if (!d.data) {
            notification.error({
                message: JSON.stringify(d.message),
            });
        }
        setListUsers(d.data.result);
        setMeta({
            current: d.data.meta.current,
            pageSize: d.data.meta.pageSize,
            pages: d.data.meta.pages,
            total: d.data.meta.total,
        });
    };

    const handleFilter = async (keyword: string, values: string) => {
        console.log(keyword, values);
        const res = await fetch(
            `http://localhost:8080/api/v1/all-users-vip?current=${1}&pageSize=${10}`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ [keyword]: values }),
            }
        );

        const d = await res.json();
        if (!d.data) {
            notification.error({
                message: JSON.stringify(d.message),
            });
        }
        setListUsers(d.data.result);
    };

    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Table List Users VIP</span>
                <span style={{ display: 'flex', gap: 15 }}>
                    <Button
                        type="text"
                        onClick={() => {
                            getData();
                        }}
                    >
                        <ReloadOutlined />
                    </Button>
                </span>
            </div>
        );
    };

    return (
        <div>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <InputSearch handleFilter={handleFilter} />
                </Col>
                <Col span={24}>
                    <Table
                        title={renderHeader}
                        columns={columns}
                        dataSource={listUsers}
                        rowKey={'_id'}
                        pagination={{
                            current: meta.current,
                            pageSize: meta.pageSize,
                            total: meta.total,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} items`,
                            onChange: (page: number, pageSize: number) =>
                                handleOnChange(page, pageSize),
                            showSizeChanger: true,
                        }}
                    />
                </Col>
            </Row>

            <UserViewDetail
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
        </div>
    );
};

export default UsersVipTable;
