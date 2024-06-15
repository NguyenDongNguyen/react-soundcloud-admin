import { Badge, Drawer } from 'antd';
import { Descriptions } from 'antd';
import moment from 'moment';
import { IUsers } from './users.table';

interface Iprops {
    openViewDetail: boolean;
    setOpenViewDetail: (v: boolean) => void;
    dataViewDetail: IUsers | null;
    setDataViewDetail: any;
}

const UserViewDetail = ({
    openViewDetail,
    setOpenViewDetail,
    dataViewDetail,
    setDataViewDetail,
}: Iprops) => {
    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    };

    return (
        <>
            <Drawer
                title="Basic Drawer"
                width={'50vw'}
                placement="right"
                onClose={onClose}
                open={openViewDetail}
            >
                <Descriptions title="User Info" bordered column={2}>
                    <Descriptions.Item label="Id">{dataViewDetail?.id}</Descriptions.Item>
                    <Descriptions.Item label="Fullname">
                        {dataViewDetail?.ten}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                        {dataViewDetail?.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="Account Type">
                        {dataViewDetail?.loaiTk}
                    </Descriptions.Item>

                    <Descriptions.Item label="Role" span={2}>
                        <Badge status="processing" text={dataViewDetail?.quyen} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {moment(dataViewDetail?.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {moment(dataViewDetail?.updatedAt).format('DD-MM-YYYY HH:mm:ss')}
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    );
};

export default UserViewDetail;
