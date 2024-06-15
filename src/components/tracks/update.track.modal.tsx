import { useState, useEffect } from 'react';
import { Modal, Input, notification, Select, Form, InputNumber } from 'antd';
import { ITracks } from './tracks.table';

const { Option } = Select;
interface IProps {
    access_token: string;
    getData: any;
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    dataUpdate: null | ITracks;
    setDataUpdate: any;
}

const UpdateUserModal = (props: IProps) => {
    const {
        access_token,
        getData,
        isUpdateModalOpen,
        setIsUpdateModalOpen,
        dataUpdate,
        setDataUpdate,
    } = props;

    const [form] = Form.useForm();

    useEffect(() => {
        if (dataUpdate) {
            //code
            form.setFieldsValue({
                title: dataUpdate.tieuDe,
                description: dataUpdate.moTa,
                category: dataUpdate.theLoai,
                uploader: dataUpdate.ThanhVien.ten,
            });
        }
    }, [dataUpdate]);

    const handleCloseCreateModal = () => {
        setIsUpdateModalOpen(false);
        form.resetFields();
        setDataUpdate(null);
    };

    const onFinish = async (values: any) => {
        const { title, description, category } = values;
        if (dataUpdate) {
            const data = {
                id: dataUpdate.id, //undefined
                title,
                description,
                category,
            };

            const res = await fetch('http://localhost:8080/api/v1/tracks', {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const d = await res.json();
            if (d.data) {
                //success
                await getData();
                notification.success({
                    message: 'Cập nhật track thành công.',
                });
                handleCloseCreateModal();
            } else {
                ///
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: JSON.stringify(d.message),
                });
            }
        }
    };

    return (
        <Modal
            title="Update a track"
            open={isUpdateModalOpen}
            onOk={() => form.submit()}
            onCancel={() => handleCloseCreateModal()}
            maskClosable={false}
        >
            <Form name="basic" onFinish={onFinish} layout="vertical" form={form}>
                <Form.Item
                    style={{ marginBottom: 5 }}
                    label="Title"
                    name="title"
                    rules={[{ required: true, message: 'Please input title track!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    style={{ marginBottom: 5 }}
                    label="Description"
                    name="description"
                    rules={[
                        { required: true, message: 'Please input description track!' },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    style={{ marginBottom: 5 }}
                    label="Category"
                    name="category"
                    rules={[{ required: true }]}
                >
                    <Select
                        placeholder="Select a option and change input text above"
                        // onChange={onGenderChange}
                        allowClear
                    >
                        <Option value="CHILL">CHILL</Option>
                        <Option value="WORKOUT">WORKOUT</Option>
                        <Option value="PARTY">PARTY</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    style={{ marginBottom: 5 }}
                    label="Uploader"
                    name="uploader"
                    rules={[
                        { required: true, message: 'Please input description track!' },
                    ]}
                >
                    <Input disabled />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateUserModal;
