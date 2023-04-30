import { memo } from 'react';
import { Handle, Position } from 'reactflow';

export default memo(( { data, isConnectable}: any) => {
  return (
    <div className="course-node">
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: '#555' }}
          onConnect={(params) => console.log('handle onConnect', params)}
          isConnectable={isConnectable}
        />
        <div>
          <label>{data.label}</label>
          <a href={"https://www.uvic.ca/calendar/future/undergrad/index.php#/courses/" + data.pid} className="nodrag"> {data.title} </a>
        </div>
        <Handle
          type="source"
          position={Position.Right}
          id="a"
          style={{ background: '#555' }}
          isConnectable={isConnectable}
        />
    </div>
  );
});
