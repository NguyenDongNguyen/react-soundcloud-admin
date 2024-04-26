import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { Card, Col, Row, Statistic, notification } from 'antd';
import { valueType } from 'antd/es/statistic/utils';

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
                        <Statistic
                            title="All Users"
                            value={listUsers.length}
                            formatter={formatter}
                        />
                    </Card>
                </Col>
                <Col span={10}>
                    <Card title="" bordered={false}>
                        <Statistic
                            title="All Tracks"
                            value={listTracks.length}
                            precision={2}
                            formatter={formatter}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ManageDashboardPage;
