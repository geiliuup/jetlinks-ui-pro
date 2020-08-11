import { Modal, } from "antd";
import React from "react";
import { Password, Input } from '@formily/antd-components';
import { SchemaForm, createFormActions, FormEffectHooks } from "@formily/antd";

interface Props {
    close: Function;
    data: Partial<USER.UserItem>;
}
const Save: React.FC<Props> = (props) => {


    const { onFieldValueChange$ } = FormEffectHooks;

    const useLinkageValidateEffects = () => {
        const { setFieldState, getFieldState } = createFormActions()
        onFieldValueChange$('*(password,confirm)').subscribe(fieldState => {
            const selfName = fieldState.name
            const selfValue = fieldState.value
            const otherName = selfName == 'password' ? 'confirm' : 'password'
            const otherValue = getFieldState(otherName, state => state.value)
            setFieldState(otherName, state => {
                if (selfValue && otherValue && selfValue !== otherValue) {
                    state.errors = ['两次密码输入不一致']
                } else {
                    state.errors = ['']
                }
            })
            setFieldState(selfName, state => {
                if (selfValue && otherValue && selfValue !== otherValue) {
                    state.errors = ['两次密码输入不一致']
                } else {
                    state.errors = ['']
                }
            })
        })
    }
    const actions = createFormActions();
    return (
        <Modal
            visible
            title="编辑用户"
            onCancel={() => props.close()}
            onOk={() => {
                actions.validate().then(res => {
                    actions.getFormState(state => {
                        console.log(state, 'state');
                    });
                });

            }}
        >
            <SchemaForm
                actions={actions}
                labelCol={6}
                wrapperCol={16}
                effects={() => {
                    useLinkageValidateEffects()
                }}
                components={{ Input, Password }}
                schema={{
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            title: '姓名',
                            "x-rules": {
                                required: true,
                                message: '请输入姓名',
                            },

                            "x-component": 'input'
                        },
                        username: {
                            type: 'string',
                            "x-rules": {
                                required: true,
                                message: '请输入用户名',
                            },
                            title: '用户名',
                            "x-component": 'Input'
                        },
                        password: {
                            type: 'password',
                            title: '密码',
                            "x-props": {
                                "checkStrength": true
                            },

                            required: true,
                            "x-component": 'password'
                        },
                        confirm: {
                            type: 'password',
                            title: '确认密码',
                            "x-props": {
                                "checkStrength": true
                            },
                            required: true,
                            "x-component": 'password'
                        }
                    }
                }}
            >
            </SchemaForm>
        </Modal>
    )
}
export default Save;