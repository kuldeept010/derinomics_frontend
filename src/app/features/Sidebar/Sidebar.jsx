import { Layout, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import CandlestickChartRoundedIcon from '@mui/icons-material/CandlestickChartRounded';
import RestoreRoundedIcon from '@mui/icons-material/RestoreRounded';
const { Sider } = Layout;

const SidebarItems = [{
  icon: <HomeRoundedIcon />,
  label: "Home",
  key: "/"
},
{
  icon: <CandlestickChartRoundedIcon />,
  label: "Live Calendar",
  key: "/live-calendar"
},
{
  icon: <RestoreRoundedIcon />,
  label: "All Events",
  key: "/all-events"
}
]

export default function Sidebar({ setShowTrigger, showTrigger, setIsMobile, isMobile }) {

  const location = useLocation();
  const navigate = useNavigate();

  const getBasepath = (url) => {
    if (url === "/") {
      return "/"
    } else {
      return "/" + url.split("/")[1];
    }
  }

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth={0}
      style={{
        // height: '100vh',
        background: "#0257fa",
        padding: !showTrigger ? "10px" : "0"
      }}
      collapsed={showTrigger}
      trigger={null}
      onBreakpoint={(point) => {
        if (showTrigger !== point) {
          setShowTrigger(point);
        }
        setIsMobile(point);
      }}
    >
      <div style={{ margin: 16, color: "#fff" }}>DERINOMICS FINANCIAL Pvt. Ltd.</div>
      <Menu mode="inline" onClick={({ key }) => { navigate(key); if (isMobile && !showTrigger) { setShowTrigger(true); }} } className="app-sidebar" selectedKeys={[getBasepath(location.pathname)]} items={SidebarItems} />
    </Sider>);
}