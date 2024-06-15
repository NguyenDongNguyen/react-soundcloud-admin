import { Badge, Drawer } from 'antd';
import { Descriptions } from 'antd';
import moment from 'moment';
import { IUsersVip } from './manage.user';

interface Iprops {
    openViewDetail: boolean;
    setOpenViewDetail: (v: boolean) => void;
    dataViewDetail: IUsersVip | null;
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
                        {dataViewDetail?.ThanhVien.ten}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                        {dataViewDetail?.ThanhVien.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="Account Type">
                        {dataViewDetail?.ThanhVien.loaiTk}
                    </Descriptions.Item>

                    <Descriptions.Item label="Role" span={2}>
                        <Badge
                            status="processing"
                            text={dataViewDetail?.ThanhVien.quyen}
                        />
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
