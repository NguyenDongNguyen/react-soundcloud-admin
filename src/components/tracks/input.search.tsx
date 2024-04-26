import React, { useEffect, useMemo, useState } from 'react';
import { Button, Col, Form, Input, Row, Select, theme } from 'antd';

interface Iprops {
    handleFilter: (a: string, b: any) => void;
}

const AdvancedSearchForm = ({ handleFilter }: Iprops) => {
    const { token } = theme.useToken();
    const [form] = Form.useForm();

    const formStyle = {
        maxWidth: 'none',
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        padding: 24,
    };

    return (
        <Form form={form} name="advanced_search" style={formStyle}>
            <Row gutter={24}>
                <Col span={12}>
                    <Form.Item
                        labelCol={{ span: 24 }} //whole column
                        name={`title`}
                        label={`Title`}
                    >
                        <Input
                            id="keyword"
                            onChange={(e) => handleFilter('title', e.target.value)}
                            placeholder="Tên bài nhạc"
                        />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item
                        labelCol={{ span: 24 }} //whole column
                        name={`category`}
                        label={`Category`}
                    >
                        <Select
                            id="category"
                            allowClear
                            onChange={(values) => handleFilter('category', values)}
                            placeholder="Thể loại"
                            style={{ width: '100%' }}
                        >
                            <Select.Option key={'CHILL'} value={'CHILL'}>
                                {'CHILL'}
                            </Select.Option>
                            <Select.Option key={'WORKOUT'} value={'WORKOUT'}>
                                {'WORKOUT'}
                            </Select.Option>
                            <Select.Option key={'PARTY'} value={'PARTY'}>
                                {'PARTY'}
                            </Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

// https://stackblitz.com/run?file=demo.tsx
// https://ant.design/components/form
const InputSearch = ({ handleFilter }: Iprops) => {
    return (
        <div>
            <AdvancedSearchForm handleFilter={handleFilter} />
        </div>
    );
};

export default InputSearch;
