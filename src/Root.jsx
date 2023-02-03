import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import { MenuOutlined } from '@ant-design/icons';
import Sidebar from "./app/features/Sidebar/Sidebar";

const { Content } = Layout;

export default function Root() {

  const [showTrigger, setShowTrigger] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  return (
    <Layout>
      <Sidebar isMobile={isMobile} setShowTrigger={setShowTrigger} setIsMobile={setIsMobile} showTrigger={showTrigger} />
      <Content className="content" style={{ background: "#f6f8fa", minHeight: "100vh" }}>
        {isMobile ? <MenuOutlined style={{ marginLeft: "14px" }} onClick={() => setShowTrigger(!showTrigger)} /> : ""}
        <Outlet />
      </Content>
    </Layout>
  )
}