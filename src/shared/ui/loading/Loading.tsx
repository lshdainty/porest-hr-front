import { Spin } from 'antd';

const Loading: React.FC = () => {
  return (
    <Spin tip='Loading' size='large' fullscreen></Spin>
  )
}

export default Loading;