import { useEffect, useState } from 'react';
// import '../../styles/users.css';
import { Table, Button, notification, Form, Select, Row, Col } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import InputSearch from './input.search';

export interface ITracks {
    id: string;
    tieuDe: string;
    moTa: string;
    theLoai: string;
    linkNhac: string;
    isPublic: boolean;
    ThanhVien: {
        ten: string;
    };
}

const AcceptTrackTable = () => {
    const [listTracks, setListTracks] = useState([]);

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
            `http://localhost:8080/api/v1/tracks-unPublic?current=${meta.current}&pageSize=${meta.pageSize}`,
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
        setListTracks(d.data.result);
        setMeta({
            current: d.data.meta.current,
            pageSize: d.data.meta.pageSize,
            pages: d.data.meta.pages,
            total: d.data.meta.total,
        });
    };

    const handleAcceptTrack = async (value: boolean, data: any) => {
        const res = await fetch(`http://localhost:8080/api/v1/tracks-access`, {
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
                message: 'Updated status track success !',
            });
            await getData();
        } else {
            notification.error({
                message: JSON.stringify(d.message),
            });
        }
    };

    const columns: ColumnsType<ITracks> = [
        {
            title: 'STT',
            render: (value, record, index) => {
                return <>{(meta.current - 1) * meta.pageSize + index + 1}</>;
            },
        },
        {
            title: 'Title',
            dataIndex: 'tieuDe',
        },
        {
            title: 'Description',
            dataIndex: 'moTa',
        },
        {
            title: 'Category',
            dataIndex: 'theLoai',
        },
        {
            title: 'Track url',
            dataIndex: 'linkNhac',
        },
        {
            title: 'Uploader',
            dataIndex: ['ThanhVien', 'ten'],
            // render: (value, record, index) => {
            //     return <div>{record.uploader.name}</div>;
            // },
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
                                defaultValue={false}
                            >
                                <Select.Option key={`${record.id}-false`} value={false}>
                                    Chờ Duyệt
                                </Select.Option>
                                <Select.Option key={`${record.id}-true`} value={true}>
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
            `http://localhost:8080/api/v1/tracks-unPublic?current=${page}&pageSize=${pageSize}`,
            {
                method: 'POST',
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
        setListTracks(d.data.result);
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
            `http://localhost:8080/api/v1/tracks-unPublic?current=${1}&pageSize=${10}`,
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
        setListTracks(d.data.result);
    };

    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Table List Accept Tracks</span>
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
                        dataSource={listTracks}
                        rowKey={(record) => record.id}
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
        </div>
    );
};

export default AcceptTrackTable;
