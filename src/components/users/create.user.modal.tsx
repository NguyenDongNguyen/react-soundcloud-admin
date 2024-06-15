import { Modal, Input, notification, Select, Form, InputNumber } from 'antd';
const { Option } = Select;

interface IProps {
    access_token: string;
    getData: any;
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (v: boolean) => void;
}

const CreateUserModal = (props: IProps) => {
    const { access_token, getData, isCreateModalOpen, setIsCreateModalOpen } = props;

    const [form] = Form.useForm();

    const handleCloseCreateModal = () => {
        form.resetFields();
        setIsCreateModalOpen(false);
    };

    const onFinish = async (values: any) => {
        console.log('Success:', values);
        const { name, email, password, birthday, role } = values;

        const data = { name, email, password, birthday, role };
        const res = await fetch('http://localhost:8080/api/v1/create-users', {
            method: 'POST',
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
                message: 'Tạo mới user thành công.',
            });
            handleCloseCreateModal();
        } else {
            ///
            notification.error({
                message: 'Có lỗi xảy ra',
                description: JSON.stringify(d.message),
            });
        }
    };

    return (
        <Modal
            title="Add new user"
            open={isCreateModalOpen}
            onOk={() => form.submit()}
            onCancel={() => handleCloseCreateModal()}
            maskClosable={false}
        >
            <Form name="basic" onFinish={onFinish} layout="vertical" form={form}>
                <Form.Item
                    style={{ marginBottom: 5 }}
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input your name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    style={{ marginBottom: 5 }}
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input type="email" />
                </Form.Item>

                <Form.Item
                    style={{ marginBottom: 5 }}
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    style={{ marginBottom: 5 }}
                    label="Birthday"
                    name="birthday"
                    rules={[{ required: true, message: 'Please input your birthday!' }]}
                >
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    style={{ marginBottom: 5 }}
                    name="role"
                    label="Role"
                    rules={[{ required: true }]}
                >
                    <Select
                        placeholder="Select a option and change input text above"
                        // onChange={onGenderChange}
                        allowClear
                    >
                        <Option value="USER">User</Option>
                        <Option value="ADMIN">Admin</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateUserModal;
