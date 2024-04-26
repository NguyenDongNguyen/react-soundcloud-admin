import { useEffect, useState } from 'react';
// import '../../styles/users.css';
import { Table, Button, notification, Popconfirm, message, Row, Col } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    PlusOutlined,
    CloudUploadOutlined,
    ExportOutlined,
    ReloadOutlined,
} from '@ant-design/icons';
import CreateUserModal from './create.user.modal';
import UpdateUserModal from './update.user.modal';
import InputSearch from './input.search';

export interface IUsers {
    id: string;
    email: string;
    ten: string;
    ngaySinh: string;
    quyen: string;
}

const UsersTable = () => {
    const [listUsers, setListUsers] = useState([]);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    // generics(typescript)
    const [dataUpdate, setDataUpdate] = useState<null | IUsers>(null);

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
            `http://localhost:8080/api/v1/users?current=${meta.current}&pageSize=${meta.pageSize}`,
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

    const confirm = async (user: IUsers) => {
        const res = await fetch(`http://localhost:8080/api/v1/users/${user.id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
        });

        const d = await res.json();
        if (d.data) {
            notification.success({
                message: 'Xóa user thành công.',
            });
            await getData();
        } else {
            notification.error({
                message: JSON.stringify(d.message),
            });
        }
    };

    const columns: ColumnsType<IUsers> = [
        {
            title: 'Email',
            dataIndex: 'email',
            render: (value, record) => {
                return <div>{record.email}</div>;
            },
        },
        {
            title: 'Name',
            dataIndex: 'ten',
        },
        {
            title: 'Role',
            dataIndex: 'quyen',
        },
        {
            title: 'Actions',
            render: (value, record) => {
                return (
                    <div>
                        <button
                            onClick={() => {
                                setDataUpdate(record);
                                setIsUpdateModalOpen(true);
                            }}
                        >
                            Edit
                        </button>

                        <Popconfirm
                            title="Delete the user"
                            description={`Are you sure to delete this user. name = ${record.ten}?`}
                            onConfirm={() => confirm(record)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button style={{ marginLeft: 20 }} danger>
                                Delete
                            </Button>
                        </Popconfirm>
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
            `http://localhost:8080/api/v1/users?current=${1}&pageSize=${10}`,
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
                <span>Table List Users</span>
                <span style={{ display: 'flex', gap: 15 }}>
                    <Button
                        icon={<ExportOutlined />}
                        type="primary"
                        // onClick={handleExportData}
                    >
                        Export
                    </Button>

                    <Button
                        icon={<CloudUploadOutlined />}
                        type="primary"
                        // onClick={() => setOpenModalImport(true)}
                    >
                        Import
                    </Button>

                    <Button
                        icon={<PlusOutlined />}
                        type={'primary'}
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        Add new
                    </Button>

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

            <CreateUserModal
                access_token={access_token}
                getData={getData}
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
            />

            <UpdateUserModal
                access_token={access_token}
                getData={getData}
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
        </div>
    );
};

export default UsersTable;
