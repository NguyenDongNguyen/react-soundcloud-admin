import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { Card, Col, Row, Statistic, notification } from 'antd';
import { valueType } from 'antd/es/statistic/utils';
import ReportCharts from './components/report/report.chart';
import { TeamOutlined, CustomerServiceOutlined } from '@ant-design/icons';

const ManageDashboardPage = () => {
    const [listUsers, setListUsers] = useState([]);
    const [listTracks, setListTracks] = useState([]);

    const access_token = localStorage.getItem('access_token') as string;

    useEffect(() => {
        getDataUser();
        getDataTrack();
    }, []);

    const getDataUser = async () => {
        const res = await fetch(
            `http://localhost:8080/api/v1/users?current=${1}&pageSize=${100}`,
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
    };

    const getDataTrack = async () => {
        const res = await fetch(
            `http://localhost:8080/api/v1/tracks?current=${1}&pageSize=${100}`,
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
    };

    const formatter = (value: valueType) => (
        <CountUp end={value as number} duration={5} separator="," />
    );

    return (
        <div style={{ margin: 15 }}>
            <Row gutter={[40, 40]}>
                <Col span={10}>
                    <Card title="" bordered={false}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                            }}
                        >
                            <TeamOutlined
                                style={{
                                    fontSize: '30px',
                                    padding: '15px',
                                    color: '#4154f1',
                                    backgroundColor: '#e8e8e8',
                                    borderRadius: '50%',
                                }}
                            />
                            <Statistic
                                title="All Users"
                                value={listUsers.length}
                                formatter={formatter}
                                style={{
                                    color: '#012970 !important',
                                    fontWeight: '600',
                                }}
                            />
                        </div>
                    </Card>
                </Col>
                <Col span={10}>
                    <Card title="" bordered={false} style={{ display: 'flex' }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                            }}
                        >
                            <CustomerServiceOutlined
                                style={{
                                    fontSize: '30px',
                                    padding: '15px',
                                    color: '#4154f1',
                                    backgroundColor: '#e8e8e8',
                                    borderRadius: '50%',
                                }}
                            />
                            <Statistic
                                title="All Tracks"
                                value={listTracks.length}
                                precision={2}
                                formatter={formatter}
                                style={{
                                    color: '#012970 !important',
                                    fontWeight: '600',
                                }}
                            />
                        </div>
                    </Card>
                </Col>
            </Row>

            <div
                style={{
                    marginTop: '30px',
                    background: '#fff',
                    padding: '0 20px 20px 20px',
                }}
            >
                <h5
                    style={{
                        padding: '20px 0 5px 0',
                        fontSize: '18px',
                        fontWeight: '500',
                        color: '#012970',
                        letterSpacing: '1px',
                    }}
                >
                    Report
                </h5>
                <ReportCharts />
            </div>
        </div>
    );
};

export default ManageDashboardPage;
