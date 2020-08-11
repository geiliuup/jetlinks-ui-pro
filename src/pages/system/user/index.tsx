import { PageContainer } from "@ant-design/pro-layout"
import React, { useRef, useState } from "react";
import ProTable, { ProColumns, ActionType } from "@ant-design/pro-table";
import { Tag, Button, Dropdown, Menu, message, Divider } from "antd";
import { PlusOutlined, DownOutlined } from "@ant-design/icons";
import { list } from "./service";
import Save from "./save";

const User: React.FC<{}> = () => {
    const [saveVisible, setSaveVisible] = useState<boolean>(false);
    const [current, setCurrent] = useState<Partial<USER.UserItem>>({});

    const actionRef = useRef<ActionType>();
    const columns: ProColumns<USER.UserItem>[] = [
        {
            title: '姓名',
            dataIndex: 'name',
            rules: [
                {
                    required: true,
                    message: '姓名为必填项',
                }
            ]
        },
        {
            title: '用户名',
            dataIndex: 'username',
            rules: [
                {
                    required: true,
                    message: '用户名为必填项',
                }
            ]
        },
        {
            title: '状态',
            dataIndex: 'status',
            valueEnum: {
                0: { text: '正常', status: 1 },
                1: { text: '禁用', status: 0 }
            },
            renderText: (text: number) => <Tag color={text === 1 ? '#108ee9' : '#f50'}>{text === 1 ? '正常' : '已禁用'}</Tag>
        },
        {
            title: '操作',
            render: (_, record) => (
                <>
                    <a onClick={() => {
                        setCurrent(record);
                        setSaveVisible(true)
                    }}>
                        编辑
                    </a>
                    <Divider type="vertical" />
                    <a>赋权</a>
                    <Divider type="vertical" />
                    <a>删除</a>
                </>
            )
        }
    ];

    /**
     *  删除节点
     * @param selectedRows
     */
    const handleRemove = async (selectedRows: USER.UserItem[]) => {
        const hide = message.loading('正在删除');
        if (!selectedRows) return true;
        try {

            hide();
            message.success('删除成功，即将刷新');
            return true;
        } catch (error) {
            hide();
            message.error('删除失败，请重试');
            return false;
        }
    };

    return (
        <PageContainer>
            <ProTable<USER.UserItem>
                headerTitle="用户管理"
                actionRef={actionRef}
                rowKey="id"
                toolBarRender={(action, { selectedRows }) => [
                    <Button type="primary" onClick={() => setSaveVisible(true)}>
                        <PlusOutlined /> 新建
                    </Button>,
                    selectedRows && selectedRows.length > 0 && (
                        <Dropdown
                            overlay={
                                <Menu
                                    onClick={async (e) => {
                                        if (e.key === 'remove') {
                                            await handleRemove(selectedRows);
                                            action.reload();
                                        }
                                    }}
                                    selectedKeys={[]}
                                >
                                    <Menu.Item key="remove">批量删除</Menu.Item>
                                    <Menu.Item key="approval">批量审批</Menu.Item>
                                </Menu>
                            }
                        >
                            <Button>
                                批量操作 <DownOutlined />
                            </Button>
                        </Dropdown>
                    ),
                ]}
                tableAlertRender={({ selectedRowKeys, selectedRows }) => (
                    <div>
                        已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                        <span>
                            服务调用次数总计 {selectedRows.reduce((pre, item) => pre + item.callNo, 0)} 万
                        </span>
                    </div>
                )}
                request={(params, sorter, filter) => list({ ...params, sorter, filter })}
                columns={columns}
                rowSelection={{}}
            />
            {
                saveVisible && (
                    <Save
                        data={current}
                        close={() => setSaveVisible(false)}
                    />
                )
            }
        </PageContainer>
    )
}
export default User;