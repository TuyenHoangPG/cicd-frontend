import React, { useContext, useCallback } from "react";
import { Collapse, Typography, Button } from "antd";
import styled from "styled-components";
import { PlusSquareOutlined } from "@ant-design/icons";
import { AppContext } from "../../context/AppProvider";
const { Panel } = Collapse;

const PannelStyled = styled(Panel)`
  &&& {
    .ant-collapse-header,
    p {
      color: white;
    }

    .ant-collapse-content-box {
      padding: 0 40px;
    }
    .add-room {
      color: white;
      padding: 0;
    }
  }
`;

const LinkStyled = styled(Typography.Link)`
  display: block;
  margin-bottom: 5px;
  color: white;
`;
export default function RoomList() {
  const { rooms, setIsAddRoomVisible, setSelectedRoomId } =
    useContext(AppContext);
  const handleAddRoom = useCallback(() => {
    setIsAddRoomVisible(true);
  }, [setIsAddRoomVisible]);
  const selectRoom = useCallback(
    (roomId) => {
      setSelectedRoomId(roomId);
    },
    [setSelectedRoomId]
  );

  return (
    <Collapse ghost defaultActiveKey={["1"]}>
      <PannelStyled header="Danh sách các phòng" key="1">
        {rooms &&
          rooms.map((room) => (
            <LinkStyled key={room.id} onClick={() => selectRoom(room.id)}>
              {room.name}
            </LinkStyled>
          ))}
        <Button
          type="text"
          icon={<PlusSquareOutlined />}
          className="add-room"
          onClick={handleAddRoom}
        >
          Thêm phòng
        </Button>
      </PannelStyled>
    </Collapse>
  );
}
