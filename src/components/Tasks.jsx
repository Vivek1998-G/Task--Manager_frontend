import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Loader from './utils/Loader';
import Tooltip from './utils/Tooltip';
import Popup from 'reactjs-popup';
import { useNavigate } from 'react-router-dom';

const Tasks = () => {

  const navigate = useNavigate()

  const authState = useSelector(state => state.authReducer);
  const [tasks, setTasks] = useState([]);
  const [rdate, setRDate] = useState();
  const [rmsg, setRmsg] = useState("Set Reminder");
  const [status, setStatus] = useState();

  const [fetchData, { loading }] = useFetch();

  const fetchTasks = useCallback(() => {
    const config = { url: "/tasks", method: "get", headers: { Authorization: authState.token } };
    fetchData(config, { showSuccessToast: false }).then(data => setTasks(data.tasks));
  }, [authState.token, fetchData]);

  useEffect(() => {
    if (!authState.isLoggedIn) return;
    fetchTasks();
  }, [authState.isLoggedIn, fetchTasks]);


  const handleDelete = (id) => {
    const config = { url: `/tasks/${id}`, method: "delete", headers: { Authorization: authState.token } };
    fetchData(config).then(() => fetchTasks());
  }

  function setTaskReminder(desc) {
    console.log(rdate)
    let alarmDate = new Date(rdate);
    console.log(alarmDate)
    let now = new Date();
    setRDate("")
    setRmsg("Done")
    let timeToAlarm = alarmDate - now;
    console.log(timeToAlarm);
    if (timeToAlarm >= 0) {
      setTimeout(() => {

        console.log("Ringing now")

        window.alert(`complete this task ${desc}`)

      }, timeToAlarm);
    }
  }

  const checkStatus = (taskId) => {

    console.log(status)
    const config = { url: `/tasks/status/${taskId}`, method: "put", status: status, headers: { Authorization: authState.token } };
    fetchData(config).then(() => fetchTasks());
  }

  return (
    <>
      <div className="my-2 mx-auto max-w-[700px] py-4">

        {tasks.length !== 0 && <h2 className='my-2 ml-2 md:ml-0 text-xl'>Your tasks ({tasks.length})</h2>}
        {loading ? (
          <Loader />
        ) : (
          <div>
            {tasks.length === 0 ? (

              <div className='w-[600px] h-[300px] flex items-center justify-center gap-4'>
                <span>No tasks found</span>
                <Link to="/tasks/add" className="bg-blue-500 text-white hover:bg-blue-600 font-medium rounded-md px-4 py-2">+ Add new task </Link>
              </div>

            ) : (
              tasks.map((task, index) => (
                <div key={task._id} className='bg-white my-4 p-4 text-gray-600 rounded-md shadow-md'>
                  <div className='flex'>

                    <span className='font-medium'>Task #{index + 1}</span>

                    <Tooltip text={"Edit this task"} position={"top"}>
                      <Link to={`/tasks/${task._id}`} className='ml-auto mr-2 text-green-600 cursor-pointer'>
                        <i className="fa-solid fa-pen"></i>
                      </Link>
                    </Tooltip>
                    <Tooltip text={"Delete this task"} position={"top"}>
                      <span className='text-red-500 cursor-pointer' onClick={() => handleDelete(task._id)}>
                        <i style={{ marginLeft: "9px" }} className="fa-solid fa-trash"></i>
                      </span>
                    </Tooltip>


                    <Popup trigger=
                      {<button>  <Tooltip text={"Set Reminder"} position={"top"}>
                        <i style={{ marginLeft: "15px" }} className="fa-sharp fa-solid fa-bell"></i>

                      </Tooltip> </button>}
                      style={{ position: "left" }}>
                      <div className="bg-red-400 " style={{ height: '100px' }}>

                        <input type="text" style={{ height: '35px', marginLeft: '35px', marginTop: '33px' }} value={rdate} onChange={(e) => { setRDate(e.target.value) }}
                          placeholder="Enter the time in yyyy-mm-dd hh:mm:ss" />


                        <button className='bg-primary text-white px-4 py-2 font-medium hover:bg-primary-dark m-4' onClick={() => setTaskReminder(task.description)} >{rmsg}</button>
                      </div> </Popup>
                    <Popup trigger=
                      {<button>  <Tooltip text={"Check Status"} position={"top"}>
                        <i style={{ marginLeft: '15px', color: 'brown' }} className="fa-solid fa-list-check"></i>
                      </Tooltip> </button>}
                      style={{ position: "left" }}>
                      <div className="bg-gray-300 " style={{ height: '70px', width: '140px' }}>
                        <Tooltip text={"Mark As Complited"} position={"top"}>
                          <button className='bg-red-500 text-white px-4 py-2 font-medium hover:bg-primary-dark m-4' onClick={() => checkStatus(task._id)} >{task.status}</button>

                        </Tooltip>
                      </div> </Popup>

                  </div>
                  <div className='whitespace-pre'>{task.description}</div>
                </div>
              ))

            )}
          </div>
        )}
      </div>
    </>
  )

}

export default Tasks