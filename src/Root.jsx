import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import Sidebar from "./app/features/Sidebar/Sidebar";

const { Content } = Layout;

export default function Root() {
  return (
    <Layout hasSider>
      <Layout
        className="site-layout"
        style={{
          marginLeft: 200,
        }}
      >
        <Sidebar />
        <Content style={{ background: "#f6f8fa", minHeight: "100vh" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}