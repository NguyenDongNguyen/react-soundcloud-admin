import { useEffect, useState } from 'react';
// import '../../styles/users.css';
import { Table, Button, notification, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';

export interface ITracks {
    id: string;
    tieuDe: string;
    moTa: string;
    theLoai: string;
    linkNhac: string;
    ThanhVien: {
        ten: string;
    };
}

const TracksTable = () => {
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
            `http://localhost:8080/api/v1/tracks?current=${meta.current}&pageSize=${meta.pageSize}`,
            {
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

    const confirm = async (track: ITracks) => {
        const res = await fetch(`http://localhost:8080/api/v1/tracks/${track.id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
        });

        const d = await res.json();
        if (d.data) {
            notification.success({
                message: 'Xóa track thành công.',
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
                        <Popconfirm
                            title="Delete the track"
                            description={`Are you sure to delete this track. name = ${record.tieuDe}?`}
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
            `http://localhost:8080/api/v1/tracks?current=${page}&pageSize=${pageSize}`,
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
        setListTracks(d.data.result);
        setMeta({
            current: d.data.meta.current,
            pageSize: d.data.meta.pageSize,
            pages: d.data.meta.pages,
            total: d.data.meta.total,
        });
    };

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <h2>Table Tracks</h2>
            </div>

            <Table
                columns={columns}
                dataSource={listTracks}
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
        </div>
    );
};

export default TracksTable;
