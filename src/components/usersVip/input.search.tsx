import { Col, Form, Input, Row, theme } from 'antd';

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
                        name={`email`}
                        label={`Email`}
                    >
                        <Input
                            id="keyword"
                            onChange={(e) => handleFilter('email', e.target.value)}
                            placeholder="Email"
                        />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item
                        labelCol={{ span: 24 }} //whole column
                        name={`name`}
                        label={`Name`}
                    >
                        <Input
                            id="keyword"
                            onChange={(e) => handleFilter('name', e.target.value)}
                            placeholder="Name"
                        />
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
