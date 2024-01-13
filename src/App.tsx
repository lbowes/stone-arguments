import Block from './components/Block';
import Pillar from './components/Pillar';


const App = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw'
    }}>
      <div style={{
        width: '600px',
        height: '600px',
        border: '1px solid #eee',
        borderRadius: '16px',
        overflow: 'hidden'
      }}>
        <svg width="100%" height="100%">
          <Block x={20} y={20} width={400} height={50} padding={10}/>
          <Pillar x={40} y={70} width={80} height={500} channelWidth={12}/>
          <Pillar x={230} y={70} width={100} height={400} channelWidth={12}/>
          <Block x={135} y={470} width={200} height={100} padding={10}/>
        </svg>
      </div>
    </div>
  );
}


export default App;
