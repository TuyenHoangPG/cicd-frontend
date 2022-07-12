import React, { useContext, useEffect, useState, useMemo } from "react";
import { Modal, Form, Input, Select, Spin } from "antd";
import { AppContext } from "../../context/AppProvider";
import { addDocument } from "../../firebase/services";
import { AuthContext } from "../../context/AuthProvider";
import { debounce } from "lodash";
import Avatar from "antd/lib/avatar/avatar";
import firestore, { db } from "../../firebase/config";

function DebounceSelect({ fetchOptions, debounceTimeout = 300, ...props }) {
  const [isFetching, setIsFetching] = useState(false);
  const [options, setOptions] = useState([]);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      setOptions([]);
      setIsFetching(true);

      fetchOptions(value, props.currentMembers).then((newOptions) => {
        setOptions(newOptions);
        setIsFetching(false);
      });
    };
    return debounce(loadOptions, debounceTimeout);
  }, [setOptions, setIsFetching, fetchOptions, debounceTimeout]);

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={isFetching ? <Spin size="small" /> : null}
      {...props}
    >
      {options &&
        options.map((opt) => (
          <Select.Option key={opt.id} value={opt.value} title={opt.label}>
            <Avatar size="small" src={opt.photoURL}>
              {opt.photoURL ? "" : opt.label?.charAt(0)?.toUpperCase()}
            </Avatar>
            {` ${opt.label} `}
          </Select.Option>
        ))}
    </Select>
  );
}

export default function InviteMemberModal() {
  const {
    isInviteMemberVisible,
    setIsInviteMemberVisible,
    selectedRoomId,
    selectedRoom,
  } = useContext(AppContext);
  const {
    user: { uid },
  } = useContext(AuthContext);
  const [value, setValue] = useState(null);
  const [form] = Form.useForm();
  const handleOk = async () => {
    const roomRef = db.collection("rooms").doc(selectedRoomId);
    await roomRef.update({
      members: firestore.firestore.FieldValue.arrayUnion(
        ...value.map((item) => item.value)
      ),
    });
    form.resetFields();
    setIsInviteMemberVisible(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsInviteMemberVisible(false);
  };

  const fetchUser = async (search, currentMembers) => {
    return db
      .collection("users")
      .where("keywords", "array-contains", search)
      .orderBy("displayName")
      .limit(20)
      .get()
      .then((snapshot) => {
        return snapshot.docs
          .map((doc) => ({
            id: doc.id,
            label: doc.data().displayName,
            photoURL: doc.data().photoURL,
            value: doc.data().uid,
          }))
          .filter((opt) => currentMembers.indexOf(opt.value) === -1);
      });
  };

  console.log(value);

  return (
    <div>
      <Modal
        title="Mời thêm thành viên"
        visible={isInviteMemberVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <DebounceSelect
            mode="multiple"
            label="Tên thành viên"
            value={value}
            placeholder="Tên thành viên"
            fetchOptions={fetchUser}
            onChange={(newValue) => setValue(newValue)}
            style={{ width: "100%" }}
            currentMembers={selectedRoom.members}
          />
        </Form>
      </Modal>
    </div>
  );
}
